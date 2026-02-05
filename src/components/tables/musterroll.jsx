import React, { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchEmployeeCalendar } from "../../service/employeeService";

function MusterRoll() {
  const navigate = useNavigate();

  // -------------------- STATES --------------------
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [todayDate] = useState(new Date().getDate());
  const [visibleDates, setVisibleDates] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");

  const isFullView = visibleDates === 31;

  // -------------------- STATIC LABELS --------------------
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = [2024, 2025, 2026];

  // -------------------- LOAD API DATA --------------------
  useEffect(() => {
    loadAttendance();
  }, [month, year]);

  const loadAttendance = async () => {
    const data = await fetchEmployeeCalendar(month, year);

    const formatted = data.map((emp) => {
      // Format existing attendance
      const attendance = emp.attendance.map((d) => ({
        ...d,
        in_time: convertToTime(d.in),
        out_time: convertToTime(d.out),
        total_hour:
          !d.total_hour || d.total_hour === "0000-01-01T00:00:00Z"
            ? "00:00:00"
            : convertToTimeWithSeconds(d.total_hour),
      }));

      // Fill missing days up to 31
      const filledAttendance = Array.from({ length: 31 }, (_, i) => {
        return (
          attendance[i] || {
            status: "--",
            in_time: "--",
            out_time: "--",
            total_hour: "00:00:00",
          }
        );
      });

      return {
        ...emp,
        attendance: filledAttendance,
      };
    });

    setAttendanceData(formatted);
  };

  // -------------------- DATE CONVERSIONS --------------------
  const convertToTime = (value) => {
    if (!value || value === "0000-01-01T00:00:00Z") return "--";
    const date = new Date(value);
    if (isNaN(date)) return "--";
    let h = date.getUTCHours().toString().padStart(2, "0");
    let m = date.getUTCMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const convertToTimeWithSeconds = (value) => {
    if (!value || value === "0000-01-01T00:00:00Z") return "--";
    const date = new Date(value);
    if (isNaN(date)) return "--";
    let h = date.getUTCHours().toString().padStart(2, "0");
    let m = date.getUTCMinutes().toString().padStart(2, "0");
    let s = date.getUTCSeconds().toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const calculateHourDifference = (inTime, outTime) => {
    if (!inTime || !outTime) return "--";
    if (inTime.includes("0000") || outTime.includes("0000")) return "--";

    const diff = new Date(outTime) - new Date(inTime);
    if (diff <= 0) return "--";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // -------------------- STATUS COLORS --------------------
  const getStatusClasses = (status) => {
    switch (status) {
      case "On Time":
      case "Holt Day":
        return "bg-[#00AB2E1F] text-[#00AB2E]";
      case "EARLY CHECK-IN":
        return "bg-yellow-200 text-yellow-600";
      case "Absent":
        return "bg-[#FF666833] text-[#FF6668]";
      case "Sick Leave":
        return "outline outline-1 outline-red-600 text-red-600 bg-transparent";
      case "Casual Leave":
        return "outline outline-1 outline-orange-600 text-orange-600 bg-transparent";
      case "Late":
        return "bg-[#4F4C9133] text-[#4F4C91]";
      default:
        return "bg-gray-100 text-gray-600"; // Handles "--" or missing data
    }
  };

  // -------------------- DATE HEADERS --------------------
  const dayHeaders = Array.from({ length: visibleDates }, (_, i) => {
    const day = i + 1;
    return day === todayDate ? `${day} (Today)` : day;
  });

  // -------------------- FILTER EMPLOYEES --------------------
  const filteredEmployees = attendanceData.filter((emp) =>
    emp.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // -------------------- TABLE HEADER COMPONENT --------------------
  const TableHeaderItem = ({ children }) => (
    <th className="px-4 py-3 sticky left-0 bg-white font-medium text-gray-500 text-left text-xs uppercase tracking-wider w-40 sm:w-56">
      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
        {children}
        <span className="flex flex-col ml-1">
          <ChevronUp className="w-3 h-3 -mb-1 text-gray-400" />
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </span>
      </div>
    </th>
  );

  // -------------------- UI --------------------
  return (
    <div className="bg-[#f9fafb] rounded-lg pt-0 px-4 pb-4 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <h2 className="text-base font-medium text-gray-800">Muster Roll</h2>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Month */}
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded-md px-2.5 py-1.5 text-xs bg-white"
          >
            {monthNames.map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-md px-2.5 py-1.5 text-xs bg-white"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Download */}
          <button className="bg-black text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1">
            <Download className="w-4 h-4" /> Download
          </button>

          {/* Consolidated Data */}
          <button
            onClick={() => navigate("/consoildate")}
            className="border bg-black text-white px-3 py-1.5 rounded-md text-xs"
          >
            Consolidated Data
          </button>

          {/* Search Box */}
          <div className="flex items-center gap-1 border px-2 py-1.5 rounded-md bg-gray-50 text-xs w-36 sm:w-40">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        className={`overflow-x-auto scrollbar-none rounded-lg shadow-sm bg-white ${isFullView ? "w-[1080px]" : "w-full"}`}
      >
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-white text-gray-500 text-xs uppercase">
            <tr>
              <TableHeaderItem>Name</TableHeaderItem>

              {dayHeaders.map((day, idx) => (
                <th
                  key={idx}
                  className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    typeof day === "string" && day.includes("(Today)")
                      ? "text-black font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y bg-white text-center">
            {filteredEmployees.map((emp, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {/* NAME CELL */}
                <td className="px-4 py-3 sticky left-0 bg-white text-left w-40 sm:w-56 border-r flex items-center gap-3 h-[105px]">
                  <img
                    src={emp.image || `https://i.pravatar.cc/40?img=${idx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://i.pravatar.cc/40?img=${idx + 1}`;
                    }}
                    className="w-10 h-10 rounded-full"
                    alt={emp.user_name}
                  />
                  <div>
                    <p className="font-medium text-[13px]">{emp.user_name}</p>
                  </div>
                </td>

                {/* DATE CELLS */}
                {emp.attendance.slice(0, visibleDates).map((d, i) => (
                  <td
                    key={i}
                    className={`border-r border-gray-100 ${
                      isFullView
                        ? "min-w-[120px] h-[120px]"
                        : "min-w-[100px] h-[100px]"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full space-y-1.5">
                      <span
                        className={`px-3 py-0.5 rounded text-[10px] tracking-wider ${getStatusClasses(
                          d.status,
                        )}`}
                      >
                        {d.status === "EARLY CHECK-IN" ? "EARLY" : d.status}
                      </span>

                      <span className="text-[10px] font-light text-gray-900">
                        Work hours
                      </span>

                      <span className="font-light bg-[#F4F6F8] rounded-md px-3 py-1 text-xs">
                        {d.total_hour}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SHOW ALL / BACK TO 7 BUTTONS */}
      <div className="flex justify-end mt-2">
        {visibleDates < 31 ? (
          <button
            onClick={() => setVisibleDates(31)}
            className="px-3 py-1 bg-gray-800 text-white rounded-md text-xs"
          >
            Show All Days
          </button>
        ) : (
          <button
            onClick={() => setVisibleDates(7)}
            className="px-3 py-1 bg-gray-800 text-white rounded-md text-xs"
          >
            Back to 7 Days
          </button>
        )}
      </div>
    </div>
  );
}

export default MusterRoll;
