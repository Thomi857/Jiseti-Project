// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});
// Automatically attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Reports
apiClient.getReports = async function () {
  const res = await this.get('/reports');
  return res.data;
};

apiClient.createReport = async function (reportData) {
  const token = localStorage.getItem("access_token");
  const res = await this.post("/reports", reportData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    withCredentials: true
  });
  return res.data;
};


apiClient.updateReport = async function (reportId, updateData) {
  const res = await this.put(`/reports/${reportId}`, updateData);
  return res.data;
};

apiClient.deleteReport = async function (reportId) {
  const res = await this.delete(`/reports/${reportId}`);
  return res.data;
};

apiClient.register = async function (userData) {
  const res = await this.post('/register', userData, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });
  return res.data;
};


apiClient.login = async function (credentials) {
  const res = await this.post('/login', credentials);
  return res.data;
};

export default apiClient;
