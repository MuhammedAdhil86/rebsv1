import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useEmployeeStore from "../store/employeeStore";

function DatePicker() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(29); // Default: today
  const [visibleStart, setVisibleStart] = useState(0);

  const { setSelectedDay } = useEmployeeStore();

  // Generate last 30 days ending today
  useEffect(() => {
    const today = new Date();
    const days = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "long" }), // full day name
        date: d.getDate(),
        fullDate: new Date(d),
      });
    }

    setCalendarDays(days);

    // Set today as selected
    setSelectedIndex(days.length - 1);
    const formatted = days[days.length - 1].fullDate.toISOString().split("T")[0];
    setSelectedDay(formatted);

    // Show last 8 days by default
    setVisibleStart(Math.max(days.length - 8, 0));
  }, [setSelectedDay]);

  const handleDateClick = (item, idx) => {
    setSelectedIndex(idx);
    const formatted = item.fullDate.toISOString().split("T")[0];
    setSelectedDay(formatted);
  };

  const scrollCalendar = (dir) => {
    if (dir === "left") setVisibleStart((v) => Math.max(v - 1, 0));
    else setVisibleStart((v) => Math.min(v + 1, calendarDays.length - 8));
  };

  return (
    <div className="flex items-center bg-[#f9fafb] rounded-xl overflow-hidden w-full">
      {/* Left Arrow */}
      <button
        onClick={() => scrollCalendar("left")}
        className="p-2 rounded-full hover:bg-gray-200 flex-shrink-0"
      >
        <Icon icon="mdi:chevron-left" className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
      </button>

      {/* Calendar Icon */}
      <div className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full flex-shrink-0">
        <Icon icon="solar:calendar-date-bold" className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
      </div>

      {/* Scrollable Date List */}
      <div
        className="flex gap-1 overflow-x-auto flex-1 px-2 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {calendarDays.slice(visibleStart, visibleStart + 8).map((item, idx) => (
          <button
            key={visibleStart + idx}
            onClick={() => handleDateClick(item, visibleStart + idx)}
            className={`flex flex-col items-center justify-center text-center rounded-xl transition-all duration-200 p-2 flex-shrink-0
              ${
                visibleStart + idx === selectedIndex
                  ? "bg-black text-white"
                  : "bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-300"
              }
              w-[60px] sm:w-[70px] md:w-[80px]
              h-[50px] sm:h-[55px] md:h-[60px]
            `}
            style={{ scrollSnapAlign: "center" }}
          >
            {/* Day Name - Regular Poppins */}
            <span className="font-poppins font-normal text-[10px] sm:text-[11px] md:text-[12px]">
              {item.day}
            </span>
            {/* Date - Bold 24px */}
            <span className="font-bold text-[24px]">{item.date}</span>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scrollCalendar("right")}
        className="p-2 rounded-full hover:bg-gray-200 flex-shrink-0"
      >
        <Icon icon="mdi:chevron-right" className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
      </button>
    </div>
  );
}

export default DatePicker;
