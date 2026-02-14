import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import CustomSelect from "../../ui/customselect";
import ReportTable from "../../ui/reporttable";

// ✅ Helper imports for Excel styling
import {
  headerStyle,
  textCellStyle,
  numberCellStyle,
} from "../helpers/exelsheet";

// ✅ API Service
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
  const navigate = useNavigate();
  const now = new Date();

  // States
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

      const processedRecords = Array.isArray(data.employees)
        ? data.employees.map((emp) => {
            const info = emp.bank_info || {};
            const stat = emp.statutory || {};

            return {
              ...emp,
              full_name:
                `${info.first_name || ""} ${info.last_name || ""}`.trim() ||
                info.account_holder_name ||
                "N/A",
              bank_name: info.bank_name || "N/A",
              account_no: info.account_number || "N/A",
              ifsc: info.ifsc || "N/A",
              branch: info.bank_branch || "N/A",
              pt: stat.pt || 0,
              epf: stat.epf_employee || 0,
              esi: stat.esi_employee || 0,
              total_deductions_monthly: emp.total_deductions || 0,
              attendance_pct: emp.attendance_factor
                ? `${(emp.attendance_factor * 100).toFixed(2)}%`
                : "0%",
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

  // ================== NAVIGATION LOGIC ==================
  const handleRowClick = (row) => {
    // Navigates to /payslip and passes the clicked row data
    navigate("/payslip", { state: { employeeData: row } });
  };

  // ================== TABLE COLUMNS ==================
  const columns = [
    { label: "User ID", key: "user_id" },
    { label: "Employee Name", key: "full_name" },
    { label: "Attendance", key: "attendance_pct" },
    { label: "Bank Name", key: "bank_name" },
    { label: "Account No", key: "account_no" },
    { label: "IFSC", key: "ifsc" },
    { label: "Gross Monthly", key: "gross_monthly" },
    { label: "PT", key: "pt" },
    { label: "EPF", key: "epf" },
    { label: "Total Deductions", key: "total_deductions_monthly" },
    { label: "Net Monthly", key: "net_monthly" },
    { label: "Net Annual", key: "net_annual" },
  ];

  // ================== EXCEL DOWNLOADS ==================
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

      {/* --- Filters & Actions --- */}
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

        <div className="ml-auto flex gap-2">
          <button
            onClick={handleDownloadSalary}
            disabled={!records.length || loading}
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-black text-white disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </button>

          <button
            onClick={handleDownloadBankExcel}
            disabled={!records.length || loading}
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Download for Bank
          </button>
        </div>
      </div>

      {/* --- Table Section --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-gray-500">Fetching payroll data...</p>
        </div>
      ) : (
        <ReportTable
          columns={columns}
          data={records}
          rowsPerPage={8}
          onRowClick={handleRowClick} // This triggers navigation
        />
      )}
    </div>
  );
}
