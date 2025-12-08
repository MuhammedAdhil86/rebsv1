// FILE: src/components/activity/ActivityTab.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format as dfFormat,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../service/axiosinstance";
import RegularizeAndWorkHour from "../activity/regularizeand_workhour";
import EmployeeTimeline from "../activity/timelineactivity";
import PieChartComponent from "../activity/piechart";
import moment from "moment";

// Status color mapping
const statusColors = {
  "weekly-off": "bg-black",
  "on-time": "bg-green-500",
  "delay": "bg-yellow-400",
  "late": "bg-orange-500",
  "absent": "bg-red-500",
  "leave": "bg-purple-500",
  "on-duty": "bg-blue-500",
};

// Map API record_type and in/out fields to our status
const mapRecordTypeToStatus = (record_type, apiDay) => {
  if (!record_type && apiDay) {
    if (apiDay.in && apiDay.out) return "on-time";
    if (!apiDay.in) return "absent";
    return null;
  }
  const t = (record_type || "").toLowerCase();
  if (t.includes("weekly")) return "weekly-off";
  if (t.includes("holiday") || t.includes("leave")) return "leave";
  if (t.includes("wfh") || t.includes("on-duty")) return "on-duty";
  if (t.includes("absent")) return "absent";
  if (t.includes("late")) return "late";
  return "on-time";
};

// Extract HH:MM:SS from ISO string
const extractTimeString = (isoOrTime) => {
  if (!isoOrTime) return null;
  const m = isoOrTime.match(/T(\d{2}):(\d{2}):(\d{2})/);
  if (m) return `${m[1]}:${m[2]}:${m[3]}`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(isoOrTime)) return isoOrTime;
  return null;
};

const ActivityTab = () => {
  const { state } = useLocation();
  const UUID = state?.employeeUUID || state?.employee?.uuid;

  const today = new Date(); // <-- default today
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const goPrev = () => setCurrentMonth((m) => subMonths(m, 1));
  const goNext = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToday = () => {
    setCurrentMonth(today);
    setSelectedDay(today);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Fetch attendance data
  useEffect(() => {
    if (!UUID) return;
    const fetchAttendance = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const year = dfFormat(currentMonth, "yyyy");
        const month = dfFormat(currentMonth, "MM");
        const res = await axiosInstance.get(`/admin/staff/workhours/${month}/${year}/${UUID}`);
        setAttendanceData(res.data.data || []);
        console.log("Attendance data for month:", month, year, res.data.data);
      } catch (err) {
        console.error("CALENDAR API ERROR:", err);
        setError("Failed to load attendance");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [currentMonth, UUID]);

  // map date -> apiDay for quick lookup
  const apiDayMap = useMemo(() => {
    const map = {};
    (attendanceData || []).forEach((d) => {
      try {
        map[dfFormat(new Date(d.date), "yyyy-MM-dd")] = d;
      } catch {}
    });
    return map;
  }, [attendanceData]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      const dayObj = { date: new Date(day) };
      const dateKey = dfFormat(day, "yyyy-MM-dd");
      const apiDay = apiDayMap[dateKey];

      if (apiDay) {
        dayObj.day = day.getDate();
        dayObj.status = mapRecordTypeToStatus(apiDay.record_type, apiDay);
        dayObj.time = extractTimeString(apiDay.in) || extractTimeString(apiDay.first_in_time);
      } else {
        dayObj.day = day.getDate();
        dayObj.status = null;
        dayObj.time = null;
      }

      dayObj.inMonth = isSameMonth(day, monthStart);
      days.push(dayObj);
      day = addDays(day, 1);
    }
    return days;
  }, [startDate, endDate, apiDayMap, monthStart]);

  const handleDayClick = (dayObj) => setSelectedDay(dayObj);

  const renderCell = (d, idx) => {
    const statusClass = d.status ? statusColors[d.status] : "";
    const faded = !d.inMonth ? "bg-gray-100" : "";
    const isSelected = selectedDay && isSameDay(d.date, selectedDay.date) ? "bg-blue-50" : "";

    return (
      <div
        key={idx}
        onClick={() => handleDayClick(d)}
        title={d.status ? `${d.status} • ${d.time || ""}` : d.time || ""}
        className={`h-24 border-r border-b border-gray-200 p-1 flex flex-col items-start relative cursor-pointer hover:bg-gray-50 transition ${faded} ${isSelected}`}
      >
        <div className="w-full flex justify-between px-1 pt-1">
          <span className="text-sm font-medium">{d.day}</span>
          <div className="space-y-0.5">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        {d.status && <div className={`absolute bottom-2 left-2 w-3 h-3 rounded-full ${statusClass}`}></div>}
        {d.time && <div className="absolute bottom-2 right-2 text-xs text-gray-600 font-mono">{d.time}</div>}
      </div>
    );
  };

  const renderTopHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold">
        {dfFormat(currentMonth, "MMMM").toUpperCase()} <span className="text-red-500 ml-2">{dfFormat(currentMonth, "yyyy")}</span>
      </h2>
      <div className="flex space-x-2">
        <button onClick={goPrev} className="p-2 border rounded-full hover:bg-gray-100"><ChevronLeft size={20} /></button>
        <button onClick={goNext} className="p-2 border rounded-full hover:bg-gray-100"><ChevronRight size={20} /></button>
        <button onClick={goToday} className="ml-2 px-3 py-1 border rounded-md text-sm">Today</button>
      </div>
    </div>
  );

  return (
    <div className="p-8 w-full bg-white" style={{ minWidth: "400px" }}>
      {renderTopHeader()}

      {/* Days Header */}
      <div className="grid grid-cols-7 text-center mb-1 text-xs text-gray-600 font-semibold">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {calendarDays.map((d, idx) => renderCell(d, idx))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center py-4 text-xs mt-4 border-t">
        {Object.entries(statusColors).map(([key, colorClass]) => (
          <div key={key} className="flex items-center mx-2 my-1">
            <span className={`w-3 h-3 rounded-full mr-1 ${colorClass}`}></span>
            <span className="uppercase text-gray-700 font-medium">{key.replace(/-/g, " ")}</span>
          </div>
        ))}
      </div>

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[520px] bg-white shadow-2xl transform transition-transform duration-400 z-50 ${selectedDay ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setSelectedDay(null)} className="absolute right-4 top-4 text-gray-500 hover:text-black text-2xl" aria-label="Close details">✕</button>
        {selectedDay && (
          <div className="p-6 overflow-y-auto h-full">
            <h2 className="text-2xl font-bold mb-2">{dfFormat(selectedDay.date, "PPP")}</h2>
            <p className="mb-4 text-sm text-gray-600">{selectedDay.status ? selectedDay.status.toUpperCase() : "No record"}</p>
            <div className="mb-6">
              <RegularizeAndWorkHour
                UUID={UUID}
                selectedDate={selectedDay.date}
                selectedDayData={apiDayMap[dfFormat(selectedDay.date, "yyyy-MM-dd")] || null}
                refreshAttendance={() => setCurrentMonth((m) => new Date(m))}
              />
            </div>
            <div className="mb-6">
              <EmployeeTimeline
                month={currentMonth.getMonth() + 1}
                year={currentMonth.getFullYear()}
                employeeId={UUID}
              />
            </div>
            <div className="mb-10">
              <PieChartComponent
                month={currentMonth.getMonth() + 1}
                year={currentMonth.getFullYear()}
                employeeId={UUID}
              />
            </div>
          </div>
        )}
      </div>

      {selectedDay && <div onClick={() => setSelectedDay(null)} className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"></div>}

      {isLoading && <div className="fixed bottom-4 left-4 bg-white px-3 py-2 rounded shadow text-sm text-gray-600">Loading attendance...</div>}
      {error && <div className="fixed bottom-4 left-4 bg-red-50 px-3 py-2 rounded shadow text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default ActivityTab;
