import React, { useState, useEffect } from "react";
import { FiPlus, FiChevronDown, FiCalendar, FiSearch } from "react-icons/fi";
import axiosInstance from "../../service/axiosinstance";

const avatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// ---------------- FILTER BAR ----------------
const FilterBar = ({ employees = [], selectedWeek, setSelectedWeek }) => {
  const [filterMode, setFilterMode] = useState("All Employees");
  const [selectedValues, setSelectedValues] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectChange = (value) => {
    setFilterMode(value);
    setSelectedValues([]);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleCheckboxChange = (option) => {
    setSelectedValues((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
    );
  };

  const getOptions = () => {
    switch (filterMode) {
      case "Designation":
        return [...new Set(employees.map((e) => e.role))];
      case "Department":
        return ["UI/UX", "Development", "QA", "HR"];
      case "Job Type":
        return ["Full‑Time", "Part‑Time", "Intern"];
      case "Branch":
        return ["Kochi", "Bangalore", "Chennai"];
      case "Division":
        return ["Design", "Tech", "Ops"];
      default:
        return [];
    }
  };

  const options = getOptions();
  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

  return (
    <div className="flex flex-wrap items-end gap-3 mb-3 p-3 mt-1 rounded-lg relative">
      {/* Staff Type */}
      <div className="min-w-[100px] w-[130px] relative">
        <label className="text-[11px] text-gray-500 mb-0.5 block">Staff Type</label>
        <div className="relative">
          <select
            value={filterMode}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-1.5 text-xs focus:outline-none focus:border-black appearance-none"
          >
            <option>All Employees</option>
            <option>Individual</option>
            <option>Designation</option>
            <option>Department</option>
            <option>Job Type</option>
            <option>Branch</option>
            <option>Division</option>
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        </div>
      </div>

      {/* Week Filter */}
      <div className="min-w-[100px] w-[130px] relative">
        <label className="text-[11px] text-gray-500 mb-0.5 block">Week</label>
        <div className="relative">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-1.5 text-xs focus:outline-none focus:border-black appearance-none"
          >
            {weeks.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        </div>
      </div>

      {/* Search box for Individual */}
      {filterMode === "Individual" && (
        <div className="min-w-[150px] w-[180px] relative">
          <label className="text-[11px] text-gray-500 mb-0.5 block">Search Employee</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full border border-gray-300 rounded-md p-1.5 pl-6 text-xs focus:outline-none focus:border-black"
            />
            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-sm max-h-32 overflow-y-auto scrollbar-none">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <label key={emp.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 cursor-pointer text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(emp.name)}
                        onChange={() => handleCheckboxChange(emp.name)}
                        className="scale-90"
                      />
                      {emp.name}
                    </label>
                  ))
                ) : (
                  <div className="p-1.5 text-xs text-gray-500 text-center">No match found</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multi-select dropdown for other modes */}
      {filterMode !== "All Employees" &&
        filterMode !== "Individual" &&
        options.length > 0 && (
          <div className="min-w-[120px] w-[160px] relative">
            <label className="text-[11px] text-gray-500 mb-0.5 block">{filterMode}</label>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full border border-gray-300 rounded-md p-1.5 text-xs cursor-pointer bg-white flex justify-between items-center"
            >
              <span className="truncate">
                {selectedValues.length > 0 ? selectedValues.join(", ") : `Select ${filterMode}`}
              </span>
              <FiChevronDown className="text-gray-400 text-xs" />
            </div>
            {showDropdown && (
              <div className="absolute mt-1 w-full bg-white z-20 border border-gray-200 rounded-md shadow-sm max-h-32 overflow-y-auto scrollbar-none">
                {options.map((option) => (
                  <label key={option} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 cursor-pointer text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="scale-90"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

      {/* From/To Date */}
      {["From","To"].map((label) => (
        <div key={label} className="min-w-[100px] w-[115px]">
          <label className="text-[11px] text-gray-500 mb-0.5 block">{label}</label>
          <div className="relative">
            <input
              type="text"
              defaultValue="09-10-2025"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              className="w-full border border-gray-300 rounded-md p-1.5 text-xs focus:outline-none focus:border-black"
            />
            <FiCalendar className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          </div>
        </div>
      ))}

      {/* Shift Type */}
      <div className="min-w-[100px] w-[115px]">
        <label className="text-[11px] text-gray-500 mb-0.5 block">Shift</label>
        <div className="relative">
          <select className="w-full border border-gray-300 rounded-md p-1.5 text-xs focus:outline-none focus:border-black appearance-none">
            <option>Select</option>
            <option>Regular</option>
            <option>Evening</option>
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        </div>
      </div>

      {/* Allocate Button */}
      <button className="bg-black text-white px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 h-8">
        <FiPlus size={12} /> Allocate Shift
      </button>
    </div>
  );
};

// ---------------- TABLE COMPONENTS ----------------
const EmployeeInfo = ({ employee }) => (
  <div className="flex items-center h-full">
    <div className="flex items-center gap-1.5">
      <input type="checkbox" className="scale-90 align-middle" />
      <div className="relative">
        <div className="w-7 h-7 bg-gray-200 overflow-hidden rounded-full">
          <img src={avatar} alt={employee.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className="text-gray-800 text-[10px] leading-tight truncate max-w-[100px]"
          title={employee.name}
        >
          {employee.name}
        </div>
        <div
          className="text-[9px] text-gray-500 truncate max-w-[100px]"
          title={employee.role}
        >
          {employee.role}
        </div>
      </div>
    </div>
  </div>
);

const ShiftCard = ({ shift }) => {
  const isRegular = shift.name === "Regular Shift";
  const isEvening = shift.name === "Evening Shift";
  const borderColor = isRegular ? "border-green-400" : isEvening ? "border-sky-400" : "border-gray-300";

  const inTime = shift.in || "00:00 AM";
  const outTime = shift.out || "00:00 PM";
  const workHours = shift.work_hours || "00:00:00";

  return (
    <div className={`w-full border ${borderColor} rounded p-[6px]  h-full flex flex-col justify-between bg-white relative text-[8px]`}>
      <button className="absolute top-1 right-1 p-[2px] bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors z-10">
        <FiPlus className="text-white text-[8px]" />
      </button>

<div className="flex justify-between items-center mb-[2px]">
  <div
    className={`truncate px-2 py-[1px] rounded-xs ${
      shift.name === "Regular Shift" ? "text-green-500 bg-green-50" :
      shift.name === "Evening Shift" ? "text-sky-500 bg-sky-50" :
      shift.name === "Office" ? "text-purple-500 bg-purple-50" :
      shift.name === "Night Shift" ? "text-orange-500 bg-orange-50" :
      "text-gray-700 bg-gray-50"
    }`}
  >
    {shift.name || "Shift"}
  </div>
</div>


      <div className="flex justify-between text-gray-700 mt-[4px] px-[2px]">
        <span className="text-gray-600">Work</span>
        <span className="text-gray-800 text-[9px]">{workHours}</span>
      </div>

      <div className="bg-gray-100 rounded mt-[2px] p-[2px]">
        <div className="flex justify-between items-center px-[2px] border-b border-gray-200">
          <span className="text-green-600 ">IN</span>
          <span>{inTime}</span>
        </div>
        <div className="flex justify-between items-center px-[2px] pt-[1px]">
          <span className="text-red-600">OUT</span>
          <span>{outTime}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[10px]">
        <span className="text-gray-500 text-[8px]">Break</span>
        <span className="text-gray-500 text-[8px]">1:00PM–1:30PM</span>
      </div>
    </div>
  );
};

const WeeklyOffCard = () => (
  <div className="w-full border border-yellow-400 bg-gray-50 rounded p-1.5 h-[95px] flex items-center justify-center relative">
    <button className="absolute top-1 right-1 p-[2px] bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors z-10">
      <FiPlus className="text-white text-[8px]" />
    </button>
    <span className="text-yellow-700 text-[9px] font-medium">Weekly Off</span>
  </div>
);

// ---------------- CALENDAR ----------------
const ShiftCalendar = ({ employees, days, selectedWeek }) => {
  const weekIndex = Number(selectedWeek?.split(" ")[1]) - 1 || 0;
  const startDay = weekIndex * 7;
  const endDay = weekIndex === 4 ? days.length : startDay + 7;
  const visibleDays = days.slice(startDay, endDay);

  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="w-full overflow-y-auto scrollbar-none rounded-xl shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[minmax(120px,_1fr)_repeat(7,_minmax(95px,_0.7fr))] text-[11px] bg-white sticky top-0 z-30 border-b">
          <div className="p-2 font-semibold text-gray-600 flex items-center gap-1 border-r bg-white">
            <input type="checkbox" className="rounded scale-90" />
            Name
          </div>
          {visibleDays.map((day, idx) => (
            <div key={`day-${startDay + idx}`} className="p-2 font-semibold text-gray-600 text-center border-r last:border-none bg-white">
              {day}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="bg-white">
          {employees.map((employee) => (
            <div key={`emp-${employee.id}`} className="grid grid-cols-[minmax(120px,_1fr)_repeat(7,_minmax(95px,_0.7fr))] text-[11px] border-b last:border-none">
              <div className="p-2 border-r">
                <EmployeeInfo employee={employee} />
              </div>
              {(employee.shifts || []).slice(startDay, endDay).map((shift, index) => (
                <div key={`shift-${employee.id}-${startDay + index}`} className="p-2 border-r last:border-none w-full">
                  {shift.type === "off" ? <WeeklyOffCard /> : <ShiftCard shift={{
                    ...shift,
                    in: shift.in || "00:00 AM",
                    out: shift.out || "00:00 PM",
                    work_hours: shift.work_hours || "00:00:00"
                  }} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------------- MAIN EXPORT ----------------
export default function AllocateShift() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [employeesData, setEmployeesData] = useState([]);
  const days = Array.from({ length: 31 }, (_, i) => `${String(i + 1).padStart(2,"0")}-Day`);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axiosInstance.get("/shifts/filtered");
        const data = response.data;

        const grouped = {};
        data.forEach((shift) => {
          const empKey = shift.name || shift.id || Math.random();
          if (!grouped[empKey]) {
            grouped[empKey] = {
              id: empKey,
              name: shift.name,
              role: shift.designation,
              shifts: Array.from({ length: 31 }, () => ({ type: "off" })),
            };
          }
          const dayIndex = new Date(shift.date).getDate() - 1;
          grouped[empKey].shifts[dayIndex] = shift.shift_type
            ? {
                type: "work",
                name: shift.shift_type || "Regular Shift",
                in: shift.in_time || "00:00 AM",
                out: shift.out_time || "00:00 PM",
                work_hours: shift.work_hours || "00:00:00"
              }
            : { type: "off" };
        });

        setEmployeesData(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setEmployeesData([]);
      }
    };

    fetchShifts();
  }, []);

  return (
    <div className="bg-[#f9fafb] p-4 rounded-lg">
      <FilterBar employees={employeesData} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />
      <ShiftCalendar employees={employeesData} days={days} selectedWeek={selectedWeek} />
    </div>
  );
}
