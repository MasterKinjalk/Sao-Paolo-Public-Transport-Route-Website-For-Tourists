import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sample = [
  { id: '1', name: 'chennai' },
  { id: '2', name: 'chicago' },
  { id: '3', name: 'test3' },
  { id: '4', name: 'test4' },
  { name: '1012-10-1', id: '5' },
];

const HistoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const lsemail = localStorage.getItem('email');
const Feedback = () => {
  const [selectedName, setSelectedName] = useState('');
  const [review, setReview] = useState('');
  const [trips, Settrips] = useState(null);
  const [pastData, setpastData] = useState(null);
  const [previousReview, setPreviousReview] = useState('');
  const [pastFeedback, setPastFeedback] = useState(null);
  const smallScreen = useMediaQuery('(max-width:600px)');

  const userEmail = localStorage.getItem('email');
  console.log(userEmail);

  useEffect(() => {
    const getFeedback = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: lsemail }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setpastData(data);
        console.log(data);
      } else {
        throw new Error('Failed to fetch feedback');
      }
    };
    const getTrips = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/my_trips`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: lsemail }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        Settrips(data); // for my trips and trip history id
        console.log(data);
      } else {
        throw new Error('Failed to fetch feedback');
      }
    };
    getTrips();

    getFeedback();
  }, []);

  // useEffect(() => {
  //   const getTrips = async () => {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_SERVER_BE}/my_trips`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ email: lsemail }),
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       Settrips(data);
  //       console.log(data);
  //     } else {
  //       throw new Error('Failed to fetch feedback');
  //     }
  //   };
  //   getTrips();
  // }, []);

  // const handleNameChange = (event, newValue) => {
  //   setSelectedName(newValue);
  //   console.log(newValue);
  // };

  const handleSubmit = async () => {
    if (!selectedName || !review) {
      toast.error('Please select a name and provide a review');
      return;
    }
    console.log(selectedName, review);

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/add_feedback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: selectedName.name,
          feedback: review,
          email: lsemail,
        }),
      }
    );

    if (response.ok) {
      // Handle successful submission: show a success message, etc.
      toast.success('Feedback submitted successfully');
    } else {
      // Handle errors
      toast.error('Failed to submit feedback');
    }

    // After successful submission, reset the dropdown and text field
    setSelectedName('');
    setReview('');
    setPreviousReview('');
  };

  const handleEditFeedback = async () => {
    if (!userEmail || !selectedName || !review) {
      console.error('User email, selected name, or review is missing');
      return;
    }

    try {
      const selectedUser = sample.find((user) => user.name === selectedName);
      if (!selectedUser) {
        console.error('Selected user not found in the sample');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/edit_feedback/${selectedUser.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedback_id: selectedUser.id,
            feedback_text: review,
          }),
        }
      );

      if (response.ok) {
        toast.success('Feedback updated successfully');
      } else {
        throw new Error('Failed to update feedback');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Error updating feedback');
    }
  };

  const handleDeleteHistory = async () => {
    if (!userEmail || !selectedName) {
      console.error('User email or selected name is missing');
      return;
    }

    try {
      const selectedUser = sample.find((user) => user.name === selectedName);
      if (!selectedUser) {
        console.error('Selected user not found in the sample');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/delete_feedback/${selectedUser.id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        toast.success('Feedback deleted successfully');
        // Optionally update UI or perform actions after successful deletion
      } else {
        throw new Error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Error deleting feedback');
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <ToastContainer />
        <Paper
          sx={{
            maxWidth: 400,
            margin: 'auto',
            padding: 2,
            marginTop: '2rem',
            marginBottom: '2rem',
          }}
        >
          <Autocomplete
            value={selectedName}
            onChange={(event, newValue) => {
              setSelectedName(newValue);
              setReview(''); // Clear review when a new name is selected
              // setPreviousReview(''); // Clear previous review
            }}
            options={sample}
            getOptionLabel={(option) => (option && option.name) || ''}
            renderInput={(params) => (
              <TextField {...params} label="Select a name" fullWidth />
            )}
          />
          <TextField
            label="Write a Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            multiline
            fullWidth
            rows={4}
            sx={{ marginTop: '1rem' }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ marginTop: '1rem' }}
          >
            Submit
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box sx={{ padding: 2 }}>
          {pastData &&
            pastData.map((data) => (
              <HistoryCard key={data.feedback_id}>
                <div sx={{ marginBottom: { xs: 2, md: 0 } }}>
                  <Typography variant="h6">{`Trip ID: ${data.trip_id}`}</Typography>
                  <Typography variant="body1">{`Feedback: ${data.feedback}`}</Typography>
                </div>
                <div sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* <Button onClick={() => handleViewFeedback(feedbackItem)}>
                    View Feedback
                  </Button> */}
                  {/* <Button onClick={() => handleDeleteFeedback(feedbackItem)}>
                    Delete
                  </Button> */}
                </div>
              </HistoryCard>
            ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Feedback;
