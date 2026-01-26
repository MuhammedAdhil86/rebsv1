import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const WeekendsAndOffDays = () => {
  const [dayType, setDayType] = useState("Half Day");

  const weeks = [
    { label: "Week 01", days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], full: [0], half: [] },
    { label: "Week 02", days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], full: [0], half: [6] },
    { label: "Week 03", days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], full: [0], half: [] },
    { label: "Week 04", days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], full: [0], half: [6] },
  ];

  const labelClass =
    "text-[11px] font-normal text-gray-400 mb-1.5 block ml-1";
  const selectClass =
    "w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-[12px] appearance-none focus:outline-none text-gray-800 h-[40px]";

  return (
    <div className="w-full bg-[#fcfcfc]  font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-[18px] font-medium text-gray-900">
          Weekends and off days
        </h2>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="pl-2 pr-10 py-1 border border-gray-200 bg-white rounded-lg text-[12px] w-full sm:w-64 focus:outline-none"
          />
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
            size={16}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[45%]">
          <div className="bg-[#F7F9F9] p-4 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-[18px] font-medium text-gray-900 mb-2">
              Select the days
            </h3>
            <p className="text-[12px] text-gray-500 mb-10 leading-relaxed max-w-[280px]">
              The selected weekly off days apply to all weeks throughout the year.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="relative">
                <label className={labelClass}>Select Branch</label>
                <select className={selectClass}>
                  <option>Head office</option>
                </select>
                <ChevronDown className="absolute right-3 top-[32px] text-gray-400" size={14} />
              </div>

              <div className="relative">
                <label className={labelClass}>Select Year</label>
                <select className={selectClass}>
                  <option>2025</option>
                </select>
                <ChevronDown className="absolute right-3 top-[32px] text-gray-400" size={14} />
              </div>

              <div className="relative">
                <label className={labelClass}>Select Type</label>
                <div className="flex  bg-white border border-black rounded-xl h-[40px] overflow-hidden">
                  <button
                    onClick={() => setDayType("Full Day")}
                    className={`flex-1 text-[12px] font-medium rounded-lg ${
                      dayType === "Full Day"
                        ? "bg-black text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Full Day
                  </button>
                  <button
                    onClick={() => setDayType("Half Day")}
                    className={`flex-1 text-[12px] font-medium rounded-lg ${
                      dayType === "Half Day"
                        ? "bg-black text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Half Day
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className={labelClass}>Select Shift</label>
                <select className={selectClass}>
                  <option>Weekend Shift</option>
                </select>
                <ChevronDown className="absolute right-3 top-[32px] text-gray-400" size={14} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-12">
              <button className="px-10 py-2 border border-gray-300 rounded-xl text-[13px] font-medium text-gray-900 bg-white">
                Clear
              </button>
              <button className="px-10 py-2 bg-black text-white rounded-xl text-[13px] font-medium">
                Create
              </button>
            </div>
          </div>

          {/* Color legend */}
          <div className="flex items-center gap-6 mt-8 ml-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#96E0BC] rounded-md"></div>
              <span className="text-[11px] font-medium text-gray-600">
                Full Day
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#C6EBF4] rounded-md"></div>
              <span className="text-[11px] font-medium text-gray-600">
                Half Day
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:flex-1 bg-white p-4  rounded-2xl border border-gray-200 shadow-sm min-h-[500px] overflow-x-auto">
          <div className="space-y-2 ">
            {weeks.map((week, wIdx) => (
              <div key={wIdx}>
                <label className="text-[12px] font-medium text-gray-900 mb-2 block">
                  {week.label}
                </label>
                <div className="flex gap-4">
                  {week.days.map((day, dIdx) => {
                    let color = "bg-[#F4F7F8]";
                    if (week.full.includes(dIdx)) color = "bg-[#96E0BC]";
                    if (week.half.includes(dIdx)) color = "bg-[#C6EBF4]";
                    return (
                      <div
                        key={dIdx}
                        className={`w-[56px] h-[56px] flex items-center justify-center rounded-xl text-[12px] font-medium text-gray-800 shadow-sm ${color}`}
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
