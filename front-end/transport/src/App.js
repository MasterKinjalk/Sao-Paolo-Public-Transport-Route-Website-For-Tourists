import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './Auth/Login.jsx';
import LogoutButton from './Auth/Logout.jsx';
import Profile from './Auth/Profile.jsx';
import Map from './Map/Map.jsx';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
// import { styled } from '@mui/system';

// const StyledNav = styled('nav')({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: '10px 20px',
//   color: 'white',
//   width: '100%',
// });

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Transport
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && (
              <Link
                to="/profile"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Button color="inherit">Profile</Button>
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/map"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Button color="inherit">Map</Button>
              </Link>
            )}
            {/* <Link
              to="/map"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Button color="inherit">Map</Button>
            </Link> */}
            <Box marginLeft={2}>
              {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/map"
          element={isAuthenticated ? <Map /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
