import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Search, MoreHorizontal, Power } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
import { fetchAllLeavePolicy } from "../../../service/companyService";
import payrollService from "../../../service/payrollService";
import CreateLeavePolicyTab from "../leaves_and_vacations/createleavepolicymodal";
import DefaultTemplatesTable from "../leaves_and_vacations/leavepolicy/defaultleave";
import toast, { Toaster } from "react-hot-toast";

const LeavesAndVacations = () => {
  // ---------------- STATE MANAGEMENT ----------------
  const [activeTab, setActiveTab] = useState("all_leaves");
  const [showCreateTab, setShowCreateTab] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [leaveData, setLeaveData] = useState([]);
  const [defaultTemplates, setDefaultTemplates] = useState([]);

  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // ---------------- 1. DATA FETCHING ----------------
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [customRes, defaultRes] = await Promise.all([
        fetchAllLeavePolicy(),
        payrollService.getDefaultLeavePolicies(),
      ]);

      setLeaveData(customRes?.data || customRes || []);
      setDefaultTemplates(defaultRes?.data || defaultRes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load leave policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ---------------- 2. TARGETED CLONE LOGIC ----------------
  /**
   * Specifically clones ONLY the clicked policy
   * @param {Object} template - The specific row object clicked
   */
  const handleCloneTemplate = async (template) => {
    if (!template?.id) return;

    const toastId = "clone-action";
    toast.loading("Cloning selected policy...", { id: toastId });

    try {
      // The body is specifically formatted to contain only the clicked ID
      const payload = {
        leave_policy_ids: [template.id],
      };

      const response = await payrollService.cloneLeavePolicy(
        payload.leave_policy_ids,
      );

      // Handle Success Message from Backend
      const successMsg = response?.message || "Template cloned successfully!";
      toast.success(successMsg, { id: toastId });

      // UI Actions
      setActiveTab("all_leaves");
      loadAllData();
    } catch (error) {
      // Handle Error Message from Backend
      const errorMsg =
        error.response?.data?.message || "Failed to clone template";
      toast.error(errorMsg, { id: toastId });
    }
  };

  // ---------------- 3. STATUS TOGGLE LOGIC ----------------
  const handleToggleStatus = async () => {
    if (!selectedRow) return;
    const toastId = "status-update";
    try {
      const newStatusValue = selectedRow.status !== "active";
      const response = await payrollService.updatePolicyStatus(
        selectedRow.id,
        newStatusValue,
      );

      const msg =
        response?.message ||
        `Policy ${newStatusValue ? "Activated" : "Deactivated"}`;
      toast.success(msg, { id: toastId });

      closeMenu();
      loadAllData();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update status";
      toast.error(errorMsg, { id: toastId });
    }
  };

  // ---------------- 4. MENU CONTROLS ----------------
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

  // ---------------- 5. SEARCH/FILTERING ----------------
  const currentData = activeTab === "all_leaves" ? leaveData : defaultTemplates;
  const filteredData = currentData.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leave_type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ---------------- 6. COLUMNS ----------------
  const columns = [
    {
      key: "name",
      label: "Leave Name",
      render: (v) => (
        <div className="text-center font-['Poppins'] text-black text-[12px]">
          {v}
        </div>
      ),
    },
    {
      key: "leave_type",
      label: "Type",
      render: (v) => (
        <div className="flex justify-center">
          <span className="bg-[#F1F1F8] text-black px-2 py-0.5 rounded text-[10px] uppercase font-bold font-['Poppins']">
            {v?.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Effective From",
      render: (v) => (
        <div className="text-center font-['Poppins'] text-black text-[12px]">
          {new Date(v).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "count",
      label: "Count",
      render: (_, row) => (
        <div className="text-center font-['Poppins'] text-black text-[12px]">
          {row.employee_accrues}/{row.accrual_method}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <div className="flex justify-center">
          <span
            className={`px-4 py-1 rounded-full text-[11px] font-medium font-['Poppins'] ${
              v === "active"
                ? "bg-[#E7F7EF] text-[#00B050]"
                : "bg-[#F1F1F8] text-[#8C8CB1]"
            }`}
          >
            {v === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (_, row) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => openMenu(e, row)}
            className="text-gray-400 hover:text-black transition-colors p-1"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full relative">
      <Toaster position="top-right" />

      {/* TAB NAVIGATION */}
      {!showCreateTab && (
        <div className="flex items-center gap-8 border-b border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab("all_leaves")}
            className={`pb-3 text-[14px] font-medium font-['Poppins'] transition-all ${
              activeTab === "all_leaves"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            All Leaves
          </button>
          <button
            onClick={() => setActiveTab("default_templates")}
            className={`pb-3 text-[14px] font-medium font-['Poppins'] transition-all ${
              activeTab === "default_templates"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Default Templates
          </button>
        </div>
      )}

      {/* HEADER */}
      {!showCreateTab && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-medium text-gray-900 font-['Poppins']">
            {activeTab === "all_leaves"
              ? "Leave Policies"
              : "Standard Templates"}
          </h2>

          <div className="flex items-center gap-3">
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
                placeholder="Search..."
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

      {/* TABLES */}
      {showCreateTab ? (
        <CreateLeavePolicyTab isOpen={true} onClose={handleCloseCreate} />
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
            rowsPerPage={8}
          />
        )
      ) : (
        <DefaultTemplatesTable
          data={filteredData}
          loading={loading}
          onUseTemplate={handleCloneTemplate}
        />
      )}

      {/* ACTION PORTAL */}
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
              className="w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-1">
                <button
                  className={`w-full text-left px-3 py-2 text-[11px] font-['Poppins'] transition-colors flex items-center gap-2 rounded-lg ${
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
