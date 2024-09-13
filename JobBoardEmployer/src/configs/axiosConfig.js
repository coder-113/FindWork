import axios from "axios";

const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

// Request Interceptor for JWT
axiosRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosRequest.interceptors.response.use(
  (response) => response.data, // Automatically return response.data
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);
export default axiosRequest;
