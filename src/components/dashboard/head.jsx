import React, { useEffect, useState } from "react";
import dashboardService from "../../service/dashboardService";
import { Icon } from "@iconify/react";

function DashboardHead({ userName, activeTab, setActiveTab }) {
  const [dashboardData, setDashboardData] = useState({
    total_staff: 0,
    present_today: 0,
    on_leave: 0,
    happiness_rate: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data || {});
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500 w-full">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full m-0 p-0">
      {/* Top Header */}
      <div className="flex justify-between items-center w-full sm:px-6">
        <div>
          <p className="text-sm text-gray-600">
            Hi, <span className="font-semibold">{userName}</span>, welcome back!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Icon icon="hugeicons:notification-02" className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Icon icon="solar:settings-linear" className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1 border rounded-full text-[12px]">
            Settings
            <span className="text-sm font-medium">{userName}</span>
          </button>
        </div>
      </div>

      {/* Dashboard Title + Top Action Buttons */}
      <div className="w-full sm:px-6 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-lg sm:text-2xl">{userName} Admin’s Dashboard</p>
          <p className="text-[10px] sm:text-[13px] text-gray-400">
            Track and manage all details here
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button className="px-3 sm:px-4 py-1.5 text-sm rounded-md font-medium text-gray-700 hover:bg-white">
              Yesterday
            </button>
            <button className="px-3 sm:px-4 py-1.5 text-sm rounded-lg font-medium bg-white shadow text-black">
              Today
            </button>
          </div>
          <button className="px-3 sm:px-4 py-2 text-sm rounded-lg border bg-black text-white">
            + Create Announcement
          </button>
          <button className="px-3 sm:px-4 py-2 text-sm rounded-lg border bg-black text-white">
            + Add Leave
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full px-4 sm:px-6 mt-4">
        {[
          { label: "Total Employees", value: dashboardData.total_staff || "0", bg: "#EBFDEF" },
          { label: "Total Present", value: dashboardData.present_today || "0", bg: "#E8EFF9" },
          { label: "On Leave", value: dashboardData.on_leave || "0", bg: "#FFEFE7" },
          { label: "Happiness Rate", value: dashboardData.happiness_rate || "0%", bg: "#FFFBDB" },
        ].map((card, idx) => (
          <div key={idx} className="shadow rounded-lg p-3" style={{ backgroundColor: card.bg }}>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <h2 className="text-lg sm:text-xl font-medium">{card.value}</h2>
          </div>
        ))}
      </section>

      {/* Attendance Tabs */}
      <section className="bg-white mt-4 sm:mt-6 w-full px-4 sm:px-6">
        <div className="border-b flex flex-wrap gap-4 sm:gap-6 pt-4 text-sm text-gray-600">
          {[
            { label: "Attendance Overview", key: "overview" },
            { label: "Log Details", key: "logdetails" },
            { label: "Leave Requests", key: "leaverequests" },
            { label: "Daily Attendance", key: "dailyAttendance" },
            { label: "Muster Roll", key: "musterRoll" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 whitespace-nowrap ${
                activeTab === tab.key ? "border-b-2 border-black font-semibold text-black" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardHead;
