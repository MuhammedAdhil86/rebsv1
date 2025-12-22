// src/components/shifts/ShiftDonutChart.jsx
import React from "react";

const ShiftDonutChart = ({ className }) => {
  const donutChartData = [
    { color: "#8A79F6", percentage: 48, label: "Morning Shift" },
    { color: "#FD9589", percentage: 35, label: "Evening Shift" },
    { color: "#54D1DD", percentage: 17, label: "Night Shift" },
  ];

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm flex flex-col items-center ${className}`}>
      <div className="relative w-[200px] h-[200px]">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {donutChartData.map((item, index) => {
            const arcLength = (item.percentage / 100) * circumference;
            const strokeDasharray = `${arcLength} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += arcLength;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="15"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[16px] font-medium text-black">60</span>
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2 flex-nowrap whitespace-nowrap text-[12px] font-[Poppins]">
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
