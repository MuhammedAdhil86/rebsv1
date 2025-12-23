import React, { useEffect } from "react";
import useShiftDashboardStore from "../../store/shiftoverviewStore";

const ShiftRatioCard = ({ className }) => {
  const {
    shiftRatios,
    fetchShiftRatios,
    selectedShiftName,
  } = useShiftDashboardStore();

  /* ---------- FETCH API ---------- */
  useEffect(() => {
    fetchShiftRatios();
  }, []);

  /* ---------- ACTIVE SHIFT ---------- */
  const activeShift =
    selectedShiftName || shiftRatios?.[0]?.shift_name;

  const shiftData = shiftRatios.find(
    (s) => s.shift_name === activeShift
  );

  /* ---------- ATTENDANCE ---------- */
  const total = shiftData?.total_attendance ?? 0;
  const online = shiftData?.ontime ?? 0;
  const delay = shiftData?.delay ?? 0;
  const late = shiftData?.late ?? 0;
  const absent = shiftData?.absent ?? 0;
  const early = 0; // API doesn’t provide early

  const safeTotal = total || 1;

  const onlinePerc = (online / safeTotal) * 100;
  const delayPerc = (delay / safeTotal) * 100;
  const latePerc = (late / safeTotal) * 100;
  const absentPerc = (absent / safeTotal) * 100;
  const earlyPerc = (early / safeTotal) * 100;

  const shifts = shiftRatios.map((s) => s.shift_name);

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm flex-1 flex flex-col h-full ${className}`}
    >
      {/* Title */}
      <div className="text-sm font-medium text-gray-800 mb-3">
        Shift Ratio
      </div>

      {/* Tabs */}
      <div className="flex justify-between text-[12px] text-gray-500 mb-10 border-b border-gray-200">
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

      {/* Attendance */}
      <div className="text-2xl text-gray-900 mb-3">
        {total}{" "}
        <span className="text-[12px] text-gray-500">Attendance</span>
      </div>

      {/* Status Bar */}
      <div className="flex h-3 w-full">
        <div
          className="h-full bg-green-400 rounded-full mr-[2px]"
          style={{ width: `${onlinePerc}%` }}
        />
        <div
          className="h-full bg-yellow-400 rounded-full mr-[2px]"
          style={{ width: `${delayPerc}%` }}
        />
        <div
          className="h-full bg-orange-400 rounded-full mr-[2px]"
          style={{ width: `${latePerc}%` }}
        />
        <div
          className="h-full bg-red-500 rounded-full mr-[2px]"
          style={{ width: `${absentPerc}%` }}
        />
        <div
          className="h-full bg-purple-600 rounded-full"
          style={{ width: `${earlyPerc}%` }}
        />
      </div>

      {/* Legend */}
      <div className="mt-auto text-xs text-gray-500 space-y-2 px-0 p-6">
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

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-purple-600 rounded-full" />
          <span>Early {early}</span>
        </div>
      </div>
    </div>
  );
};

export default ShiftRatioCard;
