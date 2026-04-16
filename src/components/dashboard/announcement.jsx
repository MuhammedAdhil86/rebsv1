import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Paperclip,
  Send,
  Loader2,
  FileText,
  Search,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import GlowButton from "../helpers/glowbutton";

import { getStaffDetails } from "../../service/employeeService";
import { getDepartmentData } from "../../service/companyService";
import announceService from "../../service/announceService";

const AnnouncementModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filePreview, setFilePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audienceType: "All",
    selectedEmployees: [],
    selectedDepartmentId: "",
    attachment: null,
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [staffRes, deptRes] = await Promise.all([
            getStaffDetails(),
            getDepartmentData(),
          ]);
          const staffList =
            staffRes?.data?.data ||
            staffRes?.data ||
            staffRes?.responsedata ||
            staffRes ||
            [];
          const deptList =
            deptRes?.data || deptRes?.responsedata || deptRes || [];
          setStaff(Array.isArray(staffList) ? staffList : []);
          setDepartments(Array.isArray(deptList) ? deptList : []);
        } catch (err) {
          toast.error("Failed to load staff/departments");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const filteredStaff = useMemo(() => {
    return staff.filter((emp) => {
      const fullName = (
        emp.name || `${emp.first_name || ""} ${emp.last_name || ""}`
      ).toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [staff, searchTerm]);

  const toggleEmployee = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(id)
        ? prev.selectedEmployees.filter((empId) => empId !== id)
        : [...prev.selectedEmployees, id],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, attachment: file }));
      if (file.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview("file_icon");
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.content);
    payload.append("priority", formData.audienceType === "Department" ? 2 : 1);
    payload.append("audience_type", formData.audienceType);

    if (formData.audienceType === "Specific employees") {
      payload.append("send_to", JSON.stringify(formData.selectedEmployees));
    } else if (formData.audienceType === "Department") {
      payload.append("department", formData.selectedDepartmentId);
    }

    if (formData.attachment) {
      payload.append("attachment", formData.attachment);
      payload.append("attachment_type", formData.attachment.type);
    }

    try {
      await announceService.addAnnouncement(payload);
      toast.success("Announcement broadcasted successfully!");
      handleClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Internal Server Error";
      toast.error(`Push Failed: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      audienceType: "All",
      selectedEmployees: [],
      selectedDepartmentId: "",
      attachment: null,
    });
    setFilePreview(null);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm font-poppins text-[12px]">
        <div className="bg-white w-[95%] max-w-[500px] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-white/20">
          {/* Header */}
          <div className="px-8 py-5 flex items-center justify-between border-b border-gray-50 bg-white">
            <div>
              <h2 className="text-gray-900 text-[16px] font-medium tracking-tight uppercase">
                New Announcement
              </h2>
              <p className="text-gray-400 text-[10px] tracking-wider">
                Fill details to notify your team
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6 overflow-y-auto custom-scrollbar"
          >
            <div>
              <label className="block text-gray-400 mb-2 ml-1 text-[10px] tracking-widest uppercase">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter title..."
                className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition-all text-gray-700 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 ml-1 text-[10px] tracking-widest uppercase">
                Message
              </label>
              <textarea
                rows="4"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your announcement..."
                className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black transition-all text-gray-700 resize-none"
                required
              />
            </div>

            {/* Audience Tabs */}
            <div className="bg-gray-100 p-1 rounded-2xl flex gap-1 border border-gray-300">
              {["All", "Department", "Specific employees"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, audienceType: type }))
                  }
                  className={`flex-1 py-2.5 rounded-xl text-[11px] transition-all ${
                    formData.audienceType === type
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {type === "All"
                    ? "Everyone"
                    : type === "Department"
                      ? "Dept"
                      : "Staff"}
                </button>
              ))}
            </div>

            {/* Attachment Preview */}
            {formData.attachment && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-300 animate-in zoom-in-95">
                <div className="flex items-center gap-3 overflow-hidden">
                  {filePreview !== "file_icon" ? (
                    <img
                      src={filePreview}
                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                      alt="preview"
                    />
                  ) : (
                    <FileText className="text-black" size={20} />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-black truncate">
                      {formData.attachment.name}
                    </p>
                    <p className="text-[9px] text-gray-500">
                      {(formData.attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((p) => ({ ...p, attachment: null }));
                    setFilePreview(null);
                  }}
                  className="p-1.5 hover:bg-gray-200 rounded-full text-black"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Standardized Footer */}
            <div className="pt-6 flex items-center justify-between border-t border-gray-100 sticky bottom-0 bg-white">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-white bg-black px-5 py-3 rounded-xl hover:bg-gray-800 transition-all font-medium text-[11px]"
                >
                  <Paperclip size={16} /> Attach
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-3 text-white bg-black rounded-xl hover:bg-gray-800 transition-all font-medium text-[11px]"
                >
                  Cancel
                </button>

                <GlowButton onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-white">Send</span>
                      <Send size={14} className="text-white" />
                    </div>
                  )}
                </GlowButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AnnouncementModal;
