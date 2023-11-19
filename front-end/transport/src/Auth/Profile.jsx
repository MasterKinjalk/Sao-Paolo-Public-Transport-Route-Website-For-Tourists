import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress, Typography, Avatar, Box } from '@mui/material';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isAuthenticated) {
    console.log(user);
  }

  return (
    isAuthenticated && (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={4}
      >
        <Avatar
          alt={user.name}
          src={user.picture}
          sx={{ width: 100, height: 100 }}
        />
        <Typography variant="h4" marginTop={2}>
          {user.name}
        </Typography>
        <Typography variant="body1" marginTop={1}>
          {user.email}
        </Typography>
      </Box>
    )
  );
};

export default Profile;
