// import React from 'react';
// import { Map, Marker } from '@vis.gl/react-google-maps';

// const ReportMap = ({ lat, lng }) => {
//   const position = { lat: lat, lng: lng };

//   return (
//     <div style={{ height: '200px', width: '100%', marginTop: '1rem' }}>
//       <Map
//         defaultCenter={position}
//         defaultZoom={14}
//         gestureHandling={'greedy'}
//         disableDefaultUI={true}
//       >
//         <Marker position={position} />
//       </Map>
//     </div>
//   );
// };

// export default ReportMap;

// ReportMap.jsx
import React from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';

const ReportMap = ({ lat, lng }) => {
  const position = { lat: lat, lng: lng };

  return (
    <div className="h-64 w-full mt-4 rounded-lg overflow-hidden shadow-lg">
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
