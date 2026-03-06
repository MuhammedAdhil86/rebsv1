import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Upload } from "lucide-react";
import { Toaster } from "react-hot-toast";
import PayrollTable from "../../../ui/payrolltable";
import CreateEmailTemplateModal from "../../../ui/createemailmodal";
import UploadEmailTemplateModal from "../../../ui/uploademailmodal";
import ActionMenu from "../../../ui/actionmenu";
import useEmailTemplateStore from "../../../store/emailtemplateStore";

const EmailTemplates = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" = My Templates, "default" = Preset

  const {
    templates,
    defaultTemplates,
    loading,
    error,
    loadTemplates,
    loadDefaultTemplates,
  } = useEmailTemplateStore();

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      loadTemplates();
    } else {
      loadDefaultTemplates();
    }
  }, [activeTab, loadTemplates, loadDefaultTemplates]);

  const columns = useMemo(
    () => [
      { key: "name", label: "Template Name", align: "left" },
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
        render: (v) => (v ? new Date(v).toLocaleDateString("en-GB") : "-"),
      },
      {
        key: "is_active",
        label: "Status",
        align: "center",
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
            isPresetTab={activeTab === "default"}
            refreshTemplates={
              activeTab === "all" ? loadTemplates : loadDefaultTemplates
            }
          />
        ),
      },
    ],
    [activeTab, loadTemplates, loadDefaultTemplates],
  );

  const filteredData = useMemo(() => {
    const data = activeTab === "all" ? templates : defaultTemplates;
    return (data || []).filter((item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [templates, defaultTemplates, searchQuery, activeTab]);

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm">
      <Toaster position="top-right" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-[18px]  text-gray-900 font-['Poppins']">
          Email Template Management
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="p-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all active:scale-95"
            title="Upload Template"
          >
            <Upload size={16} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-all"
          >
            <Plus size={14} /> Create Template
          </button>

          <div className="relative ml-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-200 bg-[#f9f9f9] rounded-lg text-[12px] w-64 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 bg-gray-100 p-1.5 w-fit rounded-2xl">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-8 py-2.5 rounded-xl text-[12px]  transition-all ${
            activeTab === "all"
              ? "bg-white text-black shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Templates
        </button>
        <button
          onClick={() => setActiveTab("default")}
          className={`px-8 py-2.5 rounded-xl text-[12px]  transition-all ${
            activeTab === "default"
              ? "bg-white text-black shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Preset Templates
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-gray-400 text-[13px] animate-pulse font-medium">
            Fetching templates...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-32 text-red-500 text-[13px]">
            {error}
          </div>
        ) : (
          <PayrollTable columns={columns} data={filteredData} rowsPerPage={7} />
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
