import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Upload } from "lucide-react";
import PayrollTable from "../../../ui/payrolltable"; // ✅ Swapped to PayrollTable
import CreateEmailTemplateModal from "../../../ui/createemailmodal";
import UploadEmailTemplateModal from "../../../ui/uploademailmodal";
import ActionMenu from "../../../ui/actionmenu";
import useEmailTemplateStore from "../../../store/emailtemplateStore";

const EmailTemplates = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all or default

  const {
    templates,
    defaultTemplates,
    loading,
    error,
    loadTemplates,
    loadDefaultTemplates,
  } = useEmailTemplateStore();

  useEffect(() => {
    if (activeTab === "all") {
      loadTemplates();
    } else {
      loadDefaultTemplates();
    }
  }, [activeTab, loadTemplates, loadDefaultTemplates]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredTemplates = useMemo(() => {
    const data = activeTab === "all" ? templates : defaultTemplates;
    return (data || []).filter((item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [templates, defaultTemplates, searchQuery, activeTab]);

  // EXACT ALIGNMENT CONFIGURATION (Matching Shifts/Leaves Reference)
  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Template Name",
        align: "left", // Anchor primary text to the left
      },
      {
        key: "is_manual",
        label: "Type",
        align: "left",
        render: (v) => (v ? "Manual" : "Auto"),
      },
      {
        key: "created_at",
        label: "Created on",
        align: "left",
        render: (v) => formatDate(v),
      },
      {
        key: "is_active",
        label: "Status",
        align: "center", // Center aligned status pill
        render: (v) => (
          <span
            className={`px-3 py-1 rounded-full border text-[11px] font-medium ${
              v
                ? "bg-green-50 text-green-500 border-green-100"
                : "bg-gray-50 text-gray-400 border-gray-100"
            }`}
          >
            {v ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "action",
        label: "Action",
        align: "center",
        render: (_, row) => (
          <ActionMenu
            row={row}
            refreshTemplates={
              activeTab === "all" ? loadTemplates : loadDefaultTemplates
            }
          />
        ),
      },
    ],
    [activeTab, loadTemplates, loadDefaultTemplates],
  );

  return (
    <div className="w-full bg-white rounded-xl">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-[16px] font-semibold text-gray-900 font-['Poppins']">
          All Email Templates
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center p-2.5 text-white bg-black rounded-lg hover:bg-gray-800 transition-all active:scale-95"
            title="Upload Template"
          >
            <Upload className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-all font-['Poppins']"
          >
            <Plus size={14} /> Create Email Template
          </button>

          <div className="relative ml-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-200 bg-[#f9f9f9] rounded-lg text-[12px] w-60 focus:outline-none focus:ring-1 focus:ring-black font-['Poppins']"
            />
          </div>
        </div>
      </div>

      {/* Modern Tab Toggle */}
      <div className="flex items-center gap-2 mb-6 bg-gray-50 p-1 w-fit rounded-xl">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-lg text-[12px] font-medium transition-all ${
            activeTab === "all"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("default")}
          className={`px-6 py-2 rounded-lg text-[12px] font-medium transition-all ${
            activeTab === "default"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Presets Templates
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-[12px] font-['Poppins'] animate-pulse">
            Loading templates...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-500 text-[12px] font-['Poppins']">
            {error}
          </div>
        ) : (
          <PayrollTable
            columns={columns}
            data={filteredTemplates}
            rowsPerPage={6}
          />
        )}
      </div>

      {/* Modals */}
      <CreateEmailTemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          loadTemplates();
        }}
      />
      <UploadEmailTemplateModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          loadTemplates();
        }}
      />
    </div>
  );
};

export default EmailTemplates;
