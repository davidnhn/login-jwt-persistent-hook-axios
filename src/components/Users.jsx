import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const effectRan = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    if (effectRan.current === true) {
      const getUsers = async () => {
        try {
          const response = await axiosPrivate.get('/users', {
            signal: controller.signal,
          });
          const userNames = response.data.map((user) => user.username);
          // console.log(response.data);
          isMounted && setUsers(userNames);
        } catch (err) {
          console.log(err);
          navigate('/login', { state: { from: location }, replace: true }); // une fois login, on nous revoie sur cette page
        }
      };

      getUsers();
    }

    return () => {
      isMounted = false;
      effectRan.current = true;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
      <br />
    </article>
  );
};

export default Users;
