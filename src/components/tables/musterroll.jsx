import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MusterRoll() {
  const navigate = useNavigate();

  const ATTENDANCE_DATA = [
    {
      name: "Vishnu",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/30?img=1",
      daily: Array.from({ length: 31 }, (_, i) => {
        // Example: generate a month's data
        const statusOptions = ["On Time", "Late", "Absent", "Sick Leave"];
        return {
          status: statusOptions[i % statusOptions.length],
          workHours: "09:00:00",
        };
      }),
    },
    // Add more employees as needed
  ];

  const getStatusClasses = (status) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-600";
      case "Absent":
        return "bg-red-100 text-red-600";
      case "Sick Leave":
        return "outline outline-1 outline-red-600 text-red-600 bg-transparent";
      case "Casual Leave":
        return "outline outline-1 outline-orange-600 text-orange-600 bg-transparent";
      case "Late":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const [selectedWeek, setSelectedWeek] = useState("Week 1");

  // Calculate 8 days: today is 5th day (index 4)
  const getWeekDays = (week) => {
    const today = new Date();
    const startOffset = (WEEKS.indexOf(week)) * -7; // shift by week
    const days = [];
    for (let i = 0; i < 8; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + startOffset + i - 4); // 5th day is today
      days.push(d.getDate()); // just day number
    }
    return days;
  };

  const [weekDays, setWeekDays] = useState(getWeekDays(selectedWeek));

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
    setWeekDays(getWeekDays(week));
  };

  const TableHeaderItem = ({ children }) => (
    <th className="px-4 py-3 sticky left-0 bg-white font-medium text-gray-500 text-left text-xs uppercase tracking-wider w-40 sm:w-56">
      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
        {children}
        <span className="flex flex-col ml-1">
          <ChevronUp className="w-3 h-3 -mb-1 text-gray-400" />
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </span>
      </div>
    </th>
  );

  return (
    <div className="bg-[#f9fafb] rounded-lg pt-0 px-4 pb-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <h2 className="text-base font-medium text-gray-800 font-[Poppins]">
          Muster Roll
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Week Filter */}
            <div className="relative group">
              <button className="border rounded-md px-2.5 py-1.5 text-xs flex items-center bg-white hover:bg-gray-50">
                {selectedWeek}
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-500" />
              </button>
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-50 hidden group-hover:block">
                {WEEKS.map((week) => (
                  <div
                    key={week}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => handleWeekChange(week)}
                  >
                    {week}
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button className="bg-black text-white px-3 py-1.5 rounded-md text-xs flex items-center font-medium hover:bg-gray-800">
              <Download className="w-4 h-4 mr-1" /> Download
            </button>

            {/* Consolidated Data Button */}
            <button
              onClick={() => navigate("/consoildate")}
              className="border border-gray-300 bg-black text-white px-3 py-1.5 rounded-md text-xs flex items-center font-medium hover:bg-gray-950"
            >
              Consolidated Data
            </button>

            {/* Search Box */}
            <div className="flex items-center gap-1.5 border px-2 py-1.5 rounded-md bg-gray-50 text-xs w-36 sm:w-40">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent w-full focus:outline-none text-xs"
              />
              <Search className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-white text-gray-500 text-left text-xs uppercase">
            <tr>
              <TableHeaderItem>Name</TableHeaderItem>
              {weekDays.map((day, idx) => (
                <th
                  key={idx}
                  className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    idx === 4 ? "text-black font-bold" : "text-gray-500"
                  }`}
                >
                  {day === weekDays[4] ? `${day}(Today)` : day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y bg-white text-center align-middle">
            {ATTENDANCE_DATA.map((employee, empIdx) => (
              <tr key={empIdx} className="hover:bg-gray-50">
                <td className="px-4 py-3 sticky left-0 bg-white text-left w-40 sm:w-56 border-r border-gray-100 flex items-center gap-3">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.role}</p>
                  </div>
                </td>

                {weekDays.map((day, idx) => {
                  const attendanceIndex =
                    new Date().getDate() - 4 + idx + WEEKS.indexOf(selectedWeek) * -7;
                  const dayData = employee.daily[attendanceIndex] || {
                    status: "N/A",
                    workHours: "0",
                  };

                  return (
                    <td
                      key={idx}
                      className={`text-center text-sm border-r border-gray-100 last:border-r-0 ${
                        idx === 4 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <div
                        className={`flex flex-col items-center justify-center py-2 ${
                          idx === 4 ? "space-y-1.5" : "space-y-1"
                        }`}
                      >
                        <span
                          className={`px-3 py-0.5 rounded text-[10px] tracking-wider ${getStatusClasses(
                            dayData.status
                          )}`}
                        >
                          {dayData.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-700">Work hours</span>
                        <span className="text-xs font-medium text-gray-900">
                          {dayData.workHours}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MusterRoll;
