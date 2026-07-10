import axios from 'axios';

// Get API base URL from env variables
const API_URL = import.meta.env.VITE_API_URL || '';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g., JWT expiration)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // If unauthorized/token expired, clear local storage and redirect
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login/register pages
        if (
          window.location.pathname !== '/login' && 
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
