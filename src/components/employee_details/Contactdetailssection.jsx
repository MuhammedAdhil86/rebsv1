import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import useEmployeeStore from "../../store/employeeStore";
import axiosInstance from "../../service/axiosinstance";
import toast, { Toaster } from "react-hot-toast";

export default function ContactInfoSection() {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  // ✅ Initialize form data when employee changes
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        work_phone: selectedEmployee.work_phone || "",
        personal_mobile: selectedEmployee.ph_no || "",
        extension_number: selectedEmployee.extension_number || "",
        personal_email: selectedEmployee.personal_email || "",
        seating_location: selectedEmployee.seating_location || "",
        tags: selectedEmployee.tags || "",
        present_address: selectedEmployee.present_address || "",
        permanant_address: selectedEmployee.permanant_address || "",
      });
    }
  }, [selectedEmployee]);

  // ✅ All fields configuration
  const contactFields = [
    { label: "Work Phone", key: "work_phone" },
    { label: "Personal Mobile", key: "personal_mobile" },
    { label: "Extension Number", key: "extension_number" },
    { label: "Personal Email", key: "personal_email" },
    { label: "Seating Location", key: "seating_location" },
    { label: "Tags", key: "tags" },
    { label: "Present Address", key: "present_address" },
    { label: "Permanent Address", key: "permanant_address" },
  ];

  // ✅ Handle form change
  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ✅ Save data to backend
  const handleSave = useCallback(async () => {
    if (!formData || !selectedEmployee?.id) return;

    const sanitizedData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, v === "Not specified" ? "" : v])
    );

    const apiUrl = `/staff/updatecontactinfo/${selectedEmployee.id}`;

    try {
      setLoading(true);
      console.log("📤 Sending contact update:", sanitizedData);

      const response = await axiosInstance.put(apiUrl, sanitizedData);
      console.log("✅ Contact info updated:", response.data);

      // Update global store
      setSelectedEmployee({ ...selectedEmployee, ...sanitizedData });
      toast.success("Contact details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating contact information:", error);
      toast.error("Failed to update contact information. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, selectedEmployee, setSelectedEmployee]);

  if (!formData)
    return <p className="p-4 text-gray-500">Loading contact info...</p>;

  // ✅ UI
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">Contact Details</h3>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
          <Icon
            icon="basil:edit-outline"
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => setIsEditing((prev) => !prev)}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="text-sm space-y-2">
        {contactFields.map((field) => {
          const value = formData[field.key];
          const displayValue =
            value === null || value === undefined || value.trim() === ""
              ? "N/A"
              : value;

          return (
            <div
              key={field.key}
              className="flex justify-between border-b border-gray-100 py-2"
            >
              <span className="text-gray-500">{field.label}</span>
              <span className="text-gray-800 min-w-0 break-words text-right">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-full max-w-[160px]"
                  />
                ) : (
                  displayValue
                )}
              </span>
            </div>
          );
        })}
      </div>

      <Toaster />
    </div>
  );
}
