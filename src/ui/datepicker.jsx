import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useEmployeeStore from "../store/employeeStore";

function DatePicker() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0);

  const { setSelectedDay } = useEmployeeStore();

  // ✅ Generate dates for the current month
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let d = new Date(today); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        fullDate: new Date(d),
      });
    }
    setCalendarDays(days);
  }, []);

  // ✅ Handle date selection
  const handleDateClick = (item, idx) => {
    setSelectedIndex(idx);
    const formatted = item.fullDate.toISOString().split("T")[0];
    setSelectedDay(formatted);
  };

  // ✅ Scroll through calendar days
  const scrollCalendar = (dir) => {
    if (dir === "left") setVisibleStart((v) => Math.max(v - 1, 0));
    else setVisibleStart((v) => Math.min(v + 1, calendarDays.length - 8));
  };

  return (
    <div className="flex items-center px-2 py-3 bg-gray-100 rounded-xl overflow-hidden w-full">
      {/* Left Arrow */}
      <button
        onClick={() => scrollCalendar("left")}
        className="p-2 rounded-full hover:bg-gray-200 flex-shrink-0"
      >
        <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-600" />
      </button>

      {/* Calendar Icon */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0">
        <Icon icon="solar:calendar-date-bold" className="w-5 h-5 text-gray-600" />
      </div>

      {/* Scrollable Date List */}
      <div
        className="flex gap-2 overflow-x-auto flex-1 px-2 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {calendarDays.slice(visibleStart, visibleStart + 8).map((item, idx) => (
          <button
            key={visibleStart + idx}
            onClick={() => handleDateClick(item, visibleStart + idx)}
            className={`flex flex-col items-center justify-center w-[70px] sm:w-[75px] md:w-[80px] h-[55px] sm:h-[60px] rounded-xl text-xs font-medium transition-all duration-200 p-2 ${
              visibleStart + idx === selectedIndex
                ? "bg-black text-white"
                : "bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-300"
            }`}
            style={{ scrollSnapAlign: "center" }}
          >
            <span className="text-[10px] sm:text-[11px]">{item.day}</span>
            <span className="text-[13px] sm:text-[14px] font-bold mt-1">{item.date}</span>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scrollCalendar("right")}
        className="p-2 rounded-full hover:bg-gray-200 flex-shrink-0"
      >
        <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

export default DatePicker;
