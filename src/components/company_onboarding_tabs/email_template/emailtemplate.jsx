import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
import CreateEmailTemplateModal from "../../../ui/createemailmodal";
import ActionMenu from "../../../ui/actionmenu";
import useEmailTemplateStore from "../../../store/emailtemplateStore";

/**
 * EmailTemplates - Production Grade with Zustand Store
 */
const EmailTemplates = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- Zustand Store ----------------
  const { templates, loading, error, loadTemplates } = useEmailTemplateStore();

  // ---------------- Fetch Templates on Mount ----------------
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // ---------------- Helpers ----------------
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

  // ---------------- Search Filter ----------------
  const filteredTemplates = useMemo(() => {
    return templates.filter((item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [templates, searchQuery]);

  // ---------------- Columns for UniversalTable ----------------
  const columns = useMemo(
    () => [
      { key: "name", label: "Template Name" },
      {
        key: "is_manual",
        label: "Type",
        render: (value) => getType(value),
      },
      {
        key: "created_at",
        label: "Created on",
        render: (value) => formatDate(value),
      },
      {
        key: "is_active",
        label: "Status",
        render: (value) => (
          <span
            className={`px-4 py-1 rounded-full text-[11px] font-medium ${
              value
                ? "bg-[#E7F7EF] text-[#00B050]"
                : "bg-[#F1F1F8] text-[#8C8CB1]"
            }`}
          >
            {getStatus(value)}
          </span>
        ),
      },
      {
        key: "action",
        label: "Action",
        render: (_, row) => <ActionMenu row={row} />,
      },
    ],
    []
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-medium text-gray-900">
          All Email Templates
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
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
              className="pl-4 pr-10 py-2 border border-gray-100 bg-[#f9f9f9] rounded-lg text-[12px] w-64 focus:outline-none"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading && (
        <p className="text-center text-[12px] text-gray-500">Loading...</p>
      )}
      {error && (
        <p className="text-center text-[12px] text-red-500">{error}</p>
      )}
      {!loading && !error && (
        <UniversalTable
          columns={columns}
          data={filteredTemplates}
          rowsPerPage={6}
        />
      )}

      {/* Modal */}
      <CreateEmailTemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadTemplates(); // refresh list after create
        }}
      />
    </div>
  );
};

export default EmailTemplates;
