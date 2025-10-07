import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LogTable from "../../tables/logtable"; // Your log table component

const LogDetails = () => {
  const [selectedDay, setSelectedDay] = useState("01");
  const scrollRef = useRef(null);

  // Generate 30 days dynamically
  const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => {
    const date = (i + 1).toString().padStart(2, "0");
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = dayNames[i % 7];
    return { day, date };
  });

  // Scroll function
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 90; // width + gap of one button
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Dummy log data
  const EMPLOYEES = [
    {
      name: "Aswin Lal",
      role: "Designer",
      device: "Nothing(A1N44)",
      time: "April 30 2025, 8:30",
      location: "NON",
      distance: "NON",
      status: "Logout",
      img: "https://randomuser.me/api/portraits/men/10.jpg",
    },
    {
      name: "Aleena Eldhose",
      role: "Senior Developer",
      device: "Nothing(A1N44)",
      time: "April 30 2025, 8:30",
      location: "NON",
      distance: "NON",
      status: "Logout",
      img: "https://randomuser.me/api/portraits/women/20.jpg",
    },
    {
      name: "Greeshma b",
      role: "Junior Developer",
      device: "Samsung(SM-S355B)",
      time: "April 30 2025, 8:30",
      location: "NON",
      distance: "NON",
      status: "Login",
      img: "https://randomuser.me/api/portraits/women/30.jpg",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 rounded-b-2xl  ">
      {/* Calendar / Date Part */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 overflow-hidden">
          {/* Left Chevron */}
        <button
          onClick={() => scroll("left")}
          className="flex items-center justify-center w-7 h-7  rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 " />
        </button>
        {/* Calendar Icon */}
        <div className="flex-shrink-0 text-gray-400">
          <Icon icon="solar:calendar-date-bold" className="w-5 h-5" />
        </div>

      

        {/* Scrollable Dates */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-hidden scrollbar-hide flex-1"
        >
          {CALENDAR_DAYS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(item.date)}
              className={`flex flex-col items-center justify-center w-[75px] h-[55px] rounded-xl text-xs font-medium transition-all duration-200 flex-shrink-0 ${
                selectedDay === item.date
                  ? "bg-black text-white"
                  : "bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-300"
              }`}
            >
              <span className="text-[10px]">{item.day}</span>
              <span className="text-[14px] font-bold mt-1">{item.date}</span>
            </button>
          ))}
        </div>

        {/* Right Chevron */}
        <button
          onClick={() => scroll("right")}
          className="flex items-center justify-center w-7 h-7  rounded-full  hover:bg-gray-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Log Table */}
      <LogTable logs={EMPLOYEES} />
    </div>
  );
};

export default LogDetails;
