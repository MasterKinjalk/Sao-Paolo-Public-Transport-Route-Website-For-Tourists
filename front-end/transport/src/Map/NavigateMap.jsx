import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import Map, { FullscreenControl } from 'react-map-gl';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

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

const MapC = () => {
  const [viewState, setViewState] = React.useState({
    // longitude: -100,
    // latitude: 40,
    zoom: 3.5,
  });

  // const maxBounds = [-46.8267, -23.9927, -46.3565, -23.3565];

  const addDirections = (map) => {
    const directions = new MapboxDirections({
      accessToken: process.env.REACT_APP_MAPBOX,
      unit: 'metric', // Use metric or imperial as per your preference
    });

    map.addControl(directions, 'top-left');
  };

  const handleMapLoad = (map) => {
    addDirections(map);
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
        <FullscreenControlContainer>
          <FullscreenControl />
        </FullscreenControlContainer>
      </Map>
    </MapContainer>
  );
};

export default MapC;
