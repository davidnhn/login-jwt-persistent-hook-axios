import { Outlet } from 'react-router-dom';
import useRefreshToken from '../hooks/useRefreshToken';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import useLocalStorage from '../hooks/useLocalStorage';

/* Quand on revient sur le site sur une page protegee ou simplement qu'on rafraichit la page, on perd le auth qui contient accesstoken enregistré en memoire via usestate dans context. Mais le refresh token est toujours présent dans un cookie. 

On vérifie qu'il n'ya pas d'accesstoken dans auth, puis on appelle refreshAccessToken qui contacte le serveur via la route '/refresh' , lui envoie le refresh token et reçoit un nouveau access token et les roles.

Ca se passe dans le hook useRefreshToken, qui met a jour auth avec setAuth avec les informations reçues du serveur (new access token et role). 

Si il n'y a pas d'erreur , le bloc finally met IsLoading a false , et on return Outlet qui est requiredauth qui protege enfant qui verifie les roles et authentification (voir app.jsx) (finally s'execute erreur ou non)

(si il n'y a pas de refresh token dans cookie, le serveur renvoie 401, on va dans le catch puis dans le finally , isLoading false, return <Outlet> qui est requireauth qui voit qu'on est pas connecté qui revoie vers login )

(si le refresh token est expiré, le serveur renvoie 403, on va dans le catch puis dans le finally , isLoading false, return <Outlet> qui est requireauth qui voit qu'on est pas connecté qui revoie vers login)


*/

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refreshAccessToken = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useLocalStorage('persist', false);
  const effectRan = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken();
      } catch (err) {
        console.log(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (effectRan.current === true) {
      !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false); // quand on revient sur l'app,
    }

    return () => {
      effectRan.current = true;
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log(`isLoading : ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;

/* le return s'execute avant le code asynchrone useffect , si persist est false ca render l'outlet qui ne laisse pas le temps au useeffect de se lancer */
