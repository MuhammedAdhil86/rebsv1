import React, { useState, useEffect } from "react";
import EmployeeTableWrapper from "../../ui/employeetablewrapper";
import DatePicker from "../../ui/datepicker";
import { fetchBarAttendance } from "../../service/employeeService";

function DashboardOverview({ ATTENDANCE_DATA, getWidth, CALENDAR_DAYS }) {
  const [selectedDate, setSelectedDate] = useState(CALENDAR_DAYS[0] || new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch attendance data when date changes
  useEffect(() => {
    const loadBarData = async () => {
      setIsLoading(true);
      setError(null);
      try {
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
  }, [selectedDate]);

  const getBarWidth = (count) => {
    if (totalAttendance === 0) return "0%";
    return `${(count / totalAttendance) * 100}%`;
  };

  return (
<div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 px-3 bg-gray-50">

      {/* Left Section */}
      <div className="lg:col-span-9 flex flex-col gap-1 w-full">
        <DatePicker
          CALENDAR_DAYS={CALENDAR_DAYS}
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
        <EmployeeTableWrapper />
      </div>

      {/* Right Section */}
      <div className="lg:col-span-3 flex flex-col gap-3 w-full">

      {/* Attendance Summary */}
<div className="bg-white shadow rounded-xl p-4 border border-gray-100 w-full">
  <div className="flex items-baseline gap-1 mb-4">
    <p className="text-2xl font-semibold text-[#1E2734]">{totalAttendance}</p>
    <span className="text-sm text-gray-500">Attendance</span>
  </div>

  {isLoading ? (
    <p className="text-gray-500 text-sm mb-3">Loading attendance data...</p>
  ) : error ? (
    <p className="text-red-500 text-sm mb-3">{error}</p>
  ) : (
    <>
      {/* Bar */}
      <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div className="flex w-full h-full">
          {attendanceData.map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} h-full`}
              style={{ width: getBarWidth(item.count) }}
            ></div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm mb-3">
        {attendanceData
          .filter((item) =>
            ["Ontime", "Delay", "Late", "Absent"].includes(item.status)
          )
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

      {/* Early Check-in */}
      {attendanceData.find((item) => item.status === "Early Check-in") && (
        <div className="flex justify-start ml-3">
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
<div className="bg-white shadow rounded-lg p-3 w-full">
  <h3 className="text-xs font-medium mb-4">Leaves and Vacations</h3>

  <ul className="space-y-3 text-sm h-[270px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    {[
      { name: "Vishnu", role: "UI/UX Designer", date: "Only Today" },
      { name: "Aswin Lal", role: "Designer", date: "14 Feb" },
      {
        name: "Aleena Edhose ",
        role: "Sr UX Designer",
        date: "8 Feb to 10 Feb",
      },
      { name: "Greesham B", role: "UX/UI Designer", date: "14 Feb" },
      {name: "Rohith" , role:"Golang developer" , date: "14jan"}
    ].map((leave, idx) => (
      <li
        key={idx}
        className="flex justify-between items-center gap-2 pb-1 last:pb-0"
      >
        {/* Left side — avatar + name + role */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={`https://i.pravatar.cc/40?img=${idx + 10}`}
            alt={leave.name}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="truncate">
            {/* Name — truncated + tooltip */}
            <p
              className="font-[400] text-gray-800 text-[13px] font-['Poppins'] truncate"
              title={leave.name} // ✅ shows full name on hover
            >
              {leave.name}
            </p>
            {/* Role / Designation */}
            <p className="text-[10px] font-[400] font-['Poppins'] text-gray-500 truncate">
              {leave.role}
            </p>
          </div>
        </div>

        {/* Right side — Leave date with special color */}
        <span className="whitespace-nowrap font-[400] text-[11px] font-['Poppins'] text-[#FF000499]">
          {leave.date}
        </span>
      </li>
    ))}
  </ul>

<button className=" font-['Poppins'] text-[11px] font-medium text-[#4F4C91] hover:underline">
  View all people
</button>

</div>


      </div>
    </div>
  );
}

export default DashboardOverview;
