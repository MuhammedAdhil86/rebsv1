import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Upload, Trash2, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import PayrollTable from "../../../ui/payrolltable";
import CreateEmailTemplateModal from "../../../ui/createemailmodal";
import UploadEmailTemplateModal from "../../../ui/uploademailmodal";
import ActionMenu from "../../../ui/actionmenu";
import useEmailTemplateStore from "../../../store/emailtemplateStore";
import { deleteEmailTemplateService } from "../../../service/mainServices"; // Ensure this path is correct

const EmailTemplates = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" = My Templates, "default" = Preset

  // --- DELETE MODAL STATES ---
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // --- DELETE HANDLER ---
  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEmailTemplateService(templateToDelete.id);
      toast.success("Template deleted");
      // Refresh the list after deletion
      if (activeTab === "all") loadTemplates();
      else loadDefaultTemplates();

      setTemplateToDelete(null); // Close modal
    } catch (err) {
      toast.error(err.message || "Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

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
            // Pass the trigger function to the ActionMenu
            onDeleteClick={() => setTemplateToDelete(row)}
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
    <div className="w-full bg-white rounded-xl p-6 shadow-sm min-h-screen relative">
      <Toaster position="top-right" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-[18px] text-gray-900 font-['Poppins'] ">
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
          className={`px-8 py-2.5 rounded-xl text-[12px] transition-all ${
            activeTab === "all"
              ? "bg-white text-black shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Templates
        </button>
        <button
          onClick={() => setActiveTab("default")}
          className={`px-8 py-2.5 rounded-xl text-[12px] transition-all ${
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

      {/* --- DELETE CONFIRMATION MODAL (CENTERED) --- */}
      {templateToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-[18px]  text-gray-900 mb-2 font-['Poppins']">
                Delete Template?
              </h3>
              <p className="text-gray-500 text-[13px] leading-relaxed">
                Are you sure you want to delete{" "}
                <span className=" text-gray-900">
                  "{templateToDelete.name}"
                </span>
                ? This action cannot be undone and will remove the template
                permanently.
              </p>
            </div>

            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setTemplateToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-4 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-4 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals */}
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
