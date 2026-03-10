import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  AlertCircle,
} from "lucide-react";
import PayrollTable from "../../../ui/payrolltable";
import {
  fetchPolicyData,
  fetchPresetAttendanceTemplates,
  deleteattendancepolicy, // Your imported function
} from "../../../service/companyService";
import CreateAttendancePolicyTab from "../../../ui/createattendancepolicy";
import UpdateAttendancePolicyTab from "../../../ui/updateattendancepolicy";
import DefaultAttendanceTemplates from "./defaultattendacepolicy";
import EditAttendancePreset from "./editattendanceprset";
import toast, { Toaster } from "react-hot-toast";

// --- CUSTOM DELETE MODAL COMPONENT ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-500" size={28} />
          </div>

          <h3 className="text-[18px] font-semibold text-gray-900 mb-2 font-['Poppins']">
            Delete Policy?
          </h3>
          <p className="text-[13px] text-gray-500 mb-6 font-['Poppins'] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">"{itemName}"</span>?
            This action cannot be undone.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[12px] font-medium transition-colors font-['Poppins']"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[12px] font-medium transition-colors shadow-lg shadow-red-200 font-['Poppins']"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const AttendancePolicy = () => {
  const [activeTab, setActiveTab] = useState("all_policies");
  const [viewMode, setViewMode] = useState("list");
  const [editData, setEditData] = useState(null);
  const [policyData, setPolicyData] = useState([]);
  const [defaultPolicies, setDefaultPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Menu & Modal States
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const menuRef = useRef(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [customRes, defaultRes] = await Promise.all([
        fetchPolicyData(),
        fetchPresetAttendanceTemplates(),
      ]);
      const customArray =
        customRes?.data?.data || customRes?.data || customRes || [];
      const defaultArray =
        defaultRes?.data?.data || defaultRes?.data || defaultRes || [];
      setPolicyData(Array.isArray(customArray) ? customArray : []);
      setDefaultPolicies(Array.isArray(defaultArray) ? defaultArray : []);
    } catch (error) {
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Close three-dot menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ACTIONS ---
  const handleOpenDelete = (e, row) => {
    e.stopPropagation();
    setSelectedPolicy(row);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPolicy) return;
    const tid = toast.loading("Deleting policy...");
    try {
      await deleteattendancepolicy(selectedPolicy.id);
      toast.success("Policy deleted successfully", { id: tid });
      setIsDeleteModalOpen(false);
      loadAllData();
    } catch (error) {
      const msg = error?.response?.data?.message || "Delete failed";
      toast.error(msg, { id: tid });
    }
  };

  const toggleMenu = (e, rowId) => {
    e.stopPropagation();
    if (openMenuId === rowId) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX - 140,
      });
      setOpenMenuId(rowId);
    }
  };

  const formatTime = (timeInput) => {
    if (!timeInput) return "N/A";
    let timeStr = timeInput.includes("T")
      ? timeInput.split("T")[1].substring(0, 5)
      : timeInput;
    const [hour, minute] = timeStr.split(":");
    const hr = parseInt(hour, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHour = hr % 12 === 0 ? 12 : hr % 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const columns = [
    { key: "policy_name", label: "Policy Name", align: "left" },
    {
      key: "working_hours",
      label: "Duration",
      render: (val) => `${val || 0} Hrs`,
    },
    {
      key: "start_time",
      label: "Start Time",
      render: (val) => formatTime(val),
    },
    { key: "end_time", label: "End Time", render: (val) => formatTime(val) },
    {
      key: "regularisation",
      label: "Regularization",
      render: (_, row) => (
        <span className="text-[12px] font-medium text-gray-600">
          {row.regularisation_limit ?? 0} /{" "}
          {row.regularisation_type
            ? row.regularisation_type.charAt(0).toUpperCase() +
              row.regularisation_type.slice(1).toLowerCase()
            : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (_, row) => {
        const isActive =
          new Date() >= new Date(row.start_date) &&
          new Date() <= new Date(row.end_date);
        return (
          <span
            className={`px-3 py-1 rounded-full border text-[11px] font-medium ${isActive ? "bg-green-50 text-green-500 border-green-100" : "bg-indigo-50 text-indigo-500 border-indigo-100"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (_, row) => (
        <div className="relative flex justify-end">
          <button
            onClick={(e) => toggleMenu(e, row.id)}
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>

          {openMenuId === row.id && (
            <div
              ref={menuRef}
              className="fixed w-40 border border-gray-200 rounded-xl shadow-2xl bg-white z-[9999] py-1 animate-in fade-in zoom-in duration-100"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              <button
                onClick={(e) => handleOpenDelete(e, row)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 font-semibold transition-colors text-left"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleCloseTabs = () => {
    setViewMode("list");
    setEditData(null);
    loadAllData();
  };

  if (viewMode === "create")
    return (
      <CreateAttendancePolicyTab isOpen={true} onClose={handleCloseTabs} />
    );
  if (viewMode === "update")
    return (
      <UpdateAttendancePolicyTab
        initialData={editData}
        onClose={handleCloseTabs}
      />
    );
  if (viewMode === "edit_preset")
    return (
      <EditAttendancePreset initialData={editData} onClose={handleCloseTabs} />
    );

  return (
    <div className="w-full bg-white rounded-xl">
      <Toaster position="top-right" />

      {/* Delete Modal Overlay */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedPolicy?.policy_name}
      />

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 mb-6 px-2">
        {["all_policies", "presets_templates"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[14px] font-medium transition-all relative ${activeTab === tab ? "text-black" : "text-gray-400"}`}
          >
            {tab === "all_policies" ? "All Policies" : "Presets Templates"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-[16px] font-semibold font-['Poppins']">
          {activeTab === "all_policies"
            ? "Attendance Policies"
            : "Presets Templates"}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-200 bg-[#f9f9f9] rounded-lg text-[12px] w-64 focus:outline-none focus:ring-1 focus:ring-black font-['Poppins']"
            />
          </div>
          {activeTab === "all_policies" && (
            <button
              onClick={() => setViewMode("create")}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[12px] font-medium active:scale-95 transition-transform"
            >
              <Plus size={14} /> Create Policy
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-[12px]">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-2" />
            <span>Loading policies...</span>
          </div>
        ) : activeTab === "all_policies" ? (
          <PayrollTable
            columns={columns}
            data={policyData.filter((p) =>
              p.policy_name?.toLowerCase().includes(searchTerm.toLowerCase()),
            )}
            rowsPerPage={8}
            rowClickHandler={(row) => {
              setEditData(row);
              setViewMode("update");
            }}
          />
        ) : (
          <DefaultAttendanceTemplates
            data={defaultPolicies.filter((p) =>
              p.policy_name?.toLowerCase().includes(searchTerm.toLowerCase()),
            )}
            loading={loading}
            onEdit={(row) => {
              setEditData(row);
              setViewMode("edit_preset");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AttendancePolicy;
