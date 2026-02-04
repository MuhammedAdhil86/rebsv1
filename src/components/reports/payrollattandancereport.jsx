import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosinstance";
import UniversalTable from "../../ui/universal_table";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { postPayrollAttendance } from "../../api/api";
import CustomSelect from "../../ui/customselect";

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(postPayrollAttendance, {
        month: Number(monthNames.indexOf(month) + 1),
        year: Number(year),
        leave_type: leaveType.toLowerCase(),
        accrual_method: accrualMethod.toLowerCase(),
      });
      setRecords(res.data?.data?.employees || []);
    } catch (err) {
      console.error("Payroll attendance fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year, leaveType, accrualMethod]);

  const columns = [
    { label: "User ID", key: "user_id" },
    { label: "Employee Name", key: "user_name" },
    { label: "Gross Monthly", key: "gross_monthly" },
    { label: "Total Deductions", key: "total_deductions_monthly" },
    { label: "Net Monthly", key: "net_monthly" },
    { label: "Net Annual", key: "net_annual" },
  ];

  const handleDownload = () => {
    if (!records.length) return;
    const excelData = records.map((r) => ({
      "User ID": r.user_id,
      Employee: r.user_name,
      "Gross Monthly": r.gross_monthly,
      "Total Deductions": r.total_deductions_monthly,
      "Net Monthly": r.net_monthly,
      "Net Annual": r.net_annual,
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Attendance");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `payroll_attendance_${month}_${year}.xlsx`,
    );
  };

  return (
    <div className="p-1 rounded-xl shadow-sm">
      <h2 className="text-[16px] font-medium mb-3">
        Payroll Attendance Report
      </h2>

      {/* ================= FILTERS ================= */}
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
          minWidth={80} // You can tweak px for year
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
          Download
        </button>
      </div>

      {/* ================= TABLE ================= */}
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
