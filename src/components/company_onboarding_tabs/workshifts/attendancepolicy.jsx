import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
// Import the specific PayrollTable component
import PayrollTable from "../../../ui/payrolltable";
import { fetchPolicyData } from "../../../service/companyService";
import CreateAttendancePolicyTab from "../../../ui/createattendancepolicy";
import UpdateAttendancePolicyTab from "../../../ui/updateattendancepolicy";

const AttendancePolicy = () => {
  const [viewMode, setViewMode] = useState("list");
  const [editData, setEditData] = useState(null);
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const res = await fetchPolicyData();
      // PayrollTable handles data normalization, but passing an empty array fallback is good practice
      setPolicyData(res || []);
    } catch (error) {
      console.error("Failed to fetch policies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTabs = () => {
    setViewMode("list");
    setEditData(null);
    loadPolicies();
  };

  const handleRowClick = (row) => {
    setEditData(row);
    setViewMode("update");
  };

  const formatTime = (timeInput) => {
    if (!timeInput) return "N/A";
    let timeStr = timeInput.includes("T")
      ? timeInput.split("T")[1].substring(0, 5)
      : timeInput;
    const [hour, minute] = timeStr.split(":");
    const hr = parseInt(hour, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHour = hr % 12 === 0 ? 12 : hr % 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const columns = [
    { key: "policy_name", label: "Policy Name", align: "left" },
    {
      key: "working_hours",
      label: "Duration",
      render: (val) => `${val || 0} Hrs`,
    },
    {
      key: "start_time",
      label: "Start Time",
      render: (val) => formatTime(val),
    },
    { key: "end_time", label: "End Time", render: (val) => formatTime(val) },
    {
      key: "work_from_home",
      label: "WFH",
      render: (val) => (val ? "Enabled" : "Disabled"),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (_, row) => {
        const isActive =
          new Date() >= new Date(row.start_date) &&
          new Date() <= new Date(row.end_date);
        return (
          <span
            className={`px-3 py-1 rounded-full border text-[11px] font-medium ${
              isActive
                ? "bg-green-50 text-green-500 border-green-100"
                : "bg-indigo-50 text-indigo-500 border-indigo-100"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

  // VIEW LOGIC
  if (viewMode === "create") {
    return (
      <div className="w-full min-h-screen bg-white p-6 rounded-md shadow-md">
        <CreateAttendancePolicyTab isOpen={true} onClose={handleCloseTabs} />
      </div>
    );
  }

  if (viewMode === "update") {
    return (
      <div className="w-full min-h-screen bg-white p-6 rounded-md shadow-md">
        <UpdateAttendancePolicyTab
          initialData={editData}
          onClose={handleCloseTabs}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search and Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-colors"
          onClick={() => setViewMode("create")}
        >
          <Plus size={14} /> Create Policy
        </button>
      </div>

      {/* Payroll Table Implementation */}
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center p-10">
            <p className="text-gray-500 text-[12px] animate-pulse">
              Loading policies...
            </p>
          </div>
        ) : (
          <PayrollTable
            columns={columns}
            data={policyData}
            rowsPerPage={8}
            searchTerm={searchTerm}
            rowClickHandler={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

export default AttendancePolicy;
