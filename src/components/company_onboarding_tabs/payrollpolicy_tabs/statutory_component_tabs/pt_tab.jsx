import React from "react";
import { FiExternalLink } from "react-icons/fi";

const ProfessionalTaxTab = () => {
  return (
    <div className="px-2 sm:px-4 md:px-6">
      {/* Title + description */}
      <h3 className="font-medium text-[14px] sm:text-[15px] text-gray-800 flex items-center gap-1">
        Professional Tax{" "}
        <span className="text-gray-500 font-normal text-xs sm:text-[12px]">
          (This tax is levied on an employee's income by the State Government. Tax slabs differ in each state)
        </span>
      </h3>

      {/* Content Section */}
      <div className="mt-5 space-y-5 text-sm text-gray-700">
        
        {/* PT Number */}
        <div className="flex gap-3">
          <span className="w-[150px] font-normal text-gray-600">PT Number</span>
          <button className="text-black font-medium underline hover:text-blue-600 transition">
            Update PT Number
          </button>
        </div>

        {/* State */}
        <div className="flex gap-3">
          <span className="w-[150px] font-normal text-gray-600">State</span>
          <span className="text-gray-800">Kerala</span>
        </div>

        {/* Deduction */}
        <div className="flex gap-3">
          <span className="w-[150px] font-normal text-gray-600">Deduction Cycle</span>
          <span className="text-gray-800">Half Yearly</span>
        </div>

        {/* PT Slabs */}
        <div className="flex gap-3 items-center">
          <span className="w-[150px] font-normal text-gray-600">PT Slabs</span>
          <button className="text-black font-medium underline flex items-center gap-1 hover:text-blue-600 transition">
            View Tax Slabs <FiExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Line Divider */}
      <hr className="mt-6 border-gray-200" />
    </div>
  );
};

export default ProfessionalTaxTab;
