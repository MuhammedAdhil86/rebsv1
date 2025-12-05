// FILE: src/pages/EmployeeCalendar.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../ui/pagelayout";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import moment from "moment";
import axiosInstance from "../service/axiosinstance";

import EmployeeTimeline from "../components/activity/timelineactivity";
import PieChartComponent from "../components/activity/piechart";
import RegularizeAndWorkHour from "../components/activity/regularizeand_workhour";

export default function EmployeeCalendar() {
  const { state } = useLocation();
  const UUID = state?.employeeUUID || state?.employee?.uuid;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);

  if (!UUID) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-500 font-medium">
          ERROR: No employee UUID provided.
        </div>
      </DashboardLayout>
    );
  }

  // Calendar navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Month boundaries
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Fix cleanTime to allow valid non-zero times
  const cleanTime = (t) => {
    if (!t || t === "0000-01-01T00:00:00Z") return "-";
    return moment(t).utc().format("hh:mm A");
  };

  // Fix cleanDuration to allow valid non-zero durations
  const cleanDuration = (t) => {
    if (!t || t === "0000-01-01T00:00:00Z") return "0 hrs";
    // total_hour/overtime_hr might be in "0000-01-01THH:MM:SSZ" format
    const durationMoment = moment.utc(t, "YYYY-MM-DDTHH:mm:ssZ");
    const hours = durationMoment.hours();
    const minutes = durationMoment.minutes();
    return `${hours} hrs ${minutes} mins`;
  };

  // Extract time for input fields
  const extractTimeForInput = (dateString) => {
    if (!dateString) return "";
    const m = dateString.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (!m) return "";
    const [hh, mm, ss] = [m[1], m[2], m[3]];
    if (hh === "00" && mm === "00" && ss === "00") return "";
    return `${hh}:${mm}`;
  };

  // Fetch monthly attendance
  const fetchAttendance = async () => {
    try {
      const year = format(currentMonth, "yyyy");
      const month = format(currentMonth, "MM");
      const res = await axiosInstance.get(
        `/admin/staff/workhours/${month}/${year}/${UUID}`
      );
      setAttendanceData(res.data.data || []);
      console.log("Attendance data for month:", month, year, res.data.data);
    } catch (err) {
      console.error("CALENDAR API ERROR:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [currentMonth, UUID]);

  const selectedDayData =
    attendanceData.find((item) =>
      isSameDay(new Date(item.date), selectedDate)
    ) || null;

  // Calendar header
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <button
          onClick={prevMonth}
          className="px-3 py-1 text-[12px] border border-gray-400 rounded-md"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="px-3 py-1 text-[12px] border border-gray-400 rounded-md"
        >
          Today
        </button>
        <button
          onClick={nextMonth}
          className="px-3 py-1 text-[12px] border border-gray-400 rounded-md"
        >
          Next
        </button>
      </div>
      <h2 className="text-[14px] font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
    </div>
  );

  // Calendar weekday labels
  const renderDays = () => {
    const days = [];
    const start = startOfWeek(monthStart);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-center font-medium text-gray-600 text-[12px]"
        >
          {format(addDays(start, i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  // Calendar cells
  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const apiDay = attendanceData.find((d) =>
          isSameDay(new Date(d.date), cloneDay)
        );

        const statusColor = apiDay
          ? apiDay.record_type === "Holiday"
            ? "bg-pink-500"
            : apiDay.record_type === "Weekly Off"
            ? "bg-gray-400"
            : apiDay.in && apiDay.in.includes("0000")
            ? "bg-red-500"
            : !apiDay.in
            ? "bg-red-500"
            : "bg-green-500"
          : "";

        // Tooltip text for hover
        const tooltipText = apiDay
          ? `Type: ${apiDay.record_type || "-"}
Check-in: ${cleanTime(apiDay.in)}
Check-out: ${cleanTime(apiDay.out)}
Total Hours: ${cleanDuration(apiDay.total_hour)}
Overtime: ${cleanDuration(apiDay.overtime_hr)}`
          : "";

        days.push(
          <div
            key={day.getTime()}
            className={`border h-24 p-1 cursor-pointer 
              ${!isSameMonth(day, monthStart) ? "bg-gray-100" : ""} 
              ${isSameDay(day, selectedDate) ? "bg-blue-100" : ""}`}
            onClick={() => setSelectedDate(cloneDay)}
            title={tooltipText} // Tooltip
          >
            <div className="text-[12px] font-medium">{format(day, "d")}</div>
            {apiDay && (
              <span
                className={`text-[10px] px-1 rounded text-white ${statusColor}`}
              >
                {apiDay.record_type}
              </span>
            )}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.getTime()} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  return (
    <DashboardLayout userName="Employee Calendar">
      <div className="px-4 pt-2">
        <h1 className="text-[14px] font-medium">Employee Attendance Calendar</h1>
        <p className="text-gray-500 text-[12px]">{format(currentMonth, "MMMM yyyy")}</p>
      </div>

      <div className="flex flex-col gap-4 p-6 bg-gray-50">
        {/* TOP SECTION: Calendar + Regularize Panel */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          <div className="w-80 bg-white p-4 rounded-xl shadow-md flex flex-col gap-4">
            <RegularizeAndWorkHour
              UUID={UUID}
              selectedDate={selectedDate}
              selectedDayData={attendanceData.find((item) =>
                isSameDay(new Date(item.date), selectedDate)
              )}
              refreshAttendance={fetchAttendance}
            />
          </div>
        </div>

        {/* BOTTOM SECTION: Timeline + Pie Chart */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
            <EmployeeTimeline
              month={currentMonth.getMonth() + 1}
              year={currentMonth.getFullYear()}
              employeeId={UUID}
            />
          </div>

          <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-[14px] font-medium mb-4 text-center">Attendance Overview</h2>
            <PieChartComponent
              month={currentMonth.getMonth() + 1}
              year={currentMonth.getFullYear()}
              employeeId={UUID}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
