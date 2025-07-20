import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/auth', // Add /auth prefix for register and login
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token from localStorage before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Override Content-Type for multipart/form-data requests (e.g., /reports)
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

export default api;