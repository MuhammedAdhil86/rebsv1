import React from "react";
import { MdTaskAlt } from "react-icons/md"; // mdi:tick-decagram alternative

const EnableEPF = ({ onEnable }) => {
  return (
    <div className="flex flex-col items-center justify-center h-72 bg-white px-4">
      {/* Heading */}
      <h1 className="text-[22px] font-medium text-center mb-5">
        Enable EPF to stay compliant and support your employees' future.
      </h1>

      {/* Content */}
      <p className="text-[12px] font-normal text-center text-gray-600 mb-5 max-w-md">
        Mandatory for organizations with 20+ employees, EPF ensures monthly retirement savings through joint employer-employee contributions.
      </p>

  {/* Button */}
<button
  onClick={onEnable} // ✅ Calls parent handler to enable EPF
  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition flex items-center justify-center gap-2 max-w-[200px] text-center"
>
  <MdTaskAlt className="text-green-500" size={24} />
  <span className="whitespace-normal text-sm font-medium">
    Enable EPF
  </span>
</button>

    </div>
  );
};

export default EnableEPF;
