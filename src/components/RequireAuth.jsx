import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import jwt_decode from 'jwt-decode';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined;

  const roles = decoded?.UserInfo?.roles || [];

  return roles.find((role) => allowedRoles?.includes(role)) ? ( // auth.role correspond aux roles de l'utilisateur qui vient de se connecter, allowedRoles sont les roles  autorisés a acceder a la page demandée / roles sont les role venant du token decodé de l'utilisateur connecté
    <Outlet />
  ) : auth?.accessToken ? ( // accessToken remplace user pour persister car si on rafraichit, auth ne contient plus user mais accesstoken est renouvelé
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace /> //ce n'est pas un lien mais un redirection , on attrape l'url courant , on le remplace avec /login // si on oublie state, on peut pas retourner a la page precedente
  );
};

export default RequireAuth;
