import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosinstance";
import UniversalTable from "../../ui/universal_table";
import { Search, Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import CustomSelect from "../../ui/customselect";

import {
  titleStyle,
  headerStyle,
  textCellStyle,
  numberCellStyle,
  totalRowStyle,
} from "../helpers/exelsheet";

export default function LeaveReports() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchUser, setSearchUser] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [mainFilter, setMainFilter] = useState("");
  const [dynamicValue, setDynamicValue] = useState("");

  const truncate = (text, limit = 10) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "…" : text;
  };

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
        department_short: truncate(r.department_name),
        designation_short: truncate(r.designation),
        reason_short: truncate(r.reason),
        leave_policy_short:
          r.leave_policy_name === "Casual Leave"
            ? "Casual"
            : r.leave_policy_name,
      }));

      setRecords(processed);
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

  const columns = [
    { label: "Date", key: "date" },
    { label: "Employee", key: "employee_name" },
    { label: "Department", key: "department_short" },
    { label: "Designation", key: "designation_short" },
    { label: "Reason", key: "reason_short" },
    { label: "Leave Policy", key: "leave_policy_short" },
    { label: "Status", key: "status" },
    { label: "Manager Approval", key: "manager_approval" },
  ];

  const handleDownload = () => {
    if (!records.length) return;

    const headerRow = [
      "Date",
      "User ID",
      "Employee",
      "Department",
      "Designation",
      "Reason",
      "Leave Policy",
      "Status",
      "Manager Approval",
    ];

    const dataRows = records.map((r) => [
      r.date ? new Date(r.date).toLocaleDateString() : "",
      r.user_id,
      r.employee_name,
      r.department_name,
      r.designation,
      r.reason,
      r.leave_policy_name,
      r.status,
      r.manager_approval,
    ]);

    const sheetData = [["LEAVE REPORT"], headerRow, ...dataRows];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headerRow.length - 1 } },
    ];

    ws["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 30 },
      { wch: 25 },
      { wch: 35 },
      { wch: 25 },
      { wch: 16 },
      { wch: 14 },
      { wch: 18 },
    ];

    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        if (R === 0) ws[cellRef].s = titleStyle;
        else if (R === 1) ws[cellRef].s = headerStyle;
        else if (typeof ws[cellRef].v === "number")
          ws[cellRef].s = numberCellStyle;
        else ws[cellRef].s = textCellStyle;
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Leave Reports");
    XLSX.writeFile(wb, `leave_report_${from || "all"}_${to || "all"}.xlsx`);
  };

  return (
    <div className="p-2 rounded-xl shadow-sm">
      <h2 className="text-lg font-medium mb-2">Leave Reports</h2>

      <div className="flex flex-wrap gap-2 items-center mb-4">
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

        <CustomSelect
          placeholder="Filter"
          value={mainFilter}
          onChange={(val) => {
            setMainFilter(val);
            setDynamicValue("");
          }}
          options={[
            { label: "Status", value: "status" },
            { label: "Manager Approval", value: "managerApproval" },
          ]}
          minWidth={140}
        />

        {mainFilter === "status" && (
          <CustomSelect
            placeholder="Select Status"
            value={dynamicValue}
            onChange={setDynamicValue}
            options={["Approved", "Pending", "Rejected"]}
            minWidth={140}
          />
        )}

        {mainFilter === "managerApproval" && (
          <CustomSelect
            placeholder="Select Approval"
            value={dynamicValue}
            onChange={setDynamicValue}
            options={["Approved", "Pending", "Rejected"]}
            minWidth={160}
          />
        )}

        <div className="relative">
          <input
            type="text"
            placeholder="Search Staff"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="border rounded-lg px-3 py-2 text-xs"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border bg-black text-white"
        >
          <Download className="w-4 h-4" /> Download
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <UniversalTable columns={columns} data={records} rowsPerPage={8} />
      )}
    </div>
  );
}
