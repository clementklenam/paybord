import axios from 'axios';
import { getAuthHeader } from '../services/auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    if (authHeader && config.headers) {
      config.headers = { ...config.headers, ...authHeader } as any;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
