import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const days = ["01-Mon", "02-Tue", "03-Wed", "04-Thu", "05-Fri", "06-Sat", "07-Sun"];
const avatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

// Employee info component
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

// Shift card
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
    </div>
  );
};

const WeeklyOffCard = () => (
  <div className="border border-yellow-400 bg-gray-50 rounded p-1.5 h-full flex items-center justify-center">
    <span className="text-yellow-700 text-[9px] font-medium">Weekly Off</span>
  </div>
);

// Shift calendar grid
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
          <div
            key={employee.id}
            className="grid grid-cols-[minmax(160px,_1fr)_repeat(7,_minmax(95px,_0.7fr))] text-[11px] border-b last:border-none"
          >
            <div className="p-2 border-r">
              <EmployeeInfo employee={employee} />
            </div>
            {employee.shifts.map((shift, index) => (
              <div key={index} className="p-2 border-r last:border-none">
                {shift.type === "off" ? <WeeklyOffCard /> : <ShiftCard shift={shift} />}
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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔑 Example: You can store token in localStorage after login
  // localStorage.setItem("authToken", "your_jwt_here");

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("authToken") || "YOUR_BEARER_TOKEN_HERE"; // fallback

      try {
        const res = await fetch(
          "https://agnostically-bonniest-patrice.ngrok-free.dev/shifts/filtered",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Bearer token added
            },
          }
        );

        if (!res.ok) throw new Error(`Failed to fetch data (${res.status})`);
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div className="p-4 text-sm text-gray-500">Loading shifts...</div>;
  if (error) return <div className="p-4 text-sm text-red-500">Error: {error}</div>;

  return (
    <div className="bg-[#f9fafb] p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-700">All Employee Shifts</h2>
        <button className="bg-black text-white px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 h-8">
          <FiPlus size={12} /> Allocate Shift
        </button>
      </div>

      <ShiftCalendar employees={employees} days={days} />
    </div>
  );
}
