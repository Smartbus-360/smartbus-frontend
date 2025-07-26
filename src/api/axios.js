import axios from "axios";
import { logoutUser } from "../config/authService";

// Base API Instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/admin`,
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Reject if not in 2xx range
  },
});

// Function to Refresh Token
const refreshAccessToken = async () => {
  console.log("refreshAccessToken() called!");

  try {
    const response = await axiosInstance.post(
      "refresh",
      {},
      { withCredentials: true }
    );

    console.log("Refresh Token Response:", response);

    if (response.data?.accessToken) {
      const newAccessToken = response.data.accessToken;
      sessionStorage.setItem("authToken", newAccessToken);
      return newAccessToken;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    sessionStorage.removeItem("authToken");
    alert("Your session has expired. Please log in again.");
    window.location.href = "/"; // Redirect user to login
    return null;
  }

  return null;
};

// Request Interceptor – Attach Token Dynamically
axiosInstance.interceptors.request.use(
    (config) => {
      config.withCredentials = true; //Ensure cookies are sent with each request
  
      const token = sessionStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
  
      // Dynamically adjust headers for FormData requests
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
  

// Response Interceptor – Handle Expired Token (401) and Save New Token
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if a new access token is provided
    const newToken =
      response.headers["authorization"] || response.data?.accessToken;

    if (newToken) {
      const tokenValue = newToken.split(" ")[1] || newToken;
      console.log("New access token received:", tokenValue);
      sessionStorage.setItem("authToken", tokenValue);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.log(
          "Unauthorized request detected! Attempting to refresh token..."
        );

        if (!originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Error while refreshing token:", refreshError);
          }
        }
      }

      // Logout if refresh token is invalid
      if (
        status === 403 &&
        data?.message === "Forbidden: Invalid refresh token"
      ) {
        console.warn("Invalid refresh token. Logging out user...");
        logoutUser();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
