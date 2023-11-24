// import React, { useState, useEffect } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { CircularProgress, Typography, Avatar, Box } from '@mui/material';

// const Profile = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const [name, setName] = useState('');
//   const [edit, setEdit] = useState(false);

//   //TODO: add icon for edit and post URL for updating then name of the user

//   if (isLoading) {
//     return <CircularProgress />;
//   }

//   if (isAuthenticated) {
//     console.log(user);
//   }

//   return (
//     isAuthenticated && (
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         marginTop={4}
//       >
//         <Avatar
//           alt={user.name}
//           src={user.picture}
//           sx={{ width: 100, height: 100 }}
//         />
//         <Typography variant="h4" marginTop={2}>
//           {user.name}
//         </Typography>
//         <Typography variant="body1" marginTop={1}>
//           {user.email}
//         </Typography>
//       </Box>
//     )
//   );
// };

// export default Profile;
