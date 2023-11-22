// import 'mapbox-gl/dist/mapbox-gl.css';
// import * as React from 'react';
// import Map, { Marker, FullscreenControl } from 'react-map-gl';
// import { Box } from '@mui/material';
// import { styled } from '@mui/system';

// const MapContainer = styled(Box)({
//   position: 'relative',
//   width: '100%',
//   height: '100vh',
// });

// const FullscreenControlContainer = styled('div')({
//   position: 'absolute',
//   top: 20,
//   left: 20,
// });

// const MapWithMarkers = ({ stopsData, centers }) => {
//   const [viewState, setViewState] = React.useState({
//     zoom: 3.5,
//     // longitude: centers[0],
//     // latitude: centers[1],
//   });

//   console.log(stopsData);
//   const f100 = stopsData.slice(0, 100);

//   console.log('f100');
//   console.log(f100);

//   // for (let i = 0; i < f100.length; i++) {
//   //   console.log(f100[i]);
//   // }
//   const maxBounds = [-52.8267, -14.9927, -46.3565, -23.3565];

//   return (
//     <MapContainer>
//       <Map
//         {...viewState}
//         mapStyle="mapbox://styles/mapbox/streets-v12"
//         mapboxAccessToken={process.env.REACT_APP_MAPBOX}
//         onMove={(evt) => setViewState(evt.viewState)}
//         // maxBounds={maxBounds}
//       >
//         {f100.map((stop, index) => (
//           <Marker
//             key={index}
//             latitude={parseFloat(stop[1])}
//             longitude={parseFloat(stop[2])}
//           >
//             <div
//               style={{
//                 color: 'white',
//                 background: 'blue',
//                 borderRadius: '50%',
//                 padding: '2px',
//               }}
//             >
//               {stop[0]}
//             </div>
//           </Marker>
//         ))}

//         <FullscreenControlContainer>
//           <FullscreenControl />
//         </FullscreenControlContainer>
//       </Map>
//     </MapContainer>
//   );
// };

// export default MapWithMarkers;

import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import Map, { Marker, FullscreenControl } from 'react-map-gl';
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

const MapWithMarkers = ({ stopsData, centers }) => {
  const [viewState, setViewState] = React.useState({
    zoom: 3.5,
    // longitude: centers[0],
    // latitude: centers[1],
  });

  const [hoveredStop, setHoveredStop] = React.useState(null);

  console.log(stopsData);
  const f100 = stopsData.slice(0, 100);

  console.log('f100');
  console.log(f100);

  // for (let i = 0; i < f100.length; i++) {
  //   console.log(f100[i]);
  // }
  const maxBounds = [-52.8267, -14.9927, -46.3565, -23.3565];

  return (
    <MapContainer>
      <Map
        {...viewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewState(evt.viewState)}
        // maxBounds={maxBounds}
      >
        {f100.map((stop, index) => (
          <Marker
            key={index}
            latitude={parseFloat(stop[1])}
            longitude={parseFloat(stop[2])}
          >
            <div
              style={{
                color: 'white',
                background: 'red',
                borderRadius: '4px',
                padding: '5px',
                display: hoveredStop === stop[0] ? 'block' : 'none',
                position: 'absolute',
                top: '-50px',
                left: '-15px',
                zIndex: 9999,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '120px',
                textAlign: 'center',
              }}
            >
              {stop[0]}
            </div>
            <div
              onMouseEnter={() => setHoveredStop(stop[0])}
              onMouseLeave={() => setHoveredStop(null)}
              style={{ zIndex: 1 }}
            >
              {/* Your marker design */}
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  background: 'blue',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              ></div>
            </div>
          </Marker>
        ))}

        <FullscreenControlContainer>
          <FullscreenControl />
        </FullscreenControlContainer>
      </Map>
    </MapContainer>
  );
};

export default MapWithMarkers;
