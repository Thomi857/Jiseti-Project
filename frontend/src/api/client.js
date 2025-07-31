import axios from 'axios';

const API_BASE_URL = 'https://jiseti-project.onrender.com/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(userData) {
    const response = await this.client.post('/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await this.client.post('/login', credentials);
    return response.data;
  }

  async getReports() {
    const response = await this.client.get('/reports');
    return response.data;
  }

  async createReport(reportData) {
    const response = await this.client.post('/reports', reportData);
    return response.data;
  }

  async updateReport(reportId, updateData) {
    const response = await this.client.put(`/reports/${reportId}`, updateData);
    return response.data;
  }

  async deleteReport(reportId) {
    const response = await this.client.delete(`/reports/${reportId}`);
    return response.data;
  }
}

export default new ApiClient();
