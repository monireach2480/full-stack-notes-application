// import axios from 'axios';

// export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("token");
//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;



import axios from 'axios';

// Determine the base URL dynamically
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL; // Explicitly set in .env
  }
  return import.meta.env.MODE === 'development' 
    ? 'http://localhost:8000' 
    : '/api'; // Production assumes same domain (handled by reverse proxy)
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If using cookies/auth
});

// Request interceptor for adding the token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;