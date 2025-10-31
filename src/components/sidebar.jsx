import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { Icon } from "@iconify/react";
import rebsLogo from "../assets/img/Picture1.png";
import { useAuthStore } from "../store/authStore"; // Zustand store

function SideBar({ isCollapsed, toggleSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  // Get user from Zustand store
  const user = useAuthStore((state) => state.user);

  // Display name
  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const nickName = user?.nick_name ? `(${user.nick_name})` : "";
  const displayName =
    `${firstName} ${lastName} ${nickName}`.trim() || user?.name || "Admin";

  // Avatar
  const avatarUrl = user?.avatar || "/assets/img/avatar.svg";

  // Slugify username for URL
  const userId = user?.id || "";
  const userNameSlug = user
    ? `${user.first_name}-${user.last_name}`.toLowerCase().replace(/\s+/g, "-")
    : "user";

  // Icons
  const icons = {
    hr: <Icon icon="si:dashboard-line" width="20" />,
    muster: <Icon icon="mynaui:table" width="20" />,
    events: <Icon icon="carbon:event" width="20" />,
    payroll: <Icon icon="fluent:payment-20-regular" width="20" />,
    reports: <Icon icon="iconoir:reports" width="20" />,
    asset: <Icon icon="fluent:web-asset-16-regular" width="20" />,
    manageEmployees: <Icon icon="clarity:employee-group-line" width="20" />,
    workfromhome: <Icon icon="material-symbols-light:home-work-outline-rounded" width="20" />,
    organisationonboard: <Icon icon="octicon:organization-24" width="20" />,
    employeeOnboard: <Icon icon="clarity:employee-line" width="20" />,
    Hiring: <Icon icon="hugeicons:job-link" width="20" />,
    interview: <Icon icon="mage:message-conversation" width="20" />,
  };

  // Menu items with ID + username in path
  const menuItems = [
    {
      section: "HUMAN RESOURCES",
      items: [
        { title: "Attendance", path: `/dashboard`, icon: icons.hr },
        { title: "Muster Roll", path: userId ? `/u/${userId}/${userNameSlug}/musteroll` : "#", icon: icons.muster },
        { title: "Events", path: userId ? `/u/${userId}/${userNameSlug}/events` : "#", icon: icons.events },
        { title: "Payroll", path: userId ? `/u/${userId}/${userNameSlug}/payroll` : "#", icon: icons.payroll },
        { title: "Reports", path: userId ? `/u/${userId}/${userNameSlug}/reports` : "#", icon: icons.reports },
        { title: "Asset Manager", path: userId ? `/u/${userId}/${userNameSlug}/assetmanager` : "#", icon: icons.asset },
        { title: "Manage Employees", path: `/manageemployee`, icon: icons.manageEmployees },
        { title: "Work From Home", path: userId ? `/u/${userId}/${userNameSlug}/workfromhome` : "#", icon: icons.workfromhome },
      ],
    },
    {
      section: "ONBOARDING",
      items: [
        { title: "Organization", path: `/manageempl`, icon: icons.organisationonboard },
        { title: "Employee", path:  `/employeeonboarding`, icon: icons.employeeOnboard },
      ],
    },
    {
      section: "HIRING PROCESS",
      items: [
        { title: "Job Creation", path: userId ? `/u/${userId}/${userNameSlug}/jobcreation` : "#", icon: icons.Hiring },
        { title: "Interview Process", path: userId ? `/u/${userId}/${userNameSlug}/interviewprocess` : "#", icon: icons.interview },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-gray-800 rounded"
        onClick={toggleMobileSidebar}
      >
        <Icon icon="flowbite:bars-from-left-outline" width="24" height="24" />
      </button>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-black fixed top-0 left-0 z-50 h-[100vh] flex flex-col text-white shadow-lg
        transition-transform duration-300
        ${isCollapsed ? "w-[6%]" : "w-[20%]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo + Toggle */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <img
              src={rebsLogo}
              alt="Logo"
              className={`${isCollapsed ? "hidden" : "block"} h-8 w-8`}
            />
            {!isCollapsed && <span className="text-white text-lg font-normal">REBS HR</span>}
          </div>
          <button onClick={toggleSidebar} className="p-1 rounded transition-colors">
            <Icon
              icon="flowbite:bars-from-left-outline"
              width="24"
              height="24"
              className="text-white"
            />
          </button>
        </div>

        {/* Profile Section */}
        <div className="mt-1 flex flex-col items-center">
          <div
            onClick={toggleProfile}
            className={`flex items-center justify-center rounded-lg transition-colors duration-300 cursor-pointer
              ${isCollapsed ? "w-12 h-12 bg-[#111827] hover:bg-gray-700" : "w-[90%] px-4 h-14"}
              ${!isCollapsed && (isProfileOpen ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-600")}`}
          >
            <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
            {!isCollapsed && (
              <div className="flex-1 text-left ml-3">
                <span className="block text-sm">{displayName}</span>
                <span className="block text-xs text-gray-400">{user?.user_type || "Admin"}</span>
              </div>
            )}
            {!isCollapsed && (
              <div className="ml-2 transition-transform duration-300">
                <Icon
                  icon="mdi:chevron-down"
                  className={`w-5 h-5 text-gray-400 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {!isCollapsed && isProfileOpen && (
            <div className="mt-2 w-[90%] bg-[#1C2526] rounded-lg flex flex-col space-y-1 px-2 py-1">
              <Link
                to="/settings"
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors"
              >
                <Settings size={20} />
                <span className="text-sm flex-1 text-left">Settings</span>
              </Link>

              <button
                onClick={() => alert("Logout logic here")}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors"
              >
                <Icon icon="material-symbols:logout" width="20" height="20" />
                <span className="text-sm flex-1 text-left">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 flex flex-col justify-start mt-5 overflow-y-auto">
          {menuItems.map((menu, index) => (
            <div key={index} className="px-4 mb-2">
              {!isCollapsed && (
                <p className="text-gray-400 text-xs mb-1 px-2 tracking-wider">{menu.section}</p>
              )}
              {menu.items.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) =>
                    `h-[40px] flex items-center space-x-3 px-3 rounded-lg transition-all duration-200 text-sm ${
                      isActive
                        ? "bg-[#1C2526] text-white font-light"
                        : "text-neutral-600 hover:text-white hover:bg-gray-800"
                    }`
                  }
                  style={{ width: isCollapsed ? "6%" : "90%" }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="flex-1 text-left">{item.title}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

export default SideBar;
