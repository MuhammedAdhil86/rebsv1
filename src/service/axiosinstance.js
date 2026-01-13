import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://rebs-hr-cwhyx.ondigitalocean.app/", // ✅ trailing slash added
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ⭐ Attach ngrok URL manually (without touching interceptors)
axiosInstance.baseURL2 = "https://garishly-pluvious-keiko.ngrok-free.dev/";

// Attach token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and update token
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.data?.token;
    if (newToken) localStorage.setItem("authToken", newToken);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
