import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import Map, { FullscreenControl } from 'react-map-gl';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

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

  const maxBounds = [-46.8267, -23.9927, -46.3565, -23.3565];
  //23.5558° S, 46.6396° W

  return (
    <MapContainer>
      <Map
        {...viewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewState(evt.viewState)}
        maxBounds={maxBounds}
      >
        <FullscreenControlContainer>
          <FullscreenControl />
        </FullscreenControlContainer>
      </Map>
    </MapContainer>
  );
};

export default MapC;
