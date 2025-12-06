import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- 1. Status and Color Mapping ---
const statusColors = {
  "weekly-off": "bg-black",
  "on-time": "bg-green-500",
  "delay": "bg-yellow-400",
  "late": "bg-orange-500",
  "absent": "bg-red-500",
  "leave": "bg-purple-500",
  "on-duty": "bg-blue-500",
};

// --- 2. Hardcoded Data for January 2026 (based on the image) ---
// This data drives the exact look of the calendar image provided.
const january2026Data = {
  1: { status: "weekly-off", time: null }, 
  2: { status: "on-time", time: "08:13:55" }, 
  3: { status: "on-time", time: "08:13:55" }, 
  4: { status: "on-time", time: "08:13:55" }, 
  5: { status: "on-time", time: "08:13:55" }, 
  6: { status: "on-time", time: "08:13:55" }, 
  7: { status: "on-time", time: "08:13:55" }, 
  8: { status: "weekly-off", time: null },
  9: { status: "on-time", time: "08:13:55" },
  10: { status: "delay", time: "08:13:55" },
  11: { status: "absent", time: "00:00:00" }, 
  12: { status: "delay", time: "08:30:45" }, 
  13: { status: "on-time", time: "08:13:55" },
  14: { status: "on-time", time: "08:13:55" },
  15: { status: "weekly-off", time: null },
  16: { status: "on-time", time: "08:13:55" },
  17: { status: "on-time", time: "08:13:55" },
  18: { status: "on-time", time: "08:13:55" },
  19: { status: "on-time", time: "08:13:55" },
  20: { status: "on-time", time: "08:13:55" },
  21: { status: "on-time", time: "08:13:55" },
  22: { status: "weekly-off", time: null },
  23: { status: "on-time", time: "08:13:55" },
  24: { status: "on-time", time: "08:13:55" },
  25: { status: "on-time", time: "08:13:55" },
  26: { status: "on-time", time: "08:13:55" },
  27: { status: "on-time", time: "08:13:55" },
  28: { status: "on-time", time: "08:13:55" },
  29: { status: "weekly-off", time: null },
  30: { status: "late", time: "08:13:55" },
  31: { status: "on-duty", time: "08:13:55" }, 
};


const Activity_Tab = () => {
  const [month] = useState(new Date(2026, 0, 1)); // January 2026

  const generateCalendarDays = () => {
    const days = [];
    // Get the day of the week for the 1st of the month (0=Sun, 4=Thu for Jan 1, 2026)
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay(); 

    // 1. Empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 2. Days with data
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(); 
    for (let i = 1; i <= daysInMonth; i++) {
      const data = january2026Data[i] || { status: null, time: null }; 
      days.push({ day: i, status: data.status, time: data.time });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Dummy function for navigation buttons (since the data is static)
  const dummyNav = () => { 
    console.log("Navigation not implemented for static clone."); 
  };

  return (
    <div className="p-8 w-full bg-white" style={{ minWidth: '400px' }}>
      
      {/* Header: Month/Year and Navigation Arrows */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          JANUARY
          <span className="text-red-500 ml-2">2026</span>
        </h2>
        <div className="flex space-x-2 text-gray-700">
          <button onClick={dummyNav} className="p-2 border rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button>
          <button onClick={dummyNav} className="p-2 border rounded-full hover:bg-gray-100"><ChevronRight size={24} /></button>
        </div>
      </div>

      {/* Day of the Week Headers (SUN, MON, etc.) */}
      <div className="grid grid-cols-7 text-center mb-1 text-xs text-gray-600 font-semibold">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {calendarDays.map((day, idx) => (
          // Cell uses 'relative' to allow absolute positioning of the status ball and time
          <div 
            key={idx} 
            className="h-24 border-r border-b border-gray-200 p-1 flex flex-col items-start relative" 
          >
            {day ? (
              <>
                {/* Top Row: Day Number (Top Left) and Menu Dots (Top Right) */}
                <div className="w-full flex justify-between items-start pt-1 px-1">
                  {/* Day Number (Top Left) */}
                  <span className="text-sm font-medium">{day.day}</span>
                  
                  {/* Menu/More Icon (Top Right) */}
                  <div className="h-4 w-4 flex justify-center items-center">
                    <div className="space-y-0.5">
                      {/* Dots Icon */}
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
                </div>

                {/* Status Dot (Bottom-Left) */}
                {day.status && (
                    <div 
                        className={`absolute bottom-2 left-2 w-3 h-3 rounded-full ${statusColors[day.status]}`} 
                    ></div>
                )}

                {/* Time (Bottom-Right) */}
                {day.time && (
                    <div 
                        className="absolute bottom-2 right-2 text-xs text-gray-600 font-mono" 
                        style={{ fontSize: '0.6rem' }}
                    >
                        {day.time === "00:00:00" ? "00:00:00" : day.time} 
                    </div>
                )}
              </>
            ) : (
              // Empty cell for padding
              <div className="h-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Legend Area */}
      <div className="flex flex-wrap justify-center py-4 text-xs mt-4 border-t">
        {Object.entries(statusColors).map(([key, colorClass]) => (
          <div key={key} className="flex items-center mx-2 my-1">
            <span className={`w-3 h-3 rounded-full mr-1 ${colorClass}`}></span>
            <span className="uppercase text-gray-700 font-medium">
              {key.replace(/-/g, " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity_Tab;