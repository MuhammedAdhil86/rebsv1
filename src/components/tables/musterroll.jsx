import React, { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchEmployeeCalendar } from "../../service/employeeService";
import CustomSelect from "../../ui/customselect";

function MusterRoll() {
  const navigate = useNavigate();

  // -------------------- STATES --------------------
  const [attendanceData, setAttendanceData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");

  // Set to 31 by default since we are removing the toggle button
  const visibleDates = 31;

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

  useEffect(() => {
    loadAttendance();
  }, [month, year]);

  const loadAttendance = async () => {
    const data = await fetchEmployeeCalendar(month, year);
    const formatted = data.map((emp) => {
      const attendance = emp.attendance.map((d) => ({
        ...d,
        in_time: convertToTime(d.in),
        out_time: convertToTime(d.out),
        total_hour:
          !d.total_hour || d.total_hour === "0000-01-01T00:00:00Z"
            ? "00:00:00"
            : convertToTimeWithSeconds(d.total_hour),
      }));

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

      return { ...emp, attendance: filledAttendance };
    });
    setAttendanceData(formatted);
  };

  const convertToTime = (value) => {
    if (!value || value === "0000-01-01T00:00:00Z") return "--";
    const date = new Date(value);
    return isNaN(date)
      ? "--"
      : `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  };

  const convertToTimeWithSeconds = (value) => {
    if (!value || value === "0000-01-01T00:00:00Z") return "--";
    const date = new Date(value);
    return isNaN(date)
      ? "--"
      : `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;
  };

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
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredEmployees = attendanceData.filter((emp) =>
    emp.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-[#f9fafb] rounded-lg pt-0 px-4 pb-4 w-full font-poppins text-[12px]">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <h2 className="text-base font-medium text-gray-800">Muster Roll</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <CustomSelect
            value={month}
            onChange={(val) => setMonth(Number(val))}
            options={monthNames.map((name, index) => ({
              label: name,
              value: index + 1,
            }))}
            minWidth={120}
          />
          <CustomSelect
            value={year}
            onChange={(val) => setYear(Number(val))}
            options={years.map((y) => ({ label: y, value: y }))}
            minWidth={100}
          />
          <button className="bg-black text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1">
            <Download className="w-4 h-4" /> Download
          </button>
          <button
            onClick={() => navigate("/consoildate")}
            className="border bg-black text-white px-3 py-1.5 rounded-md text-xs"
          >
            Consolidated Data
          </button>
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

      {/* TABLE SECTION - FIXED NAME COLUMN LOGIC */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-none">
          <table className="min-w-full text-sm border-collapse table-fixed">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {/* Fixed Header Column */}
                <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left font-medium border-b border-r w-[200px] min-w-[200px]">
                  Employee Name
                </th>
                {/* Scrollable Date Headers */}
                {Array.from({ length: 31 }, (_, i) => (
                  <th
                    key={i}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-700 border-b border-r min-w-[120px]"
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredEmployees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-gray-50 group">
                  {/* Fixed Name Cell */}
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 px-4 py-3 border-r h-[100px] w-[200px] min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          emp.image || `https://i.pravatar.cc/40?img=${idx + 1}`
                        }
                        className="w-10 h-10 rounded-full border border-gray-200"
                        alt=""
                      />
                      <p className="font-medium text-gray-900 truncate">
                        {emp.user_name}
                      </p>
                    </div>
                  </td>

                  {/* Scrollable Date Cells */}
                  {emp.attendance.map((d, i) => (
                    <td
                      key={i}
                      className="px-2 py-3 border-r min-w-[120px] h-[100px]"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px]  uppercase ${getStatusClasses(d.status)}`}
                        >
                          {d.status === "EARLY CHECK-IN" ? "EARLY" : d.status}
                        </span>
                        <div className="text-center">
                          <p className="text-[11px]  bg-gray-100 rounded px-2 py-0.5 mt-0.5">
                            {d.total_hour}
                          </p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MusterRoll;
