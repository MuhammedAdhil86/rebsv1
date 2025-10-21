import React, { useState } from "react";
import SideBar from "../components/sidebar";

function DashboardLayout({ userName, onLogout, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-black overflow-hidden ">
      {/* Sidebar */}
      <SideBar
        userData={{ name: userName }}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main container */}
      <div
        className={`transition-all duration-500 ease-in-out p-3 w-full ${
          isCollapsed ? "md:ml-[6%]" : "md:ml-[20%]"
        }`}
      >
        <div className="bg-white h-[96vh] rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-500">
          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
