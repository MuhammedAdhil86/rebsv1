import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosinstance";
import UniversalTable from "../../ui/universal_table";
import { Search, Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { createPortal } from "react-dom";

export default function LeaveReports() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tooltip states
  const [hoverText, setHoverText] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Filters
  const [searchUser, setSearchUser] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState("");
  const [status, setStatus] = useState("");

  // Truncate helper with tooltip support
  const truncate = (text, limit = 17) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "…" : text;
  };

  // Reset dynamic filters
  const resetDynamicFilters = () => {
    setIsHalfDay(false);
    setHalfDayType("");
    setStatus("");
  };

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        user_id: searchUser || undefined,
        from: from || undefined,
        to: to || (from ? from : undefined),
        is_half_day: selectedFilter === "isHalfDay" ? isHalfDay : undefined,
        half_day_type:
          selectedFilter === "halfDayType" ? halfDayType : undefined,
        status: selectedFilter === "status" ? status : undefined,
      };

      const res = await axiosInstance.get("admin/leave/employee/leave/report", {
        params,
      });
      const list = res.data?.data?.records || [];

      // Process fields for table
      const processed = list.map((r) => ({
        ...r,
        designation_short: truncate(r.designation),
        reason_short: truncate(r.reason),
      }));

      setRecords(processed);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchUser, from, to, selectedFilter, isHalfDay, halfDayType, status]);

  // Table columns
  const columns = [
    { label: "Date", key: "date" },
    { label: "Employee", key: "employee_name" },
    { label: "Department", key: "department_name" },
    {
      label: "Designation",
      key: "designation_short",
      render: (value, row) => (
        <div
          onMouseEnter={(e) => {
            if (row.designation?.length > 17) {
              const rect = e.target.getBoundingClientRect();
              setTooltipPos({ x: rect.left, y: rect.top - 30 });
              setHoverText(row.designation);
            }
          }}
          onMouseLeave={() => setHoverText(null)}
        >
          {value}
        </div>
      ),
    },
    {
      label: "Reason",
      key: "reason_short",
      render: (value, row) => (
        <div
          onMouseEnter={(e) => {
            if (row.reason?.length > 17) {
              const rect = e.target.getBoundingClientRect();
              setTooltipPos({ x: rect.left, y: rect.top - 30 });
              setHoverText(row.reason);
            }
          }}
          onMouseLeave={() => setHoverText(null)}
        >
          {value}
        </div>
      ),
    },
    { label: "Leave Type", key: "leave_type" },
    { label: "Status", key: "status" },
    { label: "Manager Approval", key: "manager_approval" },
  ];

  // Excel Download
  const handleDownload = () => {
    if (!records.length) return;

    const excelData = records.map((r) => ({
      Date: r.date ? new Date(r.date) : "",
      "User ID": r.user_id,
      Employee: r.employee_name,
      Department: r.department_name,
      Designation: r.designation,
      Reason: r.reason,
      "Leave Type": r.leave_type,
      Status: r.status,
      "Manager Approval": r.manager_approval,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData, { dateNF: "yyyy-mm-dd" });

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c });
      if (ws[cell]) ws[cell].s = { font: { bold: true } };
    }

    Object.keys(ws).forEach((cell) => {
      if (ws[cell]?.v instanceof Date) ws[cell].z = "dd/mm/yyyy";
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leave Reports");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `leave_report_${from || "all"}_${to || "all"}.xlsx`,
    );
  };

  return (
    <>
      <div className="p-1 rounded-xl shadow-sm">
        {/* Title */}
        <h2 className="text-lg font-mrdium mb-2">Leave Reports</h2>

        {/* Filters + Download */}
        <div className="flex gap-3 mb-4 flex-wrap items-center w-full">
          {/* Search User */}
          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="Search User ID"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-xs w-full"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          {/* From Date */}
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-lg px-3 sm:px-4 py-2 text-xs"
          />

          {/* To Date */}
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded-lg px-3 sm:px-4 py-2 text-xs"
          />

          {/* Filter Select */}
          <select
            value={selectedFilter}
            onChange={(e) => {
              resetDynamicFilters();
              setSelectedFilter(e.target.value);
            }}
            className="border rounded-lg px-3 sm:px-4 py-2 text-xs"
          >
            <option value="">Select Filter</option>
            <option value="isHalfDay">Is Half Day</option>
            <option value="halfDayType">Half Day Type</option>
            <option value="status">Status</option>
          </select>

          {/* Conditional Filters */}
          {selectedFilter === "isHalfDay" && (
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                className="w-4 h-4"
              />
              Half Day Leave
            </label>
          )}
          {selectedFilter === "halfDayType" && (
            <select
              value={halfDayType}
              onChange={(e) => setHalfDayType(e.target.value)}
              className="border rounded-lg px-3 sm:px-4 py-2 text-xs"
            >
              <option value="">Half Day Type</option>
              <option value="1">First Half</option>
              <option value="2">Second Half</option>
            </select>
          )}
          {selectedFilter === "status" && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg px-3 sm:px-4 py-2 text-xs"
            >
              <option value="">Select Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="ml-auto flex items-center gap-2 px-3 sm:px-4 py-2 text-xs rounded-lg border bg-black text-white font-poppins font-normal"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <UniversalTable columns={columns} data={records} rowsPerPage={8} />
        )}
      </div>

      {/* Tooltip */}
      {hoverText &&
        createPortal(
          <div
            className="fixed px-2 py-1 bg-black text-white text-xs rounded shadow-lg z-[999999]"
            style={{ top: tooltipPos.y, left: tooltipPos.x }}
          >
            {hoverText}
          </div>,
          document.body,
        )}
    </>
  );
}
