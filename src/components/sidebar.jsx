import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { Icon } from "@iconify/react";
import avatar from "../assets/img/avatar.svg";
import rebsLogo from "../assets/img/Picture1.png";

function SideBar({ userId, userData, isCollapsed, toggleSidebar, onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // ✅ Construct display name (first_name + last_name + nick_name)
  const firstName = userData?.first_name || "";
  const lastName = userData?.last_name || "";
  const nickName = userData?.nick_name ? `(${userData.nick_name})` : "";
  const displayName = `${firstName} ${lastName} ${nickName}`.trim();

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

  const menuItems = [
    {
      section: "HUMAN RESOURCES",
      items: [
        { title: "Attendance", path: `/dashboard`, icon: icons.hr },
        { title: "Muster Roll", path: `/u/${userId}/musteroll`, icon: icons.muster },
        { title: "Events", path: `/u/${userId}/events`, icon: icons.events },
        { title: "Payroll", path: `/u/${userId}/payroll`, icon: icons.payroll },
        { title: "Reports", path: `/u/${userId}/reports`, icon: icons.reports },
        { title: "Asset Manager", path: `/u/${userId}/assetmanager`, icon: icons.asset },
        { title: "Manage Employees", path: `/u/${userId}/manageemployees`, icon: icons.manageEmployees },
        { title: "Work From Home", path: `/u/${userId}/workfromhome`, icon: icons.workfromhome },
      ],
    },
    {
      section: "ONBOARDING",
      items: [
        { title: "Organization", path: `/u/${userId}/orgOnboard`, icon: icons.organisationonboard },
        { title: "Employee", path: `/u/${userId}/employeeOnboard`, icon: icons.employeeOnboard },
      ],
    },
    {
      section: "HIRING PROCESS",
      items: [
        { title: "Job Creation", path: `/u/${userId}/jobcreation`, icon: icons.Hiring },
        { title: "Interview Process", path: `/u/${userId}/interviewprocess`, icon: icons.interview },
      ],
    },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-16 md:w-20" : "w-[255px]"
      } h-screen font-sans bg-black text-white flex flex-col transition-all duration-300 fixed md:static top-0 left-0 z-50 shadow-lg`}
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
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-gray-600 rounded transition-colors"
        >
          <Icon
            icon="flowbite:bars-from-left-outline"
            width="24"
            height="24"
            className="text-white"
          />
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-4 pb-2">
        <div
          onClick={toggleProfile}
          className={`w-[240px] h-[50px] flex items-center space-x-3 px-4 rounded-lg transition-colors bg-[#1C2526] ${
            isProfileOpen ? "bg-gray-600" : "hover:bg-gray-600"
          }`}
        >
          <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
          <div className="flex-1 text-left">
            {/* ✅ Full name + nickname */}
            <span className="block text-sm">{displayName || "Admin"}</span>
            <span className="block text-xs text-gray-400">{userData?.user_type || "Admin"}</span>
          </div>

          <div className="relative flex items-center justify-center">
            <Link to="/settings">
                        <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
            </Link>

            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border border-black">
              8
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 flex flex-col justify-start mt-5">
        {menuItems.map((menu, index) => (
          <div key={index} className="px-4 mb-2">
            {!isCollapsed && (
              <p className="text-gray-400 text-xs mb-1 px-2 tracking-wider">
                {menu.section}
              </p>
            )}
            {menu.items.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `h-[30px] flex items-center space-x-3 px-3 rounded-lg transition-all duration-200 text-sm ${
                    isActive
                      ? "bg-[#1C2526] text-white font-light"
                      : "text-neutral-600 hover:text-white hover:bg-gray-800"
                  }`
                }
                style={{ width: isCollapsed ? "48px" : "220px" }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="flex-1 text-left">{item.title}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default SideBar;
