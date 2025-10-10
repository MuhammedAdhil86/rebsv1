import React, { useState } from "react";
import { Search } from "lucide-react";

function EmployeeTable({ employees }) {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentEmployees = employees.slice(startIdx, endIdx);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <section className="bg-gray-100 rounded overflow-x-auto">
      {/* Title & Search */}
      <div className="flex justify-between items-center p-2 mb-3">
        <h3 className="text-xl">Employee List</h3>
        <div className="flex items-center gap-1 border px-2 py-1 rounded-lg bg-white text-xs">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-xs text-gray-600 w-40"
          />
          <Search className="w-3 h-3 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div>
        <table className="w-full text-xs table-fixed">
          <thead className="bg-white">
            <tr className="border-b border-gray-200">
              {["Employee", "Designation", "Mobile", "Branch", "Shift", "Status"].map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-medium text-gray-500 uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentEmployees.map((emp, idx) => (
              <tr key={idx} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="px-3 py-3 flex items-center gap-2">
                  <img
                    src={`https://i.pravatar.cc/24?img=${startIdx + idx + 1}`}
                    alt={emp.name}
                    className="w-5 h-5 rounded-full"
                  />
                  {emp.name}
                </td>
                <td className="px-3 py-3">{emp.designationname?.String || ""}</td>
                <td className="px-3 py-3">{emp.ph_no || ""}</td>
                <td className="px-3 py-3">{emp.branch?.String || ""}</td>
                <td className="px-3 py-3">{emp.shift || ""}</td>
                <td className="px-3 py-3">
                  <span
                    className={`w-[70px] h-[27px] flex items-center justify-center rounded-full text-[10px] ${
                      emp.status === "Online"
                        ? "bg-green-100 text-green-600"
                        : emp.status === "Absent"
                        ? "bg-red-100 text-red-600"
                        : emp.status === "Late"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}

            {/* Pagination Row */}
            <tr>
              <td colSpan={6}>
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50">
                  {/* Left: total data info */}
                  <span className="text-gray-500 text-xs">
                    Showing {startIdx + 1}-{Math.min(endIdx, employees.length)} of {employees.length}
                  </span>

                  {/* Right: Previous / Next buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EmployeeTable;
