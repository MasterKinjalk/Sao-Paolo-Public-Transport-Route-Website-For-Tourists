import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',

  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const BookingCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  '& .MuiAutocomplete-inputRoot': {
    padding: theme.spacing(1),
  },
}));

const bookType = [
  {
    id: 1,
    type: 'Bus',
  },
  {
    id: 2,
    type: 'Metro',
  },
  {
    id: 3,
    type: 'Train',
  },
];
const Booking = () => {
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [latestTransportHeadway, setLatestTransportHeadway] = useState(null);
  const [routeTypedata, setrouteTypedata] = useState(null);

  const [selectedorigin, setselectedOrigin] = useState(null);
  const [selecteddestination, setselectedDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tripPossible, setTripPossible] = useState('');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [headway, setheadway] = useState(null);
  const [global, setGlobal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  // const secondsToMinutes = (seconds) => {
  //   return Math.floor(seconds / 60);
  // };

  const handleDropdownChange = async (event) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
    console.log('hit dropdown');
    await fetchType(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_BE}/all_stops`
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
        toast.error('Error fetching stop points');
      }
    };
    fetchData();
  }, []);

  // const entireTripHandler = async () => {
  //   console.log(tripPossible.trip_id);
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_SERVER_BE}/trip`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },

  //       body: JSON.stringify({ trip_id: tripPossible.trip_id }),
  //     });
  //     if (!response.ok) {
  //       console.log(response);
  //       console.log(await response.json());
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.text();
  //     console.log('entire trip success');
  //     console.log(data);
  //   } catch (error) {
  //     console.error('Error fetching booking history:', error);
  //   }
  // };

  const fetchBookingHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/my_trips`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBookingHistory(data);
      console.log('history success');
      console.log(data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };
  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const email = localStorage.getItem('email');

  // const TripPlannerMap = async () => {
  //   const response = await fetch(
  //     `${process.env.REACT_APP_SERVER_BE}/possible_trips_stats`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         // email,
  //         trip_id: '1012-10-1',
  //       }),
  //     }
  //   );

  //   if (response.ok) {
  //     console.log(response);
  //   }
  // };

  const fetchType = async (type) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/get_routemode_ids`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route_type: type,
        }),
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setrouteTypedata(data);
    console.log(data);
  };

  const handleTripClick = async () => {
    try {
      if (!email) {
        console.error('Email not found in localStorage');
        toast.error('Email not found in localStorage');
        return;
      }

      if (
        !selectedorigin ||
        !selecteddestination ||
        selectedorigin.id === selecteddestination.id
      ) {
        console.error(
          'Please select both origin and destination or select different origin and destination'
        );
        toast.error(
          'Please select both origin and destination or select different origin and destination'
        );
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/possible_trips_stats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // email,
            origin_id: selectedorigin.id,
            destination_id: selecteddestination.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Trip possible:', responseData);
      setTripPossible(responseData);
      setGlobal(responseData.globalTripformaps);
    } catch (error) {
      console.error('Error fetching trip possible:', error);
      toast.error('Error fetching trip possible');
    }
  };

  const handleBookClick = async () => {
    try {
      if (!email) {
        console.error('Email not found in localStorage');
        toast.error('Email not found in localStorage');
        return;
      }

      if (!selectedorigin || !selecteddestination) {
        console.error('Please select both origin and destination');
        toast.error('Please select both origin and destination');
        return;
      }

      const gmtTime = new Date();

      gmtTime.setHours(gmtTime.getHours() - 6);

      const cstTime = gmtTime.toISOString().slice(0, 19).replace('T', ' ');

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/add_trip`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // email,
            origin_id: selectedorigin.id,
            destination_id: selecteddestination.id,
            email,
            trip_id: tripPossible.trip_id,
            booking_time: cstTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('History :', responseData);

      // setBookingHistory([...bookingHistory, responseData])
      fetchBookingHistory();
    } catch (error) {
      console.error('Error booking:', error);
      toast.error('Error booking');
    }
    const headway_resp = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/headway_time`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: tripPossible.trip_id,
        }),
      }
    );
    if (!headway_resp.ok) {
      console.log(tripPossible.trip_id);
      throw new Error('Network response was not ok');
    }
    const headway_data = await headway_resp.json();

    function getNextTripTime(headwaySeconds) {
      const currentTime = new Date();
      const cstTime = currentTime.toLocaleString('en-US', {
        timeZone: 'America/Chicago',
      });
      console.log(cstTime);

      const currentCSTTime = new Date(
        currentTime.toLocaleString('en-US', { timeZone: 'America/Chicago' })
      );

      const startOfDay = new Date(
        currentCSTTime.getFullYear(),
        currentCSTTime.getMonth(),
        currentCSTTime.getDate(),
        7,
        0,
        0
      ); // 7am CST
      const endOfDay = new Date(
        currentCSTTime.getFullYear(),
        currentCSTTime.getMonth(),
        currentCSTTime.getDate(),
        23,
        0,
        0
      ); // 11pm CST

      // If current time is before 7 AM, set it to 7 AM CST
      if (currentCSTTime < startOfDay) {
        currentCSTTime.setTime(startOfDay.getTime());
      }

      const currentTimeInMinutes = (currentCSTTime - startOfDay) / (1000 * 60); // Current time in minutes since 7am CST

      const headwayMinutes = headwaySeconds / 60; // Convert headway from seconds to minutes

      let nextTripTime =
        Math.ceil(currentTimeInMinutes / headwayMinutes) * headwayMinutes; // Calculate next trip time

      // Ensure the next trip time is within operating hours (7am to 11pm)
      while (
        nextTripTime < currentTimeInMinutes ||
        nextTripTime > (endOfDay - startOfDay) / (1000 * 60)
      ) {
        nextTripTime += headwayMinutes;
      }

      // Calculate hours and minutes for the next trip time
      const nextTripDate = new Date(
        startOfDay.getTime() + nextTripTime * 60 * 1000
      );
      const hours = nextTripDate.getHours();
      const minutes = nextTripDate.getMinutes();

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    }

    // Example usage with a headway of 159 seconds
    const headwaySeconds = headway_data[0].average_headway;
    console.log(headwaySeconds);
    const nextTrip = getNextTripTime(headwaySeconds);
    setLatestTransportHeadway(nextTrip);
    console.log(`Next earliest trip time is ${nextTrip}`);

    // setLatestTransportHeadway(minutes);

    setheadway(headway_data);
    console.log('headway', headway_data);
    console.log('latestTrip', latestTransportHeadway);
  };

  const tripBookedHandler = async () => {
    try {
      if (!email) {
        console.error('Email not found in localStorage');
        toast.error('Email not found in localStorage');
        return;
      }

      if (!selectedorigin || !selecteddestination) {
        console.error('Please select both origin and destination');
        toast.error('Please select both origin and destination');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_BE}/trip_booked`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // email,
            globalTripformaps: global,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('History :', responseData);

      // setBookingHistory([...bookingHistory, responseData]);
    } catch (error) {
      console.error('Error booking:', error);
      toast.error('Error booking');
    }
  };

  const typographyStyles = {
    marginBottom: 2,
  };
  const cardStyles = {
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    maxWidth: 600,
    margin: 'auto',
    marginTop: 4,
  };

  // const handleDelete = (id) => {
  //   // Implement delete logic here using the ID
  //   const updatedBookingHistory = bookingHistory.filter(
  //     (booking) => booking.id !== id
  //   );
  //   setBookingHistory(updatedBookingHistory);
  //   // Make API call to delete the booking with the specific ID
  //   // Example:
  //   // const response = await fetch(`YOUR_DELETE_ENDPOINT/${id}`, {
  //   //   method: 'DELETE',
  //   // });
  //   // Handle the response/error accordingly
  // };

  return (
    <Grid container spacing={2} marginTop={2}>
      <ToastContainer />
      <Grid item xs={12} md={7}>
        <BookingCard>
          <CardContent>
            <StyledAutocomplete
              options={originOptions}
              id="origin"
              getOptionLabel={(option) => option[1]}
              onChange={(event, value) => setselectedOrigin(value)}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option[1]}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Origin" variant="outlined" />
              )}
            />
            <StyledAutocomplete
              options={destinationOptions}
              id="destination"
              getOptionLabel={(option) => option[1]}
              onChange={(event, value) => setselectedDestination(value)}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option[1]}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Destination" variant="outlined" />
              )}
            />

            <Button
              variant="contained"
              onClick={handleTripClick}
              sx={{ marginRight: 1 }}
            >
              Plan Trip
            </Button>

            {/* {tripPossible && tripPossible.message && (
              <>
                <Typography variant="h6" marginTop={2}>
                  Quickest time possible between the 2 stops:{' '}
                  {tripPossible.time_taken}
                </Typography>
                <Typography variant="h6" marginTop={2}>
                  Quickest trip id possible between the 2 stops:{' '}
                  {tripPossible.trip_id}
                </Typography>
                <Typography variant="h4" marginTop={2}>
                  Stops in between:
                </Typography>
                {tripPossible.seq_of_stop_names.map((stop, index) => (
                  <Typography variant="subtitle1" marginTop={2}>
                    {index + 1}) {stop[1]}
                  </Typography>
                ))}
              </>
            )} */}
            {tripPossible && tripPossible.message ? (
              <Card sx={cardStyles}>
                <CardContent>
                  <Typography variant="h6" sx={typographyStyles}>
                    Quickest time possible between the 2 stops:{' '}
                    {tripPossible.time_taken}
                  </Typography>
                  <Typography variant="h6" sx={typographyStyles}>
                    Quickest trip id possible between the 2 stops:{' '}
                    {tripPossible.trip_id}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ ...typographyStyles, marginTop: 2 }}
                  >
                    Stops in between:
                  </Typography>
                  {tripPossible.seq_of_stop_names.map((stop, index) => (
                    <Typography
                      variant="subtitle1"
                      sx={{ ...typographyStyles, marginTop: 2 }}
                      key={index}
                    >
                      {index + 1}) {stop[0]}
                    </Typography>
                  ))}
                  {headway && (
                    <Typography>
                      Headway Time: {latestTransportHeadway} Time with{' '}
                      {headway[0].average_headway} seconds as headway
                    </Typography>
                  )}

                  <Button variant="contained" onClick={handleBookClick}>
                    Book Trip
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 1 }}
                    // onClick={entireTripHandler}
                  >
                    {/* <a
                      href={`${process.env.REACT_APP_SERVER_BE}/trip/${tripPossible.trip_id}`}
                      target="_blank"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      Entire Trip
                    </a> */}
                    Entire Trip
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 1 }}
                    onClick={tripBookedHandler}
                  >
                    {/* <a
                      href={`${process.env.REACT_APP_SERVER_BE}/trip_booked`}
                      target="_blank"
                      style={{ textDecoration: 'none', color: 'white' }}
                    >
                      User Trip
                    </a> */}
                    User Trip
                  </Button>

                  <Select
                    value={selectedOption}
                    onChange={handleDropdownChange}
                    label="Select an route type"
                    sx={{ marginLeft: 1 }}
                  >
                    {bookType.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.type}
                      </MenuItem>
                    ))}
                  </Select>
                </CardContent>
              </Card>
            ) : (
              <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                Not possible from the above 2 points
              </Typography>
            )}
            {/* {selectedorigin && (
              <>
                <Typography variant="subtitle1">
                  User selected origin:
                </Typography>
                <Typography>{selectedorigin[1]}</Typography>
              </>
            )} */}
            {console.log(selectedorigin)}
            {console.log(selecteddestination)}
          </CardContent>
        </BookingCard>
      </Grid>
      <Grid item xs={12} md={5}>
        {/* <BookingCard> */}
        {/* <CardContent> */}
        <Typography variant="h6" marginBottom={2} sx={{ fontStyle: 'italic' }}>
          Booking History
        </Typography>

        {bookingHistory.map((booking, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <Card style={{ display: 'flex', alignItems: 'center' }}>
              <CardContent style={{ flex: 1 }}>
                <Typography variant="subtitle1">{booking[0]}</Typography>
                <Typography variant="subtitle1">{booking[1]}</Typography>
                <Typography variant="subtitle1">{booking[2]}</Typography>
              </CardContent>
              {/* <IconButton
                aria-label="delete"
                style={{ marginLeft: 'auto' }}
                // onClick={() => handleDelete(booking.id)}
              >
                <DeleteIcon />
              </IconButton> */}
            </Card>
          </div>
        ))}
        {/* </CardContent> */}
        {/* </BookingCard> */}
      </Grid>
    </Grid>
  );
};

export default Booking;
