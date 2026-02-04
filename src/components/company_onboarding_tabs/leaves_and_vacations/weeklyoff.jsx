import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { createWeeklyOff } from "../../../service/eventservice";
import { getBranchData, getShiftList } from "../../../service/staffservice";

const WeekendsAndOffDays = () => {
  const [dayType, setDayType] = useState("Half Day");

  // Logic Change: Initial state now starts with no days selected
  const initialWeeks = [
    {
      label: "Week 01",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      full: [],
      half: [],
    },
    {
      label: "Week 02",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      full: [],
      half: [],
    },
    {
      label: "Week 03",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      full: [],
      half: [],
    },
    {
      label: "Week 04",
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      full: [],
      half: [],
    },
  ];

  const [weeks, setWeeks] = useState(initialWeeks);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");

  useEffect(() => {
    fetchBranches();
    fetchShifts();
  }, []);

  const fetchBranches = async () => {
    try {
      const data = await getBranchData();
      setBranches(data);
      if (data.length) setSelectedBranch(data[0].id || data[0].name);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShifts = async () => {
    try {
      const data = await getShiftList();
      setShifts(data);
      if (data.length) {
        setSelectedShift(data[0].id || data[0].name);
        setSelectedPolicyId(data[0]?.policies?.[0]?.id || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Logic: Reset function
  const handleClear = () => {
    setWeeks(initialWeeks);
    setDayType("Half Day");
  };

  const handleDayClick = (weekIndex, dayIndex) => {
    setWeeks((prevWeeks) => {
      const newWeeks = [...prevWeeks];
      const week = { ...newWeeks[weekIndex] };
      const isFull = week.full.includes(dayIndex);
      const isHalf = week.half.includes(dayIndex);

      week.full = week.full.filter((d) => d !== dayIndex);
      week.half = week.half.filter((d) => d !== dayIndex);

      if (!isFull && !isHalf) {
        week.full.push(dayIndex);
      } else if (isFull) {
        week.half.push(dayIndex);
      }
      newWeeks[weekIndex] = week;
      return newWeeks;
    });
  };

  const handleCreate = async () => {
    const payloadWeeklyOffs = [];
    weeks.forEach((week, weekIndex) => {
      week.full.forEach((dayIndex) => {
        payloadWeeklyOffs.push({
          day: week.days[dayIndex],
          type: "Specific",
          weeks: [weekIndex + 1],
          is_half_day: false,
          policy_id: selectedPolicyId,
        });
      });
      week.half.forEach((dayIndex) => {
        payloadWeeklyOffs.push({
          day: week.days[dayIndex],
          type: "Specific",
          weeks: [weekIndex + 1],
          is_half_day: true,
          policy_id: selectedPolicyId,
        });
      });
    });

    const payload = {
      year: 2026,
      branch: selectedBranch,
      shift: selectedShift,
      weeklyOffs: payloadWeeklyOffs,
    };
    try {
      await createWeeklyOff(payload);
      alert("Weekly off created successfully");
    } catch (error) {
      alert("Failed to create weekly off");
    }
  };

  const labelClass = "text-[12px] font-medium text-gray-700 mb-2 block ml-1";
  const selectClass =
    "w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-[13px] appearance-none focus:outline-none text-gray-600 h-[45px] font-poppins shadow-sm";

  return (
    <div className="w-full bg-[#F4F7F9] p-6 min-h-screen font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[20px] font-semibold text-gray-900">
          Weekends and Off days
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[45%] flex flex-col">
          <div className="bg-[#F8FAFB] p-8 rounded-3xl border border-gray-100 flex-grow">
            <h3 className="text-[18px] font-semibold text-gray-900 mb-1">
              Select the days
            </h3>
            <p className="text-[13px] text-gray-400 mb-8 leading-snug max-w-[300px]">
              The selected weekly off days apply to all weeks throughout the
              year.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative col-span-1">
                <label className={labelClass}>Select Branch</label>
                <select
                  className={selectClass}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  {branches.map((b, idx) => (
                    <option key={idx} value={b.id || b.name}>
                      {b.name || b.branch_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-[42px] text-gray-400"
                  size={16}
                />
              </div>

              <div className="relative col-span-1">
                <label className={labelClass}>Select Year</label>
                <select className={selectClass}>
                  <option>2025</option>
                  <option>2026</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-[42px] text-gray-400"
                  size={16}
                />
              </div>

              <div className="col-span-1">
                <label className={labelClass}>Select Type</label>
                <div className="flex bg-white border border-gray-200 rounded-xl h-[45px] p-1 shadow-sm">
                  <button
                    onClick={() => setDayType("Full Day")}
                    className={`flex-1 text-[13px] font-medium rounded-lg transition-all ${dayType === "Full Day" ? "bg-black text-white" : "text-gray-900"}`}
                  >
                    Full Day
                  </button>
                  <button
                    onClick={() => setDayType("Half Day")}
                    className={`flex-1 text-[13px] font-medium rounded-lg transition-all ${dayType === "Half Day" ? "bg-black text-white" : "text-gray-900"}`}
                  >
                    Half Day
                  </button>
                </div>
              </div>

              <div className="relative col-span-1">
                <label className={labelClass}>Select Shift</label>
                <select
                  className={selectClass}
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                >
                  {shifts.map((s, idx) => (
                    <option key={idx} value={s.id || s.name}>
                      {s.name || s.shift_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-[42px] text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-16">
              <button
                onClick={handleClear}
                className="px-10 py-2.5 border border-gray-300 rounded-xl text-[14px] font-semibold text-gray-900 bg-white hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleCreate}
                className="px-10 py-2.5 bg-black text-white rounded-xl text-[14px] font-semibold hover:bg-gray-800 transition-colors"
              >
                Create
              </button>
            </div>
          </div>

          <div className="mt-1 space-y-2 px-2">
            <p className="text-[12px] font-medium text-gray-900 mb-3">Info:</p>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#96E0BC] rounded-[4px]"></div>
              <span className="text-[12px] text-gray-500">
                Single Click on a day to select as full day
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#C6EBF4] rounded-[4px]"></div>
              <span className="text-[12px] text-gray-500">
                Double Click on a day to select as half day
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#F4F7F8] rounded-[4px]"></div>
              <span className="text-[12px] text-gray-500">
                Triple Click on a day to remove the allocation
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[55%] bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[550px]">
          <div className="space-y-8">
            {weeks.map((week, wIdx) => (
              <div key={wIdx}>
                <label className="text-[13px] font-bold text-gray-900 mb-3 block">
                  {week.label}
                </label>
                <div className="flex justify-between items-center">
                  {week.days.map((day, dIdx) => {
                    let color = "bg-[#F4F7F8]";
                    if (week.full.includes(dIdx)) color = "bg-[#96E0BC]";
                    if (week.half.includes(dIdx)) color = "bg-[#C6EBF4]";
                    return (
                      <div
                        key={dIdx}
                        onClick={() => handleDayClick(wIdx, dIdx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl text-[13px] font-medium text-gray-700 cursor-pointer transition-all ${color}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-8 mt-10 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#96E0BC] rounded-lg"></div>
              <span className="text-[12px] font-medium text-gray-600">
                Full Day
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#C6EBF4] rounded-lg"></div>
              <span className="text-[12px] font-medium text-gray-600">
                Half Day
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#F4F7F8] rounded-lg"></div>
              <span className="text-[12px] font-medium text-gray-600">
                Normal Working Day
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekendsAndOffDays;
