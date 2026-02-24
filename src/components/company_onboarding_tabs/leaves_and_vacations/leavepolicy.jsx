import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, MoreHorizontal, Power, Copy } from "lucide-react";
import PayrollTable from "../../../ui/payrolltable";
import { fetchAllLeavePolicy } from "../../../service/companyService";
import payrollService from "../../../service/payrollService";
import CreateLeavePolicyTab from "../leaves_and_vacations/createleavepolicymodal";
import UpdateLeavePolicyTab from "./updateleavepolicy";
import DefaultTemplatesTable from "./leavepolicy/defaultleave";
import toast, { Toaster } from "react-hot-toast";

const LeavesAndVacations = () => {
  const [activeTab, setActiveTab] = useState("all_leaves");
  const [showCreateTab, setShowCreateTab] = useState(false);
  const [showUpdateTab, setShowUpdateTab] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [defaultLeaves, setDefaultLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState([]);
  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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

  // EXACT ALIGNMENT CONFIGURATION (Matching Shifts Reference)
  const columns = [
    { key: "name", label: "Leave Name", align: "left" }, // Primary anchor left
    {
      key: "leave_type",
      label: "Type",
      align: "left",
      render: (value) => (
        <span className="capitalize">{value?.toLowerCase()}</span>
      ),
    },
    {
      key: "created_at",
      label: "Effective From",
      align: "left",
      render: (value) =>
        new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "count",
      label: "Accrual Count",
      align: "center",
      render: (_, row) => (
        <span className="font-medium text-gray-700">
          {row.employee_accrues}/{row.accrual_method}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      align: "left",
      render: (value) => (
        <div className="max-w-[180px] truncate text-gray-400" title={value}>
          {value || "No description"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full border text-[11px] font-medium ${
            value === "active"
              ? "bg-green-50 text-green-500 border-green-100"
              : "bg-gray-50 text-gray-400 border-gray-100"
          }`}
        >
          {value === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      align: "center",
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

  if (showCreateTab)
    return <CreateLeavePolicyTab isOpen={true} onClose={handleCloseCreate} />;
  if (showUpdateTab)
    return (
      <UpdateLeavePolicyTab
        policyData={selectedPolicy}
        onClose={handleCloseUpdate}
      />
    );

  return (
    <div className="w-full bg-white rounded-xl">
      <Toaster position="top-right" />

      {/* Tabs Header */}
      <div className="flex items-center gap-8 border-b border-gray-100 mb-6">
        <button
          onClick={() => setActiveTab("all_leaves")}
          className={`pb-3 text-[14px] font-medium transition-all relative ${
            activeTab === "all_leaves"
              ? "text-black"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          All Leaves
          {activeTab === "all_leaves" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("presets_templates")}
          className={`pb-3 text-[14px] font-medium transition-all relative ${
            activeTab === "presets_templates"
              ? "text-black"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Presets Templates
          {activeTab === "presets_templates" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
          )}
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-[16px] text-gray-900 font-['Poppins']">
          {activeTab === "all_leaves" ? "Leave Policies" : "Presets Templates"}
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-200 bg-[#f9f9f9] rounded-lg text-[12px] w-64 focus:outline-none focus:ring-1 focus:ring-black font-['Poppins'] transition-all"
            />
          </div>

          {activeTab === "presets_templates" && selectedIds.length > 0 && (
            <button
              onClick={() => handleCloneTemplate(selectedIds)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all font-['Poppins']"
            >
              <Copy size={14} /> Clone ({selectedIds.length})
            </button>
          )}

          {activeTab === "all_leaves" && (
            <button
              onClick={() => setShowCreateTab(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all font-['Poppins']"
            >
              <Plus size={14} /> Create Policy
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-[12px] font-['Poppins']">
            <span className="animate-pulse">Loading leave policies...</span>
          </div>
        ) : activeTab === "all_leaves" ? (
          <PayrollTable
            columns={columns}
            data={filteredData}
            rowsPerPage={8}
            searchTerm={searchQuery}
            rowClickHandler={handleRowClick}
          />
        ) : (
          <DefaultTemplatesTable
            data={filteredData || []}
            loading={loading}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onUseTemplate={handleCloneTemplate}
          />
        )}
      </div>

      {/* Action Menu Portal */}
      {menuPosition &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9999] bg-transparent"
              onClick={closeMenu}
            />
            <div
              style={{
                position: "absolute",
                top: menuPosition.top,
                left: menuPosition.left,
                zIndex: 10000,
              }}
              className="w-44 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden p-1.5"
            >
              <button
                className={`w-full text-left px-3 py-2 text-[11px] font-medium font-['Poppins'] transition-colors flex items-center gap-2 rounded-lg ${
                  selectedRow?.status === "active"
                    ? "text-red-500 hover:bg-red-50"
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
          </>,
          document.body,
        )}
    </div>
  );
};

export default LeavesAndVacations;
