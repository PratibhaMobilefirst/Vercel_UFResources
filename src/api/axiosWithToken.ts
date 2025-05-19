import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore"; // Adjust this import according to your file structure

const axiosWithToken = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

// Add a request interceptor to include the token from Zustand store
axiosWithToken.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Access token from Zustand store

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to the header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosWithToken;
