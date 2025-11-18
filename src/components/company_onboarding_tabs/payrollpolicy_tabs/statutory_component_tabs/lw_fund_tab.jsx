import React from "react";

const LabourWelfareFundTab = () => {
  return (
    <div className="px-2 sm:px-4 md:px-6 w-full">

      {/* Title */}
      <h3 className="font-medium text-[14px] sm:text-[15px] text-black flex items-center gap-3">
        Labour Welfare Fund{" "}
        <span className=" font-normal text-xs sm:text-[12px]">
          (Labour Welfare Fund act ensures social security and improves working)
        </span>
      </h3>

      {/* State Label */}
      <p className="mt-3 text-[11px] font-semibold text-gray-600">Kerala</p>

      {/* Content */}
      <div className="mt-3 space-y-5 text-sm text-gray-700">

        <div className="flex gap-3">
          <span className="w-[180px] font-normal text-gray-600">
            Employee’s Contribution
          </span>
          <span className="text-gray-900 font-medium">₹ 50.00</span>
        </div>

        <div className="flex gap-3">
          <span className="w-[180px] font-normal text-gray-600">
            Employer Contribution
          </span>
          <span className="text-gray-900 font-medium">₹ 50.00</span>
        </div>

        <div className="flex gap-3">
          <span className="w-[180px] font-normal text-gray-600">
            Deduction Cycle
          </span>
          <span className="text-gray-900 font-medium">Monthly</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-6 border-gray-200" />

      {/* Status + Button Row with small gap */}
      <div className="flex items-center mt-4 gap-10">

        {/* Status */}
        <div className="flex flex-col leading-tight gap-1">
          <span className="text-[10px] font-medium text-gray-500 uppercase">
            Status
          </span>
          <span className="text-[11px] font-medium text-red-500">
            Disabled
          </span>
        </div>

        {/* Enable Button */}
        <button
          className="px-5 py-[6px] text-[12px] bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Enable
        </button>
      </div>
    </div>
  );
};

export default LabourWelfareFundTab;
