import React from 'react';
import { Box, Typography } from '@mui/material';
import Train from '../assets/train.mp4';

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
      }}
    >
      <video autoPlay loop muted style={{ width: '100%', maxWidth: '600px' }}>
        <source src={Train} type="video/mp4" />
      </video>
      <Typography
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
      </Typography>
    </Box>
  );
};

export default LoginPage;
