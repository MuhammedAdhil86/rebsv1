import React, { useEffect, useState } from "react";
import UniversalTable from "../../ui/universal_table";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import CustomSelect from "../../ui/customselect";

import {
  headerStyle,
  textCellStyle,
  numberCellStyle,
} from "../helpers/exelsheet";

// ✅ IMPORT PAYROLL ANALYTICS API
import { fetchPayrollAnalytics } from "../../service/reportsService";

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

const SALARY_ACCOUNT_NUMBER = "7049968193";

export default function PayrollAttendanceReport() {
  const now = new Date();
  const [month, setMonth] = useState(monthNames[now.getMonth()]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================== FETCH PAYROLL ANALYTICS ==================
  const fetchData = async () => {
    try {
      setLoading(true);

      const data = await fetchPayrollAnalytics(
        monthNames.indexOf(month) + 1,
        Number(year),
      );

      // ✅ Map employees to include full_name from nested bank_info
      const processedRecords = Array.isArray(data.employees)
        ? data.employees.map((emp) => {
            const info = emp.bank_info || {};
            return {
              ...emp,
              full_name:
                `${info.first_name || ""} ${info.last_name || ""}`.trim(),
              total_deductions_monthly: emp.total_deductions || 0,
            };
          })
        : [];

      setRecords(processedRecords);
    } catch (err) {
      console.error("Payroll analytics fetch failed:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  // ================== TABLE COLUMNS (Designation/Dept Removed) ==================
  const columns = [
    { label: "User ID", key: "user_id" },
    { label: "Employee Name", key: "full_name" },
    { label: "Gross Monthly", key: "gross_monthly" },
    { label: "Total Deductions", key: "total_deductions_monthly" },
    { label: "Net Monthly", key: "net_monthly" },
    { label: "Net Annual", key: "net_annual" },
  ];

  // ================== DOWNLOAD SALARY (WITH HEADER) ==================
  const handleDownloadSalary = async () => {
    if (!records.length) return;
    try {
      setLoading(true);
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

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

      const dataRows = records.map((r) => {
        const bank = r.bank_info || {};
        return [
          "AEDEN12",
          "SALPAY",
          "NEFT",
          formattedDate,
          bank.account_number || "",
          r.net_monthly || 0,
          "M",
          r.full_name || "",
          bank.ifsc || "",
          SALARY_ACCOUNT_NUMBER,
        ];
      });

      const sheetData = [headerRow, ...dataRows];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(sheetData);

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

  // ================== DOWNLOAD BANK EXCEL (WITHOUT HEADER) ==================
  const handleDownloadBankExcel = async () => {
    if (!records.length) return;
    try {
      setLoading(true);
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

      const dataRows = records.map((r) => {
        const bank = r.bank_info || {};
        return [
          "AEDEN12",
          "SALPAY",
          "NEFT",
          formattedDate,
          bank.account_number || "",
          r.net_monthly || 0,
          "M",
          r.full_name || "",
          bank.ifsc || "",
          SALARY_ACCOUNT_NUMBER,
        ];
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(dataRows);
      XLSX.utils.book_append_sheet(wb, ws, "Bank Sheet");
      XLSX.writeFile(wb, `bank_excel_${month}_${year}.xlsx`);
    } catch (err) {
      console.error("Bank Excel download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 rounded-xl shadow-sm">
      <h2 className="text-[16px] font-medium mb-3">
        Payroll Attendance Report
      </h2>

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

        <button
          onClick={handleDownloadSalary}
          disabled={!records.length || loading}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-black text-white disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Download
        </button>

        <button
          onClick={handleDownloadBankExcel}
          disabled={!records.length || loading}
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-blue-600 text-white disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Download for Bank
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
