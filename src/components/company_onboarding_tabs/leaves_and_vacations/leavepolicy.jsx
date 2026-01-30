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
import UniversalTable from "../../../ui/universal_table";

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

  // ✅ Columns for UniversalTable
  const columns = [
    { key: "name", label: "Leave Name" },
    {
      key: "leave_type",
      label: "Type",
      render: (value) => value?.toUpperCase(),
    },
    {
      key: "created_at",
      label: "Effective From",
      render: (value) =>
        new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "count",
      label: "Count",
      render: (_, row) => `${row.employee_accrues}/${row.accrual_method}`,
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-4 py-1 rounded-full text-[11px] font-medium ${
            value === "active"
              ? "bg-[#E7F7EF] text-[#00B050]"
              : "bg-[#F1F1F8] text-[#8C8CB1]"
          }`}
        >
          {value === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <button className="text-gray-400 hover:text-gray-900 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      ),
    },
  ];

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
        {loading ? (
          <p className="text-gray-400 text-[12px]">Loading...</p>
        ) : filteredLeaves.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-[12px]">
            No matching leaves found.
          </div>
        ) : (
          <UniversalTable
            columns={columns}
            data={filteredLeaves}
            rowsPerPage={6}
          />
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
