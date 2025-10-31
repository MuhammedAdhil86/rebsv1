import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Pages
import Login from "../page/login";
import ForgotPasswordUI from "../page/forgetpasssword";
import OtpUi from "../page/otp";
import NewPasswordUI from "../page/newpassword";
import Dashboard from "../page/dashboard";
import WorkFromHome from "../page/workfromhome";
import Settings from "../page/settings";
import LogPage from "../page/testpage";
import ManageEmployees from "../page/manageemployee";
import EmployeeDtails from "../page/employeedetails";
import EmployeeProfileStaticUI from "../page/employeedetails";
import EmployeeProfile from "../page/employeedetails";
import EmployeeOnboarding from "../page/exployeeonbording";
import ConsolidatedData from "../components/tables/consoildate";

// ProtectedRoute Component
const ProtectedRoute = ({ element: Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to root login page
    return <Navigate to="/" replace />;
  }

  return <Element />;
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
      <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
      <Route path="/employeeonboarding" element={<ProtectedRoute element={EmployeeOnboarding} />} />
      <Route path="/settings" element={<ProtectedRoute element={Settings} />} />
      <Route path="/manageemployee" element={<ProtectedRoute element={ManageEmployees} />} />
      <Route path="/test" element={<ProtectedRoute element={LogPage} />} />
<Route path="/details/:id" element={<ProtectedRoute element={EmployeeProfile} />} />
<Route path="/consoildate" element={<ProtectedRoute element={ConsolidatedData} />} />

      {/* <Route path="/manageemployees" element={<ProtectedRoute element={ManageEmployees} />} /> */}

      {/* Catch-all redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
