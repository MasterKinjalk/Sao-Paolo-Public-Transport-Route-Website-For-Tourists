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

//   const [hoveredStop, setHoveredStop] = React.useState(null);

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
//                 background: 'red',
//                 borderRadius: '4px',
//                 padding: '5px',
//                 display: hoveredStop === stop[0] ? 'block' : 'none',
//                 position: 'absolute',
//                 top: '-50px',
//                 left: '-15px',
//                 zIndex: 9999,
//                 whiteSpace: 'nowrap',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 maxWidth: '120px',
//                 textAlign: 'center',
//               }}
//             >
//               {stop[0]}
//             </div>
//             <div
//               onMouseEnter={() => setHoveredStop(stop[0])}
//               onMouseLeave={() => setHoveredStop(null)}
//               style={{ zIndex: 1 }}
//             >
//               {/* Your marker design */}
//               <div
//                 style={{
//                   width: '10px',
//                   height: '10px',
//                   background: 'blue',
//                   borderRadius: '50%',
//                   cursor: 'pointer',
//                 }}
//               ></div>
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
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  });

  // const [hoveredStop, setHoveredStop] = React.useState(null);
  const [coordinates, setCoordinates] = React.useState([]);

  const f100 = stopsData.slice(0, 1000);

  const handleMarkerClick = (name, lat, lon) => {
    toast(`Clicked on ${name} with lat:${lat} and lon:${lon}`, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const handleAddCoordinates = (name, lat, lon) => {
    const updatedCoordinates = [...coordinates, [name, lat, lon]];

    if (updatedCoordinates.length > 2) {
      updatedCoordinates.shift();
    }

    setCoordinates(updatedCoordinates);
    localStorage.setItem('coordinates', JSON.stringify(updatedCoordinates));
  };

  console.log(coordinates);

  return (
    <MapContainer>
      <Map
        {...viewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        <ToastContainer />
        {f100.map((stop, index) => (
          <Marker
            key={index}
            latitude={parseFloat(stop[2])}
            longitude={parseFloat(stop[3])}
          >
            {/* {console.log('Stop data:', stop)} */}
            <div
              onClick={(e) => {
                e.preventDefault();
                handleMarkerClick(stop[1], stop[2], stop[3]);
                handleAddCoordinates(stop[1], stop[2], stop[3]);
              }}
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

      <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Button
          variant="contained"
          onClick={() => {
            console.log('Coordinates:', coordinates);
            // You can use the coordinates array as needed
          }}
        >
          Show Coordinates
        </Button>
      </div>
    </MapContainer>
  );
};

export default MapWithMarkers;
