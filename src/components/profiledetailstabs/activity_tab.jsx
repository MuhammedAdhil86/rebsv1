// FILE: src/components/profiledetailstabs/activity_tab.jsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../service/axiosinstance";
import RegularizeAndWorkHour from "../activity/regularizeand_workhour";
import EmployeeTimeline from "../activity/timelineactivity";
import PieChartComponent from "../activity/piechart";

// Status-to-color mapping
const statusColors = {
  "weekly-off": "bg-black",
  "on-time": "bg-green-500",
  "delay": "bg-yellow-400",
  "late": "bg-orange-500",
  "absent": "bg-red-500",
  "leave": "bg-purple-500",
  "on-duty": "bg-blue-500",
};

// Convert backend total_hour to HH:MM:SS
const formatTime = (timeString) => {
  if (!timeString) return "00:00:00";

  try {
    const date = new Date(timeString);
    const hh = String(date.getUTCHours()).padStart(2, "0");
    const mm = String(date.getUTCMinutes()).padStart(2, "0");
    const ss = String(date.getUTCSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  } catch (err) {
    console.error("Time parse error:", timeString, err);
    return "00:00:00";
  }
};

const ActivityTab = ({ employee }) => {
  const UUID = employee?.uuid;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);

  const [selectedDay, setSelectedDay] = useState(null); // clicked day
  const [modalOpen, setModalOpen] = useState(false); // modal state

  // Fetch attendance data
  useEffect(() => {
    if (!UUID) return;
    const fetchAttendance = async () => {
      try {
        const month = (currentMonth.getMonth() + 1).toString().padStart(2, "0");
        const year = currentMonth.getFullYear();
        const res = await axiosInstance.get(
          `/admin/staff/workhours/${month}/${year}/${UUID}`
        );
        setAttendanceData(res.data.data || []);
      } catch (err) {
        console.error("Attendance fetch error:", err);
      }
    };
    fetchAttendance();
  }, [UUID, currentMonth]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) days.push(null);

    // Fill days with attendance
    for (let i = 1; i <= daysInMonth; i++) {
      const dayData = attendanceData.find(d => new Date(d.date).getDate() === i) || {};
      days.push({
        day: i,
        status: dayData.record_type ? dayData.record_type.toLowerCase().replace(" ", "-") : null,
        totalHours: formatTime(dayData.total_hour),
        rawData: dayData,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Month navigation
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <div className="p-8 w-full bg-white" style={{ minWidth: "400px" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px]">
          {monthName.toUpperCase()}
          <span className="text-red-500 ml-2">{year}</span>
        </h2>
        <div className="flex space-x-2 text-gray-700">
          <button onClick={prevMonth} className="p-2 border rounded-full hover:bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} className="p-2 border rounded-full hover:bg-gray-100">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center mb-1 text-xs text-gray-600 font-semibold">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className="h-24 border-r border-b border-gray-200 p-1 flex flex-col items-start relative cursor-pointer"
            onClick={() => {
              if (day) {
                setSelectedDay(day);
                setModalOpen(true);
              }
            }}
          >
            {day ? (
              <>
                {/* Top-left: Day number, Top-right: three dots */}
                <div className="w-full flex justify-between items-start pt-1 px-1">
                  <span className="text-sm font-medium">{day.day}</span>
                  <div className="h-4 w-4 flex justify-center items-center">
                    <div className="space-y-0.5">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom-left: Status dot */}
                {day.status && (
                  <div
                    className={`absolute bottom-2 left-2 w-3 h-3 rounded-full ${statusColors[day.status]}`}
                  ></div>
                )}

                {/* Bottom-right: Total hours */}
                {day.totalHours && (
                  <div
                    className="absolute bottom-2 right-2 text-xs text-gray-600 font-mono"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {day.totalHours}
                  </div>
                )}
              </>
            ) : (
              <div className="h-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-start py-4 text-xs mt-4 border-t">
        {Object.entries(statusColors).map(([key, colorClass]) => (
          <div key={key} className="flex items-center mx-2 my-1">
            <span className={`w-3 h-3 rounded-full mr-1 ${colorClass}`}></span>
            <span className="uppercase text-gray-700 font-medium">{key.replace(/-/g, " ")}</span>
          </div>
        ))}
      </div>

      {/* Modal for selected day */}
      {modalOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl p-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                {`Details for ${selectedDay.day}-${currentMonth.getMonth()+1}-${currentMonth.getFullYear()}`}
              </h3>
              <button
                className="px-2 py-1 rounded bg-gray-500 text-white"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>

            {/* Regularize & Work Hours */}
            <RegularizeAndWorkHour
              UUID={UUID}
              selectedDate={new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDay.day)}
              selectedDayData={selectedDay.rawData}
              refreshAttendance={() => {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
              }}
            />

            <hr className="my-4" />

            {/* Timeline */}
            <EmployeeTimeline
              month={currentMonth.getMonth() + 1}
              year={currentMonth.getFullYear()}
              employeeId={UUID}
            />

            <hr className="my-4" />

            {/* Pie Chart */}
            <PieChartComponent
              month={currentMonth.getMonth() + 1}
              year={currentMonth.getFullYear()}
              employeeId={UUID}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTab;
