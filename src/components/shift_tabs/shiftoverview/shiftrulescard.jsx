// src/components/shifts/ShiftRulesCard.jsx
import React from "react";
import { FiEdit } from "react-icons/fi";

const ShiftRulesCard = ({ className }) => (
  <div className={`bg-white rounded-xl p-4 pb-8 shadow-sm font-[Poppins] flex-1 ${className}`}>
    <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-200">
      <div className="text-base font-medium text-gray-800">Shift Rules and Conditions</div>
      <button className="text-gray-700 flex items-center gap-2 text-sm"><FiEdit size={18} /> Edit</button>
    </div>
    <div className="space-y-4 overflow-auto">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-normal pb-3 border-b border-gray-200 pt-5 font-[Poppins]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          <span className="text-gray-600 text-[12px]">Effective Date :</span>
          <span className="text-gray-800 text-[12px]">01 Jan 2025 - 31 Dec 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          <span className="text-gray-600 text-[12px]">Regularization :</span>
          <span className="text-gray-800 text-[12px]">04 / Month</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          <span className="text-gray-600 text-[12px]">Attendance Policy Count :</span>
          <span className="text-gray-800 text-[12px]">01 Policy</span>
        </div>
      </div>
      <div className="space-y-2 pt-1 text-sm font-medium">
        <div className="grid grid-cols-3 items-center">
          <span className="text-green-500 text-[12px]">04</span>
          <span className="text-green-500 text-[12px]">Delay</span>
          <span className="text-red-500 text-[12px]">01 Half Day</span>
        </div>
        <div className="grid grid-cols-3 items-center text-[12px]">
          <span className="text-orange-400">02</span>
          <span className="text-orange-400">Late</span>
          <span className="text-red-500">01 Half Day</span>
        </div>
        <div className="grid grid-cols-3 items-center text-[12px]">
          <span className="text-red-500">00</span>
          <span className="text-red-500">Half Day</span>
          <span className="text-red-500">01 Half Day</span>
        </div>
      </div>
    </div>
  </div>
);

export default ShiftRulesCard;
