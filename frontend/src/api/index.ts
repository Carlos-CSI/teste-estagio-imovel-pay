import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Can add authentication token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      // Server returned an error
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Error request:', error.request);
    } else {
      // Error in request configuration
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
