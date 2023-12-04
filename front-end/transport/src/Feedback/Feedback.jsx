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

// const sample = [
//   { id: '1', name: 'chennai' },
//   { id: '2', name: 'chicago' },
//   { id: '3', name: 'test3' },
//   { id: '4', name: 'test4' },
//   { name: '1012-10-1', id: '5' },
// ];

//TODO: use trip id for dropdown and not sample

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
  const [editSubmit, seteditSubmit] = useState(false);
  const smallScreen = useMediaQuery('(max-width:600px)');

  // const userEmail = localStorage.getItem('email');
  // console.log(userEmail);

  const getFeedback = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/feedback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('email') }),
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

  useEffect(() => {
    const getTrips = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/my_trips`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: localStorage.getItem('email') }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        Settrips(data); // for my trips and trip history id
        console.log('trip data');
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
          email: localStorage.getItem('email'),
        }),
      }
    );

    if (response.ok) {
      toast.success('Feedback submitted successfully');
      const resp = await response.json();
      console.log(resp);
      getFeedback();
    } else {
      toast.error('Failed to submit feedback');
    }

    setSelectedName('');
    setReview('');
    setPreviousReview('');
  };

  const handleEditFeedback = async (id) => {
    const updatedPastData = pastData.filter((item) => item.feedback_id === id);
    if (!localStorage.getItem('email') || !updatedPastData) {
      console.error('User email, selected name, or review is missing');
      return;
    }
    // const updatedPastData = pastData.filter((item) => item.feedback_id === id);
    console.log('edit handler hit');
    console.log(updatedPastData);
    localStorage.setItem('feedback_id', id);
    setReview(updatedPastData[0].feedback);
    seteditSubmit(true);
  };

  const handleEditSubmit = async () => {
    try {
      // const selectedUser = sample.find((user) => user.name === selectedName);
      // if (!selectedUser) {
      //   console.error('Selected user not found in the sample');
      //   return;
      // }
      const id = localStorage.getItem('feedback_id');
      console.log(id);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/edit_feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedback_id: id,
            feedback_text: review,
          }),
        }
      );

      if (response.ok) {
        toast.success('Feedback updated successfully');
        localStorage.removeItem('feedback_id');
        seteditSubmit(false);
      } else {
        throw new Error('Failed to update feedback');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Error updating feedback');
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!localStorage.getItem('email')) {
      console.error('User email or selected name is missing');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/delete_feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feedback_id: id }),
        }
      );

      if (response.ok) {
        toast.success('Feedback deleted successfully');
        const updatedPastData = pastData.filter(
          (item) => item.feedback_id !== id
        );
        setpastData(updatedPastData);
        //  setPastFeedback((prevFeedback) =>
        //    prevFeedback.filter((feedback) => feedback.feedback_id !== id)
        //  );
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
      {trips && trips.length > 0 ? (
        <Grid item xs={12} md={7}>
          <ToastContainer />
          <Paper
            sx={{
              maxWidth: 600,
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
                setReview('');
                // setPreviousReview('');
              }}
              options={trips}
              getOptionLabel={(option) =>
                (option && option[3] + ' -> ' + option[2]) || ''
              }
              renderInput={(params) => (
                <TextField {...params} label="Select a trip id" fullWidth />
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
            {!editSubmit ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ marginTop: '1rem' }}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleEditSubmit}
                sx={{ marginTop: '1rem' }}
              >
                Submit Edit
              </Button>
            )}
          </Paper>
        </Grid>
      ) : (
        <Grid item xs={12} md={7}>
          <Typography variant="h6">
            Please go to the book page to create trips first.
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={5}>
        <Typography variant="h4" sx={{ margin: 2, fontStyle: 'italic' }}>
          Trip History
        </Typography>
        <Box sx={{ padding: 2 }}>
          {pastData &&
            pastData.map((data) => (
              <HistoryCard key={data.feedback_id}>
                <div sx={{ marginBottom: { xs: 2, md: 0 } }}>
                  <Typography variant="h6">{`Trip ID: ${data.trip_id}`}</Typography>
                  <Typography variant="body1">{`Feedback: ${data.feedback}`}</Typography>
                </div>
                <div sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={() => handleEditFeedback(data.feedback_id)}>
                    View Feedback
                  </Button>
                  <Button onClick={() => handleDeleteHistory(data.feedback_id)}>
                    Delete
                  </Button>
                </div>
              </HistoryCard>
            ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Feedback;
