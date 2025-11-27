import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useEmployeeStore from "../store/employeeStore";

function DatePicker() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const scrollRef = useRef(null);
  const { setSelectedDay } = useEmployeeStore();

  const BUTTON_WIDTH = 75;
  const BUTTON_GAP = 8;
  const VISIBLE_COUNT = 8;

  useEffect(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push({
        // **ONLY CHANGE HERE → short weekday**
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
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
      scrollToIndex(idx);
    } else {
      alert("Date not in the past 30 days!");
    }
    setShowCalendar(false);
  };

  const scrollToIndex = (idx) => {
    const button = scrollRef.current?.querySelectorAll("button")[idx];
    if (button) {
      button.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -(BUTTON_WIDTH + BUTTON_GAP) * VISIBLE_COUNT,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: (BUTTON_WIDTH + BUTTON_GAP) * VISIBLE_COUNT,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center bg-[#f9fafb] rounded-xl overflow-hidden mr-2 py-1">
      {/* Calendar Icon */}
      <div
        onClick={handleCalendarIconClick}
        className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer flex-shrink-0 "
      >
        <Icon icon="solar:calendar-linear" className="w-5 h-5 text-black" />
      </div>

      {/* Left Chevron */}
      <button
        onClick={scrollLeft}
        className="flex items-center justify-center flex-shrink-0 px-1"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Date Strip */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide "
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
              w-[75px] h-[60px]
            `}
          >
            <span className="font-poppins font-normal text-[12px] leading-none">
              {item.day}
            </span>
            <span className="font-semibold text-[16px] leading-none mt-1">
              {item.date}
            </span>
          </button>
        ))}
      </div>

      {/* Right Chevron */}
      <button
        onClick={scrollRight}
        className="flex items-center justify-center flex-shrink-0 px-1"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 " />
      </button>

      {/* Black & White Date Picker */}
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-lg p-2">
          <DatePickerLib
            selected={
              calendarDays[selectedIndex]?.fullDate
                ? new Date(calendarDays[selectedIndex].fullDate)
                : new Date()
            }
            onChange={handleCalendarChange}
            maxDate={new Date()}
            minDate={new Date(new Date().setDate(new Date().getDate() - 29))}
            inline
            calendarClassName="bg-white text-black border border-gray-300 rounded-lg"
            dayClassName={() =>
              "hover:bg-black hover:text-white transition-colors rounded"
            }
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;
