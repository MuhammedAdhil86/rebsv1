import React from "react";
import useShiftDashboardStore from "../../../store/shiftoverviewStore";

const ShiftDonutChart = ({ className }) => {
  const { shiftDetails } = useShiftDashboardStore();

  const total = shiftDetails.reduce(
    (sum, s) => sum + (s.total_people || 0),
    0
  );

  const donutChartData = shiftDetails.map((shift, index) => ({
    label: shift.shift_name,
    percentage: total
      ? Math.round((shift.total_people / total) * 100)
      : 0,
    color: ["#8A79F6", "#FD9589", "#54D1DD"][index % 3],
  }));

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm flex flex-col items-center ${className}`}>
      <div className="relative w-[200px] h-[200px]">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {donutChartData.map((item, index) => {
            const arc = (item.percentage / 100) * circumference;
            const dash = `${arc} ${circumference}`;
            const dashOffset = -offset;
            offset += arc;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="15"
                strokeDasharray={dash}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[16px] font-medium">{total}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-2 text-[12px]">
        {donutChartData.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftDonutChart;
