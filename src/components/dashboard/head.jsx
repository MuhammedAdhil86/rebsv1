import React from "react";

function DashboardHead({ userName, ATTENDANCE_DATA, activeTab, setActiveTab }) {
  const attendance = ATTENDANCE_DATA || {
    total: 0,
    ontime: 0,
    delay: 0,
    late: 0,
    absent: 0,
    employees: [],
    leaves: [],
  };

  return (
    <div className="bg-white">

      {/* Title */}
      <div className="ml-4 sm:ml-6 mt-4">
        <p className="text-xl sm:text-2xl font-semibold">{userName} Admin’s Dashboard</p>
        <p className="text-[12px] sm:text-[13px] text-gray-400">
          Track and manage all details here
        </p>
      </div>

      {/* Top Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 justify-end px-4 sm:px-6 mt-4">
        {/* Toggle Group */}
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button className="px-3 sm:px-4 py-1.5 text-sm sm:text-sm rounded-md font-medium text-gray-700 hover:bg-white">
            Yesterday
          </button>
          <button className="px-3 sm:px-4 py-1.5 text-sm sm:text-sm rounded-md font-medium bg-white shadow text-black">
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

      {/* KPI Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6">
        {[ 
          { label: "Total Employees", value: "134", bg: "#EBFDEF" },
          { label: "Total Present", value: "120", bg: "#E8EFF9" },
          { label: "On Leave", value: "14", bg: "#FFEFE7" },
          { label: "Happiness Rate", value: "90.00%", bg: "#FFFBDB" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="shadow rounded-lg p-3"
            style={{ backgroundColor: card.bg }}
          >
            <p className="text-gray-500 text-sm">{card.label}</p>
            <h2 className="text-lg sm:text-xl font-semibold">{card.value}</h2>
          </div>
        ))}
      </section>

      {/* Attendance Tabs */}
      <section className="bg-white mt-4 sm:mt-6">
        <div className="border-b flex flex-wrap gap-4 sm:gap-6 px-4 sm:px-6 pt-4 text-sm text-gray-600">
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
                activeTab === tab.key
                  ? "border-b-2 border-black font-semibold text-black"
                  : ""
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
