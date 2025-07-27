import axios from 'axios';

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
    // Retry logic
    validateStatus: function (status) {
        return status >= 200 && status < 500; // Only reject if status is 5xx
    },
});

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
                    if (!config.headers) config.headers = {} as any;
        (config.headers as any).Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Store a record of recent API errors to prevent excessive logging
const recentErrors = new Map<string, number>();

// Function to check if we should log an error (rate limiting)
const shouldLogError = (url: string, status: number): boolean => {
    const key = `${url}:${status}`;
    const now = Date.now();
    const lastLogged = recentErrors.get(key) || 0;
    
    // Only log the same error once every 5 seconds
    if (now - lastLogged > 5000) {
        recentErrors.set(key, now);
        return true;
    }
    return false;
};

// Retry logic for timeouts and network errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (!config || config.__retryCount >= 2) {
            return Promise.reject(error);
        }
        config.__retryCount = (config.__retryCount || 0) + 1;
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.warn(`Retrying request (${config.__retryCount}/2) due to timeout...`);
            return api(config);
        }
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Network errors and timeouts
        if (!error.response) {
            if (shouldLogError(error.config?.url || 'unknown', 0)) {
                if (error.message.includes('timeout')) {
                    console.error('Request timed out. Please check your connection and try again.');
                } else {
                    console.error('Network error. Please check your connection and try again.');
                }
            }
        }
        // Handle 404 errors silently for business profile checks
        else if (error.response.status === 404 && error.config?.url?.includes('/business/profile')) {
            // This is an expected error for users who haven't registered a business yet
            // We'll handle it silently to avoid console spam
        }
        // Handle unauthorized errors (401)
        else if (error.response.status === 401) {
            // Clear localStorage and redirect to login if token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        // Handle server errors (5xx)
        else if (error.response.status >= 500 && shouldLogError(error.config?.url || 'unknown', error.response.status)) {
            console.error('Server error. Please try again later.');
        }
        
        return Promise.reject(error);
    }
);

export default api;
