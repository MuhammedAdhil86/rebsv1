import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosinstance";
import UniversalTable from "../../ui/universal_table";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import { postPayrollAttendance } from "../../api/api";
import CustomSelect from "../../ui/customselect";

import {
  titleStyle,
  headerStyle,
  textCellStyle,
  numberCellStyle,
} from "../helpers/exelsheet";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const leaveTypes = ["Paid", "Unpaid"];
const accrualMethods = ["Yearly", "Monthly"];

export default function PayrollAttendanceReport() {
  const now = new Date();
  const [month, setMonth] = useState(monthNames[now.getMonth()]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [leaveType, setLeaveType] = useState("Paid");
  const [accrualMethod, setAccrualMethod] = useState("Yearly");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Payroll Attendance Data
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(postPayrollAttendance, {
        month: monthNames.indexOf(month) + 1,
        year: Number(year),
        leave_type: leaveType.toLowerCase(),
        accrual_method: accrualMethod.toLowerCase(),
      });

      setRecords(res.data?.data?.employees || []);
    } catch (err) {
      console.error("Payroll attendance fetch failed:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year, leaveType, accrualMethod]);

  // Table columns
  const columns = [
    { label: "User ID", key: "user_id" },
    { label: "Employee Name", key: "user_name" },
    { label: "Gross Monthly", key: "gross_monthly" },
    { label: "Total Deductions", key: "total_deductions_monthly" },
    { label: "Net Monthly", key: "net_monthly" },
    { label: "Net Annual", key: "net_annual" },
  ];

  // Download Salary Transfer Excel
  const handleDownload = async () => {
    if (!records.length) return;

    try {
      setLoading(true);

      // Fetch bank info
      const bankRes = await axiosInstance.get(
        "https://rebs-hr-cwhyx.ondigitalocean.app/staff/employees/bank-info",
      );
      const bankData = bankRes.data?.data || [];
      const bankMap = {};
      bankData.forEach((emp) => {
        if (emp.uuid) bankMap[emp.uuid] = emp.bank_details || {};
      });

      // Today's date
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1,
      ).padStart(2, "0")}/${today.getFullYear()}`;

      // Salary Transfer Headers
      const headerRow = [
        "Customer Bank Id",
        "Remarks",
        "Mode of Transaction",
        "Date",
        "Bank Account #",
        "Amount",
        "Bank Code",
        "Name",
        "IFSC Code of Receiver",
        "Salary A/c #",
      ];

      // Prepare rows
      const dataRows = records.map((r) => {
        const bank = bankMap[r.user_id] || {}; // match payroll user_id to bank uuid
        return [
          "AEDEN12", // Customer Bank Id
          "SALPAY", // Remarks
          "NEFT", // Mode of Transaction
          formattedDate, // Today
          bank.account_number || "", // Bank Account #
          r.net_monthly || 0, // Amount
          "M", // Bank Code
          bank.account_holder_name || "", // Name
          bank.ifsc || "", // IFSC
          bank.account_number || "", // Salary A/c #
        ];
      });

      const sheetData = [headerRow, ...dataRows];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(sheetData);

      // Column widths
      ws["!cols"] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 18 },
        { wch: 12 },
        { wch: 10 },
        { wch: 25 },
        { wch: 18 },
        { wch: 20 },
      ];

      // Optional: style header row
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;

          if (R === 0) ws[cellRef].s = headerStyle;
          else if (typeof ws[cellRef].v === "number")
            ws[cellRef].s = numberCellStyle;
          else ws[cellRef].s = textCellStyle;
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, "Salary Transfer");
      XLSX.writeFile(wb, `salary_transfer_${month}_${year}.xlsx`);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 rounded-xl shadow-sm">
      <h2 className="text-[16px] font-medium mb-3">
        Payroll Attendance Report
      </h2>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <CustomSelect
          label="Month"
          value={month}
          onChange={setMonth}
          options={monthNames}
        />

        <CustomSelect
          label="Year"
          value={year}
          onChange={setYear}
          options={[2024, 2025, 2026]}
          minWidth={80}
        />

        <CustomSelect
          label="Leave Type"
          value={leaveType}
          onChange={setLeaveType}
          options={leaveTypes}
          minWidth={100}
        />

        <CustomSelect
          label="Accrual Method"
          value={accrualMethod}
          onChange={setAccrualMethod}
          options={accrualMethods}
          minWidth={100}
        />

        <button
          onClick={handleDownload}
          disabled={!records.length || loading}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-black text-white disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Download Salary Transfer
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
  );
}
