import React, { useEffect, useState } from 'react';
import MapWithMarkers from './StopPoint';

const PlotMapStops = () => {
  const [MarkData, setMarkData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_BE}/all_stops`
        );
        const data = await response.json();
        setMarkData(data);
        console.log(data);

        // console.log(response);
        // Assuming data is an array of objects with latitude and longitude properties
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  if (MarkData.length === 0) {
    return <div>Loading...</div>;
  }

  let points = [];
  if (MarkData) {
    console.log(MarkData['stops_data']);
    points = MarkData['stops_data'];
    // points = MarkData['geojson_data']['features'][0]['geometry']['coordinates'][0];
    // points = MarkData['geojson_data'];
  }

  // console.log(MarkData.center);

  console.log(points);

  return (
    <div>
      {MarkData ? (
        <MapWithMarkers stopsData={points} centers={MarkData.center} />
      ) : (
        // <div>
        //   {points.map((p) => {
        //     return <p>{p}</p>;
        //   })}
        //   {/* hi */}
        // </div>
        // <>
        //   {stopsData.center[0]}
        //   {stopsData.center[1]}
        // </>
        // <div>
        //   {points.map((m) => {
        //     return <p>{m}</p>;
        //   })}
        // </div>
        <p>Not Working</p>
      )}
    </div>
    // <div>hi</div>
  );
};

export default PlotMapStops;
