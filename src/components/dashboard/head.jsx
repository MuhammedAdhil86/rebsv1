import React from "react";

function DashboardHead({ userName, ATTENDANCE_DATA, activeTab, setActiveTab }) {
  // Default values
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
    <>
      {/* Title */}
      <div className="ml-6 mt-4">
        <p className="text-2xl font-semibold">{userName} Admin’s Dashboard</p>
        <p className="text-[13px] text-gray-400">
          Track and manage all details here
        </p>
      </div>

      {/* Top Action Buttons */}
      <div className="flex gap-2 justify-end px-6 mt-4">
        {/* Toggle Group */}
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button className="px-4 py-1.5 text-sm rounded-md font-medium text-gray-700 hover:bg-white">
            Yesterday
          </button>
          <button className="px-4 py-1.5 text-sm rounded-md font-medium bg-white shadow text-black">
            Today
          </button>
        </div>

        <button className="px-4 py-2 text-sm rounded-lg border bg-black text-white">
          + Create Announcement
        </button>
        <button className="px-4 py-2 text-sm rounded-lg border bg-black text-white">
          + Add Leave
        </button>
      </div>

      {/* KPI Cards */}
      <section
        className="grid grid-cols-4 gap-4 p-6"
        style={{ width: "860px", height: "86px" }}
      >
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
            <h2 className="text-xl font-semibold">{card.value}</h2>
          </div>
        ))}
      </section>

      {/* Attendance Tabs */}
      <section className="bg-white mt-6">
        <div className="border-b flex gap-6 px-6 pt-4 text-sm text-gray-600">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 ${
              activeTab === "overview"
                ? "border-b-2 border-black font-semibold text-black"
                : ""
            }`}
          >
            Attendance Overview
          </button>

          <button
            onClick={() => setActiveTab("logdetails")}
            className={`pb-2 ${
              activeTab === "logdetails"
                ? "border-b-2 border-black font-semibold text-black"
                : ""
            }`}
          >
            Log Details
          </button>

          <button
            onClick={() => setActiveTab("leaverequests")}
            className={`pb-2 ${
              activeTab === "leaverequests"
                ? "border-b-2 border-black font-semibold text-black"
                : ""
            }`}
          >
            Leave Requests
          </button>

          <button
            onClick={() => setActiveTab("dailyAttendance")}
            className={`pb-2 ${
              activeTab === "dailyAttendance"
                ? "border-b-2 border-black font-semibold text-black"
                : ""
            }`}
          >
            Daily Attendance
          </button>

          {/* ✅ New Muster Roll tab */}
          <button
            onClick={() => setActiveTab("musterRoll")}
            className={`pb-2 ${
              activeTab === "musterRoll"
                ? "border-b-2 border-black font-semibold text-black"
                : ""
            }`}
          >
            Muster Roll
          </button>
        </div>
      </section>
    </>
  );
}

export default DashboardHead;
