import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useEmployeeStore from "../store/employeeStore";

function DatePicker() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const scrollRef = useRef(null);
  const { setSelectedDay } = useEmployeeStore();
  const VISIBLE_COUNT = 8;

  useEffect(() => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        date: d.getDate(),
        fullDate: d,
      });
    }

    setCalendarDays(days);
    const formatted = days[0].fullDate.toISOString().split("T")[0];
    setSelectedDay(formatted);
  }, [setSelectedDay]);

  const handleDateClick = (item, idx) => {
    setSelectedIndex(idx);
    const formatted = item.fullDate.toISOString().split("T")[0];
    setSelectedDay(formatted);
  };

  const handleCalendarIconClick = () => {
    setShowCalendar((prev) => !prev);
  };

  const handleCalendarChange = (date) => {
    if (!date) return;
    const selected = date.toISOString().split("T")[0];
    const idx = calendarDays.findIndex(
      (d) => d.fullDate.toISOString().split("T")[0] === selected
    );

    if (idx !== -1) {
      setSelectedIndex(idx);
      setSelectedDay(selected);
      const button = scrollRef.current?.querySelectorAll("button")[idx];
      if (button) button.scrollIntoView({ behavior: "smooth", inline: "center" });
    } else {
      alert("Date not in the past 30 days!");
    }
    setShowCalendar(false);
  };

  return (
    <div className="relative flex items-center bg-[#f9fafb] rounded-xl overflow-hidden w-full px-5">
      {/* Calendar Icon */}
      <div
        onClick={handleCalendarIconClick}
        className="flex items-center justify-center w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 rounded-full flex-shrink-0 cursor-pointer"
      >
        <Icon
          icon="solar:calendar-date-bold"
          className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-gray-600"
        />
      </div>

      {/* Date List (scrollable but fixed UI) */}
      <div
        ref={scrollRef}
        className="flex gap-[7px] overflow-x-auto flex-1 px-[4px] scrollbar-hide"
      >
        {calendarDays.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleDateClick(item, idx)}
            className={`flex flex-col items-center justify-center text-center rounded-lg transition-colors duration-200 flex-shrink-0
              ${
                idx === selectedIndex
                  ? "bg-black text-white"
                  : "bg-white text-gray-800 border border-gray-200 hover:border-gray-300"
              }
              w-[60px] h-[55px] sm:w-[65px] sm:h-[60px] md:w-[87px] md:h-[65px]
            `}
          >
            <span className="font-poppins font-normal text-[10px] sm:text-[11px] md:text-[12px] leading-none">
              {item.day}
            </span>
            <span className="font-bold text-[16px] sm:text-[18px] md:text-[20px] leading-none mt-[3px]">
              {item.date}
            </span>
          </button>
        ))}
      </div>

      {/* Hidden Date Picker (absolute popup) */}
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-lg p-2">
          <DatePickerLib
            selected={
              calendarDays[selectedIndex]?.fullDate
                ? new Date(calendarDays[selectedIndex].fullDate)
                : new Date()
            }
            onChange={handleCalendarChange}
            maxDate={new Date()} // ✅ prevents future dates
            minDate={new Date(new Date().setDate(new Date().getDate() - 29))} // only past 30 days
            inline
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;
