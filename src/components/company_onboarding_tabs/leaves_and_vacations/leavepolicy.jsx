import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import CreateLeavePolicyModal from "./createleavepolicymodal";
import { fetchAllLeavePolicy } from "../../../service/companyService";

const LeavesAndVacations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeavePolicies = async () => {
      try {
        const data = await fetchAllLeavePolicy();
        setLeaveData(data || []);
      } catch (error) {
        console.error("Error fetching leave policies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeavePolicies();
  }, []);

  // Search filter (unchanged)
  const filteredLeaves = leaveData.filter(
    (leave) =>
      leave.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leave_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-medium text-gray-900">All Leaves</h2>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all">
            Leave Templates
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all"
          >
            <Plus size={14} /> Create Policy
          </button>

          <div className="relative ml-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-100 bg-[#f9f9f9] rounded-lg text-[12px] w-64 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="pb-4 px-4 text-[12px] font-medium text-gray-800">
                <div className="flex items-center gap-1.5">
                  Leave Name <SortIcons />
                </div>
              </th>
              <th className="pb-4 px-4 text-[12px] font-medium text-gray-800">
                <div className="flex items-center gap-1.5">
                  Type <SortIcons />
                </div>
              </th>
              <th className="pb-4 px-4 text-[12px] font-medium text-gray-800">
                <div className="flex items-center gap-1.5">
                  Effective From <SortIcons />
                </div>
              </th>
              <th className="pb-4 px-4 text-[12px] font-medium text-gray-800 text-center">
                Count
              </th>
              <th className="pb-4 px-4 text-[12px] font-medium text-gray-800 text-center">
                Description
              </th>
              <th className="pb-4 px-4 text-[12px] font-medium text-gray-800 text-center">
                Status
              </th>
              <th className="pb-4 px-4 text-[12px] font-medium text-gray-800 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filteredLeaves.map((leave) => (
              <tr
                key={leave.id}
                className="hover:bg-gray-50/40 transition-colors"
              >
                <td className="py-5 px-4 text-[12px] text-gray-700">
                  {leave.name}
                </td>

                <td className="py-5 px-4 text-[12px] text-gray-600">
                  {leave.leave_type?.toUpperCase()}
                </td>

                <td className="py-5 px-4 text-[12px] text-gray-600">
                  {new Date(leave.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="py-5 px-4 text-[12px] text-gray-600 text-center">
                  {leave.employee_accrues}/{leave.accrual_method}
                </td>

                <td className="py-5 px-4 text-[12px] text-gray-500 text-center">
                  {leave.description}
                </td>

                <td className="py-5 px-4 text-center">
                  <span
                    className={`px-4 py-1 rounded-full text-[11px] font-medium ${
                      leave.status === "active"
                        ? "bg-[#E7F7EF] text-[#00B050]"
                        : "bg-[#F1F1F8] text-[#8C8CB1]"
                    }`}
                  >
                    {leave.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="py-5 px-4 text-center">
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredLeaves.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-[12px]">
            No matching leaves found.
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateLeavePolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const SortIcons = () => (
  <div className="flex flex-col opacity-60">
    <ChevronUp size={10} className="-mb-1" />
    <ChevronDown size={10} />
  </div>
);

export default LeavesAndVacations;
