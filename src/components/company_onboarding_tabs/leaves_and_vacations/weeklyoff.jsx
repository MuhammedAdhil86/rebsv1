import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { createWeeklyOff } from "../../../service/eventservice";
import { getBranchData, getShiftList } from "../../../service/staffservice";

const WeekendsAndOffDays = () => {
  const [dayType, setDayType] = useState("Half Day");

  const [weeks, setWeeks] = useState([
    { label: "Week 01", days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], full: [], half: [] },
    { label: "Week 02", days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], full: [], half: [] },
    { label: "Week 03", days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], full: [], half: [] },
    { label: "Week 04", days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], full: [], half: [] },
  ]);

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
      console.error("Error fetching branches:", error);
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
      console.error("Error fetching shifts:", error);
    }
  };

  const handleDayClick = (weekIndex, dayIndex) => {
    setWeeks(prevWeeks => {
      const newWeeks = [...prevWeeks];
      const week = { ...newWeeks[weekIndex] };

      const isFull = week.full.includes(dayIndex);
      const isHalf = week.half.includes(dayIndex);

      week.full = week.full.filter(d => d !== dayIndex);
      week.half = week.half.filter(d => d !== dayIndex);

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
      week.full.forEach(dayIndex => {
        payloadWeeklyOffs.push({
          day: week.days[dayIndex],
          type: "Specific",
          weeks: [weekIndex + 1],
          is_half_day: false,
          policy_id: selectedPolicyId,
        });
      });

      week.half.forEach(dayIndex => {
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

    console.log("Weekly Off Payload:", payload);
    try {
      await createWeeklyOff(payload);
      alert("Weekly off created successfully");
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to create weekly off");
    }
  };

  const labelClass = "text-[11px] font-normal text-gray-400 mb-1.5 block ml-1";
  const selectClass = "w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] appearance-none focus:outline-none text-gray-900 h-[40px] font-poppins";

  return (
    <div className="w-full bg-[#fcfcfc] font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-[18px] font-medium text-gray-900">Weekends and off days</h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="pl-2 pr-10 py-1 border border-gray-200 bg-white rounded-lg text-[12px] w-full sm:w-64 focus:outline-none font-poppins"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-10 w-full">

        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[45%]">
          <div className="bg-[#F7F9F9] p-4 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-[18px] font-medium text-gray-900 mb-2">Select the days</h3>
            <p className="text-[12px] text-gray-500 mb-10 leading-relaxed max-w-[280px]">
              The selected weekly off days apply to all weeks throughout the year.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

              {/* Branch */}
              <div className="relative">
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
                <ChevronDown className="absolute right-3 top-[32px] text-gray-400" size={14} />
              </div>

              {/* Year */}
              <div className="relative">
                <label className={labelClass}>Select Year</label>
                <select className={selectClass}>
                  <option>2026</option>
                </select>
                <ChevronDown className="absolute right-3 top-[32px] text-gray-400" size={14} />
              </div>

              {/* Day Type */}
              <div className="relative">
                <label className={labelClass}>Select Type</label>
                <div className="flex bg-white border border-black rounded-xl h-[40px] overflow-hidden">
                  <button
                    onClick={() => setDayType("Full Day")}
                    className={`flex-1 text-[12px] font-medium rounded-lg ${dayType === "Full Day" ? "bg-black text-white" : "text-gray-900"}`}
                  >
                    Full Day
                  </button>
                  <button
                    onClick={() => setDayType("Half Day")}
                    className={`flex-1 text-[12px] font-medium rounded-lg ${dayType === "Half Day" ? "bg-black text-white" : "text-gray-900"}`}
                  >
                    Half Day
                  </button>
                </div>
              </div>

              {/* Shift */}
              <div className="relative">
                <label className={labelClass}>Select Shift</label>
                <select
                  className={selectClass}
                  value={selectedShift}
                  onChange={(e) => {
                    const shift = shifts.find(s => (s.id || s.name) == e.target.value);
                    setSelectedShift(e.target.value);
                    setSelectedPolicyId(shift?.policies?.[0]?.id || "");
                  }}
                >
                  {shifts.map((s, idx) => (
                    <option key={idx} value={s.id || s.name}>
                      {s.name || s.shift_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-[32px] text-gray-400" size={14} />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-12">
              <button className="px-10 py-2 border border-gray-300 rounded-xl text-[13px] font-medium text-gray-900 bg-white font-poppins">
                Clear
              </button>
              <button
                onClick={handleCreate}
                className="px-10 py-2 bg-black text-white rounded-xl text-[13px] font-medium font-poppins"
              >
                Create
              </button>
            </div>
          </div>

          {/* Color legend */}
          <div className="flex items-center gap-6 mt-8 ml-2 font-poppins">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#96E0BC] rounded-md"></div>
              <span className="text-[11px] font-medium text-gray-600">Full Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#C6EBF4] rounded-md"></div>
              <span className="text-[11px] font-medium text-gray-600">Half Day</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:flex-1 bg-white p-4 sm:p-10 rounded-2xl border border-gray-200 shadow-sm min-h-[500px] overflow-x-auto font-poppins flex flex-col justify-center">
          <div className="space-y-6">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="px-2 sm:px-0"> {/* add horizontal padding */}
                <label className="text-[12px] font-medium text-gray-900 mb-2 block">{week.label}</label>
                <div className="flex justify-between gap-4 flex-wrap">
                  {week.days.map((day, dIdx) => {
                    let color = "bg-[#F4F7F8]";
                    if (week.full.includes(dIdx)) color = "bg-[#96E0BC]";
                    if (week.half.includes(dIdx)) color = "bg-[#C6EBF4]";
                    return (
                      <div
                        key={dIdx}
                        onClick={() => handleDayClick(wIdx, dIdx)}
                        className={`w-[56px] h-[56px] flex items-center justify-center rounded-xl text-[12px] font-medium text-gray-800 shadow-sm cursor-pointer ${color}`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeekendsAndOffDays;
