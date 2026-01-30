import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Pencil, Trash2, Copy } from "lucide-react";
import UpdateEmailTemplateModal from "./updateemailmodal";
import CreateEmailTemplateModal from "./createemailmodal";
import { cloneDefaultEmailTemplate } from "../service/mainServices";
import toast, { Toaster } from "react-hot-toast";

const ActionMenu = ({ row, refreshTemplates }) => {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef(null);
  const isDefault = row?.is_default === true;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleView = () => {
    setOpen(false);
    alert(`View: ${row.name}`);
  };

  const handleEdit = () => {
    setOpen(false);
    setSelectedTemplate(row);
    setEditModalOpen(true);
  };

  const handleClone = async () => {
    setOpen(false);
    const confirmed = window.confirm(`Are you sure you want to clone "${row.name}"?`);
    if (!confirmed) return;

    try {
      const res = await cloneDefaultEmailTemplate(row.id);
      toast.success(res?.message || "Template cloned successfully!");
      if (refreshTemplates) refreshTemplates();
    } catch (err) {
      toast.error(err?.message || "Failed to clone template");
    }
  };

  const handleDelete = () => {
    setOpen(false);
    alert(`Delete: ${row.name}`);
  };

  const toggleMenu = () => {
    if (!open) {
      // Get button position in viewport
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
    setOpen(!open);
  };

  return (
    <div className="relative">
      <Toaster position="top-right" />

      {/* Action Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="text-gray-400 hover:text-gray-600"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="fixed w-40 border border-gray-200 rounded-xl shadow-xl bg-white z-[99999]"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {/* View → always */}
          <button
            onClick={handleView}
            className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
          >
            <Eye size={14} /> View
          </button>

          {/* Edit → normal templates */}
          {!isDefault && (
            <>
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-red-500 hover:bg-gray-100"
              >
                <Trash2 size={14} /> Delete
              </button>
            </>
          )}

          {/* Clone → default templates */}
          {isDefault && (
            <button
              onClick={handleClone}
              className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
            >
              <Copy size={14} /> Clone
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedTemplate && editModalOpen && (
        <UpdateEmailTemplateModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          templateData={selectedTemplate}
        />
      )}
    </div>
  );
};

export default ActionMenu;
