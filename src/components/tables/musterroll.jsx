import React from "react";
import { Search, ChevronDown, ChevronUp, Download } from "lucide-react";

function MusterRoll() {
  // --- Data ---
  const ATTENDANCE_DATA = [
    {
      name: "Vishnu",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/30?img=1",
      daily: [
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05", today: true },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Weekly off", workHours: null, off: true },
        { status: "Weekly off", workHours: null, off: true },
      ],
    },
    {
      name: "Aswin Lal",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/30?img=2",
      daily: [
        { status: "Absent", workHours: "00:00:00" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Absent", workHours: "00:00:00" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05", today: true },
        { status: "Absent", workHours: "00:00:00" },
        { status: "Weekly off", workHours: null, off: true },
        { status: "Weekly off", workHours: null, off: true },
      ],
    },
    {
      name: "Aleena Eldhose",
      role: "React Developer",
      avatar: "https://i.pravatar.cc/30?img=3",
      daily: [
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Absent", workHours: "00:00:00" },
        { status: "Casual Leave", workHours: "00:00:00", today: true },
        { status: "Absent", workHours: "00:00:00" },
        { status: "Weekly off", workHours: null, off: true },
        { status: "Weekly off", workHours: null, off: true },
      ],
    },
    {
      name: "Greeshma b",
      role: "React Developer",
      avatar: "https://i.pravatar.cc/30?img=4",
      daily: [
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Holt Day", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05", today: true },
        { status: "Absent", workHours: "00:00:00" },
        { status: "Weekly off", workHours: null, off: true },
        { status: "Weekly off", workHours: null, off: true },
      ],
    },
    {
      name: "Alwin Gigi",
      role: "Golang Developer",
      avatar: "https://i.pravatar.cc/30?img=5",
      daily: [
        { status: "On Time", workHours: "09:23:05" },
        { status: "Absent", workHours: "00:00:00" },
        { status: "Holt Day", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Absent", workHours: "00:00:00", today: true },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Weekly off", workHours: null, off: true },
        { status: "Weekly off", workHours: null, off: true },
      ],
    },
    {
      name: "Hridya S B",
      role: "Web Developer",
      avatar: "https://i.pravatar.cc/30?img=6",
      daily: [
        { status: "Sick Leave", workHours: "00:00:00" },
        { status: "Absent", workHours: "00:00:00" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Late", workHours: "09:23:05", today: true },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Weekly off", workHours: null, off: true },
        { status: "Weekly off", workHours: null, off: true },
      ],
    },
  ];

  // --- Helpers ---
  const getStatusClasses = (status) => {
    switch (status) {
      case "On Time":
      case "Holt Day":
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

  const VISIBLE_DAYS = 8;
  const dayHeaders = Array.from({ length: VISIBLE_DAYS }, (_, i) => {
    const day = i + 1;
    return day === 5 ? `${day}(Today)` : `${day < 10 ? "0" : ""}${day}`;
  });

  // Reusable Table Header Item
  const TableHeaderItem = ({ children }) => (
    <th className="px-4 py-3 sticky left-0 bg-white font-medium text-gray-500 text-left text-xs uppercase tracking-wider w-64">
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
    <div className="bg-gray-100 rounded-lg p-4 w-[1020px]">
      {/* --- HEADER --- */}
      <div className="flex flex-col space-y-2 mb-6">
        {/* Top Row: Week/Month Filter, Month, Year, Download, Search */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Muster Roll</h2>
          <div className="flex items-center space-x-3">
            {/* --- Filter Dropdown UI --- */}
            <div className="relative group">
              <button className="border rounded-lg px-3 py-2 text-sm flex items-center bg-white hover:bg-gray-50 cursor-pointer">
                 Filter
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </button>
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-50 hidden group-hover:block">
                {["Week 1", "Week 2", "Week 3", "Week 4", "Monthly"].map((label) => (
                  <div
                    key={label}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* --- Month Selector --- */}
            <div className="border rounded-lg px-3 py-2 text-sm flex items-center bg-white hover:bg-gray-50 cursor-pointer">
              September
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
            </div>

            {/* --- Year Selector --- */}
            <div className="border rounded-lg px-3 py-2 text-sm flex items-center bg-white hover:bg-gray-50 cursor-pointer">
              2025
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
            </div>

            {/* --- Download Button --- */}
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center font-medium hover:bg-gray-800">
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>

            {/* --- Search Input --- */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border rounded-lg px-4 py-2 text-sm pl-10 focus:ring-0 focus:border-gray-400 w-40"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* --- ATTENDANCE TABLE --- */}
      <div className="overflow-x-auto">
        <table className="min-w-[1300px] w-full border-separate border-spacing-y-4">
          {/* Table Header */}
          <thead className="bg-white">
            <tr>
              <TableHeaderItem>Name</TableHeaderItem>
              {dayHeaders.map((day, index) => (
                <th
                  key={index}
                  className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider w-36 ${
                    day.includes("(Today)") ? "text-black font-bold" : "text-gray-500"
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {ATTENDANCE_DATA.map((employee, empIdx) => (
              <tr key={empIdx} className="hover:bg-gray-50 align-top">
                {/* Employee Info */}
                <td className="sticky left-0 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 w-64 border-r border-gray-100">
                  <div className="flex items-center mt-5">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-12 h-12 rounded mr-3"
                    />
                    <div>
                      <p className="font-semibold">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.role}</p>
                    </div>
                  </div>
                </td>

                {/* Daily Data */}
                {employee.daily.map((dayData, dayIdx) => (
                  <td
                    key={dayIdx}
                    className={`text-center text-sm border-r border-gray-100 last:border-r-0 ${
                      dayData.today ? "bg-gray-100" : ""
                    } ${dayData.off ? "bg-gray-50" : "bg-white"}`}
                  >
                    {dayData.off ? (
                      <div className="text-gray-400 text-xs py-10">Weekly off</div>
                    ) : (
                      <div
                        className={`flex flex-col items-center justify-center py-2 ${
                          dayData.today ? "space-y-1.5" : "space-y-1"
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
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MusterRoll;
