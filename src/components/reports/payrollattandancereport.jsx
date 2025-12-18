import React, { useEffect, useState } from "react";
import axiosInstance from "../../service/axiosinstance";
import UniversalTable from "../../ui/universal_table";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function PayrollAttendanceReport() {
  // ================= DATE DEFAULTS =================
  const now = new Date();

  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  // ================= STATE =================
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    if (!month || !year) return;

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `${axiosInstance.baseURL2}api/payroll/calculate/attendance`,
        {
          month: Number(month),
          year: Number(year),
        }
      );

      setRecords(res.data?.data?.employees || []);
    } catch (err) {
      console.error("Payroll attendance fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchData();
  }, [month, year]);

  // ================= TABLE COLUMNS =================
  const columns = [
    { label: "User ID", key: "user_id" },
    { label: "Employee Name", key: "user_name" },
    { label: "Gross Monthly", key: "gross_monthly" },
    { label: "Total Deductions", key: "total_deductions_monthly" },
    { label: "Net Monthly", key: "net_monthly" },
    { label: "Net Annual", key: "net_annual" },
  ];

  // ================= EXCEL EXPORT =================
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

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `payroll_attendance_${month}_${year}.xlsx`
    );
  };

  // ================= RENDER =================
  return (
    <div className="p-1 rounded-xl shadow-sm">
      <h2 className="text-[16px] font-medium mb-3">
        Payroll Attendance Report
      </h2>

      {/* ================= FILTERS ================= */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded-lg px-3 py-2 text-xs"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded-lg px-3 py-2 text-xs"
        >
          <option value="">Select Year</option>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

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
        <UniversalTable
          columns={columns}
          data={records}
          rowsPerPage={8}
        />
      )}
    </div>
  );
}
