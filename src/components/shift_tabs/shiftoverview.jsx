// src/pages/ShiftOverview.jsx
import React from "react";
import {
  FiPlus,
  FiUsers,
  FiClock,
  FiUserX,
  FiMenu,
  FiEdit,
} from "react-icons/fi";

import ShiftRatioCard from "../graphs/shiftratio";

// ---------------- MOCK DATA ----------------
const avatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const overviewStats = {
  totalEmployees: 134,
  totalShifts: 2,
  unallocated: 10,
};

const attendance = {
  total: 134,
  online: 86,
  delay: 12,
  late: 9,
  absent: 21,
};

const peopleList = [
  { id: 1, name: "Vishnu", role: "UI/UX Designer", date: "Only Today" },
  { id: 2, name: "Aswin Lal", role: "UI/UX Designer", date: "14 Feb" },
  { id: 3, name: "Aleena Eldhose", role: "UI/UX Designer", date: "8 Feb to 10 Feb" },
  { id: 4, name: "Greeshma b", role: "UI/UX Designer", date: "14 Feb" },
];

// ---------------- SUB COMPONENTS ----------------
const StatCard = ({ title, value, icon, bg }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-md shadow-sm ${bg} w-[215px]`}>
    <div className="p-2 rounded-full bg-black">
      {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
    </div>
    <div>
      <div className="text-[13px] text-gray-500 font-normal font-[Poppins]">{title}</div>
      <div className="text-xl font-medium text-gray-900">{value}</div>
    </div>
  </div>
);

const PersonRow = ({ person }) => (
  <div className="flex items-center justify-between py-1 border-b last:border-b-0">
    <div className="flex items-center gap-3">
      <img src={avatar} alt={person.name} className="w-7 h-7 rounded-full object-cover" />
      <div>
        <div className="text-[12px] font-medium text-gray-800 font-[Poppins]">{person.name}</div>
        <div className="text-[10px] text-gray-500 font-[Poppins]">{person.role}</div>
      </div>
    </div>
    <div className="text-xs text-red-500 font-medium">{person.date}</div>
  </div>
);

const MorningShiftCard = ({ className }) => (
  <div className={`bg-white rounded-xl p-3 shadow-sm w-full max-w-[340px] mx-auto flex-1 ${className}`}>
    <div className="flex justify-between items-start mb-2">
      <div className="text-base font-medium text-gray-800">Morning Shift</div>
      <div className="bg-green-100 text-green-600 rounded-full px-3 py-1 text-xs font-medium">20 Staffs</div>
    </div>
    <div className="space-y-0.5 overflow-auto">
      {peopleList.map((p) => (
        <PersonRow key={p.id} person={p} />
      ))}
    </div>
    <div className="mt-2 text-right">
      <a href="#" className="text-xs text-blue-600 hover:underline font-medium">View all people</a>
    </div>
  </div>
);

const RegularShiftPolicyCard = ({ className }) => (
  <div className={`bg-white rounded-xl p-4 shadow-sm flex-1 ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <div className="text-base font-medium text-gray-800">Regular Shift Policy Details</div>
      <button className="text-gray-400"><FiMenu size={20} /></button>
    </div>
    <div className="space-y-3 text-sm overflow-auto">
      <div className="flex justify-between">
        <span className="text-gray-500">Total Work hours</span>
        <span className="font-medium text-gray-800">08:00:00 hrs</span>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-green-600 font-medium text-[12px]">IN</span>
          <span className="font-medium text-[12px] text-gray-800">09:00 AM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500 font-medium text-[12px]">OUT</span>
          <span className="font-medium text-gray-800 text-[12px]">06:00 PM</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 text-[12px]">Break</span>
        <span className="font-medium text-gray-800 text-[12px]">01:00 PM - 01:30 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 text-[12px]">Delay</span>
        <span className="font-medium text-gray-800 text-[12px]">09:01 AM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-yellow-600 font-medium text-[12px]">Late</span>
        <span className="font-medium text-gray-800 text-[12px]">10:01 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-red-500 font-medium text-[12px]">Half Day</span>
        <span className="font-medium text-gray-800 text-[12px]">12:01 PM</span>
      </div>
    </div>
  </div>
);

const ShiftRulesCard = ({ className }) => (
  <div className={`bg-white rounded-xl p-4 pb-8 shadow-sm font-[Poppins] flex-1 ${className}`}>
    <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-200">
      <div className="text-base font-medium text-gray-800">Shift Rules and Conditions</div>
      <button className="text-gray-700 flex items-center gap-2 text-sm"><FiEdit size={18} /> Edit</button>
    </div>
    <div className="space-y-4 overflow-auto">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-normal pb-3 border-b border-gray-200 pt-5 font-[Poppins]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          <span className="text-gray-600 text-[12px]">Effective Date :</span>
          <span className="text-gray-800 text-[12px]">01 Jan 2025 - 31 Dec 2025</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          <span className="text-gray-600 text-[12px]">Regularization :</span>
          <span className="text-gray-800 text-[12px]">04 / Month</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          <span className="text-gray-600 text-[12px]">Attendance Policy Count :</span>
          <span className="text-gray-800 text-[12px]">01 Policy</span>
        </div>
      </div>
      <div className="space-y-2 pt-1 text-sm font-medium">
        <div className="grid grid-cols-3 items-center">
          <span className="text-green-500 text-[12px]">04</span>
          <span className="text-green-500 text-[12px]">Delay</span>
          <span className="text-red-500 text-[12px]">01 Half Day</span>
        </div>
        <div className="grid grid-cols-3 items-center text-[12px]">
          <span className="text-orange-400">02</span>
          <span className="text-orange-400">Late</span>
          <span className="text-red-500">01 Half Day</span>
        </div>
        <div className="grid grid-cols-3 items-center text-[12px]">
          <span className="text-red-500">00</span>
          <span className="text-red-500">Half Day</span>
          <span className="text-red-500">01 Half Day</span>
        </div>
      </div>
    </div>
  </div>
);

const ShiftSummaryCard = ({ className }) => {
  const shifts = [
    { name: "Morning Shift", time: "08:00 AM - 06:00 PM", staff: 25 },
    { name: "Evening Shift", time: "08:00 AM - 06:00 PM", staff: 25 },
    { name: "Night Shift", time: "08:00 AM - 06:00 PM", staff: 15 },
  ];

  return (
    <div className={`bg-white rounded-xl p-4 pb-0 shadow-sm flex-1 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="text-[16px] text-gray-800">Total Shifts</div>
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">{shifts.length}</div>
      </div>

      <div className="space-y-3">
        {shifts.map((shift) => (
          <div key={shift.name} className="flex justify-between items-center">
            <div>
              <div className="text-gray-800 font-medium text-sm">{shift.name}</div>
              <div className="text-gray-400 text-xs">{shift.time}</div>
            </div>
            <div className="text-red-500 text-sm font-medium">{shift.staff} Staffs</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-right">
        <a href="#" className="text-xs text-blue-600 hover:underline font-medium">View all Shifts</a>
      </div>
    </div>
  );
};

const ShiftDonutChart = ({ className }) => {
  const donutChartData = [
    { color: "#8A79F6", percentage: 48, label: "Morning Shift" },
    { color: "#FD9589", percentage: 35, label: "Evening Shift" },
    { color: "#54D1DD", percentage: 17, label: "Night Shift" },
  ];

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className={`bg-white rounded-xl p-3 shadow-sm flex flex-col items-center ${className}`}>
      <div className="relative w-[200px] h-[200px]">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {donutChartData.map((item, index) => {
            const arcLength = (item.percentage / 100) * circumference;
            const strokeDasharray = `${arcLength} ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += arcLength;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="15"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[16px] font-medium text-black">60</span>
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2 flex-nowrap whitespace-nowrap text-[12px] font-[Poppins]">
        {donutChartData.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- MAIN COMPONENT ----------------
export default function ShiftOverview() {
  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex flex-wrap gap-4 justify-start w-full md:w-auto">
          <StatCard title="Total Employees" value={overviewStats.totalEmployees} icon={<FiUsers />} bg="bg-[#EBFDEF]" />
          <StatCard title="Total Shifts" value={String(overviewStats.totalShifts).padStart(2, "0")} icon={<FiClock />} bg="bg-[#E8EFF9]" />
          <StatCard title="Unallocated" value={overviewStats.unallocated} icon={<FiUserX />} bg="bg-[#FFEFE7]" />
        </div>

        <div className="flex gap-2">
          <button className="bg-white text-black px-2.5 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 shadow-sm border border-gray-200">
            <FiPlus size={14} /> Create Shift
          </button>
          <button className="bg-black text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 shadow-sm">
            <FiPlus size={14} /> Create Attendance Policy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch h-full">
        {/* ---------- Column 1 ---------- */}
        <div className="space-y-5 flex flex-col h-full">
          <ShiftSummaryCard className="flex-1" />     {/* 1 */}
          <MorningShiftCard className="flex-1" />     {/* 2 */}
        </div>

        {/* ---------- Column 2 ---------- */}
        <div className="space-y-5 flex flex-col h-full">
          <ShiftRatioCard attendance={attendance} className="flex-1" />  {/* 3 */}
          <RegularShiftPolicyCard className="flex-1" />                   {/* 4 */}
        </div>

        {/* ---------- Column 3 ---------- */}
        <div className="space-y-5 flex flex-col h-full">
          <ShiftDonutChart className="flex-1" />       {/* 5 */}
          <ShiftRulesCard className="flex-1" />        {/* 6 */}
        </div>
      </div>
    </div>
  );
}
