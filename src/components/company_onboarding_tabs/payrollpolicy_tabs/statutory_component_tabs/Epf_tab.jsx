import React from "react";
import { Check, X } from "lucide-react";
import { Icon } from "@iconify/react";

const EpfTab = ({ onDisable }) => {
  return (
    <div className="rounded-xl">
      <h2 className="font-semibold text-gray-800 mb-4 text-[14px]">
        Employee’s Provident Fund
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-y-5 gap-x-10">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">EPF Number</p>
            <p className="text-gray-800 font-medium">KR/ERN/4646/446</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">Deduction Cycle</p>
            <p className="text-gray-800 font-medium">Monthly</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">
              Employee Contribution Rate
            </p>
            <div className="flex flex-col items-start gap-1">
              <p className="text-gray-800 font-medium">12% of Actual PF Wage</p>
              <button className="text-[12px] font-medium px-2 py-0.5 rounded bg-[#F4F6F8] hover:bg-gray-100 transition">
                View Splitup
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">
              Allow Employee Level Override
            </p>
            <p className="text-gray-800 font-medium">No</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">
              Pro-rate Restricted PF Wage
            </p>
            <p className="text-gray-800 font-medium">No</p>
          </div>

          <div className="flex items-start gap-2">
            <p className="text-gray-500 w-[240px]">
              Consider applicable salary components based on LOP
            </p>
            <p className="text-gray-800 font-medium leading-snug">
              Yes (when PF wage is less than ₹15,000)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-500 w-[240px]">Eligible for ABRY Scheme</p>
            <p className="text-gray-800 font-medium">No</p>
          </div>
        </div>

        {/* RIGHT SIDE - Contribution Preferences */}
        <div>
          <p className="text-gray-500 mb-0.5">Contribution Preferences</p>
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-50 border border-green-300 text-green-600">
                <Check size={12} />
              </span>
              <span>Employee PF contribution</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 border border-red-300 text-red-600">
                <X size={12} />
              </span>
              <span>EDLI contribution</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 border border-red-300 text-red-600">
                <X size={12} />
              </span>
              <span>Admin charges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <button className="flex items-center gap-2 text-xs text-black px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition font-medium">
          <Icon icon="basil:edit-outline" className="w-4 h-4" /> Edit EPF
        </button>
        <button
          onClick={onDisable}
          className="flex items-center gap-2 text-xs px-4 py-1.5 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition font-medium"
        >
          <Icon icon="proicons:delete" className="w-4 h-4" /> Disable EPF
        </button>
      </div>
    </div>
  );
};

export default EpfTab;
