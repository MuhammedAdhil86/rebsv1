// src/pages/ShiftOverview.jsx
import React from "react";
import {
  FiPlus,
  FiUsers,
  FiClock,
  FiUserX,
  FiMenu,
  FiEdit, // Changed from FiEdit2 to match the new icon
} from "react-icons/fi";

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
  {
    id: 3,
    name: "Aleena Eldhose",
    role: "UI/UX Designer",
    date: "8 Feb to 10 Feb",
  },
  { id: 4, name: "Greeshma b", role: "UI/UX Designer", date: "14 Feb" },
];

const donutChartData = [
  { color: "#8B5CF6", percentage: 40, label: "Morning Shift" }, // Purple
  { color: "#F87171", percentage: 30, label: "Evening Shift" }, // Salmon/Coral
  { color: "#38BDF8", percentage: 30, label: "Night Shift" }, // Cyan
];

// ---------------- SUB COMPONENTS ----------------

const StatCard = ({ title, value, icon, iconBg, bg }) => (
  <div
    className={`flex items-center gap-4 px-5 py-4 rounded-xl shadow-sm ${bg} min-w-[200px]`}
  >
    <div className={`p-3 rounded-full ${iconBg}`}>
      {React.cloneElement(icon, { className: "w-6 h-6 text-black" })}
    </div>
    <div>
      <div className="text-sm text-gray-500 font-medium">{title}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

const PersonRow = ({ person }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-b-0">
    <div className="flex items-center gap-3">
      <img
        src={avatar}
        alt={person.name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div>
        <div className="text-[15px] font-medium text-gray-800 font-[Poppins]">
          {person.name}
        </div>
        <div className="text-[11px] text-gray-500 font-[Poppins]">
          {person.role}
        </div>
      </div>
    </div>
    <div className="text-xs text-red-500 font-medium">{person.date}</div>
  </div>
);

const MorningShiftCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div>
        <div className="text-base font-semibold text-gray-800">
          Morning Shift
        </div>
      </div>
      <div className="bg-green-100 text-green-600 rounded-full px-3 py-1 text-xs font-medium">
        20 Staffs
      </div>
    </div>
    <div className="space-y-1">
      {peopleList.map((p) => (
        <PersonRow key={p.id} person={p} />
      ))}
    </div>
    <div className="mt-3 text-right">
      <a href="#" className="text-xs text-blue-600 hover:underline font-medium">
        View all people
      </a>
    </div>
  </div>
);

const RegularShiftPolicyCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <div className="text-base font-semibold text-gray-800">
        Regular Shift Policy Details
      </div>
      <button className="text-gray-400">
        <FiMenu size={20} />
      </button>
    </div>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Total Work hours</span>
        <span className="font-medium text-gray-800">08:00:00 hrs</span>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-green-600 font-medium">IN</span>
          <span className="font-medium text-gray-800">09:00 AM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500 font-medium">OUT</span>
          <span className="font-medium text-gray-800">06:00 PM</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Break</span>
        <span className="font-medium text-gray-800">01:00 PM - 01:30 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Delay</span>
        <span className="font-medium text-gray-800">09:01 AM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-yellow-600 font-medium">Late</span>
        <span className="font-medium text-gray-800">10:01 PM</span>
      </div>
      <div className="flex justify-between">
        <span className="text-red-500 font-medium">Half Day</span>
        <span className="font-medium text-gray-800">12:01 PM</span>
      </div>
    </div>
  </div>
);
// ---------- UPDATED ShiftRulesCard ----------
const ShiftRulesCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm font-[Poppins]">
    {/* ---------- Header ---------- */}
    <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-200">
      <div className="text-base font-medium text-gray-800">
        Shift Rules and Conditions
      </div>
      <button className="text-gray-700 flex items-center gap-2 text-sm ">
        <FiEdit size={18} /> Edit
      </button>
    </div>

    <div className="space-y-4">
      {/* ✅ Top rule info section — single line layout with bottom border */}
 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-normal pb-3 border-b border-gray-200 pt-5 font-[Poppins]">
  <div className="flex items-center gap-2">
    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
    <span className="text-gray-600 font-[Poppins]">Effective Date :</span>
    <span className="text-gray-800 font-[Poppins]">
      01 Jan 2025 - 31 Dec 2025
    </span>
  </div>

  <div className="flex items-center gap-2">
    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
    <span className="text-gray-600 font-[Poppins]">Regularization :</span>
    <span className="text-gray-800 font-[Poppins]">04 / Month</span>
  </div>

  <div className="flex items-center gap-2">
    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
    <span className="text-gray-600 font-[Poppins]">
      Attendance Policy Count :
    </span>
    <span className="text-gray-800 font-[Poppins]">01 Policy</span>
  </div>
</div>


      {/* 🔥 Bottom colorful section — unchanged */}
      <div className="space-y-2 pt-1 text-sm font-medium">
        <div className="grid grid-cols-3 items-center">
          <span className="text-green-500">04</span>
          <span className="text-green-500">Delay</span>
          <span className="text-red-500">01 Half Day</span>
        </div>

        <div className="grid grid-cols-3 items-center">
          <span className="text-orange-400">02</span>
          <span className="text-orange-400">Late</span>
          <span className="text-red-500">01 Half Day</span>
        </div>

        <div className="grid grid-cols-3 items-center">
          <span className="text-red-500">00</span>
          <span className="text-red-500">Half Day</span>
          <span className="text-red-500">01 Half Day</span>
        </div>
      </div>
    </div>
  </div>
);

// ------------------------------------------

const ShiftDonutChart = () => {
  const circumference = 2 * Math.PI * 40; // 2 * pi * radius (radius is 40)
  let accumulatedOffset = 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {donutChartData.map((item, index) => {
            const strokeDasharray = `${
              (item.percentage / 100) * circumference
            } ${circumference}`;
            const strokeDashoffset = -accumulatedOffset;
            accumulatedOffset += (item.percentage / 100) * circumference;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">60</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {donutChartData.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShiftRatioCard = () => {
  const { total, online, delay, late, absent } = attendance;
  const onlinePerc = (online / total) * 100;
  const delayPerc = (delay / total) * 100;
  const latePerc = (late / total) * 100;
  const absentPerc = (absent / total) * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="text-sm font-semibold text-gray-800 mb-3">
        Shift Ratio
      </div>
      <div className="text-lg font-bold text-gray-900 mb-3">
        {total} <span className="text-sm text-gray-500">Attendance</span>
      </div>
      <div className="h-2 w-full flex rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400" // Online
          style={{ width: `${onlinePerc}%` }}
        />
        <div
          className="h-full bg-cyan-400" // Delay
          style={{ width: `${delayPerc}%` }}
        />
        <div
          className="h-full bg-blue-600" // Late
          style={{ width: `${latePerc}%` }}
        />
        <div
          className="h-full bg-pink-500" // Absent
          style={{ width: `${absentPerc}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Online</span>
            <span className="text-gray-800 font-medium">{online}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-cyan-400 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Delay</span>
            <span className="text-gray-800 font-medium">{delay}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Late</span>
            <span className="text-gray-800 font-medium">
              {String(late).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-pink-500 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Absent</span>
            <span className="text-gray-800 font-medium">{absent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- MAIN COMPONENT ----------------
export default function ShiftOverview() {
  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-4">
          <StatCard
            title="Total Employees"
            value={overviewStats.totalEmployees}
            icon={<FiUsers />}
            bg="bg-[#EBFDEF]"
            iconBg="bg-white"
          />
          <StatCard
            title="Total Shifts"
            value={String(overviewStats.totalShifts).padStart(2, "0")}
            icon={<FiClock />}
            bg="bg-[#E8EFF9]"
            iconBg="bg-white"
          />
          <StatCard
            title="Unallocated"
            value={overviewStats.unallocated}
            icon={<FiUserX />}
            bg="bg-[#FFEFE7]"
            iconBg="bg-white"
          
          />
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm border border-gray-200">
            <FiPlus size={16} /> Create Shift
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
            <FiPlus size={16} /> Create Attendance policy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ---------- Column 1 ---------- */}
        <div className="space-y-5">
          <MorningShiftCard />
          <RegularShiftPolicyCard />
        </div>

        {/* ---------- Column 2 ---------- */}
        <div className="space-y-5">
          <MorningShiftCard />
          {/* This now uses the updated component */}
          <ShiftRulesCard />
        </div>

        {/* ---------- Column 3 ---------- */}
        <div className="space-y-5">
          <ShiftDonutChart />
          <ShiftRatioCard />
        </div>
      </div>
    </div>
  );
}