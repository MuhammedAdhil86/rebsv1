import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import CreateShiftModal from "../../../ui/createshiftmodal";
import { ShiftDataGet } from "../../../service/companyService";
import PayrollTable from "../../../ui/payrolltable";
import CustomSelect from "../../../ui/customselect";
import UpdateShiftTab from "../../../ui/updateshiftmodal";

const Shifts = () => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedShift, setSelectedShift] = useState(null);
  const [rawApiData, setRawApiData] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // --- PERSISTENCE LOGIC START ---

  // 1. Check localStorage on initial mount
  useEffect(() => {
    const savedMode = localStorage.getItem("shiftViewMode");
    const savedShift = localStorage.getItem("shiftSelectedData");

    if (savedMode === "update" && savedShift) {
      setViewMode("update");
      setSelectedShift(JSON.parse(savedShift));
    }
  }, []);

  // 2. Helper function to close and clear storage
  const handleCloseUpdate = () => {
    localStorage.removeItem("shiftViewMode");
    localStorage.removeItem("shiftSelectedData");
    setViewMode("list");
    setSelectedShift(null);
  };

  // --- PERSISTENCE LOGIC END ---

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hour, minute] = timeStr.split(":");
    const hr = parseInt(hour, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHour = hr % 12 === 0 ? 12 : hr % 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-500 border-green-100";
      case "Inactive":
        return "bg-indigo-50 text-indigo-500 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const fetchShiftsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ShiftDataGet();
      setRawApiData(data);

      const mappedData = data.map((shift) => ({
        id: shift.id,
        name: shift.shift_name,
        duration: `${shift.policies[0]?.working_hours || 0} Hrs`,
        start: formatTime(shift.policies[0]?.start_time),
        end: formatTime(shift.policies[0]?.end_time),
        staff: shift.allocated_employees,
        break: shift.policies[0]?.lunch_break_from
          ? `${formatTime(shift.policies[0].lunch_break_from)} - ${formatTime(shift.policies[0].lunch_break_to)}`
          : "N/A",
        reg: `${shift.policies[0]?.regularisation_limit || 0}/${shift.policies[0]?.regularisation_type || ""}`,
        policy: shift.policy_count,
        status: shift.allocated_employees > 0 ? "Active" : "Inactive",
      }));

      setShiftData(mappedData);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftsData();
  }, []);

  const handleRowClick = (row) => {
    const originalShift = rawApiData.find((s) => s.id === row.id);
    if (originalShift) {
      // Save to localStorage so it survives refresh
      localStorage.setItem("shiftViewMode", "update");
      localStorage.setItem("shiftSelectedData", JSON.stringify(originalShift));

      setSelectedShift(originalShift);
      setViewMode("update");
    }
  };

  const columns = [
    { key: "name", label: "Shift Name", align: "left" },
    { key: "duration", label: "Duration" },
    { key: "start", label: "Start Time" },
    { key: "end", label: "End Time" },
    { key: "staff", label: "Allocated Staffs" },
    { key: "break", label: "Break Time" },
    { key: "reg", label: "Regularization Count" },
    { key: "policy", label: "Policy Count" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full border ${getStatusStyle(value)}`}
        >
          {value}
        </span>
      ),
    },
  ];

  if (viewMode === "create") {
    return (
      <div className="w-full min-h-screen bg-white p-6 rounded-md shadow-md">
        <CreateShiftModal
          onClose={() => setViewMode("list")}
          refreshData={fetchShiftsData}
        />
      </div>
    );
  }

  if (viewMode === "update") {
    return (
      <div className="w-full min-h-screen bg-white p-6 rounded-md shadow-md">
        <UpdateShiftTab
          onClose={handleCloseUpdate} // Uses the new cleaner function
          shiftData={selectedShift}
          refreshData={fetchShiftsData}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <CustomSelect
            placeholder="Status"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: "All", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            minWidth={120}
          />
          <input
            type="text"
            placeholder="Search shifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] font-medium hover:bg-gray-800"
          onClick={() => setViewMode("create")}
        >
          <Plus size={14} /> Create Shift
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-[12px]">Loading shifts...</p>
        ) : error ? (
          <p className="text-red-500 text-[12px]">{error}</p>
        ) : (
          <PayrollTable
            columns={columns}
            data={shiftData}
            rowsPerPage={6}
            searchTerm={searchTerm}
            rowClickHandler={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

export default Shifts;
