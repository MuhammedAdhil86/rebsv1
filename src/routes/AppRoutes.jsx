import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore"; // ✅ Import Zustand store

// Pages
import Login from "../page/login";
import ForgotPasswordUI from "../page/forgetpasssword";
import OtpUi from "../page/otp";
import NewPasswordUI from "../page/newpassword";
import Dashboard from "../page/dashboard";
import WorkFromHome from "../page/workfromhome";
import Settings from "../page/settings";

// ✅ ProtectedRoute component
const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Component /> : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* --- Auth Routes --- */}
      <Route path="/" element={<Login />} />
      <Route path="/forgetpass" element={<ForgotPasswordUI />} />
      <Route path="/otp" element={<OtpUi />} />
      <Route path="/newpassword" element={<NewPasswordUI />} />
      <Route path="/workfromhome" element={<WorkFromHome />} />

      {/* --- Protected Routes --- */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={Dashboard} />}
      />
         <Route
        path="/settings"
        element={<ProtectedRoute element={Settings} />}
      />
    </Routes>
  );
}

export default AppRoutes;
