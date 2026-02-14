import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import { Printer, Download } from "lucide-react";
import DashboardLayout from "../ui/pagelayout";

const avatar =
  "https://ui-avatars.com/api/?name=Admin&background=000000&color=ffffff";

// ✅ Online placeholder logo for Iresco
const companyLogo = "https://cdn-icons-png.flaticon.com/512/9119/9119104.png";

const Payslip = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Data received from the ReportTable row click
  const employee = location.state?.employeeData;

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const handlePrint = () => window.print();

  const renderContent = () => {
    if (!employee) {
      return (
        <div className="p-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            No employee data found. Please select a record from reports.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      );
    }

    const { bank_info, consolidated_summary, statutory, components } = employee;
    const earnings =
      components?.filter((c) => c.component_type === "earning") || [];
    const payDateStr = employee.pay_date || "2026-02-14T08:42:23.210776Z";
    const displayLocation =
      bank_info?.branch_location ||
      "Changampuzha Nagar 5th Floor Crescence Tower";

    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center">
        {/* --- MAIN PAYSLIP DOCUMENT --- */}
        <div className="w-full max-w-5xl bg-white px-8 pt-3 pb-7 shadow-md print:shadow-none print:p-0 text-[#333] font-sans border border-gray-100">
          {/* ================= DOCUMENT HEADER (UPDATED) ================= */}
          <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-6">
            <div className="flex gap-4">
              {/* ✅ Company Logo Implementation */}
              <div className="w-14 h-14 flex items-center justify-center">
                <img
                  src={companyLogo}
                  alt="Iresco Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-gray-800 ">
                  A e d e n
                </h1>
                <p className="text-[12px] text-gray-500 leading-relaxed mt-1">
                  {displayLocation}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
                Payslip For the Month
              </p>
              <p className="text-xl font-medium text-gray-800">
                {new Date(
                  consolidated_summary?.year,
                  consolidated_summary?.month - 1,
                ).toLocaleString("default", { month: "long" })}{" "}
                {consolidated_summary?.year}
              </p>
            </div>
          </div>

          <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.2em] pb-2">
            Employee Summary
          </h2>

          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            {/* Info Column */}
            <div className="flex-1 grid grid-cols-2 gap-y-2 text-[13px]">
              <span className="text-gray-500">Employee Name</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.first_name} {bank_info?.last_name}
              </span>
              <span className="text-gray-500">Designation</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.designation}
              </span>
              <span className="text-gray-500">Employee ID</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.employee_ref_no || employee.user_id}
              </span>
              <span className="text-gray-500">Department</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.department}
              </span>
              <span className="text-gray-500">Date of Joining</span>
              <span className="font-semibold text-gray-800">
                :{" "}
                {new Date(bank_info?.date_of_join).toLocaleDateString("en-GB")}
              </span>
              <span className="text-gray-500">Pay Period</span>
              <span className="font-semibold text-gray-800">
                :{" "}
                {new Date(
                  consolidated_summary?.year,
                  consolidated_summary?.month - 1,
                ).toLocaleString("default", { month: "long" })}{" "}
                {consolidated_summary?.year}
              </span>
              <span className="text-gray-500">Pay Date</span>
              <span className="font-semibold text-gray-800">
                : {new Date(payDateStr).toLocaleDateString("en-GB")}
              </span>
            </div>

            {/* Net Pay Box */}
            <div className="w-full md:w-80 bg-[#f1fcf4] border border-[#def7e5] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-baseline mb-1">
                <p className="text-3xl font-medium text-gray-800">
                  {formatINR(employee.net_monthly)}
                </p>
              </div>
              <p className="text-[10px] font-medium text-green-700 uppercase tracking-widest mb-6">
                Total Net Pay
              </p>

              <div className="space-y-2 pt-4 border-t border-green-200/50 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid Days</span>
                  <span className="font-bold">
                    : {consolidated_summary?.paid_days}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LOP Days</span>
                  <span className="font-bold">
                    : {consolidated_summary?.lop_days}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account/Statutory Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 text-[12px] border-t border-dashed py-8 mb-6">
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                PF A/C Number
              </span>
              <span className="font-medium">
                {bank_info?.epf_number || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                UAN
              </span>
              <span className="font-medium">
                {bank_info?.uan_number || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                Bank Account No
              </span>
              <span className="font-medium">{bank_info?.account_number}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                PAN
              </span>
              <span className="font-medium">{bank_info?.pan_number}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                Work Location
              </span>
              <span className="font-medium">{bank_info?.bank_branch}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                ESI Number
              </span>
              <span className="font-medium">
                {bank_info?.esi_number || "N/A"}
              </span>
            </div>
          </div>

          {/* Earnings & Deductions Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-10">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b">
                <tr>
                  <th className="px-5 py-3 text-left w-1/3">Earnings</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-left w-1/3 border-l">
                    Deductions
                  </th>
                  <th className="px-5 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {earnings.map((comp, idx) => (
                  <tr key={idx}>
                    <td className="px-5 py-3 text-gray-600">{comp.name}</td>
                    <td className="px-5 py-3 text-right font-semibold">
                      {formatINR(comp.monthly_amount)}
                    </td>
                    <td className="px-5 py-3 border-l text-gray-600">
                      {idx === 0 ? "Professional Tax (PT)" : ""}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-red-500">
                      {idx === 0 ? formatINR(statutory?.pt) : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50/80 font-bold border-t">
                <tr>
                  <td className="px-5 py-3">Gross Earnings</td>
                  <td className="px-5 py-3 text-right text-indigo-700">
                    {formatINR(employee.gross_monthly)}
                  </td>
                  <td className="px-5 py-3 border-l">Total Deductions</td>
                  <td className="px-5 py-3 text-right text-red-600">
                    {formatINR(employee.total_deductions)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Total Net Payable */}
          <div className="bg-[#f1fcf4] border border-[#def7e5] rounded-xl p-5 flex justify-between items-center mb-4">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                Total Net Payable
              </p>
              <p className="text-[10px] text-gray-400 italic mt-1">
                Gross Earnings - Total Deductions
              </p>
            </div>
            <p className="text-2xl font-medium text-gray-800">
              {formatINR(employee.net_monthly)}
            </p>
          </div>

          <p className="text-center text-[10px] text-gray-400 italic mt-10">
            -- This is a system-generated document and does not require a
            signature. --
          </p>

          {/* Benefits Summary */}
          <div className="mt-10">
            <h3 className="text-[11px] font-bold text-gray-800 mb-2">
              Benefits Summary
            </h3>
            <p className="text-[10px] text-gray-500 mb-4">
              Detailed breakdown of benefit contributions.
            </p>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-[11px]">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Benefits</th>
                    <th className="px-4 py-3 text-center">
                      Employee Contribution
                    </th>
                    <th className="px-4 py-3 text-center">
                      Employer Contribution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y text-center">
                  <tr>
                    <td className="px-4 py-3 text-left font-medium">
                      EPF Contribution
                    </td>
                    <td className="px-4 py-3">
                      {formatINR(statutory?.epf_employee)}
                    </td>
                    <td className="px-4 py-3">
                      {formatINR(statutory?.epf_employer)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50/30">
                    <td className="px-4 py-3 text-left font-medium">
                      ESI Insurance
                    </td>
                    <td className="px-4 py-3">
                      {formatINR(statutory?.esi_employee)}
                    </td>
                    <td className="px-4 py-3">
                      {formatINR(statutory?.esi_employer)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout userName="Admin" onLogout={() => {}}>
      <div className="bg-white pt-4 px-4 pb-0 w-full max-w-full print:hidden">
        <div className="flex justify-between items-center py-1 border-b border-gray-200 mb-5 flex-wrap gap-4">
          <h1 className="text-[15px] font-semibold text-gray-800">Payslip</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300">
              <FiBell className="text-gray-600 text-lg" />
            </div>
            <button className="text-[13px] text-gray-700 border border-gray-300 px-5 py-1 rounded-full">
              Settings
            </button>
            <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden">
              <img
                src={avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full overflow-auto h-full">{renderContent()}</div>
    </DashboardLayout>
  );
};

export default Payslip;
