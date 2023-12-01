import React from 'react';
import { Button } from '@mui/material';

const LogoutButton = ({ authstate }) => {
  const handleLogout = () => {
    localStorage.removeItem('loginstatus');
    localStorage.removeItem('email');
    authstate(false);

    console.log('Logout clicked');
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
