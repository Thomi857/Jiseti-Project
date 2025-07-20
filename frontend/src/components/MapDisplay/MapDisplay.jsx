import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing default icon in some builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ setCoordinates }) {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates({ latitude: lat, longitude: lng }); // Updated to latitude/longitude

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        // Create marker if it doesn't exist
        markerRef.current = L.marker(e.latlng).addTo(useMapEvents().map);
      }
    },
  });

  return null; // No static marker needed; created dynamically on click
}

function MapDisplay({ setCoordinates }) {
  return (
    <MapContainer
      center={[0.0236, 37.9062]} // Default center (Kenya)
      zoom={6}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setCoordinates={setCoordinates} />
    </MapContainer>
  );
}

export default MapDisplay;