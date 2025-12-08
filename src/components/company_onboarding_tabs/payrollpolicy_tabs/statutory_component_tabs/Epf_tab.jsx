import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@iconify/react";

const EpfTab = ({ onDisable, epfData }) => {
  const [loading, setLoading] = useState(false);

  const handleDisableClick = async () => {
    setLoading(true);
    await onDisable();
    setLoading(false);
  };

  return (
    <div className="rounded-xl">
      <h2 className="font-medium text-gray-800 mb-4 text-[14px]">
        Employee’s Provident Fund
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-y-5 gap-x-10">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">EPF Number</p>
            <p className="text-gray-800 font-medium">{epfData?.epf_number || "-"}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">Deduction Cycle</p>
            <p className="text-gray-800 font-medium">
              {epfData?.deduction_cycle?.charAt(0).toUpperCase() + epfData?.deduction_cycle?.slice(1) || "-"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">Employee Contribution Rate</p>
            <div className="flex flex-col items-start gap-1">
              <p className="text-gray-800 font-medium">{epfData?.employee_contribution_rate}% of Actual PF Wage</p>
              <button className="text-[12px] font-medium px-2 py-0.5 rounded bg-[#F4F6F8] hover:bg-gray-100 transition">
                View Splitup
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">Allow Employee Level Override</p>
            <p className="text-gray-800 font-medium">{epfData?.allow_employee_override ? "Yes" : "No"}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">Pro-rate Restricted PF Wage</p>
            <p className="text-gray-800 font-medium">{epfData?.pro_rate_restricted_wage ? "Yes" : "No"}</p>
          </div>

          <div className="flex items-start gap-2">
            <p className="text-gray-500 w-[240px]">Consider applicable salary components based on LOP</p>
            <p className="text-gray-800 font-medium leading-snug">
              {epfData?.consider_applicable_salary
                ? `Yes (when PF wage is less than ₹${epfData?.applicable_salary_threshold})`
                : "No"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">Eligible for ABRY Scheme</p>
            <p className="text-gray-800 font-medium">{epfData?.eligible_for_abry_scheme ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* RIGHT SIDE - Contribution Preferences */}
        <div>
          <p className="text-gray-500 mb-0.5">Contribution Preferences</p>
          <div className="flex flex-col gap-2 mt-1">
            {[
              { key: "employer_pf_contribution", label: "Employee PF contribution" },
              { key: "edli_contribution", label: "EDLI contribution" },
              { key: "admin_charges", label: "Admin charges" },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-xs">
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-full ${
                    epfData?.contribution_preferences?.[item.key]
                      ? "bg-green-50 border border-green-300 text-green-600"
                      : "bg-red-50 border border-red-300 text-red-600"
                  }`}
                >
                  {epfData?.contribution_preferences?.[item.key] ? <Check size={12} /> : <X size={12} />}
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <button className="flex items-center gap-2 text-xs text-black px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition font-medium">
          <Icon icon="basil:edit-outline" className="w-4 h-4" /> Edit EPF
        </button>
        <button
          onClick={handleDisableClick}
          disabled={loading}
          className="flex items-center gap-2 text-xs px-4 py-1.5 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition font-medium disabled:opacity-50"
        >
          <Icon icon="proicons:delete" className="w-4 h-4" />
          {loading ? "Disabling..." : "Disable EPF"}
        </button>
      </div>
    </div>
  );
};

export default EpfTab;
