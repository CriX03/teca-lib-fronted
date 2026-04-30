import axios from 'axios';

const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { expires: true } }));
      }
      
      const normalizedError = error.response?.data?.error || {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.response?.data?.message || error.message || 'Ocurrió un error inesperado'
      };
      
      return Promise.reject(normalizedError);
    }
  );

  return instance;
};

export const apiUsers = createInstance(import.meta.env.VITE_API_USERS_URL);
export const apiCatalog = createInstance(import.meta.env.VITE_API_CATALOG_URL);
export const apiLoans = createInstance(import.meta.env.VITE_API_LOANS_URL);
export const apiReports = createInstance(import.meta.env.VITE_API_REPORTS_URL);
