import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from '@mui/material';

const bookType = [
  {
    id: 1,
    type: 'Metro',
  },
  {
    id: 2,
    type: 'Train',
  },
  {
    id: 3,
    type: 'Bus',
  },
];
const RoutesTypes = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [routeTypedata, setrouteTypedata] = useState(null);

  const createAndDownloadFile = (content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'entire_trip.html';
    document.body.appendChild(element);
    element.click();
  };

  const chosenRouteHandler = async (route) => {
    console.log(route);
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BE}/get_trip_id`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route_long_name: route.route_long_name,
          route_color: route.route_color,
          trip_id: route.trip_id,
        }),
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();
    console.log(data);
    createAndDownloadFile(data);
  };

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

  const handleDropdownChange = async (event) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
    console.log('hit dropdown');
    await fetchType(event.target.value);
  };
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', marginTop: 2 }}>
      <Typography variant="h6" color="initial" marginBottom={1}>
        Select one of the route types
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Select a Route Type</InputLabel>
        <Select
          value={selectedOption}
          onChange={handleDropdownChange}
          label="Select a Route Type"
        >
          {bookType.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {routeTypedata && (
        <Box marginTop={2}>
          <Grid container spacing={2}>
            {routeTypedata['trip_data'].slice(0, 20).map((route, index) => (
              <Grid item key={route.route_id + index} xs={12} sm={6} md={4}>
                <Card sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Route ID: {route.route_id}
                    </Typography>
                    <Typography variant="body1">
                      Route Long Name: {route.route_long_name}
                    </Typography>
                    <Typography variant="body1">
                      Route Color: {route.route_color}
                    </Typography>
                    <Typography variant="body1">
                      Trip ID: {route.trip_id}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => chosenRouteHandler(route)}
                    >
                      Map
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default RoutesTypes;
