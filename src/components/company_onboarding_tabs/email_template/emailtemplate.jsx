import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Upload } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
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

  // Load data based on tab
  useEffect(() => {
    if (activeTab === "all") {
      loadTemplates();
    } else {
      loadDefaultTemplates();
    }
  }, [activeTab, loadTemplates, loadDefaultTemplates]);

  const getType = (isManual) => (isManual ? "Manual" : "Auto");
  const getStatus = (isActive) => (isActive ? "Active" : "Inactive");

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter templates based on search
  const filteredTemplates = useMemo(() => {
    const data = activeTab === "all" ? templates : defaultTemplates;
    return data.filter((item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [templates, defaultTemplates, searchQuery, activeTab]);

  const columns = useMemo(
    () => [
      { key: "name", label: "Template Name", render: (v) => <div className="text-left w-full">{v}</div> },
      { key: "is_manual", label: "Type", render: (v) => getType(v) },
      { key: "created_at", label: "Created on", render: (v) => formatDate(v) },
      {
        key: "is_active",
        label: "Status",
        render: (v) => (
          <span
            className={`px-4 py-1 rounded-full text-[11px] font-medium ${
              v ? "bg-[#E7F7EF] text-[#00B050]" : "bg-[#F1F1F8] text-[#8C8CB1]"
            }`}
          >
            {getStatus(v)}
          </span>
        ),
      },
      { key: "action", label: "Action", render: (_, row) => <ActionMenu row={row} refreshTemplates={activeTab === "all" ? loadTemplates : loadDefaultTemplates} /> },
    ],
    [activeTab, loadTemplates, loadDefaultTemplates]
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-medium text-gray-900">All Email Templates</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center p-2 text-white bg-black rounded-lg hover:bg-gray-900 transition-all active:scale-95"
          >
            <Upload className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-[12px] font-medium hover:bg-zinc-800 transition-all active:scale-95"
          >
            <Plus size={14} /> Create Email template
          </button>

          <div className="relative ml-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-300 bg-[#f9f9f9] rounded-lg text-[12px] w-64 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-[12px] font-medium ${
            activeTab === "all" ? "bg-black text-white" : "bg-[#f1f1f1] text-gray-600"
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("default")}
          className={`px-4 py-2 rounded-lg text-[12px] font-medium ${
            activeTab === "default" ? "bg-black text-white" : "bg-[#f1f1f1] text-gray-600"
          }`}
        >
          Default Templates
        </button>
      </div>

      {/* Table */}
      {loading && <p className="text-center text-[12px] text-gray-500">Loading...</p>}
      {error && <p className="text-center text-[12px] text-red-500">{error}</p>}
      {!loading && !error && (
        <UniversalTable columns={columns} data={filteredTemplates} rowsPerPage={6} />
      )}

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
