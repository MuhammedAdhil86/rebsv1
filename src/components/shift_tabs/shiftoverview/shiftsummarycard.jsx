// src/components/shifts/ShiftSummaryCard.jsx
import React from "react";
import useShiftDashboardStore from "../../../store/shiftoverviewStore";

const ShiftSummaryCard = ({ className }) => {
  const { shiftDetails } = useShiftDashboardStore();

  return (
    <div className={`bg-white rounded-xl p-4 pb-0 shadow-sm flex-1 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="text-[14px] text-gray-800">Total Shifts</div>
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          {shiftDetails?.length || 0}
        </div>
      </div>

      <div className="space-y-3">
        {shiftDetails?.map((shift) => (
          <div key={shift.shift_name} className="flex justify-between items-center">
            <div>
              <div className="text-gray-800 font-medium text-[12px]">{shift.shift_name}</div>
              <div className="text-gray-400 text-[12px]">
                {/* If time info exists in your API, use it here, otherwise keep empty */}
                {shift.in_time && shift.out_time ? `${shift.in_time} - ${shift.out_time}` : "N/A"}
              </div>
            </div>
            <div className="text-red-500 text-sm font-medium">{shift.total_people || 0} Staffs</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-right">
        <a href="#" className="text-xs text-blue-600 hover:underline font-medium">
          View all Shifts
        </a>
      </div>
    </div>
  );
};

export default ShiftSummaryCard;
