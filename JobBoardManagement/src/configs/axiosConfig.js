import axios from "axios";
import showToast from "../utils/functions/showToast";
const axiosRequest = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

// Request Interceptor for JWT
axiosRequest.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
axiosRequest.interceptors.response.use(
  (response) => response.data, // Automatically return response.data
  async (error) => {
    // Handle errors
    // if (error.response.status === 401) {
    //   const refreshToken = localStorage.getItem("refreshToken");

    //   if (refreshToken) {
    //     const response = await axios.post(
    //       "http://localhost:8080/api/auth/refreshtoken",
    //       {
    //         refreshToken,
    //       }
    //     );
    //     localStorage.setItem("accessToken", response.data.accessToken);
    //   }
    // }
    // showToast(error.message, "error");

    return Promise.reject(error);
  }
);
export default axiosRequest;
