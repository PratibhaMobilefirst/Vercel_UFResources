import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://dockaccemble.vercel.app/api", // Base URL for your API
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json", // Set any default headers here if needed
  },
});

export default axiosInstance;
