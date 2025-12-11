import axios from "axios";

// Create an Axios instance with default config
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Set your base API URL
  timeout: 10000, // Optional: Set request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Axios Interceptors (for authentication, etc.)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token if available
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// You can add interceptors for responses as well:
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error messages or token expiration logic
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - redirect to login");
    }
    return Promise.reject(error);
  }
);

export default api;
