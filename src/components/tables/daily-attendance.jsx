import React from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

function DailyAttendance() {
  const musterData = [
    { name: "Aswin Lal", designation: "Designer", check: "9:00 AM - 12:00 PM", device: "Samsung(SM-S356B)", workingHours: "9:10:23 hours", status: "On Time" },
    { name: "Aleena Eldhose", designation: "Senior Developer", check: "9:00 AM - 0:00 PM", device: "Nothing(AIN44)", workingHours: "9:10:23 hours", status: "On Time" },
    { name: "Greeshma B", designation: "Junior Developer", check: "9:40 AM - 12:00 PM", device: "Nothing(AIN44)", workingHours: "9:10:23 hours", status: "On Time" },
    { name: "Gokul S", designation: "Backend Developer", check: "9:00 AM - 12:00 PM", device: "Samsung(SM-S356B)", workingHours: "9:10:23 hours", status: "Half Day" },
    { name: "Alwin Gigi", designation: "Backend Developer", check: "9:00 AM - 12:00 PM", device: "Samsung(SM-S356B)", workingHours: "9:10:23 hours", status: "Late" },
    { name: "Hridaya S B", designation: "Junior Developer", check: "9:00 AM - 12:00 PM", device: "Samsung(SM-S356B)", workingHours: "9:10:23 hours", status: "On Time" },
    { name: "Gokul S", designation: "Backend Developer", check: "9:00 AM - 12:00 PM", device: "Nothing(AIN44)", workingHours: "9:10:23 hours", status: "On Time" },
  ];

  return (
    <section className="bg-gray-100 rounded-xl shadow-sm overflow-x-auto p-2 sm:p-4 w-full max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
        <h3 className="text-lg font-semibold">Daily </h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-50 text-sm flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-gray-600 w-full focus:outline-none text-sm"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-white text-gray-500 text-left text-xs uppercase">
            <tr>
              {[
                "Name",
                "Designation",
                "Check in - out",
                "Device",
                "Working Hours",
                "Status",
              ].map((col) => (
                <th
                  key={col}
                  className="px-2 sm:px-4 py-2 font-medium whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    <span className="flex flex-col">
                      <ChevronUp className="w-3 h-3 -mb-1 text-gray-300" />
                      <ChevronDown className="w-3 h-3 text-gray-300" />
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y text-center align-middle">
            {musterData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-2 flex items-center gap-2 justify-center sm:justify-start">
                  <img
                    src={`https://i.pravatar.cc/40?img=${idx + 30}`}
                    alt={row.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{row.name}</span>
                </td>
                <td className="px-2 sm:px-4 py-2">{row.designation}</td>
                <td className="px-2 sm:px-4 py-2">{row.check}</td>
                <td className="px-2 sm:px-4 py-2">{row.device}</td>
                <td className="px-2 sm:px-4 py-2">{row.workingHours}</td>
                <td className="px-2 sm:px-4 py-2">
                  <span
                    className={`w-[85px] text-center px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "On Time"
                        ? "bg-green-100 text-green-600"
                        : row.status === "Late"
                        ? "bg-blue-100 text-blue-600"
                        : row.status === "Half Day"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DailyAttendance;
