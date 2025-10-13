import React, { useState } from "react";
import SideBar from "../components/sidebar";

function DashboardLayout({ userName, onLogout, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar stays black and constant */}
      <SideBar
        userData={{ name: userName }}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content container */}
      <div
        className={`flex-1 transition-all duration-300 p-4 ${
          isCollapsed ? "ml-16" : "ml-[2px]"
        }`}
      >
        {children} {/* Pages will render here */}
      </div>
    </div>
  );
}

export default DashboardLayout;
