import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, MoreHorizontal, Power } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
import { fetchAllLeavePolicy } from "../../../service/companyService";
import payrollService from "../../../service/payrollService";
import CreateLeavePolicyTab from "../leaves_and_vacations/createleavepolicymodal";
import toast from "react-hot-toast";

const LeavesAndVacations = () => {
  const [showCreateTab, setShowCreateTab] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // 1. Fetch Data
  const loadLeavePolicies = async () => {
    setLoading(true);
    try {
      const response = await fetchAllLeavePolicy();
      setLeaveData(response?.data || response || []);
    } catch (error) {
      console.error("Error fetching leave policies:", error);
      toast.error("Failed to load leave policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeavePolicies();
  }, []);

  // 2. Status Toggle API Logic
  const handleToggleStatus = async () => {
    if (!selectedRow) return;

    try {
      const newStatusValue = selectedRow.status !== "active";

      // Using your camelCase API method
      await payrollService.updatePolicyStatus(selectedRow.id, newStatusValue);

      toast.success(
        `Policy ${newStatusValue ? "Activated" : "Deactivated"} successfully`,
      );

      closeMenu();
      loadLeavePolicies();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
      console.error(error);
    }
  };

  // 3. Menu Controls
  const openMenu = (event, row) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.right + window.scrollX - 150,
    });
    setSelectedRow(row);
  };

  const closeMenu = () => {
    setMenuPosition(null);
    setSelectedRow(null);
  };

  const handleCloseCreate = () => {
    setShowCreateTab(false);
    loadLeavePolicies();
  };

  const filteredLeaves = leaveData.filter(
    (leave) =>
      leave.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leave_type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      render: (value) => (
        <div className="max-w-[200px] truncate cursor-pointer" title={value}>
          {value}
        </div>
      ),
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
      render: (_, row) => (
        <button
          onClick={(e) => openMenu(e, row)}
          className="text-gray-400 hover:text-gray-900 transition-colors p-1"
        >
          <MoreHorizontal size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full relative">
      {!showCreateTab && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-medium text-gray-900 font-['Poppins']">
            All Leaves
          </h2>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all font-['Poppins']">
              Leave Templates
            </button>

            <button
              onClick={() => setShowCreateTab(true)}
              className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all font-['Poppins']"
            >
              <Plus size={14} /> Create Policy
            </button>

            <div className="relative ml-2">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-100 bg-[#f9f9f9] rounded-lg text-[12px] w-64 focus:outline-none focus:ring-1 focus:ring-gray-200 font-['Poppins']"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
            </div>
          </div>
        </div>
      )}

      {showCreateTab ? (
        <CreateLeavePolicyTab isOpen={true} onClose={handleCloseCreate} />
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-[12px] font-['Poppins'] animate-pulse">
            Loading leave policies...
          </p>
        </div>
      ) : (
        <UniversalTable
          columns={columns}
          data={filteredLeaves}
          rowsPerPage={6}
        />
      )}

      {/* ACTION MENU PORTAL */}
      {menuPosition &&
        createPortal(
          <>
            {/* Backdrop: Clicking outside the box closes it */}
            <div
              className="fixed inset-0 z-[999998] bg-transparent"
              onClick={closeMenu}
            />

            <div
              style={{
                position: "absolute",
                top: menuPosition.top,
                left: menuPosition.left,
                zIndex: 999999,
              }}
              className="w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="p-1">
                <button
                  className={`w-full text-left px-3 py-2 text-[11px] font-['Poppins'] transition-colors flex items-center gap-2 rounded-lg
                    ${
                      selectedRow?.status === "active"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                  onClick={handleToggleStatus}
                >
                  <Power size={14} />
                  {selectedRow?.status === "active"
                    ? "Deactivate Policy"
                    : "Activate Policy"}
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default LeavesAndVacations;
