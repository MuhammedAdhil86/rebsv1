import axios from "axios";

const axiosInstance = axios.create({
  // ✅ Change this to use the proxy prefix from vite.config.js
  baseURL: "/api_v1", 
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// -------------------- Request Interceptor --------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------- Response Interceptor --------------------
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.data?.token;
    if (newToken) localStorage.setItem("authToken", newToken);
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || "";

    if (
      error.response?.status === 401 &&
      !requestUrl.startsWith(axiosInstance.baseURL2)
    ) {
      localStorage.removeItem("authToken");
      window.location.href = "/"; 
    } else if (error.response?.status === 401) {
      console.warn(
        "Email API returned 401, user will NOT be logged out:",
        requestUrl
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;