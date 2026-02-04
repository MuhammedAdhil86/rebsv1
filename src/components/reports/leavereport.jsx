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

  // Tooltip
  const [hoverText, setHoverText] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Filters
  const [searchUser, setSearchUser] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Dynamic filter
  const [mainFilter, setMainFilter] = useState(""); // Status / Manager Approval
  const [dynamicValue, setDynamicValue] = useState(""); // selected value of the dynamic dropdown

  // Helper: truncate text
  const truncate = (text, limit = 10) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "…" : text;
  };

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        user_id: searchUser || undefined,
        from: from || undefined,
        to: to || undefined,
        status: mainFilter === "status" ? dynamicValue : undefined,
        manager_approval:
          mainFilter === "managerApproval" ? dynamicValue : undefined,
      };

      const res = await axiosInstance.get(
        "/admin/leave/employee/leave/report",
        { params },
      );

      const list = res.data?.data?.records || [];

      const processed = list.map((r) => ({
        ...r,
        department_short: truncate(r.department_name), // 10 chars
        designation_short: truncate(r.designation), // 10 chars
        reason_short: truncate(r.reason), // 10 chars
        leave_policy_short:
          r.leave_policy_name === "Casual Leave"
            ? "Casual"
            : r.leave_policy_name,
      }));

      setRecords(processed);

      console.log("Full data for table:", processed); // Optional: full data log
    } catch (err) {
      console.error("Error fetching data:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchUser, from, to, mainFilter, dynamicValue]);

  // Table columns
  const columns = [
    { label: "Date", key: "date" },
    { label: "Employee", key: "employee_name" },
    {
      label: "Department",
      key: "department_short",
      render: (value, row) => (
        <div
          onMouseEnter={(e) => {
            if (row.department_name?.length > 10) {
              const rect = e.target.getBoundingClientRect();
              setTooltipPos({ x: rect.left, y: rect.top - 30 });
              setHoverText(row.department_name);
            }
          }}
          onMouseLeave={() => setHoverText(null)}
        >
          {value}
        </div>
      ),
    },
    {
      label: "Designation",
      key: "designation_short",
      render: (value, row) => (
        <div
          onMouseEnter={(e) => {
            if (row.designation?.length > 10) {
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
            if (row.reason?.length > 10) {
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
    {
      label: "Leave Policy",
      key: "leave_policy_short",
      render: (value, row) => (
        <div
          onMouseEnter={(e) => {
            if (row.leave_policy_name?.length > 10) {
              const rect = e.target.getBoundingClientRect();
              setTooltipPos({ x: rect.left, y: rect.top - 30 });
              setHoverText(row.leave_policy_name);
            }
          }}
          onMouseLeave={() => setHoverText(null)}
        >
          {value}
        </div>
      ),
    },
    { label: "Status", key: "status" },
    { label: "Manager Approval", key: "manager_approval" },
  ];

  // Excel download
  const handleDownload = () => {
    if (!records.length) return;

    const excelData = records.map((r) => ({
      Date: r.date ? new Date(r.date) : "",
      "User ID": r.user_id,
      Employee: r.employee_name,
      Department: r.department_name,
      Designation: r.designation,
      Reason: r.reason,
      "Leave Policy": r.leave_policy_name,
      Status: r.status,
      "Manager Approval": r.manager_approval,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData, { dateNF: "yyyy-mm-dd" });
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
      <div className="p-2 rounded-xl shadow-sm">
        <h2 className="text-lg font-medium mb-2">Leave Reports</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          {/* From / To Dates */}
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-lg px-3 py-2 text-xs"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded-lg px-3 py-2 text-xs"
          />

          {/* Main dynamic filter */}
          <select
            value={mainFilter}
            onChange={(e) => {
              setMainFilter(e.target.value);
              setDynamicValue("");
            }}
            className="border rounded-lg px-3 py-2 text-xs"
          >
            <option value="">Filter</option>
            <option value="status">Status</option>
            <option value="managerApproval">Manager Approval</option>
          </select>

          {/* Dynamic sub-filter */}
          {mainFilter === "status" && (
            <select
              value={dynamicValue}
              onChange={(e) => setDynamicValue(e.target.value)}
              className="border rounded-lg px-3 py-2 text-xs"
            >
              <option value="">Select Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}

          {mainFilter === "managerApproval" && (
            <select
              value={dynamicValue}
              onChange={(e) => setDynamicValue(e.target.value)}
              className="border rounded-lg px-3 py-2 text-xs"
            >
              <option value="">Select Approval</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}

          {/* Search Staff */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Staff"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-xs"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border bg-black text-white"
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
