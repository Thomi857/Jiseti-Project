import { 
  REPORT_STATUS_LABELS, 
  REPORT_TYPE_LABELS, 
  STATUS_COLORS, 
  TYPE_COLORS 
} from './constants';

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  return REPORT_STATUS_LABELS[status] || status;
};

export const getTypeColor = (type) => {
  return TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
};

export const getTypeText = (type) => {
  return REPORT_TYPE_LABELS[type] || type;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatCoordinates = (lat, lng, precision = 4) => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};