import React from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';

const ReportMap = ({ lat, lng }) => {
  const position = { lat: lat, lng: lng };

  return (
    <div style={{ height: '200px', width: '100%', marginTop: '1rem' }}>
      <Map
        defaultCenter={position}
        defaultZoom={14}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <Marker position={position} />
      </Map>
    </div>
  );
};

export default ReportMap;