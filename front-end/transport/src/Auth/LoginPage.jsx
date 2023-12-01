import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  useMediaQuery,
  Container,
} from '@mui/material';
import Train from '../assets/train.mp4';
import { Link } from 'react-router-dom';

const LoginPage = ({ authstate }) => {
  const [loginError, setLoginError] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const authStausLocalStorage = localStorage.getItem('loginstatus');

  //TODO: hello world dingdong@gmail.com dingdong is one account

  useEffect(() => {
    if (authStausLocalStorage === 'true') {
      authstate(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    console.log(email, password);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log('Login successful');
        setLoginError(null);
        localStorage.setItem('loginstatus', true);
        localStorage.setItem('email', email);
        authstate(true);
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setLoginError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login');
    }
  };

  return (
    <Container
      sx={{
        // minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '50px',
            }}
          >
            <video
              autoPlay
              loop
              muted
              style={{ width: '100%', maxWidth: '600px' }}
            >
              <source src={Train} type="video/mp4" />
            </video>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: isSmallScreen ? '20px' : '50px',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            {/* <Typography
            variant="body1"
            align="center"
            mt={2}
            color="primary"
            sx={{
              padding: '8px',
              borderRadius: '4px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',
            }}
          >
            Login above for exploring our app!
          </Typography> */}
            <form
              onSubmit={handleLogin}
              sx={{ width: '100%', maxWidth: '400px' }}
            >
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                required
              />
              <TextField
                label="Password"
                name="password"
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                type="password"
                required
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                type="submit"
                sx={{ mt: 2 }}
              >
                Login
              </Button>
              {loginError && (
                <Typography variant="body2" color="error" mt={2}>
                  {loginError}
                </Typography>
              )}
            </form>
            <Box textAlign="center" mt={4}>
              <Typography variant="body2" sx={{ mt: 2, mb: 4 }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
