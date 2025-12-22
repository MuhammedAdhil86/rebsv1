// src/components/shifts/RegularShiftPolicyCard.jsx
import React from "react";
import { FiMenu } from "react-icons/fi";

const RegularShiftPolicyCard = ({ className }) => (
  <div className={`bg-white rounded-xl p-4 shadow-sm flex-1 ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <div className="text-[14px] text-gray-800">Regular Shift Policy Details</div>
      <button className="text-gray-400"><FiMenu size={20} /></button>
    </div>
    <div className="space-y-3 text-sm overflow-auto">
      <div className="flex justify-between">
        <span className="text-gray-500">Total Work hours</span>
        <span className="font-medium text-gray-800">08:00:00 hrs</span>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-green-600 font-medium text-[12px]">IN</span>
          <span className="font-medium text-[12px] text-gray-800">09:00 AM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500 font-medium text-[12px]">OUT</span>
          <span className="font-medium text-gray-800 text-[12px]">06:00 PM</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 text-[12px]">Break</span>
        <span className="font-medium text-gray-800 text-[12px]">01:00 PM - 01:30 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 text-[12px]">Delay</span>
        <span className="font-medium text-gray-800 text-[12px]">09:01 AM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-yellow-600 font-medium text-[12px]">Late</span>
        <span className="font-medium text-gray-800 text-[12px]">10:01 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-red-500 font-medium text-[12px]">Half Day</span>
        <span className="font-medium text-gray-800 text-[12px]">12:01 PM</span>
      </div>
    </div>
  </div>
);

export default RegularShiftPolicyCard;
