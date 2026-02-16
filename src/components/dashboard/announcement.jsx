import React, { useState, useEffect } from "react";
import {
  X,
  Paperclip,
  Send,
  User,
  Users,
  Building2,
  Search,
  Check,
} from "lucide-react";
// Import both staff and department APIs
import { getStaffDetails } from "../../service/employeeService";
import { getDepartmentData } from "../../service/companyService";
const AnnouncementModal = ({ isOpen, onClose }) => {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audienceType: "all",
    selectedEmployees: [], // Array to store IDs of checked employees
    attachment: null,
  });

  // Fetch Data on Open
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [staffData, deptData] = await Promise.all([
            getStaffDetails(),
            getDepartmentData(),
          ]);
          setStaff(staffData || []);
          setDepartments(deptData || []);
        } catch (err) {
          console.error("Failed to load data", err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle Checkbox Logic
  const toggleEmployee = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(id)
        ? prev.selectedEmployees.filter((empId) => empId !== id)
        : [...prev.selectedEmployees, id],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Announcement Payload:", formData);
    onClose();
  };

  // Filter staff based on search
  const filteredStaff = staff.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm font-poppins font-normal text-[12px]">
      <div className="bg-white w-[90%] max-w-[500px] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-gray-800 text-[14px] font-medium">
            Create New Announcement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-gray-500 mb-1.5 ml-1">
              Announcement Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter headline..."
              className="w-full bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-lime-500 transition-all text-gray-700"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-500 mb-1.5 ml-1">
              Message Content
            </label>
            <textarea
              name="content"
              rows="3"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="What would you like to announce?"
              className="w-full bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-lime-500 transition-all text-gray-700 resize-none"
              required
            />
          </div>

          {/* Audience Selection */}
          <div>
            <label className="block text-gray-500 mb-2 ml-1">Send To</label>
            <div className="flex flex-wrap gap-3">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    formData.audienceType === type.id
                      ? "bg-lime-50 border-lime-500 text-lime-700 font-medium"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* SPECIFIC EMPLOYEES LIST - Only shows if 'Specific' is selected */}
          {formData.audienceType === "specific" && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <div className="relative mb-3">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 outline-none focus:border-lime-500 text-[11px]"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-[#F4F6F8] rounded-xl border border-gray-100 max-h-[180px] overflow-y-auto p-2 space-y-1">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => toggleEmployee(emp.id)}
                      className="flex items-center justify-between p-2 hover:bg-white rounded-lg cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {emp.name?.charAt(0)}
                        </div>
                        <span className="text-gray-700">{emp.name}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          formData.selectedEmployees.includes(emp.id)
                            ? "bg-lime-500 border-lime-500 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {formData.selectedEmployees.includes(emp.id) && (
                          <Check size={10} strokeWidth={4} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-400">
                    No employees found
                  </p>
                )}
              </div>
              <p className="mt-2 text-[10px] text-lime-600 font-medium ml-1">
                {formData.selectedEmployees.length} employees selected
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100 mt-4 flex-shrink-0">
            <div className="relative">
              <input
                type="file"
                id="modal-attach"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="modal-attach"
                className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors bg-gray-100 px-3 py-2 rounded-lg"
              >
                <Paperclip size={14} />
                <span className="max-w-[100px] truncate">
                  {formData.attachment ? formData.attachment.name : "Attach"}
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all shadow-sm"
              >
                <span>Push Now</span>
                <Send size={14} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
