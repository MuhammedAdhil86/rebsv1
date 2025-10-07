import React from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

// Main component
function LeaveRequestes() {
  // Example data
  const requests = [
    {
      name: "Aswin Lal",
      designation: "Designer",
      date: "April 30 2025",
      totalDays: "1 Day",
      remarks: "NON",
      leaveType: "Casual Leave",
      status: "Pending",
    },
    {
      name: "Aleena Echose",
      designation: "Senior Developer",
      date: "April 30 2025",
      totalDays: "1 Day",
      remarks: "NON",
      leaveType: "Casual Leave",
      status: "Approved",
    },
    {
      name: "Greeshma B",
      designation: "Junior Developer",
      date: "April 30 2025",
      totalDays: "1 Day",
      remarks: "NON",
      leaveType: "Casual Leave",
      status: "Approved",
    },
    {
      name: "Gokul S",
      designation: "Backend Developer",
      date: "April 30 2025",
      totalDays: "1 Day",
      remarks: "NON",
      leaveType: "Casual Leave",
      status: "Approved",
    },
    {
      name: "Alwin Gigi",
      designation: "Backend Developer",
      date: "April 30 2025",
      totalDays: "1 Day",
      remarks: "NON",
      leaveType: "Casual Leave",
      status: "Approved",
    },
    {
      name: "Hridaya S B",
      designation: "Junior Developer",
      date: "April 30 2025, 1 Day",
      totalDays: "1 Day",
      remarks: "NON",
      leaveType: "Casual Leave",
      status: "Approved",
    },
    {
      name: "Gokul S",
      designation: "Backend Developer",
      date: "April 30 2025",
      totalDays: "1 Day",
      remarks: "NON",
      leaveType: "Casual Leave",
      status: "Approved",
    },
  ];

  return (
    <section className="bg-gray-100 rounded-xl shadow-sm overflow-x-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Leave Requests</h3>

        <div className="flex items-center gap-3">
          <button className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800">
            + Create Request
          </button>
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
              "Date",
              "Total Days",
              "Remarks",
              "Leave Type",
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

          {/* Spacer row for gap between head and body */}
          <tr className="h-3"></tr>
        </thead>

        <tbody className="divide-y bg-white">
          {requests.map((req, idx) => (
            <tr key={idx}>
              <td className="px-4 py-3 flex items-center gap-2">
                <img
                  src={`https://i.pravatar.cc/40?img=${idx + 10}`}
                  alt={req.name}
                  className="w-8 h-8 rounded-full"
                />
                {req.name}
              </td>
              <td className="px-4 py-3">{req.designation}</td>
              <td className="px-4 py-3">{req.date}</td>
              <td className="px-4 py-3">{req.totalDays}</td>
              <td className="px-4 py-3">{req.remarks}</td>
              <td className="px-4 py-3">{req.leaveType}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    req.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : req.status === "Pending"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default LeaveRequestes;
