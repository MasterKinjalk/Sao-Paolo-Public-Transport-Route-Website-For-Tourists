import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './Auth/Login.jsx';
import LogoutButton from './Auth/Logout.jsx';
import Profile from './Auth/Profile.jsx';
import MapC from './Map/Map.jsx';
import { useEffect, useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';

function App() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } =
    useAuth0();

  if (isLoading) {
    return <CircularProgress />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
  //   const sendTokenToBackend = async () => {
  //     if (isAuthenticated) {
  //       try {
  //         const accessToken = await getAccessTokenSilently();
  //         const response = await fetch('', {
  //           method: 'POST',
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ token: accessToken, user }),
  //         });
  //         console.log('Response from backend:', response);
  //       } catch (error) {
  //         console.error('Error sending token to backend:', error);
  //       }
  //     }
  //   };

  //   if (isAuthenticated) {
  //     sendTokenToBackend();
  //   }
  // }, [isAuthenticated, getAccessTokenSilently, user]);

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
          element={isAuthenticated ? <MapC /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
