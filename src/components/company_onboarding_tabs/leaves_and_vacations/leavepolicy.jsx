import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, MoreHorizontal, Power, Copy } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
import { fetchAllLeavePolicy } from "../../../service/companyService";
import payrollService from "../../../service/payrollService";
import CreateLeavePolicyTab from "../leaves_and_vacations/createleavepolicymodal";
import UpdateLeavePolicyTab from "./updateleavepolicy";
import DefaultTemplatesTable from "./leavepolicy/defaultleave";
import toast, { Toaster } from "react-hot-toast";

const LeavesAndVacations = () => {
  const [activeTab, setActiveTab] = useState("all_leaves");
  const [showCreateTab, setShowCreateTab] = useState(false);
  const [showUpdateTab, setShowUpdateTab] = useState(false); // Update state
  const [selectedPolicy, setSelectedPolicy] = useState(null); // Selected data
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [defaultLeaves, setDefaultLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // 1. Fetch Data Logic
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [customRes, defaultRes] = await Promise.all([
        fetchAllLeavePolicy(),
        payrollService.getDefaultLeavePolicies(),
      ]);

      setLeaveData(customRes?.data || customRes || []);
      setDefaultLeaves(defaultRes?.data || defaultRes || []);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  // Clone Logic
  const handleCloneTemplate = async (ids) => {
    if (!ids || ids.length === 0) return;
    const toastId = "clone-proc";
    toast.loading("Cloning selected policies...", { id: toastId });

    try {
      await payrollService.cloneLeavePolicy(ids);
      toast.success("Templates cloned successfully!", { id: toastId });
      setSelectedIds([]);
      setActiveTab("all_leaves");
      loadAllData();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to clone";
      toast.error(msg, { id: toastId });
    }
  };

  // Filter logic
  const filteredData = (
    activeTab === "all_leaves" ? leaveData : defaultLeaves
  ).filter(
    (leave) =>
      leave.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leave_type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleStatus = async () => {
    if (!selectedRow) return;
    try {
      const newStatusValue = selectedRow.status !== "active";
      await payrollService.updatePolicyStatus(selectedRow.id, newStatusValue);
      toast.success(
        `Policy ${newStatusValue ? "Activated" : "Deactivated"} successfully`,
      );
      closeMenu();
      loadAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

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

  // Handlers for switching views
  const handleCloseCreate = () => {
    setShowCreateTab(false);
    loadAllData();
  };

  const handleRowClick = (row) => {
    setSelectedPolicy(row);
    setShowUpdateTab(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdateTab(false);
    setSelectedPolicy(null);
    loadAllData();
  };

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
          className={`px-4 py-1 rounded-full text-[11px] font-medium ${value === "active" ? "bg-[#E7F7EF] text-[#00B050]" : "bg-[#F1F1F8] text-[#8C8CB1]"}`}
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
      <Toaster position="top-right" />

      {/* Hide Header only when Create or Update tabs are active */}
      {!showCreateTab && !showUpdateTab && (
        <>
          <div className="flex items-center gap-8 border-b border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab("all_leaves")}
              className={`pb-3 text-[14px] font-medium transition-all ${activeTab === "all_leaves" ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              All Leaves
            </button>
            <button
              onClick={() => setActiveTab("default_templates")}
              className={`pb-3 text-[14px] font-medium transition-all ${activeTab === "default_templates" ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              Default Templates
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[16px] font-medium text-gray-900 font-['Poppins']">
              {activeTab === "all_leaves"
                ? "Leave Policies"
                : "System Templates"}
            </h2>
            <div className="flex items-center gap-3">
              {activeTab === "default_templates" && selectedIds.length > 0 && (
                <button
                  onClick={() => handleCloneTemplate(selectedIds)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[12px] font-medium font-['Poppins'] hover:bg-zinc-800 transition-all"
                >
                  <Copy size={14} /> Clone Selected ({selectedIds.length})
                </button>
              )}

              {activeTab === "all_leaves" && (
                <button
                  onClick={() => setShowCreateTab(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all font-['Poppins']"
                >
                  <Plus size={14} /> Create Policy
                </button>
              )}

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
        </>
      )}

      {/* Main View Area */}
      {showCreateTab ? (
        <CreateLeavePolicyTab isOpen={true} onClose={handleCloseCreate} />
      ) : showUpdateTab ? (
        <UpdateLeavePolicyTab
          policyData={selectedPolicy}
          onClose={handleCloseUpdate}
        />
      ) : activeTab === "all_leaves" ? (
        loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 text-[12px] font-['Poppins'] animate-pulse">
              Loading leave policies...
            </p>
          </div>
        ) : (
          <UniversalTable
            columns={columns}
            data={filteredData}
            rowsPerPage={6}
            rowClickHandler={handleRowClick} // This prop must be used in UniversalTable's <tr>
          />
        )
      ) : (
        <DefaultTemplatesTable
          data={filteredData || []}
          loading={loading}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onUseTemplate={handleCloneTemplate}
        />
      )}

      {menuPosition &&
        createPortal(
          <>
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
              className="w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden p-1"
            >
              <button
                className={`w-full text-left px-3 py-2 text-[11px] font-['Poppins'] transition-colors flex items-center gap-2 rounded-lg
                  ${selectedRow?.status === "active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                onClick={handleToggleStatus}
              >
                <Power size={14} />
                {selectedRow?.status === "active"
                  ? "Deactivate Policy"
                  : "Activate Policy"}
              </button>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default LeavesAndVacations;
