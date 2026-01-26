import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Eye, Pencil, Trash2, Copy } from "lucide-react";
import UpdateEmailTemplateModal from "./updateemailmodal";
import CreateEmailTemplateModal from "./createemailmodal";

const ActionMenu = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const menuRef = useRef(null);

  // -------------------- Close menu when clicking outside --------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------- Handlers --------------------
  const handleView = () => {
    setOpen(false);
    alert(`View: ${row.name}`);
  };

  const handleEdit = () => {
    setOpen(false);
    setSelectedTemplate(row);
    setEditModalOpen(true);
  };

  const handleClone = () => {
    setOpen(false);
    setSelectedTemplate(row);
    setCloneModalOpen(true);
  };

  const handleDelete = () => {
    setOpen(false);
    alert(`Delete: ${row.name}`);
  };

  return (
    <div className=" bg-white z-[100] relative flex justify-center" ref={menuRef}>
      {/* Three dot button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="text-gray-400 hover:text-gray-600"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="fixed z-[9999] mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          
          {/* View */}
          <button
            onClick={handleView}
            className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
          >
            <Eye size={14} />
            View
          </button>

          {/* Edit */}
          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
          >
            <Pencil size={14} />
            Edit
          </button>

          {/* Clone (only if is_default true) */}
          {row?.is_default && (
            <button
              onClick={handleClone}
              className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
            >
              <Copy size={14} />
              Clone
            </button>
          )}

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-2 text-[12px] text-red-500 hover:bg-gray-100"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      {/* Update Modal */}
      {selectedTemplate && editModalOpen && (
        <UpdateEmailTemplateModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          templateData={selectedTemplate}
        />
      )}

      {/* Clone Modal (reuse Create modal with prefilled data) */}
      {selectedTemplate && cloneModalOpen && (
        <CreateEmailTemplateModal
          isOpen={cloneModalOpen}
          onClose={() => setCloneModalOpen(false)}
          cloneData={selectedTemplate} // pass row data for cloning
        />
      )}
    </div>
  );
};

export default ActionMenu;
