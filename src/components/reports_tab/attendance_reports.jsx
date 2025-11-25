import React, { useState, useEffect, useRef } from "react";
import { FiDownload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Status cell component
function StatusCell({ value }) {
  const [open, setOpen] = useState(false);
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Accepted: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full text-[13px] relative">
      <span
        className={`flex items-center gap-2 px-2 py-1 rounded-full text-[11px] ${statusStyles[value]}`}
      >
        <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
          {value === "Accepted" && <span className="text-green-600 text-sm">✔</span>}
          {value === "Rejected" && <span className="text-red-600 text-sm">✖</span>}
        </span>
        {value}
      </span>

      {/* Dropdown */}
      <div className="relative">
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          ⋮
        </span>
        {open && (
          <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 shadow-lg rounded z-10">
            <button className="flex items-center gap-2 px-3 py-1 w-full hover:bg-gray-100 text-left text-[13px]">View</button>
            <button className="flex items-center gap-2 px-3 py-1 w-full hover:bg-gray-100 text-left text-[13px]">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}

// UniversalTable with fixed alignment
function UniversalTable({ columns, data, rowsPerPage = 6, searchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  const filteredData = searchTerm
    ? data.filter((row) =>
        columns.some((col) =>
          row[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentData = filteredData.slice(startIdx, endIdx);

  // Recalculate column widths after every render
useEffect(() => {
  if (headerRef.current) {
    const widths = Array.from(headerRef.current.querySelectorAll("th")).map(
      (th) => th.offsetWidth
    );
    setColWidths(widths);
  }
}, [columns, data, searchTerm]);


  return (
    <section className="p-2 rounded-2xl overflow-x-auto w-full">
      {/* Header */}
      <table
        className="w-full min-w-[600px] text-[12px] bg-white border-separate border-spacing-0 rounded-2xl overflow-hidden"
        ref={headerRef}
      >
        <thead className="bg-white text-gray-600 text-[12.5px]">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-gray-700 text-center whitespace-nowrap align-middle ${
                  idx === 0
                    ? "rounded-tl-2xl"
                    : idx === columns.length - 1
                    ? "rounded-tr-2xl"
                    : ""
                }`}
                style={{
                  width: colWidths[idx]
                    ? `${colWidths[idx]}px`
                    : col.width
                    ? `${col.width}px`
                    : "auto",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div className="h-2" />

      {/* Body */}
      <table className="w-full min-w-[600px] text-[11px] bg-white border-separate border-spacing-0 rounded-2xl overflow-hidden">
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {currentData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 text-center">
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    data-label={col.label}
                    className="px-4 py-3 truncate text-center align-middle"
                    style={{
                      width: colWidths[colIdx]
                        ? `${colWidths[colIdx]}px`
                        : col.width
                        ? `${col.width}px`
                        : "auto",
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}

          {/* Pagination */}
          {filteredData.length > 0 && (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-3 text-[12.5px]">
                  <span className="text-gray-500">
                    Showing {startIdx + 1}-{Math.min(endIdx, filteredData.length)} of {filteredData.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

// Sample data
const reportsData = [
  { name: "Aswin Lal", jobTitle: "Flutter Developer", jobId: "235345", jobType: "Remote", expiryDate: "22 Dec 2025", location: "Kochi, Kerala", status: "Pending" },
  { name: "Greshem b", jobTitle: "Golang Developer", jobId: "353353", jobType: "WFH", expiryDate: "22 Dec 2025", location: "Kochi, Kerala", status: "Rejected" },
  { name: "Aleena Elchose", jobTitle: "Golang Developer", jobId: "345525", jobType: "WFH", expiryDate: "22 Dec 2025", location: "Kochi, Kerala", status: "Accepted" },
];

// Columns
const columns = [
  { key: "name", label: "Name" },
  { key: "jobTitle", label: "Job Title" },
  { key: "jobId", label: "Job Id" },
  { key: "jobType", label: "Job Type" },
  { key: "expiryDate", label: "Expiry Date" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status", render: (value) => <StatusCell value={value} /> },
];

// Main component
export default function AttendanceReports() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-4 text-[13px]">
      {/* Filters */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3 w-full text-[13px]">
        <div className="text-[20px] font-medium">Sep 2025</div>
        <div className="flex gap-3 flex-wrap items-center justify-end flex-1">
          <select className="border border-gray-300 rounded px-3 py-1 text-[13px] w-[110px]">
            <option>September</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-1 text-[13px] w-[80px]">
            <option>2025</option>
          </select>
          <div className="relative w-[150px]">
            <input type="date" className="border border-gray-300 bg-white rounded px-3 py-1 text-[13px] w-full pr-8" />
            <Icon icon="solar:calendar-linear" className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-lg pointer-events-none" />
          </div>
          <span className="text-[13px] font-medium mx-1">to</span>
          <div className="relative w-[150px]">
            <input type="date" className="border border-gray-300 bg-white rounded px-3 py-1 text-[13px] w-full pr-8" />
            <Icon icon="solar:calendar-linear" className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-lg pointer-events-none" />
          </div>
          <button className="flex items-center px-4 py-1 bg-black text-white rounded text-[13px]">
            <FiDownload className="mr-2" /> Download
          </button>
          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-[13px] w-full pr-8"
            />
            <Icon icon="mynaui:search" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto scrollbar-hide">
        <UniversalTable columns={columns} data={reportsData} rowsPerPage={5} searchTerm={searchTerm} />
      </div>
    </div>
  );
}
