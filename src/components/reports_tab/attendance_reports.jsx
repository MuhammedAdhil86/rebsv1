import React, { useState, useEffect, useRef } from "react";
import { FiDownload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../service/axiosinstance"; // Make sure axiosInstance is configured

// StatusCell component
function StatusCell({ value, row }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Accepted: "bg-green-100 text-green-800",
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleView = () => {
    console.log("View row data:", row); // 🔹 Logs row data
  };

  return (
    <div
      className="flex items-center justify-center gap-2 w-full text-[13px]"
      ref={ref}
    >
      <span
        className={`flex items-center gap-2 px-2 py-1 rounded-full text-[11px] ${statusStyles[value] || ""}`}
      >
        <span className="w-4 h-4 rounded-full flex items-center justify-center">
          {value === "Accepted" && (
            <span className="text-green-600 text-sm">✔</span>
          )}
          {value === "Rejected" && (
            <span className="text-red-600 text-sm">✖</span>
          )}
        </span>
        {value || "N/A"}
      </span>

      <div className="relative">
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          ⋮
        </span>
        {open && (
          <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 shadow-lg rounded z-10">
            <button
              className="px-3 py-1 w-full hover:bg-gray-100 text-left text-[13px]"
              onClick={handleView}
            >
              View
            </button>
            <button className="px-3 py-1 w-full hover:bg-gray-100 text-left text-[13px]">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// UniversalTable component
function UniversalTable({ columns, data, rowsPerPage = 6, searchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  const filteredData = searchTerm
    ? data.filter((row) =>
        columns.some((col) =>
          row[col.key]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        ),
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentData = filteredData.slice(startIdx, endIdx);

  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.querySelectorAll("th")).map(
        (th) => th.offsetWidth,
      );
      setColWidths(widths);
    }
  }, [columns, data, searchTerm]);

  return (
    <section className="p-2 rounded-2xl overflow-x-auto w-full">
      <table
        className="w-full min-w-[600px] text-[12px] bg-white border-separate border-spacing-0 rounded-2xl overflow-hidden table-fixed"
        ref={headerRef}
      >
        <thead className="bg-white text-gray-600 text-[12.5px]">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-gray-700 text-center whitespace-nowrap ${
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

      <table className="w-full min-w-[600px] text-[11px] bg-white border-separate border-spacing-0 rounded-2xl table-fixed">
        <tbody className="divide-y divide-gray-100">
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 text-center">
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 truncate text-center"
                    style={{
                      width: colWidths[colIdx]
                        ? `${colWidths[colIdx]}px`
                        : col.width
                          ? `${col.width}px`
                          : "auto",
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] || "N/A"}
                  </td>
                ))}
              </tr>
            ))
          )}

          {filteredData.length > 0 && (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex justify-between items-center px-4 py-3 text-[12px]">
                  <span className="text-gray-500">
                    Showing {startIdx + 1}-
                    {Math.min(endIdx, filteredData.length)} of{" "}
                    {filteredData.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        currentPage > 1 && setCurrentPage(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage(currentPage + 1)
                      }
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

// Columns
const columns = [
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "user_id", label: "User ID" },
  { key: "department", label: "Department" },
  { key: "doj", label: "DOJ" },
  { key: "net_salary", label: "Net Salary" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => <StatusCell value={value} row={row} />,
  },
];

export default function AttendanceReports() {
  const today = new Date();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [apiData, setApiData] = useState([]);

  const getDefaultDates = (month, year) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const formatDate = (date) => date.toISOString().split("T")[0];
    return [formatDate(firstDay), formatDate(lastDay)];
  };

  // Set initial default month range
  useEffect(() => {
    const [from, to] = getDefaultDates(
      today.getMonth() + 1,
      today.getFullYear(),
    );
    setFromDate(from);
    setToDate(to);
  }, []);

  // Update dates when month/year changes
  useEffect(() => {
    const [from, to] = getDefaultDates(selectedMonth, selectedYear);
    setFromDate(from);
    setToDate(to);
  }, [selectedMonth, selectedYear]);

  // API integration
  useEffect(() => {
    axiosInstance
      .get(`/admin/staff/fullreport/${selectedMonth}/${selectedYear}`, {})
      .then((res) => {
        const mapped =
          res.data?.data?.map((item) => ({
            name: item.name || "N/A",
            designation: item.designation || "N/A",
            user_id: item.user_id || "N/A",
            department: item.department || "N/A",
            doj: item.doj
              ? (() => {
                  const d = new Date(item.doj);
                  return isNaN(d.getTime())
                    ? "N/A"
                    : d.toISOString().split("T")[0];
                })()
              : "N/A",
            net_salary: item.net_salary != null ? item.net_salary : "N/A",
            status: item.net_salary > 0 ? "Accepted" : "Pending",
          })) || [];
        setApiData(mapped);
      })
      .catch((err) => {
        console.error(err);
        setApiData([]);
      });
  }, [selectedMonth, selectedYear, fromDate, toDate]);

  return (
    <div className="flex flex-col gap-4 text-[13px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3 w-full px-2">
        <div className="text-[16px] font-medium">
          {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
            month: "short",
          })}{" "}
          {selectedYear}
        </div>

        <div className="flex gap-3 flex-wrap items-center justify-end flex-1">
          {/* Month */}
          <select
            className="border border-gray-300 rounded px-3 py-1 w-[110px]"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            className="border border-gray-300 rounded px-3 py-1 w-[90px]"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from(
              { length: 5 },
              (_, i) => today.getFullYear() - 2 + i,
            ).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* From Date */}
          <div className="relative w-[150px]">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="remove-default-icon border border-gray-300 bg-white rounded px-3 py-1 w-full pr-8"
            />
            <Icon
              icon="solar:calendar-linear"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-lg"
            />
          </div>

          <span className="text-[13px] font-medium mx-1">to</span>

          {/* To Date */}
          <div className="relative w-[150px]">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="remove-default-icon border border-gray-300 bg-white rounded px-3 py-1 w-full pr-8"
            />
            <Icon
              icon="solar:calendar-linear"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-lg"
            />
          </div>

          {/* Download */}
          <button
            className="flex items-center px-4 py-1 bg-black text-white rounded"
            onClick={() =>
              console.log("Download clicked. Current data:", apiData)
            }
          >
            <FiDownload className="mr-2" /> Download
          </button>

          {/* Search */}
          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 w-full pr-8"
            />
            <Icon
              icon="mynaui:search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto scrollbar-hide">
        <UniversalTable
          columns={columns}
          data={apiData}
          rowsPerPage={5}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
