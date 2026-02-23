import React, { useEffect, useState } from "react";
import { Plus, Search, Pencil } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
import { fetchPolicyData } from "../../../service/companyService";
import CreateAttendancePolicyTab from "../../../ui/createattendancepolicy";
import UpdateAttendancePolicyTab from "../../../ui/updateattendancepolicy";

const AttendancePolicy = () => {
  // Using 'viewMode' to match the Shifts component logic
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
      setPolicyData(res);
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

  // AM/PM Format to match Shifts UI
  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    const timeStr = isoString.includes("T")
      ? isoString.split("T")[1].substring(0, 5)
      : isoString;
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
      render: (val) => (val ? "Yes" : "No"),
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
                : "bg-red-50 text-red-500 border-red-100"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

  // --- View Switching (Matching Shifts logic) ---
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
      {/* Header Alignment: Identical to Shifts table */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm w-64 focus:outline-none"
            />
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] font-medium hover:bg-gray-800"
          onClick={() => setViewMode("create")}
        >
          <Plus size={14} /> Create Policy
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-[12px]">Loading policies...</p>
        ) : (
          <UniversalTable
            columns={columns}
            data={policyData}
            rowsPerPage={8}
            searchTerm={searchTerm}
            rowClickHandler={handleRowClick} // This ensures the row click triggers the update
          />
        )}
      </div>
    </div>
  );
};

export default AttendancePolicy;
