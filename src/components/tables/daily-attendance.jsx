import React, { useEffect, useState } from "react";
import { fetchDailyAttendance } from "../../service/employeeService";
import UniversalTable from "../../ui/universal_table";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";

function DailyAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoverName, setHoverName] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Fetch attendance
  const fetchAttendanceData = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyAttendance(date);

      const transformed = data.map((item) => ({
        user_name: item.user_name || "N/A",
        designation: item.designation || "N/A",
        check:
          item.checkin && item.checkout
            ? `${item.checkin} - ${item.checkout}`
            : "00:00 AM - 00:00 PM",
        device: item.device || "Samsung(SM-S355B)",
        workingHours: item.working_hours || "00:00:00",
        status: item.status || "Absent",
        avatar: item.image || `https://i.pravatar.cc/40?u=${item.user_id}`,
      }));

      setAttendanceData(transformed);
    } catch (err) {
      setError("Failed to load attendance data");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate]);

  // Badge Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-600";
      case "Late":
        return "bg-blue-100 text-blue-600";
      case "Half Day":
        return "bg-purple-100 text-purple-600";
      case "Check In Missed":
        return "bg-red-100 text-red-600";
      case "Absent":
        return "bg-red-200 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Columns
  const columns = [
    {
      label: "Name",
      key: "user_name",
      render: (value, row) => {
        const shortName = value.length > 7 ? value.substring(0, 7) + "…" : value;

        return (
          <div
            className="flex items-center gap-3 text-left cursor-default relative"
            onMouseEnter={(e) => {
              if (value.length > 7) {
                const rect = e.target.getBoundingClientRect();
                setTooltipPos({ x: rect.left + 10, y: rect.top - 35 });
                setHoverName(value);
              }
            }}
            onMouseLeave={() => setHoverName(null)}
          >
            <img
              src={row.avatar}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <span className="font-medium text-[12px]">{shortName}</span>
          </div>
        );
      },
      headerClassName: "text-left",
      cellClassName: "text-left",
    },

    { label: "Designation", key: "designation", headerClassName: "text-right", cellClassName: "text-right" },
    { label: "Check in - out", key: "check", headerClassName: "text-right", cellClassName: "text-right" },
    { label: "Device", key: "device", headerClassName: "text-right", cellClassName: "text-right" },
    { label: "Working Hours", key: "workingHours", headerClassName: "text-left", cellClassName: "text-left" },

    {
      label: "Status",
      key: "status",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (val) => (
        <span
          className={`inline-block w-full text-center px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(
            val
          )}`}
        >
          {val}
        </span>
      ),
    },
  ];

  return (
    <>
      {/* 🔥 NOW EVERYTHING IS INSIDE ONE DIV 🔥 */}
      <section className="bg-[#f9fafb] px-4  w-full max-w-[1280px] mx-auto rounded-xl font-[Poppins]">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ">
          <h3 className="text-base font-medium text-gray-800">
            Daily Attendance
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">

            {/* Search */}
            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm mt-2 sm:mt-0 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-gray-600 w-full focus:outline-none text-sm bg-white"
              />
              <Search className="w-4 h-4 text-gray-400" />
            </div>

            {/* DATE */}
         
          </div>
        </div>

        {/* ERRORS */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
          </div>
        ) : (
          <UniversalTable
            columns={columns}
            data={attendanceData.filter((row) =>
              row.user_name.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            rowsPerPage={8}
            className="rounded-lg shadow-sm"
          />
        )}
      </section>

      {/* TOOLTIP (ALWAYS ON TOP) */}
      {hoverName &&
        createPortal(
          <div
            className="fixed px-2 py-1 bg-black text-white text-xs rounded shadow-lg z-[999999]"
            style={{
              top: tooltipPos.y,
              left: tooltipPos.x,
            }}
          >
            {hoverName}
          </div>,
          document.body
        )}
    </>
  );
}

export default DailyAttendance;
