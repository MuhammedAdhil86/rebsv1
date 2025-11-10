import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

function EmployeeTable({ employees }) {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(term) ||
      emp.designationname?.String?.toLowerCase().includes(term) ||
      emp.branch?.String?.toLowerCase().includes(term) ||
      emp.shift?.toLowerCase().includes(term) ||
      emp.ph_no?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentEmployees = filteredEmployees.slice(startIdx, endIdx);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Sync header and body column widths
  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.querySelectorAll("th")).map(
        (th) => th.offsetWidth
      );
      setColWidths(widths);
    }
  }, [employees, searchTerm]);

  return (
    <section className="p-2 rounded-2xl overflow-x-auto overflow-y-visible relative">
      {/* Title & Search */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Employee List</h3>
   <div className="flex items-center gap-2 border px-3 py-2 rounded-xl bg-white text-sm">
  <input
    type="text"
    placeholder="Search"
    value={searchTerm}
    onChange={handleSearchChange}
    className="bg-white w-full focus:outline-none text-sm text-gray-600 px-2 py-1 rounded"
  />
  <Search className="w-4 h-4 text-gray-400" />
</div>

      </div>

      {/* Header Table */}
      <table
        className="w-full text-[12px] bg-white rounded-2xl border-separate border-spacing-0"
        ref={headerRef}
      >
        <thead className="bg-white text-gray-600 uppercase text-[12.5px] rounded-xl">
          <tr>
            {["Employee", "Designation", "Mobile", "Branch", "Shift", "Status"].map(
              (col, idx) => (
                <th
                  key={col}
                  className="px-4 py-3 font-light text-gray-700 whitespace-nowrap text-left align-middle rounded-xl"
                  style={{ width: colWidths[idx] ? `${colWidths[idx]}px` : "auto" }}
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
      </table>

      <div className="h-2"></div>

 {/* Body Table */}
<div className="overflow-x-auto overflow-y-visible relative ">
  <table className="w-full text-[12px] bg-white border-separate border-spacing-0 rounded-2xl relative z-10">
    <tbody className="divide-y divide-gray-100 text-gray-800 relative z-10 font-poppins">
      {currentEmployees.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center py-8 text-gray-500 font-poppins">
            No data available
          </td>
        </tr>
      ) : (
        currentEmployees.map((emp, idx) => (
          <tr key={idx} className="hover:bg-gray-50 align-middle">
            {/* Employee Name */}
            <td
              className="px-4 pt-5 pb-5 flex items-center gap-2 align-middle relative group font-poppins"
              style={{
                width: colWidths[0] ? `${colWidths[0]}px` : "auto",
              }}
            >
              <img
                src={`https://i.pravatar.cc/40?img=${startIdx + idx + 1}`}
                alt={emp.name}
                className="w-7 h-7 rounded-full"
              />
              <div className="max-w-[120px] truncate cursor-default">
                {emp.name}
              </div>

              {/* Tooltip */}
              <div className="absolute hidden group-hover:flex bg-black text-white text-[11px] px-2 py-1 rounded shadow-lg z-[9999] -top-8 left-0 whitespace-nowrap pointer-events-none font-poppins">
                {emp.name}
              </div>
            </td>

            {/* Designation */}
            <td
              className="px-4 pt-5 pb-5 text-[12px] align-middle relative group font-poppins"
              style={{ width: colWidths[1] ? `${colWidths[1]}px` : "auto" }}
            >
              <div className="max-w-[120px] truncate cursor-default">
                {emp.designationname?.String || ""}
              </div>
              <div className="absolute hidden group-hover:flex bg-black text-white text-[11px] px-2 py-1 rounded shadow-lg z-[9999] -top-8 left-0 whitespace-nowrap pointer-events-none font-poppins">
                {emp.designationname?.String || ""}
              </div>
            </td>

            {/* Mobile */}
            <td
              className="px-4 pt-5 pb-5 text-[12px] align-middle relative group font-poppins"
              style={{ width: colWidths[2] ? `${colWidths[2]}px` : "auto" }}
            >
              <div className="max-w-[120px] truncate cursor-default">
                {emp.ph_no || ""}
              </div>
              <div className="absolute hidden group-hover:flex bg-black text-white text-[11px] px-2 py-1 rounded shadow-lg z-[9999] -top-8 left-0 whitespace-nowrap pointer-events-none font-poppins">
                {emp.ph_no || ""}
              </div>
            </td>

            {/* Branch */}
            <td
              className="px-4 pt-5 pb-5 text-[12px] align-middle relative group font-poppins"
              style={{ width: colWidths[3] ? `${colWidths[3]}px` : "auto" }}
            >
              <div className="max-w-[120px] truncate cursor-default">
                {emp.branch?.String || "Head Office"}
              </div>
              <div className="absolute hidden group-hover:flex bg-black text-white text-[11px] px-2 py-1 rounded shadow-lg z-[9999] -top-8 left-0 whitespace-nowrap pointer-events-none font-poppins">
                {emp.branch?.String || "Head Office"}
              </div>
            </td>

            {/* Shift */}
            <td
              className="px-4 pt-5 pb-5 text-[12px] align-middle relative group font-poppins"
              style={{ width: colWidths[4] ? `${colWidths[4]}px` : "auto" }}
            >
              <div className="max-w-[120px] truncate cursor-default">
                {emp.shift || "Day Shift"}
              </div>
              <div className="absolute hidden group-hover:flex bg-black text-white text-[11px] px-2 py-1 rounded shadow-lg z-[9999] -top-8 left-0 whitespace-nowrap pointer-events-none font-poppins">
                {emp.shift || "Day Shift"}
              </div>
            </td>

            {/* Status */}
            <td
              className="px-4 pt-5 pb-5 text-[12px] align-middle relative font-poppins"
              style={{ width: colWidths[5] ? `${colWidths[5]}px` : "auto" }}
            >
              <span
                className={`px-3 py-1 w-[85px] text-center rounded-full text-[12.5px] font-medium ${
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
        ))
      )}

      {/* Pagination */}
      {filteredEmployees.length > 0 && (
        <tr>
          <td colSpan={6}>
            <div className="flex justify-between items-center px-4 py-3 text-[12.5px] rounded-b-2xl font-poppins">
              <span className="text-gray-500">
                Showing {startIdx + 1}-{Math.min(endIdx, filteredEmployees.length)} of{" "}
                {filteredEmployees.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </section>
  );
}

export default EmployeeTable;
