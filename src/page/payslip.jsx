import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import { Printer, Download } from "lucide-react";
import DashboardLayout from "../ui/pagelayout";
import html2pdf from "html2pdf.js";

const avatar =
  "https://ui-avatars.com/api/?name=Admin&background=000000&color=ffffff";

const Payslip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const payslipRef = useRef();

  // --- LOG 1: FULL INCOMING STATE ---
  useEffect(() => {
    console.log(">>> [STATE RECEIVED]:", location.state);
  }, [location.state]);

  const employee = location.state?.employeeData;

  // --- DYNAMIC DATA FROM API ---
  const companyName = location.state?.name || "N?A";
  const companyAddress = location.state?.address || "N/A";

  // Logo Logic: Primary Logo -> Horizontal Logo -> Default Avatar
  const logo = location.state?.logo;
  const hLogo = location.state?.horizontal_logo;
  const activeCompanyLogo = logo || hLogo || avatar;

  // --- LOG 2: BRANDING DATA ---
  console.log(">>> [BRANDING LOGIC]:", {
    name: companyName,
    logoUrl: activeCompanyLogo,
    isFallback: !logo && !hLogo,
  });

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const handleDownloadPDF = () => {
    console.log(
      ">>> [ACTION]: Downloading PDF for",
      employee?.bank_info?.first_name,
    );

    const element = payslipRef.current;
    const opt = {
      margin: 0,
      filename: `Payslip_${employee?.bank_info?.first_name || "Employee"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const renderContent = () => {
    if (!employee) {
      console.warn(">>> [DATA WARNING]: No employee data found in state.");
      return (
        <div className="p-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No employee data found.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 flex items-center gap-2 mx-auto"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      );
    }

    const { bank_info, consolidated_summary, statutory, components } = employee;
    const earnings =
      components?.filter((c) => c.component_type === "earning") || [];
    const payDateStr = employee.pay_date || "2026-04-21T06:54:04.92377Z";

    console.log(">>> [EMPLOYEE DATA]:", {
      id: bank_info?.employee_ref_no,
      name: `${bank_info?.first_name} ${bank_info?.last_name}`,
      totalEarnings: earnings.length,
      netPayable: employee.net_monthly,
    });

    return (
      <div className="min-h-screen flex flex-col items-center">
        <div
          ref={payslipRef}
          className="w-full bg-white px-8 pt-3 pb-7 shadow-md print:shadow-none print:p-0 text-[#333] font-sans border border-gray-100"
        >
          {/* HEADER SECTION WITH LOGO */}
          <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                <img
                  src={activeCompanyLogo}
                  alt={`${companyName} Logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = avatar; // Fallback if image fails to load
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-gray-800 ">
                  {companyName}
                </h1>
                <p className="text-[12px] text-gray-500 leading-relaxed mt-1">
                  {companyAddress}
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
            <div className="flex-1 grid grid-cols-2 gap-y-2 text-[13px]">
              <span className="text-gray-500">Employee Name</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.first_name} {bank_info?.last_name}
              </span>
              <span className="text-gray-500">Designation</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.designation || "N/A"}
              </span>
              <span className="text-gray-500">Employee ID</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.employee_ref_no || employee.user_id}
              </span>
              <span className="text-gray-500">Department</span>
              <span className="font-semibold text-gray-800">
                : {bank_info?.department || "N/A"}
              </span>
              <span className="text-gray-500">Date of Joining</span>
              <span className="font-semibold text-gray-800">
                :{" "}
                {bank_info?.date_of_join
                  ? new Date(bank_info.date_of_join).toLocaleDateString("en-GB")
                  : "N/A"}
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

            <div className="w-full md:w-80 bg-[#f1fcf4] border border-[#def7e5] rounded-xl p-6 shadow-sm">
              <p className="text-3xl font-medium text-gray-800">
                {formatINR(employee.net_monthly)}
              </p>
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
              <span className="font-medium">
                {bank_info?.account_number || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                PAN
              </span>
              <span className="font-medium">
                {bank_info?.pan_number || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-bold text-[10px] mb-1">
                Work Location
              </span>
              <span className="font-medium">
                {bank_info?.bank_branch || "N/A"}
              </span>
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
            -- System-generated document --
          </p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout userName="Admin" onLogout={() => {}}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="bg-white pt-4 px-4 pb-0 w-full max-w-full print:hidden">
        <div className="flex justify-between items-center py-1 border-b border-gray-200 mb-5 flex-wrap gap-4">
          <h1 className="text-[15px] font-semibold text-gray-800">Payslip</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 text-[13px] bg-indigo-600 text-white px-4 py-1.5 rounded-full"
            >
              <Download size={14} /> Download PDF
            </button>
            <div
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer"
              onClick={() => {
                console.log(">>> [ACTION]: Browser Print Triggered");
                window.print();
              }}
            >
              <Printer className="text-gray-600 text-lg" size={18} />
            </div>
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
      <div className="w-full overflow-auto h-full no-scrollbar">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default Payslip;
