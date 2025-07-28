import axios from 'axios';
import { getAuthHeader } from './auth-header';

// Auto-detect environment and set appropriate API URL
const getApiUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect environment
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  if (isDevelopment) {
    return 'http://localhost:5000/api';
  } else if (isProduction) {
    return 'https://paybord.onrender.com/api';
  }
  
  // Fallback
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

console.log('🌐 API URL:', API_URL);
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('📦 VITE_API_URL:', import.meta.env.VITE_API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export { api, API_URL };
