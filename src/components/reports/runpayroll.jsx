import React, { useState, useEffect } from "react";
import axiosInstance from "../../service/axiosinstance";
import UniversalTable from "../../ui/universal_table";
import { Loader2, Download, Play, PlusCircle } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import { postPayrollAttendance } from "../../api/api";
import CustomSelect from "../../ui/customselect";
import AllocatePayrollModal from "../../ui/payrollallocatemodal";
import payrollService from "../../service/payrollService";
import {
  filterStaff,
  getDepartmentData,
  getBranchData,
  getDesignationData,
} from "../../service/staffservice";
import toast from "react-hot-toast";

// --- NEW COMPONENT IMPORT ---
import FinalizePayroll from "./payrollfinalize";

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

  // View State (Toggle between List and Finalize Component)
  const [finalizingEmployee, setFinalizingEmployee] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState("draft");

  // Table States
  const [month, setMonth] = useState(monthNames[now.getMonth()]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);

  // Bulk Allocate States
  const [bulkStep, setBulkStep] = useState(1);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkStaffList, setBulkStaffList] = useState([]);
  const [bulkTemplates, setBulkTemplates] = useState([]);
  const [bulkFilters, setBulkFilters] = useState({
    departments: [],
    branches: [],
    designations: [],
  });
  const [selectedStaffUuids, setSelectedStaffUuids] = useState([]);
  const [bulkSearchQuery, setBulkSearchQuery] = useState("");
  const [bulkActiveFilters, setBulkActiveFilters] = useState({
    dept: "",
    branch: "",
    desig: "",
  });
  const [bulkFormData, setBulkFormData] = useState({
    template_id: "",
    from_date: "",
    to_date: "",
  });

  // ================= 1. FETCH MAIN TABLE DATA =================
  useEffect(() => {
    fetchData();
  }, [month, year, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const monthIndex = monthNames.indexOf(month) + 1;
      const res = await payrollService.getPayrollAnalyticsRuns(
        monthIndex,
        year,
        activeTab,
      );

      const runs = res?.data?.runs || [];
      if (runs.length > 0) {
        setRecords(runs[0].employees || []);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= 2. ACTION HANDLERS =================
  const handleRunButton = async () => {
    toast.dismiss();
    setLoading(true);
    const payload = {
      month: monthNames.indexOf(month) + 1,
      year: Number(year),
    };

    toast.promise(axiosInstance.post(postPayrollAttendance, payload), {
      loading: "Calculating payroll components...",
      success: (res) => {
        fetchData();
        return res?.data?.message || "Payroll Calculated Successfully!";
      },
      error: (err) => {
        setLoading(false);
        return err.response?.data?.message || "Calculation failed";
      },
    });
  };

  const handleBulkSubmit = async () => {
    if (selectedStaffUuids.length === 0)
      return toast.error("Select staff members");
    const payload = {
      template_id: Number(bulkFormData.template_id),
      user_ids: selectedStaffUuids,
      effective_from: `${bulkFormData.from_date}T00:00:00Z`,
      effective_to: `${bulkFormData.to_date}T00:00:00Z`,
    };

    toast.promise(payrollService.bulkAllocatePayroll(payload), {
      loading: "Allocating payroll...",
      success: () => {
        fetchData();
        setIsAllocateModalOpen(false);
        return "Payroll Allocated Successfully!";
      },
      error: (err) => err.response?.data?.message || "Allocation failed",
    });
  };

  // ================= 3. UI HELPERS =================
  const columns = [
    { label: "User ID", key: "user_id" },
    { label: "Employee Name", key: "bank_info.account_holder_name" },
    { label: "Gross Monthly", key: "gross_monthly" },
    { label: "Total Deductions", key: "total_deductions" },
    { label: "Net Monthly", key: "net_monthly" },
    { label: "Net Annual", key: "net_annual" },
  ];

  const handleDownload = () => {
    if (!records.length) return;
    const headerRow = [
      "User ID",
      "Name",
      "Gross",
      "Deductions",
      "Net Monthly",
      "Net Annual",
    ];
    const dataRows = records.map((r) => [
      r.user_id,
      r.bank_info?.account_holder_name || "N/A",
      r.gross_monthly,
      r.total_deductions,
      r.net_monthly,
      r.net_annual,
    ]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      [`PAYROLL REPORT (${activeTab.toUpperCase()}) - ${month} ${year}`],
      headerRow,
      ...dataRows,
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");
    XLSX.writeFile(wb, `payroll_${activeTab}_${month}_${year}.xlsx`);
  };

  // ================= 4. CONDITIONAL RENDER (FINALIZE VIEW) =================
  if (finalizingEmployee) {
    return (
      <FinalizePayroll
        data={finalizingEmployee}
        onBack={() => {
          setFinalizingEmployee(null);
          fetchData();
        }}
      />
    );
  }

  // ================= 5. MAIN LIST VIEW =================
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm font-poppins font-normal text-[12px]">
      {/* Tab Switcher */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("draft")}
          className={`px-6 py-2 transition-all ${activeTab === "draft" ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Draft
        </button>
        <button
          onClick={() => setActiveTab("finalized")}
          className={`px-6 py-2 transition-all ${activeTab === "finalized" ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Finalized
        </button>
      </div>

      <div className="flex gap-3 mb-4 items-center flex-wrap">
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

        <div className="flex-grow"></div>

        <button
          onClick={() => setIsAllocateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          <PlusCircle size={14} /> Allocate Payroll
        </button>

        {activeTab === "draft" && (
          <button
            onClick={handleRunButton}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}{" "}
            Run Payroll
          </button>
        )}

        <button
          onClick={handleDownload}
          disabled={!records.length || loading}
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          <Download size={14} /> Download
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <UniversalTable
          columns={columns}
          data={records}
          rowClickHandler={(row) => {
            // Logic: Switch to FinalizePayroll component view on click
            setFinalizingEmployee(JSON.parse(JSON.stringify(row)));
          }}
        />
      )}

      {/* Bulk Allocate Modal remains accessible from this view */}
      <AllocatePayrollModal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        step={bulkStep}
        setStep={setBulkStep}
        loading={bulkLoading}
        staffList={bulkStaffList}
        templates={bulkTemplates}
        filters={bulkFilters}
        selectedStaff={selectedStaffUuids}
        setSelectedStaff={setSelectedStaffUuids}
        searchQuery={bulkSearchQuery}
        setSearchQuery={setBulkSearchQuery}
        activeFilters={bulkActiveFilters}
        setActiveFilters={setBulkActiveFilters}
        formData={bulkFormData}
        setFormData={setBulkFormData}
        onSubmit={handleBulkSubmit}
      />
    </div>
  );
}
