// src/components/shifts/ShiftSummaryCard.jsx
import React from "react";

const ShiftSummaryCard = ({ className }) => {
  const shifts = [
    { name: "Morning Shift", time: "08:00 AM - 06:00 PM", staff: 25 },
    { name: "Evening Shift", time: "08:00 AM - 06:00 PM", staff: 25 },
    { name: "Night Shift", time: "08:00 AM - 06:00 PM", staff: 15 },
  ];

  return (
    <div className={`bg-white rounded-xl p-4 pb-0 shadow-sm flex-1 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="text-[14px] text-gray-800">Total Shifts</div>
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">{shifts.length}</div>
      </div>

      <div className="space-y-3">
        {shifts.map((shift) => (
          <div key={shift.name} className="flex justify-between items-center">
            <div>
              <div className="text-gray-800 font-medium text-[12px]">{shift.name}</div>
              <div className="text-gray-400 text-[12px]">{shift.time}</div>
            </div>
            <div className="text-red-500 text-sm font-medium">{shift.staff} Staffs</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-right">
        <a href="#" className="text-xs text-blue-600 hover:underline font-medium">View all Shifts</a>
      </div>
    </div>
  );
};

export default ShiftSummaryCard;
