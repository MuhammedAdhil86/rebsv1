import React, { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllStaff } from "../../../service/staffservice";

const ShiftBulkAllocation = () => {
  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= LOAD ALL USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllStaff(); // already returns array
      console.log("Fetched staff:", data); // debug
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setUsers([]);
    }
    setLoading(false);
  };

  /* ================= FILTER USERS ================= */
  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-6 w-full min-h-screen bg-[#F9FAFB] p-1 font-normal">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[320px] space-y-6">
        {/* Allocation Controls */}
        <div className="bg-[#F4981833] border border-[#FFD9A7] rounded-2xl p-5">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-gray-800 block mb-2 font-normal">
                Select a Shift
              </label>
              <div className="relative">
                <select className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm appearance-none text-gray-700 focus:outline-none font-normal">
                  <option>Morning Shift</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-800 block mb-2 font-normal">
                Select User Category
              </label>
              <div className="relative">
                <select className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm appearance-none text-gray-700 focus:outline-none font-normal">
                  <option>All Users</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <p className="text-[10px] text-[#D97706] font-normal">
              {users.length} Users Selected
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={fetchUsers}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 bg-white/50 hover:bg-white transition-colors font-normal"
              >
                Clear All
              </button>
              <button className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm hover:bg-neutral-800 transition-all font-normal">
                Allocate
              </button>
            </div>
          </div>
        </div>

        {/* Shift Policy Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[14px] text-gray-800 border-b border-gray-50 pb-4 mb-4 font-normal">
            Morning Shift Policy Details
          </h3>
          
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-gray-500 font-normal">
                Total Work hours
              </span>
              <span className="text-[12px] text-gray-800 font-normal">
                08:00:00 hrs
              </span>
            </div>

            <div className="bg-[#F2FBF6] rounded-xl p-4 space-y-3 border border-[#E1F5EA]">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#10B981] font-normal">IN</span>
                <span className="text-[12px] text-gray-700 font-normal">09:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#EF4444] font-normal">OUT</span>
                <span className="text-[12px] text-gray-700 font-normal">06:00 PM</span>
              </div>
            </div>

            <div className="space-y-3 px-1 font-normal">
              <div className="flex justify-between">
                <span className="text-[12px] text-gray-800">Break</span>
                <span className="text-[12px] text-gray-800">
                  01:00 PM - 01:30 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-[#10B981]">Delay</span>
                <span className="text-[12px] text-gray-800">09:01 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-[#F59E0B]">Late</span>
                <span className="text-[12px] text-gray-800">10:01 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-[#EF4444]">Half Day</span>
                <span className="text-[12px] text-gray-800">12:01 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT MAIN SECTION ================= */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] text-gray-900 font-normal">
              All Users
            </h2>
            <span className="bg-[#BEE3F8] text-[#2B6CB0] text-[11px] px-3 py-1 rounded-full font-normal">
              {users.length} users
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-2 bg-white border border-gray-100 rounded-lg text-sm w-72 focus:outline-none focus:ring-1 focus:ring-gray-200 font-normal"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm font-normal">
          <table className="w-full text-left font-normal">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="p-5 w-14">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black" />
                    <ChevronDown className="ml-1 text-gray-400" size={12} />
                  </div>
                </th>
                {["Name", "Designation", "Date of Joining", "Department", "Branch", "Status"].map((header) => (
                  <th key={header} className="p-5 text-[12px] text-gray-800 font-normal">
                    <div className="flex items-center gap-1 font-normal">
                      {header} <ChevronDown size={12} className="text-gray-300" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 accent-[#10B981]"
                      />
                    </td>
                    <td className="p-5 text-[13px] text-gray-800 font-normal">
                      {user.full_name}
                    </td>
                    <td className="p-5 text-[13px] text-gray-600 font-normal">
                      {user.designation}
                    </td>
                    <td className="p-5 text-[13px] text-gray-600 font-normal">
                      {new Date(user.date_of_join).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-[13px] text-gray-600 font-normal">
                      {user.department}
                    </td>
                    <td className="p-5 text-[13px] text-gray-600 font-normal">
                      {user.branch || "-"}
                    </td>
                    <td className="p-5 text-[13px] text-gray-800 font-normal">
                      {user.is_active ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="p-4 flex justify-end items-center gap-8 border-t border-gray-50 bg-white font-normal">
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-normal">
              Rows per page:
              <select className="bg-transparent text-gray-800 focus:outline-none cursor-pointer font-normal">
                <option>10</option>
              </select>
            </div>
            <span className="text-[11px] text-gray-500 font-normal">
              1-{filteredUsers.length} of {filteredUsers.length}
            </span>
            <div className="flex items-center gap-4 text-gray-400 font-normal">
              <ChevronLeft size={18} className="cursor-pointer hover:text-gray-600" />
              <ChevronRight size={18} className="cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftBulkAllocation;
