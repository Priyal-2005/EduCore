import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api',
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('educore_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle global responses/errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message for UI consumption
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    // If 401 Unauthorized, maybe trigger a logout event here if needed
    if (customError.status === 401) {
      localStorage.removeItem('educore_token');
      // window.location.href = '/login';
    }

    return Promise.reject(customError);
  }
);

export default api;
