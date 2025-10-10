import React, { useState } from "react";
import SideBar from "./SideBar";
import Settings from "./Settings";

function DashboardLayout({ user, userId }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex">
      <SideBar
        userId={userId}
        userData={user}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[255px]"}`}>
        <Settings />
      </div>
    </div>
  );
}

export default DashboardLayout;
