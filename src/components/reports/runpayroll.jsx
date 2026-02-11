import React, { useState, useEffect } from "react";
import axiosInstance from "../../service/axiosinstance";
import UniversalTable from "../../ui/universal_table";
import { Loader2, Download, Play } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import { postPayrollAttendance } from "../../api/api";
import CustomSelect from "../../ui/customselect";
import PayrollModal from "../../ui/payrollmodal";

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

export default function PayrollRunning() {
  const now = new Date();

  const [month, setMonth] = useState(monthNames[now.getMonth()]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(postPayrollAttendance, {
        month: monthNames.indexOf(month) + 1,
        year: Number(year),
      });
      setRecords(res.data?.data?.employees || []);
    } catch (err) {
      console.error("Fetch failed", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { label: "User ID", key: "user_id" },
    { label: "Employee Name", key: "user_name" },
    { label: "Gross Monthly", key: "gross_monthly" },
    { label: "Total Deductions", key: "total_deductions_monthly" },
    { label: "Net Monthly", key: "net_monthly" },
    { label: "Net Annual", key: "net_annual" },
  ];

  // ================= ROW CLICK =================
  const handleRowClick = (row) => {
    console.log("Clicked row data:", row); // log full row data
    const { bank_info, ...filteredRow } = row;
    setSelectedEmployee(JSON.parse(JSON.stringify(filteredRow)));
    setIsModalOpen(true);
  };

  // ================= FIELD CHANGE =================
  const handleFieldChange = (key, value) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleComponentChange = (index, field, value) => {
    const updated = { ...selectedEmployee };
    updated.components[index][field] = Number(value);
    setSelectedEmployee(updated);
  };

  // ================= SAVE MODAL (LOCAL ONLY) =================
  const handleSaveModal = () => {
    setRecords((prev) =>
      prev.map((emp) =>
        emp.user_id === selectedEmployee.user_id ? selectedEmployee : emp,
      ),
    );
    setIsModalOpen(false);
    setSelectedEmployee(null);
    console.log("Local table updated for", selectedEmployee.user_name);
  };

  // ================= RUN BUTTON (API CALL) =================
  const handleRunButton = async () => {
    if (!records.length) return;

    const payload = {
      month: monthNames.indexOf(month) + 1,
      year: Number(year),
      employees: records.map((emp) => ({
        user_id: emp.user_id,
        components: emp.components.map((c) => ({
          component_id: c.component_id,
          monthly_amount: Number(c.monthly_amount),
          annual_amount: Number(c.annual_amount),
        })),
        statutory: {
          epf_employee: emp.statutory?.epf || 0,
          esi_employee: emp.statutory?.esi || 0,
          pt: emp.statutory?.pt || 0,
          lwf_employee: emp.statutory?.lwf || 0,
        },
      })),
    };

    console.log(
      "Running payroll update with payload:",
      JSON.stringify(payload, null, 2),
    );

    try {
      await axiosInstance.put("/api/payroll/analytics/update", payload);
      console.log("Payroll successfully updated!");
      alert("Payroll updated successfully");
      fetchData(); // refresh table from backend
    } catch (err) {
      console.error("Payroll update failed:", err);
      alert("Payroll update failed");
    }
  };

  // ================= DOWNLOAD EXCEL =================
  const handleDownload = () => {
    if (!records.length) return;

    const headerRow = [
      "User ID",
      "Employee Name",
      "Gross Monthly",
      "Total Deductions",
      "Net Monthly",
      "Net Annual",
    ];

    const dataRows = records.map((r) => [
      r.user_id,
      r.user_name,
      r.gross_monthly,
      r.total_deductions_monthly,
      r.net_monthly,
      r.net_annual,
    ]);

    const sheetData = [
      [`PAYROLL REPORT - ${month.toUpperCase()} ${year}`],
      headerRow,
      ...dataRows,
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
          alignment: { vertical: "center", horizontal: "center" },
        };
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Payroll");
    XLSX.writeFile(wb, `payroll_${month}_${year}.xlsx`);
  };

  // ================= DOWNLOAD FOR BANK =================
  const handleDownloadBank = () => {
    if (!records.length) return;

    const dataRows = records.map((r) => [
      r.user_id,
      r.user_name,
      r.net_monthly,
      r.bank_info?.account_number || "",
      r.bank_info?.ifsc || "",
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dataRows);

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
          alignment: { vertical: "center", horizontal: "center" },
        };
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Bank");
    XLSX.writeFile(wb, `payroll_bank_${month}_${year}.xlsx`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Filters */}
      <div className="flex gap-3 mb-4 items-center">
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
        />

        {/* Run Button */}
        <button
          onClick={handleRunButton}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-green-600 text-white disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          Run
        </button>

        {/* Download Payroll */}
        <button
          onClick={handleDownload}
          disabled={!records.length || loading}
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-black text-white disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        {/* Download Bank */}
        <button
          onClick={handleDownloadBank}
          disabled={!records.length || loading}
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-blue-600 text-white disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Download for Bank
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <UniversalTable
          columns={columns}
          data={records}
          rowClickHandler={handleRowClick}
        />
      )}

      {isModalOpen && selectedEmployee && (
        <PayrollModal
          selectedEmployee={selectedEmployee}
          onClose={() => setIsModalOpen(false)}
          onFieldChange={handleFieldChange}
          onComponentChange={handleComponentChange}
          onSave={handleSaveModal} // only updates table locally
        />
      )}
    </div>
  );
}
