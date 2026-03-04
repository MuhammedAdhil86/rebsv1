import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Gift, Plus } from "lucide-react";

const holidayTypeColors = {
  "Public Holiday": "bg-red-400",
  "Company Holiday": "bg-indigo-400",
  Optional: "bg-emerald-400",
  Regional: "bg-amber-400",
};

const STATIC_HOLIDAYS = [
  {
    date: "2026-01-01",
    name: "New Year's Day",
    type: "Public Holiday",
    location: "All Branches",
  },
  {
    date: "2026-01-26",
    name: "Republic Day",
    type: "Public Holiday",
    location: "India",
  },
  {
    date: "2026-08-15",
    name: "Independence Day",
    type: "Public Holiday",
    location: "All Branches",
  },
];

const Holidays = () => {
  // Logic: Initialize state with the 1st day of the current year/month
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const generateCalendarDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const holidayMatch = STATIC_HOLIDAYS.find((h) => h.date === dateString);
      days.push({ day: i, isHoliday: !!holidayMatch, ...holidayMatch });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-4 w-full bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Gift className="text-red-400" size={20} />
          <h1 className="text-xl font-normal text-black tracking-tight">
            Holiday Calendar
          </h1>
          <span className="text-black font-light border-l border-black/10 pl-3">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </span>
        </div>

        {/* NAVIGATION & ADD BUTTON */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-black rounded-lg hover:bg-black/80 transition-colors"
            onClick={() => alert("Add Holiday Clicked")}
          >
            <Plus size={16} className="text-white" strokeWidth={1.5} />
            <span className="text-sm font-light text-white">Add Holiday</span>
          </button>

          <div className="flex items-center gap-2 border border-black/5 rounded-lg p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-black/5 rounded transition-colors"
            >
              <ChevronLeft size={18} className="text-black" strokeWidth={1.5} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-black/5 rounded transition-colors"
            >
              <ChevronRight
                size={18}
                className="text-black"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="border border-black/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-black/5 bg-black/[0.01]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-light text-black/40 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`min-h-[110px] border-r border-b border-black/5 p-2 transition-colors ${
                day?.isHoliday ? "bg-red-50/20" : ""
              } ${!day ? "bg-black/[0.01]" : ""}`}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <span
                    className={`text-sm font-light ${day.isHoliday ? "text-red-500" : "text-black/60"}`}
                  >
                    {day.day}
                  </span>
                  {day.isHoliday && (
                    <div className="mt-2">
                      <p className="text-[11px] font-normal text-black leading-tight">
                        {day.name}
                      </p>
                      <div className="flex items-center text-[10px] text-black/30 font-light mt-1 uppercase tracking-tighter">
                        <MapPin size={10} className="mr-1" />
                        {day.location}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-6 flex flex-wrap gap-6">
        {Object.entries(holidayTypeColors).map(([key, colorClass]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
            <span className="text-[11px] font-light text-black/50 uppercase tracking-wide">
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Holidays;
