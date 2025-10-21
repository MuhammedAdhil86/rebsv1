import React, { useState, useEffect } from "react";
import EmployeeTableWrapper from "../../ui/employeetablewrapper";
import DatePicker from "../../ui/datepicker";
import { fetchBarAttendance } from "../../service/employeeService"; // ✅ API import

function DashboardOverview({ ATTENDANCE_DATA, getWidth, CALENDAR_DAYS }) {
  // Selected date state
  const [selectedDate, setSelectedDate] = useState(CALENDAR_DAYS[0] || new Date());

  const [attendanceData, setAttendanceData] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch attendance bar data whenever selectedDate changes
  useEffect(() => {
    const loadBarData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pass the selected date to the API if it supports it
        const response = await fetchBarAttendance(selectedDate);

        if (response && response.data) {
          const rawData = response.data;

          const statusColors = {
            Ontime: "bg-green-500",
            Delay: "bg-blue-500",
            Late: "bg-purple-500",
            Absent: "bg-red-500",
            "Early Check-in": "bg-gray-400",
          };

          const normalized = Object.keys(statusColors).map((status) => ({
            status,
            count: rawData.find((item) => item.status === status)?.count || 0,
            color: statusColors[status],
          }));

          const total = normalized.reduce((sum, item) => sum + item.count, 0);

          setAttendanceData(normalized);
          setTotalAttendance(total);
        }
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    loadBarData();
  }, [selectedDate]); // ✅ Re-run effect whenever date changes

  // ✅ Helper to calculate width dynamically
  const getBarWidth = (count) => {
    if (totalAttendance === 0) return "0%";
    return `${(count / totalAttendance) * 100}%`;
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 bg-gray-100">
      {/* Left Section */}
      <div className="lg:col-span-9 flex flex-col gap-6 w-full">
        <DatePicker
          CALENDAR_DAYS={CALENDAR_DAYS}
          selectedDate={selectedDate}
          onChange={setSelectedDate} // Update selected date
        />
        <EmployeeTableWrapper />
      </div>

      {/* Right Section */}
      <div className="lg:col-span-3 flex flex-col gap-6 mt-2 sm:mt-4 lg:mt-7 w-full">

        {/* Attendance Summary */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100 w-full">
          <div className="flex items-baseline gap-1 mb-4">
            <p className="text-2xl font-bold text-[#1E2734]">{totalAttendance}</p>
            <span className="text-sm text-gray-500">Attendance</span>
          </div>

          {/* Dynamic Progress Bar */}
          {isLoading ? (
            <p className="text-gray-500 text-sm mb-3">Loading attendance data...</p>
          ) : error ? (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          ) : (
            <>
              <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-6 gap-1">
                {attendanceData.map((item, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === attendanceData.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`${item.color} ${isFirst ? "rounded-l-full" : ""} ${
                        isLast ? "rounded-r-full" : ""
                      }`}
                      style={{ width: getBarWidth(item.count) }}
                    ></div>
                  );
                })}
              </div>

              {/* Top 4 Summary Items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm mb-3">
                {attendanceData
                  .filter((item) => ["Ontime", "Delay", "Late", "Absent"].includes(item.status))
                  .map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-gray-600 text-xs">{item.status}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`h-2 w-2 rounded-full ${item.color}`}></span>
                        <span className="font-semibold text-[#1E2734]">{item.count}</span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Early Check-in Row */}
              {attendanceData.find((item) => item.status === "Early Check-in") && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
                    <span className="text-gray-600 text-xs">Early Check-in</span>
                    <span className="font-semibold text-[#1E2734] ml-1">
                      {attendanceData.find((item) => item.status === "Early Check-in")?.count}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Leaves & Vacations */}
        <div className="bg-white shadow rounded-lg p-4 w-full">
          <h3 className="text-sm font-semibold mb-4">Leaves and Vacations</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Vishnu", role: "UI/UX Designer", date: "Only Today" },
              { name: "Aswin Lal", role: "Designer", date: "14 Feb" },
              { name: "Aleena Edhose", role: "Sr UX Designer", date: "8 Feb to 10 Feb" },
              { name: "Greesham B", role: "UX/UI Designer", date: "14 Feb" },
              { name: "Rohith ER", role: "UX/UI Designer", date: "14 Feb" },
            ].map((leave, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-2"
              >
                <div className="flex items-center gap-3 min-w-[150px]">
                  <img
                    src={`https://i.pravatar.cc/30?img=${idx + 10}`}
                    alt={leave.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{leave.name}</p>
                    <p className="text-xs text-gray-400">{leave.role}</p>
                  </div>
                </div>
                <span
                  className={`text-xs ${
                    leave.date === "Only Today"
                      ? "text-orange-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {leave.date}
                </span>
              </li>
            ))}
          </ul>
          <button className="mt-4 text-xs text-blue-600">View all people</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
