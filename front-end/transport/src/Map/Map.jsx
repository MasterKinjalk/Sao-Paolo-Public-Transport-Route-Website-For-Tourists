// import React, { useRef, useState } from 'react';
// import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
// import { Button, styled } from '@mui/material';

// // Define styles using the styled utility
// const MapContainer = styled('div')({
//   height: '400px',
//   width: '100%',
// });

// const NavigateButton = styled(Button)({
//   margin: '8px',
// });

// const Map = () => {
//   const saoPauloBounds = {
//     east: -46.3643,
//     west: -46.8267,
//     north: -23.3568,
//     south: -23.9575,
//   };

//   const [viewport, setViewport] = useState({
//     width: '100%',
//     height: '400px',
//     latitude: -23.5505,
//     longitude: -46.6333,
//     zoom: 10,
//     maxBounds: [
//       [saoPauloBounds.west, saoPauloBounds.south],
//       [saoPauloBounds.east, saoPauloBounds.north],
//     ],
//   });

//   const handleNavigate = () => {
//     setViewport({
//       ...viewport,
//       latitude: -23.5338,
//       longitude: -46.6253,
//       zoom: 14,
//       transitionDuration: 1000, // Smooth transition duration
//     });
//   };

//   return (
//     <div>
//       <MapContainer>
//         <ReactMapGL
//           {...viewport}
//           mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
//           onViewportChange={(newViewport) => setViewport(newViewport)}
//           mapStyle="mapbox://styles/mapbox/streets-v11"
//         >
//           {/* Additional Map Components, Markers, Layers can be added here */}
//           <Marker
//             latitude={-23.5338}
//             longitude={-46.6253}
//             offsetLeft={-20}
//             offsetTop={-10}
//           >
//             {/* Your marker component */}
//             <div>Destination Marker</div>
//           </Marker>
//           <div style={{ position: 'absolute', right: 10, top: 10 }}>
//             <NavigationControl />
//           </div>
//         </ReactMapGL>
//       </MapContainer>
//       <NavigateButton
//         variant="contained"
//         color="primary"
//         onClick={handleNavigate}
//       >
//         Navigate to Sao Paulo
//       </NavigateButton>
//     </div>
//   );
// };

// export default Map;

// import * as React from 'react';
// import Map from 'react-map-gl';

// const MapC = () => {
//   return (
//     <Map
//       mapboxAccessToken={process.env.REACT_APP_MAPBOX}
//       initialViewState={{
//         longitude: -122.4,
//         latitude: 37.8,
//         zoom: 14,
//       }}
//       style={{ width: 600, height: 400 }}
//       mapStyle="mapbox://styles/mapbox/streets-v9"
//     />
//   );
// };

// export default MapC;
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
        mapStyle="mapbox://styles/mapbox/streets-v9"
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
