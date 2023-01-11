import React from 'react';
import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '../hooks/useInput';
import useToggle from '../hooks/useToggle';
import axios from '../api/axios';
const LOGIN_URL = '/auth';

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; // la page sur laquelle on etait avant d'etre redirigé par requiredauth

  const userRef = useRef();
  const errRef = useRef(); // avec errRef, on met le focus, et grace a aria-live="assertive", quand y a focus la liseuse d'ecran va lire l'erreur

  const [user, resetUser, userAttributes] = useInput('user', ''); //setUser change le state dans le hook , et le useEffect se declenhe et enregistre ce l'input en localStorage
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [check, toggleCheck] = useToggle('persist', false);
  console.log(check);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, pwd);
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      setAuth({ user, accessToken });
      // setUser('');
      resetUser();
      setPwd('');
      navigate(from, { replace: true }); // quand login ok,nous ramene sur la page precedent la redirection vers login, par default on vient de la page Home
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  // const togglePersist = () => {
  //   setPersist((prev) => !prev);
  // };

  // useEffect(() => {
  //   localStorage.setItem('persist', persist);
  // }, [persist]);

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? 'errMsg' : 'offscreen'}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          // onChange={(e) => setUser(e.target.value)}
          // value={user}
          {...userAttributes}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={toggleCheck}
            checked={check}
          />
          <label htmlFor="persist">Trust this device</label>
        </div>
      </form>
      <p>
        Need an Account?
        <br />
        <span className="line">
          {/* put router link here  */}
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
