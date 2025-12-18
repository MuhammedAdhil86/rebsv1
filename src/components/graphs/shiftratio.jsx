import React from "react";

const ShiftRatioCard = ({ attendance, className }) => {
  const { total, online, delay, late, absent, early } = attendance || {};
  const safeTotal = total || 1;

  const onlinePerc = (online / safeTotal) * 100;
  const delayPerc = (delay / safeTotal) * 100;
  const latePerc = (late / safeTotal) * 100;
  const absentPerc = (absent / safeTotal) * 100;
  const earlyPerc = (early / safeTotal) * 100;

  const shifts = ["Morning", "Evening", "Night"];
  const activeShift = "Morning"; // static active tab

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm flex-1 flex flex-col h-full ${className}`}
    >
      {/* Title */}
      <div className="text-sm font-medium text-gray-800 mb-3">
        Shift Ratio
      </div>

      {/* Shift Tabs */}
      <div className="flex justify-between text-[12px] text-gray-500 mb-3 border-b border-gray-200">
        {shifts.map((shift) => (
          <div
            key={shift}
            className={`pb-1 text-center w-full font-medium text-[12px] ${
              shift === activeShift
                ? "border-b-2 border-black text-black"
                : "text-gray-400"
            }`}
          >
            {shift}
          </div>
        ))}
      </div>

      {/* Attendance Number */}
      <div className="text-2xl text-gray-900 mb-3">
        {total}{" "}
        <span className="text-[12px] text-gray-500">Attendance</span>
      </div>

      {/* Status Bar */}
      <div className="flex h-3 w-full overflow-hidden mb-3">
        <div
          className="h-full bg-green-400 first:rounded-l-full"
          style={{ width: `${onlinePerc}%` }}
        />
        <div
          className="h-full bg-yellow-400"
          style={{ width: `${delayPerc}%` }}
        />
        <div
          className="h-full bg-orange-400"
          style={{ width: `${latePerc}%` }}
        />
        <div
          className="h-full bg-red-500"
          style={{ width: `${absentPerc}%` }}
        />
        <div
          className="h-full bg-purple-600 last:rounded-r-full"
          style={{ width: `${earlyPerc}%` }}
        />
      </div>

      {/* Legend */}
      <div className="mt-auto text-xs text-gray-500 space-y-2">
        {/* First row */}
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Online {online}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span>Delay {delay}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
            <span>Late {late}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Absent {absent}</span>
          </div>
        </div>

        {/* Second row */}
        <div className="flex">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-600 rounded-full" />
            <span>Early {early}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftRatioCard;
