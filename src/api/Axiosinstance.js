import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fitness-server-ffl7.onrender.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ───────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error?.response?.status;
    const message = error?.response?.data?.message || error.message;
    console.error(`[Axios] ${status || 'Network Error'}: ${message}`);
    return Promise.reject(error);
  }
);

export default axiosInstance;