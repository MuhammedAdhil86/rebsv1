import React from "react";
import EmployeeTableWrapper from "../../ui/employeetablewrapper";
import DatePicker from "../../ui/datepicker";

function DashboardOverview({ ATTENDANCE_DATA, getWidth, CALENDAR_DAYS }) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 bg-gray-100">
      {/* Left Section */}
      <div className="lg:col-span-9 flex flex-col gap-6 w-full">
        <DatePicker CALENDAR_DAYS={CALENDAR_DAYS} />
        <EmployeeTableWrapper />
      </div>

      {/* Right Section */}
      <div className="lg:col-span-3 flex flex-col gap-6 mt-2 sm:mt-4 lg:mt-7 w-full">
        {/* Attendance Summary */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100 w-full">
          <div className="flex items-baseline gap-1 mb-4">
            <p className="text-2xl font-bold text-[#1E2734]">
              {ATTENDANCE_DATA.total}
            </p>
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Ontime</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="font-semibold text-[#1E2734]">
                  {ATTENDANCE_DATA.ontime}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Delay</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span className="font-semibold text-[#1E2734]">
                  {ATTENDANCE_DATA.delay}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Late</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                <span className="font-semibold text-[#1E2734]">
                  {ATTENDANCE_DATA.late}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-xs">Absent</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="font-semibold text-[#1E2734]">
                  {ATTENDANCE_DATA.absent}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaves & Vacations */}
        <div className="bg-white shadow rounded-lg p-4 w-full">
          <h3 className="text-sm font-semibold mb-4">
            Leaves and Vacations
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Vishnu", role: "UI/UX Designer", date: "Only Today" },
              { name: "Aswin Lal", role: "Designer", date: "14 Feb" },
              { name: "Aleena Edhose", role: "Sr UX Designer", date: "8 Feb to 10 Feb" },
              { name: "Greesham B", role: "UX/UI Designer", date: "14 Feb" },
              { name: "Rohith ER", role: "UX/UI Designer", date: "14 Feb" },
            ].map((leave, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-2"
              >
                <div className="flex items-center gap-3 min-w-[150px]">
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
          <button className="mt-4 text-xs text-blue-600">
            View all people
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
