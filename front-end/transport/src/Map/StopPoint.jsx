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

  console.log(stopsData);
  const f100 = stopsData.slice(0, 1);

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
                background: 'blue',
                borderRadius: '50%',
                padding: '2px',
              }}
            >
              {stop[0]}
            </div>
          </Marker>
        ))}

        <FullscreenControlContainer>
          <FullscreenControl />
        </FullscreenControlContainer>
      </Map>
    </MapContainer>
    // <div>
    //   {stopsData.map((stop, index) => (
    //     <div key={index}>
    //       {index < 100 ? (
    //         <div>
    //           {stop[0]} {stop[1]} {stop[2]}
    //         </div>
    //       ) : (
    //         ''
    //       )}
    //       {/* {stop[0]} {stop[1]} {stop[2]} */}
    //     </div>
    //   ))}
    // </div>
  );
};

export default MapWithMarkers;

// import 'mapbox-gl/dist/mapbox-gl.css';
// import * as React from 'react';
// // import ReactMapGL, Map,{ Source, Layer, FullscreenControl } from 'react-map-gl';
// import Map, { Source, Layer, FullscreenControl } from 'react-map-gl';
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

// const MapWithPolygon = ({ polygonData, centers }) => {
//   const [viewport, setViewport] = React.useState({
//     width: '100%',
//     height: '100%',
//     latitude: centers[0],
//     longitude: centers[1],
//     zoom: 3.5,
//   });

//   return (
//     <MapContainer>
//       <Map
//         {...viewport}
//         mapStyle="mapbox://styles/mapbox/streets-v12"
//         mapboxAccessToken={process.env.REACT_APP_MAPBOX}
//         onViewportChange={(newViewport) => setViewport(newViewport)}
//       >
//         {/* Render the GeoJSON line */}
//         <Source id="line" type="geojson" data={polygonData}>
//           <Layer
//             id="outline"
//             type="line"
//             paint={{
//               'line-color': '#000',
//               'line-width': 3,
//             }}
//           />
//         </Source>

//         <FullscreenControlContainer>
//           <FullscreenControl />
//         </FullscreenControlContainer>
//       </Map>
//     </MapContainer>
//   );
// };

// export default MapWithPolygon;
