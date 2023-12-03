import React, { useState, useEffect } from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

const Booking = () => {
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [selectedorigin, setselectedOrigin] = useState(null);
  const [selecteddestination, setselectedDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://cs411-team124-quertyqueries.uc.r.appspot.com/all_stops'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const stopsDataWithUniqueKeys = data.stops_data.map((stop) => ({
          ...stop,
          id: stop[0],
        }));

        setOriginOptions(stopsDataWithUniqueKeys);
        setDestinationOptions(stopsDataWithUniqueKeys);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stop points:', error);
      }
    };

    fetchData();
  }, []);

  if (originOptions) {
    console.log(originOptions);
  }

  const email = localStorage.getItem('email');

  const handleBookClick = async () => {
    try {
      if (!email) {
        console.error('Email not found in localStorage');
        return;
      }

      if (!selectedorigin || !selecteddestination) {
        console.error('Please select both origin and destination');
        return;
      }

      const response = await fetch('YOUR_BOOKING_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          selectedorigin,
          selecteddestination,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Booking successful:', responseData);
    } catch (error) {
      console.error('Error booking:', error);
    }
  };

  return (
    <div>
      {!isLoading && (
        <>
          <Autocomplete
            options={originOptions}
            id="origin"
            getOptionLabel={(option) => option[1]}
            onChange={(event, value) => setselectedOrigin(value)}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option[1]}
                </li>
              );
            }}
            renderInput={(params) => <TextField {...params} label="Origin" />}
          />
          <Autocomplete
            options={destinationOptions}
            id="destination"
            getOptionLabel={(option) => option[1]}
            onChange={(event, value) => setselectedDestination(value)}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option[1]}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Destination" />
            )}
          />
          <Button
            variant="contained"
            //   onClick={handleBookClick}
          >
            Book
          </Button>
        </>
      )}
      {console.log('user selected orign')}
      {console.log(selectedorigin)}
    </div>
  );
};

export default Booking;
