import React from "react";
import { Icon } from "@iconify/react";
import EmployeeTable from "../tables/employeetable"; // import the reusable table

function DashboardOverview({ ATTENDANCE_DATA, getWidth, CALENDAR_DAYS }) {
  const employees = [
    {
      name: "Vishnu",
      role: "UI/UX Designer",
      mobile: "+91 9388837355",
      branch: "Head Office",
      shift: "9:00AM-1:00PM",
      status: "Online",
    },
    {
      name: "Aswin Lal",
      role: "Designer",
      mobile: "+91 9388837355",
      branch: "Head Office",
      shift: "9:00AM-1:00PM",
      status: "Online",
    },
    {
      name: "Aleena Edhose",
      role: "Senior Developer",
      mobile: "+91 9388837355",
      branch: "Head Office",
      shift: "9:00AM-1:00PM",
      status: "Absent",
    },
    {
      name: "Greesham B",
      role: "Junior Developer",
      mobile: "+91 9388837355",
      branch: "Head Office",
      shift: "9:00AM-1:00PM",
      status: "Absent",
    },
    {
      name: "Alwin Gigi",
      role: "Backend Developer",
      mobile: "+91 9388837355",
      branch: "Head Office",
      shift: "9:00AM-1:00PM",
      status: "Delay",
    },
    {
      name: "Hridya S B",
      role: "Junior Developer",
      mobile: "+91 9388837355",
      branch: "Head Office",
      shift: "9:00AM-1:00PM",
      status: "Late",
    },
  ];

  return (
    <div className="flex-1 grid grid-cols-12 gap-6 p-6 bg-gray-100 ">
      {/* Left Section */}
      <div className="col-span-9 flex flex-col gap-6">
        {/* Calendar / Date Part */}
        <div className="flex items-center gap-4 px-6 py-4 bg-gray-100 rounded overflow-x-hidden no-scrollbar">
          <div className="text-gray-400">
            <Icon icon="solar:calendar-date-bold" className="w-5 h-5" />
          </div>
          <div className="flex gap-2">
            {CALENDAR_DAYS.map((item, idx) => (
              <button
                key={idx}
                className={`flex flex-col items-center justify-center w-[75px] h-[55px] rounded-xl text-xs font-medium transition-all duration-200 ${
                  idx === 0
                    ? "bg-black text-white "
                    : "bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-300"
                }`}
              >
                <span className="text-[10px]">{item.day}</span>
                <span className="text-[14px] font-bold mt-1">{item.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reusable Employee Table */}
        <EmployeeTable employees={employees} />
      </div>

      {/* Right Section */}
      <div className="col-span-3 flex flex-col gap-6 ">
        {/* Attendance Summary */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100">
          <div className="flex items-baseline gap-1 mb-4">
            <p className="text-2xl font-bold text-[#1E2734]">{ATTENDANCE_DATA.total}</p>
            <span className="text-sm text-gray-500">Attendance</span>
          </div>

          <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-6 gap-1">
            <div
              className="bg-green-500 rounded-full"
              style={{ width: getWidth(ATTENDANCE_DATA.ontime) }}
            ></div>
            <div
              className="bg-blue-500 rounded-full"
              style={{ width: getWidth(ATTENDANCE_DATA.delay) }}
            ></div>
            <div
              className="bg-purple-500 rounded-full"
              style={{ width: getWidth(ATTENDANCE_DATA.late) }}
            ></div>
            <div
              className="bg-red-500 rounded-full"
              style={{ width: getWidth(ATTENDANCE_DATA.absent) }}
            ></div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Ontime</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="font-semibold text-[#1E2734]">{ATTENDANCE_DATA.ontime}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Delay</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span className="font-semibold text-[#1E2734]">{ATTENDANCE_DATA.delay}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Late</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                <span className="font-semibold text-[#1E2734]">{ATTENDANCE_DATA.late}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Absent</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="font-semibold text-[#1E2734]">{ATTENDANCE_DATA.absent}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaves & Vacations */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-4">Leaves and Vacations</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Vishnu", role: "UI/UX Designer", date: "Only Today" },
              { name: "Aswin Lal", role: "Designer", date: "14 Feb" },
              { name: "Aleena Edhose", role: "Sr UX Designer", date: "8 Feb to 10 Feb" },
              { name: "Greesham B", role: "UX/UI Designer", date: "14 Feb" },
              { name: "Rohith ER", role: "UX/UI Designer", date: "14 Feb" },
            ].map((leave, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/30?img=${idx + 10}`}
                    alt={leave.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{leave.name}</p>
                    <p className="text-xs text-gray-400">{leave.role}</p>
                  </div>
                </div>
                <span
                  className={`text-xs ${
                    leave.date === "Only Today"
                      ? "text-orange-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {leave.date}
                </span>
              </li>
            ))}
          </ul>
          <button className="mt-4 text-xs text-blue-600">View all people</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
