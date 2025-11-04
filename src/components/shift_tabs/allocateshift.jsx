import React, { useState } from "react";
import { FiPlus, FiChevronDown, FiCalendar, FiSearch } from "react-icons/fi";

// ---------------- MOCK DATA ----------------
const employees = [
  {
    id: 1,
    name: "Vishnu",
    role: "UI/UX Designer",
    shifts: [
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "off" },
    ],
  },
  {
    id: 2,
    name: "Aswin Lal",
    role: "UI/UX Designer",
    shifts: [
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Evening Shift", in: "12:00 PM", out: "09:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Regular Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "off" },
    ],
  },
  {
    id: 3,
    name: "Akhil",
    role: "UI/UX Designer",
    shifts: [
      { type: "work", name: "Evening Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Evening Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Evening Shift", in: "12:00 PM", out: "09:00 PM" },
      { type: "work", name: "Evening Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Evening Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "work", name: "Evening Shift", in: "09:00 AM", out: "06:00 PM" },
      { type: "off" },
    ],
  },
];

const days = ["01-Mon", "02-Tue", "03-Wed", "04-Thu", "05-Fri", "06-Sat", "07-Sun"];
const avatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// ---------------- FILTER BAR ----------------
const FilterBar = ({ employees = [] }) => {
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
      prev.includes(option)
        ? prev.filter((v) => v !== option)
        : [...prev, option]
    );
  };

  const getOptions = () => {
    switch (filterMode) {
      case "Designation":
        return [...new Set(employees.map((e) => e.role))];
      case "Department":
        return ["UI/UX", "Development", "QA", "HR"];
      case "Job Type":
        return ["Full-Time", "Part-Time", "Intern"];
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
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-sm max-h-32 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center gap-2 p-1.5 hover:bg-gray-50 cursor-pointer text-xs text-gray-700"
                    >
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
                {selectedValues.length > 0
                  ? selectedValues.join(", ")
                  : `Select ${filterMode}`}
              </span>
              <FiChevronDown className="text-gray-400 text-xs" />
            </div>
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-sm max-h-32 overflow-y-auto">
                {options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 p-1.5 hover:bg-gray-50 cursor-pointer text-xs text-gray-700"
                  >
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

      {/* From Date - always visible */}
      <div className="min-w-[100px] w-[115px]">
        <label className="text-[11px] text-gray-500 mb-0.5 block">From</label>
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

      {/* To Date - always visible */}
      <div className="min-w-[100px] w-[115px]">
        <label className="text-[11px] text-gray-500 mb-0.5 block">To</label>
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

      {/* Shift */}
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

      {/* Allocate Shift Button */}
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
        <div className="w-7 h-7 bg-gray-200 overflow-hidden">
          <img src={avatar} alt={employee.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div>
        <div className="font-medium text-gray-800 text-[11px] leading-tight">{employee.name}</div>
        <div className="text-[9px] text-gray-500">{employee.role}</div>
      </div>
    </div>
  </div>
);

const ShiftCard = ({ shift }) => {
  const isRegular = shift.name === "Regular Shift";
  const isEvening = shift.name === "Evening Shift";
  const borderColor = isRegular
    ? "border-green-400"
    : isEvening
    ? "border-sky-400"
    : "border-gray-300";

  return (
    <div
      className={`border ${borderColor} rounded p-[7px] text-[7px] h-full flex flex-col justify-between bg-white`}
    >
      <div className="flex justify-between items-center mb-[2px]">
        <div
          className={`truncate px-[3px] py-[1px] ${
            isRegular
              ? "text-green-500 bg-green-50"
              : isEvening
              ? "text-sky-500 bg-sky-50"
              : "text-gray-700 bg-gray-50"
          }`}
        >
          {shift.name}
        </div>
        {isRegular && (
          <button className="p-[2px] bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
            <FiPlus className="text-white text-[8px]" />
          </button>
        )}
      </div>

      <div className="flex justify-between text-gray-700 mt-[4px] px-[2px]">
        <span className="text-gray-600">Work</span>
        <span className="text-gray-800 font-medium">10:01:00</span>
      </div>

      <div className="bg-gray-100 rounded mt-[2px] p-[2px]">
        <div className="flex justify-between items-center px-[2px] border-b border-gray-200">
          <span className="text-green-600 font-semibold">IN</span>
          <span>{shift.in}</span>
        </div>
        <div className="flex justify-between items-center px-[2px] pt-[1px]">
          <span className="text-red-600 font-semibold">OUT</span>
          <span>{shift.out}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[10px]">
        <span className="text-gray-500 text-[7px]">Break</span>
        <span className="text-gray-500 text-[7px]">1:00PM–1:30PM</span>
      </div>
    </div>
  );
};

const WeeklyOffCard = () => (
  <div className="border border-yellow-400 bg-gray-50 rounded p-1.5 h-full flex items-center justify-center">
    <span className="text-yellow-700 text-[9px] font-medium">Weekly Off</span>
  </div>
);

const ShiftCalendar = ({ employees, days }) => (
  <div className="overflow-x-auto">
    <div className="min-w-[800px]">
      <div className="grid grid-cols-[minmax(160px,_1fr)_repeat(7,_minmax(95px,_0.7fr))] text-[11px] bg-white rounded-t-xl border-b shadow-sm">
        <div className="p-2 font-semibold text-gray-600 flex items-center gap-1 border-r">
          <input type="checkbox" className="rounded scale-90" />
          Name
        </div>
        {days.map((day) => (
          <div key={day} className="p-2 font-semibold text-gray-600 text-center border-r last:border-none">
            {day}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-b-xl shadow-sm">
        {employees.map((employee) => (
          <div key={employee.id} className="grid grid-cols-[minmax(160px,_1fr)_repeat(7,_minmax(95px,_0.7fr))] text-[11px] border-b last:border-none">
            <div className="p-2 border-r">
              <EmployeeInfo employee={employee} />
            </div>
            {employee.shifts.map((shift, index) => (
              <div key={index} className="p-2 border-r last:border-none">
                {index === days.length - 1 ? <WeeklyOffCard /> : <ShiftCard shift={shift} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ---------------- MAIN EXPORT ----------------
export default function AllocateShift() {
  return (
    <div className="bg-[#f9fafb] p-4 rounded-lg">
      <FilterBar employees={employees} />
      <ShiftCalendar employees={employees} days={days} />
    </div>
  );
}
