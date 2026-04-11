import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Calculator,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import payrollService from "../../service/payrollService";
import toast from "react-hot-toast";

const FinalizePayroll = ({ data, onBack }) => {
  // Initialize state with the employee data passed from the list
  const [formData, setFormData] = useState({
    user_id: data.user_id,
    components: data.components || [],
    statutory: {
      epf_employee: data.statutory?.epf_employee || 0,
      esi_employee: data.statutory?.esi_employee || 0,
      pt: data.statutory?.pt || 0,
      lwf_employee: data.statutory?.lwf_employee || 0,
    },
  });

  // Handle changes for Earnings/Components
  const handleComponentChange = (index, value) => {
    const updatedComponents = [...formData.components];
    const monthly = parseFloat(value) || 0;
    updatedComponents[index] = {
      ...updatedComponents[index],
      monthly_amount: monthly,
      annual_amount: monthly * 12, // Auto-calculate annual
    };
    setFormData({ ...formData, components: updatedComponents });
  };

  // Handle changes for Statutory/Deductions
  const handleStatutoryChange = (field, value) => {
    setFormData({
      ...formData,
      statutory: {
        ...formData.statutory,
        [field]: parseFloat(value) || 0,
      },
    });
  };

  // UPDATE (PUT) - Saves current values as Draft
  const handleSaveDraft = async () => {
    const payload = {
      month: data.consolidated_summary?.month,
      year: data.consolidated_summary?.year,
      employees: [formData], // Following your requested body structure
    };

    toast.promise(payrollService.updatePayrollAnalyticsRuns(payload), {
      loading: "Saving draft...",
      success: "Payroll draft saved!",
      error: (err) => err.message || "Failed to save draft",
    });
  };

  // FINALIZE (PATCH) - Moves to Finalized Tab
  const handleFinalize = async () => {
    const payload = {
      payroll_run_id: data.payroll_run_id,
      user_id: data.user_id,
      status: "finalized",
    };

    toast.promise(payrollService.finalizePayrollEntry(payload), {
      loading: "Finalizing payroll...",
      success: () => {
        onBack(); // Return to main list
        return "Payroll finalized successfully!";
      },
      error: "Failed to finalize",
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-5 duration-300 font-poppins">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-2xl shadow-sm border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-black transition-all"
        >
          <ArrowLeft size={18} />
          <span className="font-medium text-[13px]">Back to Payroll List</span>
        </button>

        <div className="flex gap-3 px-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-[12px]"
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            onClick={handleFinalize}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all text-[12px]"
          >
            <CheckCircle size={16} /> Finalize Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Employee Profile & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <Calculator size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {data?.bank_info?.account_holder_name}
            </h2>
            <p className="text-gray-400 text-xs mb-4">
              Emp ID: {data?.user_id} | {data?.bank_info?.designation}
            </p>

            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Department</span>
                <span className="text-gray-700 font-medium">
                  {data?.bank_info?.department}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Month / Year</span>
                <span className="text-gray-700 font-medium">
                  {data?.consolidated_summary?.month} /{" "}
                  {data?.consolidated_summary?.year}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Editable Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings / Components */}
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-gray-50/50 flex items-center gap-2">
              <Landmark size={18} className="text-blue-500" />
              <h3 className="font-semibold text-gray-800 text-[14px]">
                Salary Components (Earnings)
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {formData.components.map((comp, index) => (
                <div key={comp.component_id} className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold ml-1">
                    {comp.name}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={comp.monthly_amount}
                      onChange={(e) =>
                        handleComponentChange(index, e.target.value)
                      }
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-[13px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory / Deductions */}
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-gray-50/50 flex items-center gap-2">
              <ShieldCheck size={18} className="text-red-500" />
              <h3 className="font-semibold text-gray-800 text-[14px]">
                Statutory Deductions
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "EPF Employee", key: "epf_employee" },
                { label: "ESI Employee", key: "esi_employee" },
                { label: "Professional Tax (PT)", key: "pt" },
                { label: "LWF Employee", key: "lwf_employee" },
              ].map((stat) => (
                <div key={stat.key} className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold ml-1">
                    {stat.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={formData.statutory[stat.key]}
                      onChange={(e) =>
                        handleStatutoryChange(stat.key, e.target.value)
                      }
                      className="w-full pl-8 pr-4 py-3 bg-red-50/30 border border-red-50 rounded-2xl focus:bg-white focus:border-red-500 outline-none transition-all text-[13px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizePayroll;
