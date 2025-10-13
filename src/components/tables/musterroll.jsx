import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";

function MusterRoll() {
  const ATTENDANCE_DATA = [
    {
      name: "Vishnu",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/30?img=1",
      daily: [
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05", today: true },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Weekly off", off: true },
        { status: "Weekly off", off: true },
      ],
    },
    {
      name: "Aswin Lal",
      role: "UI/UX Designer",
      avatar: "https://i.pravatar.cc/30?img=2",
      daily: [
        { status: "Absent", workHours: "00:00:00" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "Absent", workHours: "00:00:00" },
        { status: "On Time", workHours: "09:23:05" },
        { status: "On Time", workHours: "09:23:05", today: true },
        { status: "Absent", workHours: "00:00:00" },
        { status: "Weekly off", off: true },
        { status: "Weekly off", off: true },
      ],
    },
    // Add other employees...
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return ATTENDANCE_DATA;
    const q = searchQuery.toLowerCase();
    return ATTENDANCE_DATA.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) || emp.role.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-600";
      case "Absent":
        return "bg-red-100 text-red-600";
      case "Late":
        return "bg-blue-100 text-blue-600";
      case "Half Day":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <section className="bg-gray-100 rounded-xl shadow-sm overflow-x-auto p-4 w-full max-w-[1020px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-lg font-semibold">Muster Roll</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 border px-2 py-1 rounded-lg bg-gray-50 text-sm flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-gray-600 w-full focus:outline-none text-sm"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-white text-gray-500 text-left text-xs uppercase">
            <tr>
              {["Name", "Role", ...Array.from({ length: 8 }, (_, i) => `Day ${i + 1}`)].map((col, idx) => (
                <th key={idx} className="px-2 sm:px-3 py-1 sm:py-2 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {filteredData.map((emp, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-2">
                  <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full" />
                  {emp.name}
                </td>
                <td className="px-2 sm:px-3 py-1 sm:py-2">{emp.role}</td>
                {emp.daily.map((day, dIdx) => (
                  <td key={dIdx} className="px-2 sm:px-3 py-1 sm:py-2">
                    {day.off ? (
                      <span className="text-gray-400 text-xs">Weekly off</span>
                    ) : (
                      <span
                        className={`w-[85px] text-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                          day.status
                        )}`}
                      >
                        {day.status}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MusterRoll;
