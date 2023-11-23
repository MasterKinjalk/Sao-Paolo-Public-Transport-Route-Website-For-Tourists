import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Autocomplete,
} from '@mui/material';

const sample = [
  { id: '1', name: 'chennai' },
  { id: '2', name: 'chicago' },
  { id: '3', name: 'test3' },
  { id: '4', name: 'test4' },
];

const Feedback = () => {
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState('');

  const handleSelectChange = (e, newValue) => {
    setSelected(newValue);
    console.log(newValue);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!selected || !review) {
      alert('Please select a name and provide a review');
      return;
    }

    console.log(selected.name, review);
    // try {
    //   const response = await fetch('YOUR_BACKEND_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ id: selectedId, review }),
    //   });

    //   if (response.ok) {
    //     console.log('Review submitted successfully');
    //     setSelectedId('');
    //     setReview('');
    //   } else {
    //     console.error('Failed to submit review');
    //   }
    // } catch (error) {
    //   console.error('Error submitting review:', error);
    // }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
      <h2>Feedback</h2>
      <form onSubmit={submitHandler}>
        <div>
          {/* <Select
            label="Select a Name"
            value={selectedId}
            onChange={handleSelectChange}
            fullWidth
          >
            <MenuItem value="">
              <em>Select a name</em>
            </MenuItem>
            {sample.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select> */}
          <Autocomplete
            value={selected} // Controlled: Ensure it's consistently controlled
            onChange={handleSelectChange}
            options={sample}
            getOptionLabel={(option) => (option && option.name) || ''}
            renderInput={(params) => (
              <TextField {...params} label="Select a Name" fullWidth />
            )}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <TextField
            label="Write a Review"
            value={review}
            onChange={handleReviewChange}
            multiline
            fullWidth
            rows={4}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default Feedback;