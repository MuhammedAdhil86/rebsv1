import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Paperclip,
  Send,
  User,
  Users,
  Building2,
  Search,
  Check,
  Loader2,
  FileText,
} from "lucide-react";

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
    audienceType: "all", // internal state: all, department, specific
    selectedEmployees: [],
    selectedDepartments: [],
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
          console.error("Failed to load data", err);
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

  const toggleDepartment = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedDepartments: prev.selectedDepartments.includes(id)
        ? prev.selectedDepartments.filter((deptId) => deptId !== id)
        : [...prev.selectedDepartments, id],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // --- KEY FIX IN THIS FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.content);
    payload.append("priority", 1);

    // FIXED AUDIENCE TYPE MAPPING
    let backendAudienceType = "All";
    if (formData.audienceType === "specific") {
      backendAudienceType = "specific_employees"; // This is likely what your DB enum expects
    } else if (formData.audienceType === "department") {
      backendAudienceType = "department";
    }
    payload.append("audience_type", backendAudienceType);

    // FIXED SEND_TO LOGIC
    if (formData.audienceType === "specific") {
      payload.append("send_to", JSON.stringify(formData.selectedEmployees));
    } else if (formData.audienceType === "department") {
      payload.append("send_to", JSON.stringify(formData.selectedDepartments));
    } else {
      payload.append("send_to", JSON.stringify([]));
    }

    if (formData.attachment) {
      payload.append("attachment", formData.attachment);
      const type = formData.attachment.type.split("/")[0];
      payload.append(
        "attachment_type",
        type.charAt(0).toUpperCase() + type.slice(1),
      );
    }

    try {
      const response = await announceService.addAnnouncement(payload);
      console.log("Success:", response);
      handleClose();
    } catch (err) {
      console.error("Submission failed with details:", err.response?.data);
      alert(
        `Error: ${err.response?.data?.data || "Check console for details"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      audienceType: "all",
      selectedEmployees: [],
      selectedDepartments: [],
      attachment: null,
    });
    setFilePreview(null);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm font-poppins text-[12px]">
      <div className="bg-white w-[95%] max-w-[500px] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-5 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-gray-900 text-[16px] font-bold tracking-tight">
              Create Announcement
            </h2>
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">
              Broadcast Updates
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
            <label className="block text-gray-500 font-semibold mb-2 ml-1 uppercase">
              Announcement Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title..."
              className="w-full bg-[#F4F6F8] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:border-lime-500 focus:bg-white transition-all text-gray-700 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-2 ml-1 uppercase">
              Message Content
            </label>
            <textarea
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="What is the announcement?"
              className="w-full bg-[#F4F6F8] border border-transparent rounded-2xl px-5 py-3.5 outline-none focus:border-lime-500 focus:bg-white transition-all text-gray-700 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 font-semibold mb-3 ml-1 uppercase">
              Send To
            </label>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
              {[
                { id: "all", label: "Everyone", icon: <Users size={14} /> },
                {
                  id: "department",
                  label: "Department",
                  icon: <Building2 size={14} />,
                },
                { id: "specific", label: "Specific", icon: <User size={14} /> },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, audienceType: type.id }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-[11px] font-bold ${
                    formData.audienceType === type.id
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          {formData.audienceType === "specific" && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-lime-500 text-[11px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 max-h-[180px] overflow-y-auto p-2 space-y-1">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-lime-500" />
                  </div>
                ) : filteredStaff.length > 0 ? (
                  filteredStaff.map((emp) => {
                    const fullName =
                      emp.name ||
                      `${emp.first_name || ""} ${emp.last_name || ""}`;
                    const empId = emp.uuid || emp.id;
                    return (
                      <div
                        key={empId}
                        onClick={() => toggleEmployee(empId)}
                        className="flex items-center justify-between p-3 hover:bg-white rounded-xl cursor-pointer transition-all border border-transparent hover:border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center text-[10px] font-bold text-lime-700 uppercase">
                            {fullName.charAt(0)}
                          </div>
                          <span className="text-gray-700 font-medium">
                            {fullName}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            formData.selectedEmployees.includes(empId)
                              ? "bg-lime-500 border-lime-500 text-white"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {formData.selectedEmployees.includes(empId) && (
                            <Check size={12} strokeWidth={4} />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    No staff members found
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.audienceType === "department" && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 max-h-[180px] overflow-y-auto p-2 space-y-1">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => toggleDepartment(dept.id)}
                    className="flex items-center justify-between p-3 hover:bg-white rounded-xl cursor-pointer transition-all border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <Building2 size={14} />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {dept.name}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        formData.selectedDepartments.includes(dept.id)
                          ? "bg-lime-500 border-lime-500 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {formData.selectedDepartments.includes(dept.id) && (
                        <Check size={12} strokeWidth={4} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.attachment && (
            <div className="flex items-center justify-between p-3 bg-lime-50 rounded-2xl border border-lime-100 animate-in zoom-in-95">
              <div className="flex items-center gap-3 overflow-hidden">
                {filePreview !== "file_icon" ? (
                  <img
                    src={filePreview}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <FileText className="text-lime-600" size={20} />
                )}
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-lime-900 truncate">
                    {formData.attachment.name}
                  </p>
                  <p className="text-[9px] text-lime-600">
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
                className="p-1 hover:bg-lime-100 rounded-full text-lime-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-gray-100 sticky bottom-0 bg-white">
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
                className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors bg-gray-100 px-4 py-2.5 rounded-2xl border border-transparent"
              >
                <Paperclip size={16} />
                <span className="font-bold">Attach</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 text-gray-400 hover:text-gray-600 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span className="font-bold text-[13px]">Push Now</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
