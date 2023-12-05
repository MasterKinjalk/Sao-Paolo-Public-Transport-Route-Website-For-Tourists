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
  Tooltip,
  MenuItem,
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
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
// const CopyIconContainer = styled('div')({
//   position: 'absolute',
//   top: 50,
//   right: 20,
//   display: 'flex',
//   flexDirection: 'column',
//   gap: '10px',
// });

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
  },
  '& .MuiAutocomplete-inputRoot': {
    padding: theme.spacing(1),
  },
}));

// const bookType = [
//   {
//     id: 1,
//     type: 'Metro',
//   },
//   {
//     id: 2,
//     type: 'Train',
//   },
//   {
//     id: 3,
//     type: 'Bus',
//   },
// ];
const Booking = () => {
  const [originOptions, setOriginOptions] = useState([]);
  const [Coordinate, setCoordinate] = React.useState(null);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [latestTransportHeadway, setLatestTransportHeadway] = useState('');
  const [routeTypedata, setrouteTypedata] = useState(null);
  const [html, sethtml] = useState(null);

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

  // const handleDropdownChange = async (event) => {
  //   console.log(event.target.value);
  //   setSelectedOption(event.target.value);
  //   console.log('hit dropdown');
  //   await fetchType(event.target.value);
  // };

  const handleCopyClick = (coordinateIndex) => {
    const [coord1, coord2] = Coordinate;
    const coordinate = coordinateIndex === 1 ? coord1 : coord2;
    console.log(coordinate[0]);
    const textToCopy = `${coordinate[0]}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log(
          `Copied ${
            coordinateIndex === 1 ? 'p1' : 'p2'
          } coordinates to clipboard`
        );
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
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

  const entireTripHandler = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BE}/trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trip_id: tripPossible.trip_id }),
      });
      const data = await response.text();
      sethtml(data);
      createAndDownloadFile(data);
    } catch (error) {
      console.error('Error fetching trip data:', error);
    }
  };

  const createAndDownloadFile = (content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'entire_trip.html';
    document.body.appendChild(element);
    element.click();
  };

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
      console.log('history successfully retrieved');
      console.log(data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };
  useEffect(() => {
    fetchBookingHistory();
  }, []);

  React.useEffect(() => {
    const getCoordinatesFromLocalStorage = () => {
      const Coordinatesv = localStorage.getItem('coordinates');

      if (Coordinatesv) {
        setCoordinate(JSON.parse(Coordinatesv));
      }
    };

    getCoordinatesFromLocalStorage();
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

  // const fetchType = async (type) => {
  //   const response = await fetch(
  //     `${process.env.REACT_APP_SERVER_BE}/get_routemode_ids`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         route_type: type,
  //       }),s
  //     }
  //   );
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   const data = await response.json();
  //   setrouteTypedata(data);
  //   console.log(data);
  // };

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
      console.log('Booked :', responseData);

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
    console.log(headway_data);
    function getNextTripTime(headwaySeconds) {
      const currentTime = new Date();
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
      );
      const endOfDay = new Date(
        currentCSTTime.getFullYear(),
        currentCSTTime.getMonth(),
        currentCSTTime.getDate(),
        23,
        0,
        0
      );
      // endOfDay.setDate(endOfDay.getDate() + 1);
      console.log(startOfDay);
      console.log(endOfDay);
      console.log(currentCSTTime);
      if (currentCSTTime >= startOfDay && currentCSTTime <= endOfDay) {
        let nextTripTime = new Date(startOfDay.getTime());
        console.log(true);
        console.log(nextTripTime);

        while (nextTripTime <= currentCSTTime) {
          nextTripTime.setTime(nextTripTime.getTime() + headwaySeconds * 1000);
          console.log(nextTripTime);
        }

        if (nextTripTime > endOfDay) {
          return 'No more trips today';
        }

        return nextTripTime;
      } else {
        return startOfDay;
      }
    }

    const headwaySeconds = parseFloat(headway_data[0].average_headway);
    const nextTrip = getNextTripTime(headwaySeconds);
    console.log(`Next earliest trip time is ${nextTrip}`);

    const dateString = nextTrip.toString().split(' GMT')[0];

    console.log(dateString);

    console.log(headwaySeconds + ' is the headway secs');

    setLatestTransportHeadway(dateString);

    setheadway(headway_data);
    console.log('headway', headway_data);
    // console.log('latestTrip', latestTransportHeadway);
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
      const data = await response.text();
      sethtml(data);
      createAndDownloadFile(data);
    } catch (error) {
      console.error('Error fetching trip data:', error);
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
        {/* <Typography variant="h6" marginBottom={2} sx={{ fontStyle: 'italic' }}>
          Trip Planner
        </Typography> */}
        {/* <Select
          value={selectedOption}
          onChange={handleDropdownChange}
          label="Select an route type"
          sx={{ marginBottom: 2 }}
        >
          {bookType.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.type}
            </MenuItem>
          ))}
        </Select> */}
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
            {Coordinate && Coordinate.length === 2 ? (
              // <CopyIconContainer>
              <>
                <Tooltip title="Copy p1 coordinates" placement="left">
                  <IconButton onClick={() => handleCopyClick(1)} size="small">
                    <FileCopyIcon />1
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy p2 coordinates" placement="left">
                  <IconButton
                    onClick={() => handleCopyClick(2)}
                    size="small"
                    sx={{ marginLeft: 1 }}
                  >
                    <FileCopyIcon />2
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              // </CopyIconContainer>
              ''
            )}

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
                    <>
                      <Typography>
                        Next Trip at: {latestTransportHeadway}
                        {/* {headway[0].average_headway} seconds as headway */}
                      </Typography>
                      <Typography sx={{ marginBottom: 1 }}>
                        Frequency: {parseFloat(headway[0].average_headway) / 60}{' '}
                        mins
                      </Typography>
                    </>
                  )}

                  <Button variant="contained" onClick={handleBookClick}>
                    Book Trip
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 1 }}
                    onClick={entireTripHandler}
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
                </CardContent>
              </Card>
            ) : (
              !tripPossible.message &&
              selectedorigin &&
              selecteddestination && (
                <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                  Not possible from the above 2 points
                </Typography>
              )
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

        {bookingHistory &&
          bookingHistory.slice(0, 5).map((booking, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <Card style={{ display: 'flex', alignItems: 'center' }}>
                <CardContent style={{ flex: 1 }}>
                  <Typography variant="subtitle1">{booking[0]}</Typography>
                  <Typography variant="subtitle1">{booking[1]}</Typography>
                  <Typography variant="subtitle1">
                    {booking[2].replace(' GMT', '')}
                  </Typography>
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
      {/* <HtmlViewer htmlContent={html} /> */}
    </Grid>
  );
};

export default Booking;
