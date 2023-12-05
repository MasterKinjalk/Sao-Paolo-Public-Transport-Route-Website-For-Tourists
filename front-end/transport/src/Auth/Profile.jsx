import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({ authStatus }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [oldemail, setoldEmail] = useState('');
  const [newemail, setnewemail] = useState('');
  const [newpassword, setnewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');

  const fetchUserDetails = async () => {
    console.log('fetching user details');
    try {
      const userData = await fetchUserFromAPI();
      setUser(userData);
      setoldEmail(userData.email || '');
      setFirstname(userData.first_name || '');
      setLastname(userData.last_name || '');
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleEditClick = async (field) => {
    if (field === 'email') {
      console.log('edit email');
      try {
        console.log(oldemail + ' is old', newemail);
        await updateEmailInAPI(oldemail, newemail);
        setUser({ ...user, email: oldemail, new_email: newemail });
        setEditing(false);
      } catch (error) {
        console.error('Error updating email:', error);
      }
    } else if (field === 'password') {
      console.log('edit password');
      try {
        console.log(oldPassword, newpassword);
        await updatePasswordInAPI(oldPassword, newpassword);
        setUser({
          ...user,
          old_password: oldPassword,
          new_password: newpassword,
        });
        setEditing(false);
      } catch (error) {
        console.error('Error updating password:', error);
      }
    }
  };

  const fetchUserFromAPI = async () => {
    // console.log(lsemail);
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/get_user_details`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('email') }),
      }
    );
    if (response.ok) {
      const userData = await response.json();
      // setUser(userData);
      console.log(userData);
      return userData;
    } else {
      console.error(await response.json());
      throw new Error('Failed to fetch user details');
    }
  };

  const updateEmailInAPI = async (newEmail, oldemail) => {
    console.log('hit email update endpoint');
    console.log(newEmail, oldemail);
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/update_user_info`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail, new_email: oldemail }),
      }
    );

    if (!response.ok) {
      const resp = await response.json();
      console.error(resp);
      toast.error(resp.error);
      throw new Error('Failed to update email');
    }
    if (response.ok) {
      console.log(localStorage.getItem('email'));
      localStorage.setItem('email', oldemail);
      console.log(localStorage.getItem('email'));
      console.log('updated email');
      // await fetchUserDetails();
      localStorage.clear();
      authStatus(false);
    }
  };

  const updatePasswordInAPI = async (oldpassword, newPassword) => {
    console.log(oldpassword, newPassword);
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/update_password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: oldemail,
          new_password: newPassword,
          old_password: oldpassword,
        }),
      }
    );

    if (!response.ok) {
      const resp = await response.json();
      console.error(resp);
      toast.error(resp.error);
      throw new Error('Failed to update password');
    }
    await fetchUserDetails();
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <Grid container justifyContent="center" spacing={2}>
      <ToastContainer />
      <Grid item xs={12} sm={8} md={6}>
        <Box
          flexDirection="column"
          marginTop={4}
          padding={4}
          boxShadow={3}
          bgcolor="white"
          borderRadius={8}
        >
          <Typography variant="h4" gutterBottom>
            Profile Details
          </Typography>
          <Box display="flex" alignItems="center" marginBottom="1rem">
            <Typography
              variant="body1"
              style={{ minWidth: '120px', marginRight: '1rem' }}
            >
              <strong>First Name:</strong>
            </Typography>
            <Typography variant="body1">{firstname}</Typography>
          </Box>
          <Box display="flex" alignItems="center" marginBottom="1rem">
            <Typography
              variant="body1"
              style={{ minWidth: '120px', marginRight: '1rem' }}
            >
              <strong>Last Name:</strong>
            </Typography>
            <Typography variant="body1">{lastname}</Typography>
          </Box>
          <Box display="flex" alignItems="center" marginBottom="1rem">
            <Typography
              variant="body1"
              style={{ minWidth: '120px', marginRight: '1rem' }}
            >
              <strong>Email:</strong>
            </Typography>
            {editing ? (
              <>
                <TextField
                  value={oldemail}
                  label="old Email"
                  onChange={(e) => setoldEmail(e.target.value)}
                />
                <TextField
                  value={newemail}
                  label="new Email"
                  onChange={(e) => setnewemail(e.target.value)}
                />
              </>
            ) : (
              <Typography variant="body1">{user.email}</Typography>
            )}
            {editing ? (
              <IconButton onClick={() => handleEditClick('email')}>
                <EditIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <Box display="flex" alignItems="center" marginBottom="1rem">
            <Typography
              variant="body1"
              style={{ minWidth: '120px', marginRight: '1rem' }}
            >
              <strong>Password:</strong>
            </Typography>
            {editing ? (
              <>
                <TextField
                  label="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  type="password"
                />
                <TextField
                  label="New Password"
                  value={newpassword}
                  onChange={(e) => setnewPassword(e.target.value)}
                  type="password"
                  sx={{ mr: 2 }}
                />
              </>
            ) : (
              <Typography variant="body1">**********</Typography>
            )}
            {editing ? (
              <IconButton onClick={() => handleEditClick('password')}>
                <EditIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
          {editing && (
            <Box>
              <Button
                variant="contained"
                onClick={() => handleEditClick('email')}
                style={{ marginRight: '1rem' }}
              >
                Save Email
              </Button>
              <Button
                variant="contained"
                onClick={() => handleEditClick('password')}
              >
                Save Password
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Profile;
