import Register from './components/Register';
import Login from './components/Login';
import Admin from './components/Admin';
import Editor from './components/Editor';
import Home from './components/Home';
import Lounge from './components/Lounge';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              path="/"
              element={<RequireAuth allowedRoles={[ROLES.User]} />}
            >
              <Route path="/" element={<Home />} />
            </Route>
            <Route
              path="/"
              element={<RequireAuth allowedRoles={[ROLES.Editor]} />}
            >
              <Route path="editor" element={<Editor />} />
            </Route>
            <Route
              path="/"
              element={<RequireAuth allowedRoles={[ROLES.Admin]} />}
            >
              <Route path="admin" element={<Admin />} />
            </Route>
            <Route
              path="/"
              element={
                <RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />
              }
            >
              <Route path="lounge" element={<Lounge />} />
            </Route>
          </Route>
          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
