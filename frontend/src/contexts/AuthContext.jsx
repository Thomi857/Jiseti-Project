import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);


const login = async (credentials) => {
  setAuthLoading(true);
  try {
    const response = await apiClient.login(credentials);
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  } finally {
    setAuthLoading(false);
  }
};



const register = async (userData) => {
  setAuthLoading(true);
  try {
    const response = await apiClient.register(userData);
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  } finally {
    setAuthLoading(false);
  }
};

const logout = () => {
  setAuthLoading(true);
  setTimeout(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthLoading(false);
  }, 1000); // optional delay for smooth effect
};
const [authLoading, setAuthLoading] = useState(false);

const value = {
  user,
  login,
  register,
  logout,
  loading,
  authLoading,
  isAuthenticated: !!user,
  isAdmin: user?.is_admin || false,
};


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);