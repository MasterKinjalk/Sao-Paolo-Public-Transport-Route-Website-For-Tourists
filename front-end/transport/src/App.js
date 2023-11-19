import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './Auth/Login.jsx';
import LogoutButton from './Auth/Logout.jsx';
import Profile from './Auth/Profile.jsx';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <p>Transport</p>
      <nav>
        {isAuthenticated && <Link to="/profile">Profile</Link>}
        {/* {isAuthenticated && <Link to="/logout">Logout</Link>} */}
        {isAuthenticated && <LogoutButton />}
      </nav>

      <Routes>
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        {/* <Route path="/logout" element={<LogoutButton />} /> */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/profile" /> : <LoginButton />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
