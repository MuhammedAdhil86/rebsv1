import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../ui/pagelayout";
import PayrollTable from "../ui/payrolltable";
import CreateEmailTemplateView from "../ui/letteremailcreate";
import CreatePdfTemplateView from "../ui/letterpdfcreate";
import TemplatePreviewView from "../ui/emailandletterpriview";
import EditEmailTemplateView from "../ui/editemailandletter";
import {
  FiBell,
  FiPlus,
  FiLoader,
  FiMoreHorizontal,
  FiMaximize,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiAlertTriangle,
} from "react-icons/fi";
import useEmailTemplateStore from "../store/emailtemplateStore";
import { cloneDefaultEmailTemplate } from "../service/mainServices";
import toast from "react-hot-toast";

const Letter = () => {
  // --- Navigation & View States ---
  const [activeTab, setActiveTab] = useState("email"); // email | pdf
  const [subTab, setSubTab] = useState("presets"); // presets | my-templates
  const [viewMode, setViewMode] = useState("table"); // table | create | preview | edit

  // --- Zustand Store ---
  const {
    templates,
    defaultTemplates,
    loading,
    loadTemplates,
    loadDefaultTemplates,
    removeTemplate,
  } = useEmailTemplateStore();

  // --- UI Component States ---
  const [initialData, setInitialData] = useState(null);
  const [selectedForPreview, setSelectedForPreview] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const menuRef = useRef(null);

  // 1. Initial Load
  useEffect(() => {
    loadDefaultTemplates();
    loadTemplates();
  }, [loadDefaultTemplates, loadTemplates]);

  // 2. Click Outside Menu Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Handlers
  const handleToggleMenu = (e, id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX - 150,
      });
      setOpenMenuId(id);
    }
  };

  const handleClonePreset = async (id) => {
    setOpenMenuId(null);
    const loadingToast = toast.loading("Cloning preset...");
    try {
      await cloneDefaultEmailTemplate(id);
      toast.success("Cloned to My Templates!", { id: loadingToast });
      setSubTab("my-templates");
      loadTemplates();
      setViewMode("table");
    } catch (error) {
      toast.error("Clone failed", { id: loadingToast });
    }
  };

  const handleEdit = (row) => {
    setOpenMenuId(null);
    setInitialData({
      id: row.id,
      name: row.name,
      subject: row.subject,
      body: row.body_html || row.body,
      purpose: row.purpose,
    });
    setViewMode("edit");
  };

  // --- 4. Filtering Logic ---
  const filteredData = (
    subTab === "presets" ? defaultTemplates : templates
  ).filter((item) => {
    const isForGeneration = item.for_letter_generation === true;
    const isPdf = item.purpose?.includes("pdf");
    const matchesType = activeTab === "email" ? !isPdf : isPdf;

    if (subTab === "my-templates") {
      // Show custom templates (not default)
      return isForGeneration && matchesType && item.is_default === false;
    }
    // Presets Tab: ONLY show items where is_manual is false
    return isForGeneration && matchesType && item.is_manual === false;
  });

  const columns = [
    { key: "id", label: "ID", align: "left" },
    { key: "name", label: "Template Name", align: "left" },
    { key: "purpose", label: "Purpose", align: "left" },
    {
      key: "is_active",
      label: "Status",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-medium ${val ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "center",
      render: (_, row) => (
        <div className="relative flex justify-center">
          <button
            onClick={(e) => handleToggleMenu(e, row.id)}
            className="p-1 text-gray-400 hover:text-gray-900"
          >
            <FiMoreHorizontal size={18} />
          </button>
          {openMenuId === row.id && (
            <div
              ref={menuRef}
              className="fixed w-48 border border-gray-200 rounded-xl shadow-2xl bg-white z-[9999] py-1"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              <button
                onClick={() => {
                  setSelectedForPreview(row);
                  setViewMode("preview");
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-gray-700 hover:bg-gray-50"
              >
                <FiMaximize size={14} className="text-purple-500" /> Preview
              </button>
              {subTab === "presets" ? (
                <button
                  onClick={() => handleClonePreset(row.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-gray-700 hover:bg-blue-50 font-medium border-t border-gray-50"
                >
                  <FiCopy size={14} /> Clone
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(row)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-gray-700 hover:bg-gray-50 border-t border-gray-50"
                  >
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModal({ show: true, id: row.id });
                      setOpenMenuId(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout userName="Admin">
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <FiAlertTriangle className="text-red-500 text-3xl mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure? This action is permanent.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteModal({ show: false, id: null })}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await removeTemplate(deleteModal.id);
                  setDeleteModal({ show: false, id: null });
                  toast.success("Deleted");
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="font-poppins font-normal px-3">
        <div className="bg-white flex justify-between items-center p-4 mb-4 shadow-sm rounded-lg">
          <h1 className="text-[16px] text-gray-800 font-semibold">
            Document Management
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300">
              <FiBell />
            </div>
            <img
              src="https://i.pravatar.cc/150?img=12"
              className="w-9 h-9 rounded-full border border-gray-200"
              alt="user"
            />
          </div>
        </div>

        {viewMode === "table" ? (
          <>
            <div className="flex gap-6 border-b px-2 mb-3 text-[12px]">
              <button
                onClick={() => setActiveTab("email")}
                className={`pb-2 ${activeTab === "email" ? "border-b-2 border-black text-black font-semibold" : "text-gray-400"}`}
              >
                Email Letters
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`pb-2 ${activeTab === "pdf" ? "border-b-2 border-black text-black font-semibold" : "text-gray-400"}`}
              >
                PDF Letters
              </button>
            </div>
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setSubTab("my-templates")}
                  className={`px-4 py-1.5 rounded-md text-[11px] ${subTab === "my-templates" ? "bg-white shadow-sm text-black font-medium" : "text-gray-500"}`}
                >
                  My Templates
                </button>
                <button
                  onClick={() => setSubTab("presets")}
                  className={`px-4 py-1.5 rounded-md text-[11px] ${subTab === "presets" ? "bg-white shadow-sm text-black font-medium" : "text-gray-500"}`}
                >
                  System Presets
                </button>
              </div>
              <button
                onClick={() => {
                  setInitialData(null);
                  setViewMode("create");
                }}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] hover:bg-gray-800 shadow-md transition-all font-medium font-poppins"
              >
                <FiPlus size={14} /> Create New
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <FiLoader className="animate-spin text-gray-400" size={24} />
                </div>
              ) : (
                <PayrollTable
                  columns={columns}
                  data={filteredData}
                  rowsPerPage={8}
                />
              )}
            </div>
          </>
        ) : viewMode === "preview" ? (
          <TemplatePreviewView
            data={selectedForPreview}
            subTab={subTab}
            onBack={() => setViewMode("table")}
            onClone={(id) => handleClonePreset(id)}
          />
        ) : viewMode === "edit" ? (
          <EditEmailTemplateView
            initialData={initialData}
            onBack={() => {
              setViewMode("table");
              loadTemplates();
            }}
            availablePlaceholders={[
              "FirstName",
              "LastName",
              "Designation",
              "Department",
              "Company",
              "JoiningDate",
              "Salary",
              "ReportingManager",
              "CompanyEmail",
              "CompanyLogo",
            ]}
          />
        ) : (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            {activeTab === "email" ? (
              <CreateEmailTemplateView
                onBack={() => {
                  setViewMode("table");
                  loadTemplates();
                }}
                initialData={initialData}
                availablePurposes={[
                  "offer_letter_email",
                  "appointment_letter_email",
                ]}
                availablePlaceholders={[
                  "FirstName",
                  "LastName",
                  "Designation",
                  "Department",
                  "Company",
                  "JoiningDate",
                  "Salary",
                  "ReportingManager",
                  "CompanyEmail",
                  "CompanyLogo",
                ]}
              />
            ) : (
              <CreatePdfTemplateView
                onBack={() => {
                  setViewMode("table");
                  loadTemplates();
                }}
                initialData={initialData}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Letter;
