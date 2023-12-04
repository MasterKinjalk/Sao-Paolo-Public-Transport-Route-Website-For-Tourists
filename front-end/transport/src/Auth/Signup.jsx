import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState(null);

  const handleSignup = async (event) => {
    event.preventDefault();
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    console.log(firstName, lastName, email, password);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
          }),
        }
      );

      if (response.ok) {
        console.log(response);
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setSignupError(errorData.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('An error occurred during signup');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSignup}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="lastName" label="Last Name" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" label="Email" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                fullWidth
                type="password"
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          {signupError && (
            <Typography variant="body2" color="error">
              {signupError}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Log In
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default SignupPage;
