import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useEmployeeStore from "../store/employeeStore";

function DatePicker() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleStart, setVisibleStart] = useState(0);

  const { setSelectedDay } = useEmployeeStore();

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let d = new Date(today); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        date: d.getDate(),
        fullDate: new Date(d),
      });
    }
    setCalendarDays(days);
  }, []);

  const handleDateClick = (item, idx) => {
    setSelectedIndex(idx);
    const formatted = item.fullDate.toISOString().split("T")[0];
    setSelectedDay(formatted); // ✅ update store
  };

  const scrollCalendar = (dir) => {
    if (dir === "left") setVisibleStart((v) => Math.max(v - 1, 0));
    else setVisibleStart((v) => Math.min(v + 1, calendarDays.length - 8));
  };

  return (
    <div className="flex items-center px-2 py-4 bg-gray-100 rounded overflow-hidden">
      <button onClick={() => scrollCalendar("left")} className="p-2 rounded-full hover:bg-gray-200">
        <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex items-center justify-center w-10 h-10 rounded-full">
        <Icon icon="solar:calendar-date-bold" className="w-5 h-5 text-gray-600" />
      </div>

      <div className="flex gap-2 overflow-hidden flex-1 px-2">
        {calendarDays.slice(visibleStart, visibleStart + 8).map((item, idx) => (
          <button
            key={visibleStart + idx}
            onClick={() => handleDateClick(item, visibleStart + idx)}
            className={`flex flex-col items-center justify-center w-[75px] h-[55px] rounded-xl text-xs font-medium transition-all duration-200 p-2 ${
              visibleStart + idx === selectedIndex
                ? "bg-black text-white"
                : "bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-300"
            }`}
          >
            <span className="text-[10px] ">{item.day}</span>
            <span className="text-[14px] font-bold mt-1">{item.date}</span>
          </button>
        ))}
      </div>

      <button onClick={() => scrollCalendar("right")} className="p-2 rounded-full hover:bg-gray-200">
        <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

export default DatePicker;
