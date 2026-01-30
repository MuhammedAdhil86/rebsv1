import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://rebs-hr-cwhyx.ondigitalocean.app/", // main API
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
    // Update token if backend sends a new one
    const newToken = response.data?.token;
    if (newToken) localStorage.setItem("authToken", newToken);
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || "";

    // ✅ Only auto-logout for main API, NOT email API (baseURL2)
    if (
      error.response?.status === 401 &&
      !requestUrl.startsWith(axiosInstance.baseURL2)
    ) {
      localStorage.removeItem("authToken");
      window.location.href = "/"; // Redirect to login
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
