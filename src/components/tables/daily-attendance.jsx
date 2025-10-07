import React from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

function DailyAttendance() {
  // Example data
  const musterData = [
    {
      name: "Aswin Lal",
      designation: "Designer",
      check: "9:00 AM - 12:00 PM",
      device: "Samsung(SM-S356B)",
      workingHours: "9:10:23 hours",
      status: "On Time",
    },
    {
      name: "Aleena Eldhose",
      designation: "Senior Developer",
      check: "9:00 AM - 0:00 PM",
      device: "Nothing(AIN44)",
      workingHours: "9:10:23 hours",
      status: "On Time",
    },
    {
      name: "Greeshma B",
      designation: "Junior Developer",
      check: "9:40 AM - 12:00 PM",
      device: "Nothing(AIN44)",
      workingHours: "9:10:23 hours",
      status: "On Time",
    },
    {
      name: "Gokul S",
      designation: "Backend Developer",
      check: "9:00 AM - 12:00 PM",
      device: "Samsung(SM-S356B)",
      workingHours: "9:10:23 hours",
      status: "Half Day",
    },
    {
      name: "Alwin Gigi",
      designation: "Backend Developer",
      check: "9:00 AM - 12:00 PM",
      device: "Samsung(SM-S356B)",
      workingHours: "9:10:23 hours",
      status: "Late",
    },
    {
      name: "Hridaya S B",
      designation: "Junior Developer",
      check: "9:00 AM - 12:00 PM",
      device: "Samsung(SM-S356B)",
      workingHours: "9:10:23 hours",
      status: "On Time",
    },
    {
      name: "Gokul S",
      designation: "Backend Developer",
      check: "9:00 AM - 12:00 PM",
      device: "Nothing(AIN44)",
      workingHours: "9:10:23 hours",
      status: "On Time",
    },
  ];

  return (
    <section className="bg-gray-100 rounded-xl shadow-sm overflow-x-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg">Muster Roll</h3>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-50 text-sm">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-gray-600 w-40 focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm rounded-lg overflow-hidden">
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
              <th key={col} className="px-4 py-3 font-medium">
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

          {/* Spacer row for gap */}
          <tr className="h-3"></tr>
        </thead>

        <tbody className="bg-white">
          {musterData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 flex items-center gap-2">
                <img
                  src={`https://i.pravatar.cc/40?img=${idx + 30}`}
                  alt={row.name}
                  className="w-8 h-8 rounded-full"
                />
                {row.name}
              </td>
              <td className="px-4 py-3">{row.designation}</td>
              <td className="px-4 py-3">{row.check}</td>
              <td className="px-4 py-3">{row.device}</td>
              <td className="px-4 py-3">{row.workingHours}</td>
              <td className="px-4 py-3">
                <span
                  className={`w-[90px] text-center px-3 py-1 rounded-full text-xs font-medium ${
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
    </section>
  );
}

export default DailyAttendance;
