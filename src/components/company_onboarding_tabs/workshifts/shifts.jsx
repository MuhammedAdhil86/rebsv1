import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import CreateShiftModal from "../../../ui/createshiftmodal";
import { ShiftDataGet } from "../../../service/companyService";
import PayrollTable from "../../../ui/payrolltable";
import CustomSelect from "../../../ui/customselect";

const Shifts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Format time to 12-hour
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
      case "Expired":
        return "bg-red-50 text-red-500 border-red-100";
      case "Inactive":
        return "bg-indigo-50 text-indigo-500 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  // Fetch shifts
  useEffect(() => {
    const fetchShiftsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ShiftDataGet();
        const mappedData = data.map((shift) => ({
          name: shift.shift_name,
          duration: `${shift.policies[0]?.working_hours || 0} Hrs`,
          start: formatTime(shift.policies[0]?.start_time),
          end: formatTime(shift.policies[0]?.end_time),
          staff: shift.allocated_employees,
          break: shift.policies[0]?.lunch_break_from
            ? `${formatTime(shift.policies[0].lunch_break_from)} - ${formatTime(
                shift.policies[0].lunch_break_to,
              )}`
            : "N/A",
          reg: `${shift.policies[0]?.regularisation_limit || 0}/${
            shift.policies[0]?.regularisation_type || ""
          }`,
          policy: shift.policy_count,
          status: shift.allocated_employees > 0 ? "Active" : "Inactive",
        }));

        const filtered = mappedData.filter((item) => {
          if (!filterStatus) return true;
          return item.status.toLowerCase() === filterStatus;
        });

        setShiftData(filtered);
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchShiftsData();
  }, [filterStatus]);

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

  // =========================
  // FULL-PAGE CREATE SHIFT FORM
  // =========================
  if (isModalOpen) {
    return (
      <div className="w-full min-h-screen bg-white p-6 rounded-md shadow-md">
        <CreateShiftModal onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  // =========================
  // NORMAL TABLE VIEW
  // =========================
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        {/* Filter + Search */}
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

        {/* Create Shift Button */}
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={14} /> Create Shift
        </button>
      </div>

      {/* Payroll Table */}
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
            rowClickHandler={(row) => console.log("Clicked row:", row)}
          />
        )}
      </div>
    </div>
  );
};

export default Shifts;
