import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Button, styled } from '@mui/material';

// Define styles using the styled utility
const MapContainer = styled('div')({
  height: '400px',
  width: '100%',
});

const NavigateButton = styled(Button)({
  margin: '8px',
});

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox access token
    const initializeMap = ({ setMap, mapContainerRef }) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11', // Replace with your preferred Mapbox style
        center: [-46.6333, -23.5505], // Sao Paulo's longitude and latitude
        zoom: 10, // Zoom level to focus on Sao Paulo
      });

      map.on('load', () => {
        setMap(map);
      });

      // Clean up on unmount
      return () => map.remove();
    };

    if (!map) initializeMap({ setMap, mapContainerRef });
  }, [map]);

  const handleNavigate = () => {
    // Replace these coordinates with your desired destination within Sao Paulo
    const destinationCoordinates = [-46.6253, -23.5338]; // Example coordinates within Sao Paulo
    map.flyTo({
      center: destinationCoordinates,
      zoom: 14, // Adjust the zoom level as needed
      essential: true, // This animation is considered essential and will not be affected by browser constraints
    });
  };

  return (
    <div>
      <MapContainer ref={mapContainerRef} />
      <NavigateButton
        variant="contained"
        color="primary"
        onClick={handleNavigate}
      >
        Navigate to Sao Paulo
      </NavigateButton>
    </div>
  );
};

export default Map;
