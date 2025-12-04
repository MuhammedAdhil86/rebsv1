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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import axiosInstance from "../service/axiosinstance";

export default function EmployeeCalendar() {
  const { state } = useLocation();
  const UUID = state?.employeeUUID || state?.employee?.uuid;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [workHourFrom, setWorkHourFrom] = useState("");
  const [workHourTo, setWorkHourTo] = useState("");
  const [workHourResult, setWorkHourResult] = useState("");
  const [regularizeMode, setRegularizeMode] = useState(false);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editDate, setEditDate] = useState(new Date());

  if (!UUID)
    return (
      <DashboardLayout>
        <div className="p-6 text-red-500 font-medium">
          ERROR: No employee UUID provided.
        </div>
      </DashboardLayout>
    );

  // Calendar navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Format time
  const cleanTime = (t) =>
    !t || t.includes("0000-01-01") ? "-" : moment(t).utc().format("hh:mm A");

  const cleanDuration = (t) =>
    !t || t.includes("0000-01-01")
      ? "0 hrs"
      : moment.utc(moment(t).diff(moment().startOf("day"))).format(
          "H hrs m mins"
        );

  // Helper: extract time for regularize fields
  // Accepts:
  // - full ISO datetime (e.g. "2025-10-23T09:15:00Z") -> "09:15"
  // - zero-date with time (e.g. "0000-01-01T09:19:05Z") -> "09:19"
  // - empty string or "0000...T00:00:00Z" or null -> ""
  const extractTimeForInput = (dateString) => {
    if (!dateString) return "";
    // normalize empty string case
    if (dateString === "") return "";
    // match time portion
    const m = dateString.match(/T(\d{2}):(\d{2}):(\d{2})/);
    if (!m) return "";
    const hh = m[1];
    const mm = m[2];
    const ss = m[3];
    // treat midnight 00:00:00 as empty (no meaningful out)
    if (hh === "00" && mm === "00" && ss === "00") return "";
    return `${hh}:${mm}`; // "HH:mm" format for <input type="time">
  };

  // Fetch Attendance API
  useEffect(() => {
    const year = format(currentMonth, "yyyy");
    const month = format(currentMonth, "MM");

    const fetchAttendance = async () => {
      try {
        const res = await axiosInstance.get(
          `/admin/staff/workhours/${month}/${year}/${UUID}`
        );
        console.log("Fetched Attendance Data:", res.data.data);
        setAttendanceData(res.data.data || []);
      } catch (err) {
        console.error("CALENDAR API ERROR:", err);
      }
    };
    fetchAttendance();
  }, [currentMonth]);

  const selectedDayData =
    attendanceData.find((item) =>
      isSameDay(new Date(item.date), selectedDate)
    ) || null;

  console.log("Selected Day Data:", selectedDayData);

  // Pie chart data
  useEffect(() => {
    const present = attendanceData.filter((d) => d.record_type === "Present")
      .length;
    const absent = attendanceData.filter((d) => d.record_type === "Absent")
      .length;
    const weeklyOff = attendanceData.filter(
      (d) => d.record_type === "Weekly Off"
    ).length;

    const pieArray = [
      { name: "Present", value: present, color: "#10B981" },
      { name: "Absent", value: absent, color: "#EF4444" },
      { name: "Weekly Off", value: weeklyOff, color: "#6B7280" },
    ];
    console.log("Pie Chart Data:", pieArray);
    setPieData(pieArray);
  }, [attendanceData]);

  // Work hour API
  const handleShowWorkHours = async () => {
    if (!workHourFrom || !workHourTo) {
      alert("Please select both From and To dates");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/admin/staff/daterange/workhours/${UUID}`,
        {
          from: workHourFrom,
          to: workHourTo,
        }
      );
      console.log("Work Hour API Response:", res.data);
      if (res.data.status_code === 200) {
        setWorkHourResult(res.data.data);
      } else {
        setWorkHourResult("Error fetching work hours");
      }
    } catch (err) {
      console.error("WORK HOUR API ERROR:", err);
      setWorkHourResult("Error fetching work hours");
    }
  };

  const handleRegularize = async () => {
    const dateToSend = editDate || new Date();

    // require at least one of check-in or check-out to be provided
    if (!editCheckIn && !editCheckOut) {
      alert("Please enter at least check-in or check-out time to regularize");
      return;
    }

    // Build ISO datetimes (or empty string)
    const inIso = editCheckIn
      ? `${format(dateToSend, "yyyy-MM-dd")}T${editCheckIn}:00Z`
      : "";
    const outIso = editCheckOut
      ? `${format(dateToSend, "yyyy-MM-dd")}T${editCheckOut}:00Z`
      : "";

    try {
      // Note: original endpoint used POST `/admin/staff/regularize/${UUID}`
      // If your backend expects a different path (`attendance/regularize/{uuid}/{date}` PUT) change accordingly.
      const res = await axiosInstance.post(
        `/admin/staff/regularize/${UUID}`,
        {
          date: format(dateToSend, "yyyy-MM-dd"),
          check_in: inIso,
          check_out: outIso,
        }
      );

      if (res.data.status_code === 200) {
        alert("Work hours regularized successfully!");
        setRegularizeMode(false);
        // Refresh attendance data
        const year = format(currentMonth, "yyyy");
        const month = format(currentMonth, "MM");
        const refreshRes = await axiosInstance.get(
          `/admin/staff/workhours/${month}/${year}/${UUID}`
        );
        setAttendanceData(refreshRes.data.data || []);
      } else {
        alert("Error regularizing work hours");
      }
    } catch (err) {
      console.error("REGULARIZE API ERROR:", err);
      alert("Error regularizing work hours");
    }
  };

  // Calendar Header
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

  <h2 className="text-[14px] font-medium">
    {format(currentMonth, "MMMM yyyy")}
  </h2>
</div>

  );

  const renderDays = () => {
    const days = [];
    const start = startOfWeek(monthStart);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-600 text-[12px]">
          {format(addDays(start, i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

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
            : apiDay.in === "" || !apiDay.in
            ? "bg-red-500"
            : "bg-green-500"
          : "";

        days.push(
          <div
            key={day.getTime()}
            className={`border h-24 p-1 cursor-pointer 
              ${!isSameMonth(day, monthStart) ? "bg-gray-100" : ""} 
              ${isSameDay(day, selectedDate) ? "bg-blue-100" : ""}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="text-[12px] font-medium">{format(day, "d")}</div>
            {apiDay && (
              <span className={`text-[10px] px-1 rounded text-white ${statusColor}`}>
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
        {/* TOP SECTION */}
        <div className="flex gap-4">
          {/* Calendar */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          {/* Regularize / Work Hours */}
          <div className="w-80 bg-white p-4 rounded-xl shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium text-[14px]">{format(selectedDate, "MMMM d, yyyy")}</h2>
              <button
                className={`px-2 py-1 rounded text-[12px] ${regularizeMode ? 'bg-black text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-600'}`}
                onClick={() => {
                  if (regularizeMode) {
                    // toggle off
                    setRegularizeMode(false);
                  } else {
                    // toggle on and prefill safely
                    setRegularizeMode(true);
                    setEditCheckIn(extractTimeForInput(selectedDayData?.in));
                    setEditCheckOut(extractTimeForInput(selectedDayData?.out));
                    setEditDate(selectedDate || new Date());
                  }
                }}
              >
                {regularizeMode ? "Cancel" : "Regularize"}
              </button>
            </div>

            {!regularizeMode ? (
              <>
                <p className="text-gray-500 text-[12px]">{selectedDayData ? selectedDayData.record_type : "No Data"}</p>

                <div className="flex justify-between mt-2 text-[12px]">
                  <div>
                    <p className="text-gray-500">Check-in</p>
                    <p>{selectedDayData ? cleanTime(selectedDayData.in) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Check-out</p>
                    <p>{selectedDayData ? cleanTime(selectedDayData.out) : "-"}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-2 text-[12px]">
                  <div>
                    <p className="text-gray-500">Total Hours</p>
                    <p>{cleanDuration(selectedDayData?.total_hour)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Overtime</p>
                    <p>{cleanDuration(selectedDayData?.overtime_hr)}</p>
                  </div>
                </div>

                <a className="text-green-600 text-[12px] mt-2 block">View Full Details</a>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-gray-500">Select Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-[12px]"
                  value={format(editDate, "yyyy-MM-dd")}
                  onChange={(e) => setEditDate(new Date(e.target.value))}
                />

                <label className="text-[12px] text-gray-500">Check-in</label>
                <input
                  type="time"
                  className="border rounded px-2 py-1 text-[12px]"
                  value={editCheckIn}
                  onChange={(e) => setEditCheckIn(e.target.value)}
                />

                <label className="text-[12px] text-gray-500">Check-out</label>
                <input
                  type="time"
                  className="border rounded px-2 py-1 text-[12px]"
                  value={editCheckOut}
                  onChange={(e) => setEditCheckOut(e.target.value)}
                />

                <button
                  className="mt-2 w-full bg-green-500 text-white text-[12px] py-1 rounded hover:bg-green-600"
                  onClick={handleRegularize}
                >
                  Submit Regularization
                </button>
              </div>
            )}

            <hr />

            {/* Work Hours */}
            <div>
              <p className="text-gray-500 text-[12px]">Calculate Work Hours</p>
              <div className="flex gap-2 mt-1">
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-1/2 text-[12px]"
                  value={workHourFrom}
                  onChange={(e) => setWorkHourFrom(e.target.value)}
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-1/2 text-[12px]"
                  value={workHourTo}
                  onChange={(e) => setWorkHourTo(e.target.value)}
                />
              </div>
              <button
                className="mt-2 w-full bg-black text-white text-[12px] py-1 rounded hover:bg-gray-600"
                onClick={handleShowWorkHours}
              >
                Show Work Hours
              </button>

              {workHourResult && (
                <p className="text-[12px] mt-2 font-medium">Total Work Hours: {workHourResult}</p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex gap-4">
          {/* Timeline */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md overflow-y-auto">
            <h2 className="text-[14px] font-medium mb-4 text-center">Employee Timeline</h2>
            {attendanceData.map((entry, i) => (
              <div key={i} className="border-l pl-4 mb-4 relative">
                <span className="absolute -left-3 w-4 h-4 rounded-full bg-green-500"></span>
                <p className="text-[12px] font-medium">{entry.record_type}</p>
                <p className="text-[12px] text-gray-600">{moment(entry.date).format("MMM D, YYYY")}</p>
                <p className="text-[12px] text-gray-600">In: {cleanTime(entry.in)}</p>
                <p className="text-[12px] text-gray-600">Out: {cleanTime(entry.out)}</p>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="flex-1 bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-[14px] font-medium mb-4 text-center">Attendance Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
