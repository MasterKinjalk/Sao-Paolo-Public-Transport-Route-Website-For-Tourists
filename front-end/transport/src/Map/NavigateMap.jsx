import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import Map, { FullscreenControl } from 'react-map-gl';
import { Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import FileCopyIcon from '@mui/icons-material/FileCopy';
const MapContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100vh',
});

const FullscreenControlContainer = styled('div')({
  position: 'absolute',
  top: 20,
  left: 20,
});
const CopyIconContainer = styled('div')({
  position: 'absolute',
  top: 50,
  right: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const MapC = () => {
  const [viewState, setViewState] = React.useState({
    // longitude: -100,
    // latitude: 40,
    zoom: 3.5,
  });

  const [Coordinate, setCoordinate] = React.useState(null);

  // Function to check and retrieve coordinates from local storage
  React.useEffect(() => {
    const getCoordinatesFromLocalStorage = () => {
      const Coordinatesv = localStorage.getItem('coordinates');

      if (Coordinatesv) {
        setCoordinate(JSON.parse(Coordinatesv));
      }
    };

    getCoordinatesFromLocalStorage();
  }, []);

  // const geocodePlace = async (place) => {
  //   try {
  //     const response = await fetch(
  //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${process.env.REACT_APP_MAPBOX}`
  //     );
  //     const data = await response.json();
  //     const coordinates = data.features[0].geometry.coordinates;
  //     return coordinates;
  //   } catch (error) {
  //     console.error('Error geocoding place: ', error);
  //     return null;
  //   }
  // };

  // const maxBounds = [-46.8267, -23.9927, -46.3565, -23.3565];

  const addDirections = async (map) => {
    // const p1 = await geocodePlace(Coordinate[0][0]);
    // const p2 = await geocodePlace(Coordinate[1][0]);
    // const p1_lat = Coordinate[0][1];
    // const p1_lon = Coordinate[0][2];
    // const p2_lat = Coordinate[1][1];
    // const p2_lon = Coordinate[1][2];
    const [coord1, coord2] = Coordinate;
    console.log(coord1, coord2);

    const directions = new MapboxDirections({
      accessToken: process.env.REACT_APP_MAPBOX,
      unit: 'metric',

      // Coordinate && Coordinate.length === 2
      //   ? [{ coordinates: p1 }, { coordinates: p2 }]
      //   : undefined,
    });

    map.addControl(directions, 'top-left');
  };

  const handleMapLoad = (map) => {
    addDirections(map);
  };

  const handleCopyClick = (coordinateIndex) => {
    const [coord1, coord2] = Coordinate;
    const coordinate = coordinateIndex === 1 ? coord1 : coord2;
    console.log(coordinate[2], coordinate[1]);
    const textToCopy = `${coordinate[2]}, ${coordinate[1]}`;

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

  return (
    <MapContainer>
      <Map
        {...viewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(viewport) => setViewState(viewport)}
        // maxBounds={maxBounds}
        onLoad={(event) => handleMapLoad(event.target)}
      >
        <CopyIconContainer>
          <Tooltip title="Copy p1 coordinates" placement="left">
            <IconButton onClick={() => handleCopyClick(1)}>
              <FileCopyIcon />1
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy p2 coordinates" placement="left">
            <IconButton onClick={() => handleCopyClick(2)}>
              <FileCopyIcon />2
            </IconButton>
          </Tooltip>
        </CopyIconContainer>

        <FullscreenControlContainer>
          <FullscreenControl />
        </FullscreenControlContainer>
      </Map>
    </MapContainer>
  );
};

export default MapC;
