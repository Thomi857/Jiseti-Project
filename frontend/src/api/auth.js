// frontend/src/api/auth.js
import api from './index';

export const registerUser = async (userData) => {
  // Now, the path is just '/register' because the baseURL in index.js handles the 'http://localhost:5000' part.
  const response = await api.post('/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // Similarly, the login path is now just '/login'.
  const response = await api.post('/login', credentials);
  return response.data;
};
