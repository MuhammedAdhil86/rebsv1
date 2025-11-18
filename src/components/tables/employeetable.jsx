import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

function EmployeeTable({ employees }) {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  // Detect if text is truncated
  const isTruncated = (el) => {
    if (!el) return false;
    return el.scrollWidth > el.clientWidth;
  };

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

  // Sync header & body column widths
  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.querySelectorAll("th")).map(
        (th) => th.offsetWidth
      );
      setColWidths(widths);
    }
  }, [employees, searchTerm]);

  return (
    <section className="p-2 rounded-2xl overflow-x-auto relative w-full">

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <h3 className="text-lg sm:text-xl font-medium text-gray-800">Employee List</h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm shadow-sm mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent text-gray-600 w-full focus:outline-none text-sm"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Header Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px] text-[12px] bg-white border-separate border-spacing-0 rounded-2xl" ref={headerRef}>
          <thead className="bg-white text-gray-600 uppercase text-[12.5px] rounded-xl">
            <tr>
              {["Employee", "Designation", "Mobile", "Branch", "Shift", "Status"].map((col, idx) => (
                <th
                  key={col}
                  className="px-8 py-3 font-light text-gray-700 whitespace-nowrap text-left align-middle rounded-xl"
                  style={{ width: colWidths[idx] ? `${colWidths[idx]}px` : "auto" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <div className="h-2" />

      {/* Body Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px] text-[12px] bg-white border-separate border-spacing-0 rounded-2xl">
          <tbody className="divide-y divide-gray-100 text-gray-800 font-poppins">
            {currentEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No data available</td>
              </tr>
            ) : (
              currentEmployees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 align-middle">

                  {/* Name */}
                  <td
                    data-label="Employee"
                    className="px-4 pt-5 pb-5 relative group"
                    style={{
                      width: colWidths[0] ? `${colWidths[0]}px` : "auto",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/40?img=${startIdx + idx + 1}`}
                        alt={emp.name}
                        className="w-7 h-7 rounded-full"
                      />

                      {/* truncated text ref */}
                      <span
                        className="block truncate max-w-[120px]"
                        ref={(el) => (emp._nameRef = el)}
                      >
                        {emp.name}
                      </span>
                    </div>

                    {/* Tooltip only if truncated */}
                    {isTruncated(emp._nameRef) && (
                      <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-50 top-0 left-0 whitespace-nowrap -translate-y-full">
                        {emp.name}
                      </span>
                    )}
                  </td>

                  {/* Designation */}
                  <td
                    data-label="Designation"
                    className="px-4 pt-5 pb-5 relative group"
                    style={{
                      width: colWidths[1] ? `${colWidths[1]}px` : "auto",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span
                      className="truncate block max-w-[120px]"
                      ref={(el) => (emp._desigRef = el)}
                    >
                      {emp.designationname?.String}
                    </span>

                    {isTruncated(emp._desigRef) && (
                      <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-50 top-0 left-0 whitespace-nowrap -translate-y-full">
                        {emp.designationname?.String}
                      </span>
                    )}
                  </td>

                  {/* Mobile */}
                  <td className="px-4 pt-5 pb-5 truncate max-w-[120px]" style={{ width: colWidths[2] }}>
                    {emp.ph_no}
                  </td>

                  {/* Branch */}
                  <td className="px-4 pt-5 pb-5 truncate max-w-[120px]" style={{ width: colWidths[3] }}>
                    {emp.branch?.String || "Head Office"}
                  </td>

                  {/* Shift */}
                  <td className="px-4 pt-5 pb-5" style={{ width: colWidths[4] }}>
                    {emp.shift || "Day Shift"}
                  </td>

                  {/* Status */}
                  <td className="px-4 pt-5 pb-5" style={{ width: colWidths[5] }}>
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
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-3 text-[12.5px] rounded-b-2xl">
                    <span className="text-gray-500">
                      Showing {startIdx + 1}-{Math.min(endIdx, filteredEmployees.length)} of {filteredEmployees.length}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm">Previous</button>
                      <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm">Next</button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <style jsx>{`
        @media (max-width: 640px) {
          table, thead, tbody, th, td, tr { display: block; }
          thead tr { display: none; }
          tbody tr { margin-bottom: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem; }
          tbody td { display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; }
          tbody td::before { content: attr(data-label); font-weight: 500; color: #6b7280; }
        }
      `}</style>
    </section>
  );
}

export default EmployeeTable;
