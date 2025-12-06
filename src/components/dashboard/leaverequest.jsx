import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosinstance";

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format leave dates
  const formatLeaveDates = (leaveDates) => {
    if (!leaveDates || leaveDates.length === 0) return "-";

    const options = { day: "2-digit", month: "short" }; // Feb 10

    // Convert to Date objects and sort
    const dates = leaveDates.map((d) => new Date(d.date));
    dates.sort((a, b) => a - b);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Check for today
    if (dates.length === 1) {
      const d = dates[0];
      if (d.getTime() === today.getTime()) return "Today";
      if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
      return d.toLocaleDateString("en-GB", options);
    }

    // Check for consecutive days
    let isConsecutive = true;
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff !== 1) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive) {
      return `${dates[0].toLocaleDateString("en-GB", options)} - ${dates[dates.length - 1].toLocaleDateString("en-GB", options)}`;
    }

    // Non-consecutive dates
    return dates.map((d) => d.toLocaleDateString("en-GB", options)).join(", ");
  };

  const loadLeaves = async () => {
    try {
      const res = await axiosInstance.get(
        "admin/leave/get?page=1&limit=50&from=today&to=future&status=approved"
      );

      if (res.data?.data) {
        const today = new Date();
        const filteredLeaves = res.data.data.filter(
          (leave) =>
            leave.manager_approval_status === "Approved" &&
            leave.leave_date.some((d) => new Date(d.date) >= today)
        );
        setLeaveData(filteredLeaves);
      } else {
        setLeaveData([]);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-3 w-full">
      <h3 className="text-sm text-gray-500 mb-4">Leaves and Vacations</h3>

      <ul className="space-y-3 text-sm h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {loading ? (
          <p className="text-[12px] text-gray-500">Loading...</p>
        ) : leaveData.length === 0 ? (
          <p className="text-[12px] text-gray-400">No leaves found</p>
        ) : (
          leaveData.map((leave, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center gap-2 pb-1 last:pb-0"
            >
              {/* Left side — avatar + name + designation */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={leave.image || `https://i.pravatar.cc/40?img=${idx + 10}`}
                  alt={leave.name}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="truncate">
                  <p
                    className="font-[400] text-gray-800 text-[13px] font-['Poppins'] truncate"
                    title={leave.name}
                  >
                    {leave.name || "Unknown"}
                  </p>
                  <p className="text-[10px] font-[400] font-['Poppins'] text-gray-500 truncate">
                    {leave.designation || "No designation"}
                  </p>
                </div>
              </div>

              {/* Right side — Leave dates */}
              <span className="whitespace-nowrap font-[400] text-[11px] font-['Poppins'] text-[#FF000499]">
                {formatLeaveDates(leave.leave_date)}
              </span>
            </li>
          ))
        )}
      </ul>

      <button className="font-['Poppins'] text-[11px] font-medium text-[#4F4C91] hover:underline">
        View all people
      </button>
    </div>
  );
};

export default LeaveRequest;
