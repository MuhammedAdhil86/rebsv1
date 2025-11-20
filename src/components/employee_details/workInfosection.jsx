import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";
import useEmployeeStore from "../../store/employeeStore";
import axiosInstance from "../../service/axiosinstance";

export default function WorkInfoSection() {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  // Initialize formData from selectedEmployee
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        employeeRef: selectedEmployee.employee_ref_no || "",
        branchId: selectedEmployee.branch_id || "",
        department: selectedEmployee.department || "",       // display name instead of id
        designation: selectedEmployee.designation || "",     // display name instead of id
        sourceOfHiring: selectedEmployee.source_of_hiring || "",
        employmentStatus: selectedEmployee.employment_status || "", // display name instead of id
        employeeType: selectedEmployee.employee_type || "",
        totalExperience: selectedEmployee.total_experience || "",
        joiningDate: selectedEmployee.date_of_join
          ? selectedEmployee.date_of_join.split("T")[0]
          : "",
      });
    }
  }, [selectedEmployee]);

  if (!formData) return <p className="p-4 text-gray-500">Loading work info...</p>;

  const dataFields = [
    { label: "Employee Reference Number", key: "employeeRef", type: "text" },
    { label: "Branch", key: "branchId", type: "text" },
    { label: "Department", key: "department", type: "text" },
    { label: "Designation / Role", key: "designation", type: "text" },
    { label: "Source of Hiring", key: "sourceOfHiring", type: "text" },
    { label: "Employment Status", key: "employmentStatus", type: "text" },
    { label: "Employment Type", key: "employeeType", type: "text" },
    { label: "Total Experience", key: "totalExperience", type: "number" },
    { label: "Date of Joining", key: "joiningDate", type: "date" },
  ];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selectedEmployee) return;

    const payload = {
      employee_ref_no: formData.employeeRef?.trim() || "",
      branch_id: formData.branchId?.trim() || null,
      department: formData.department?.trim() || null,
      designation: formData.designation?.trim() || null,
      source_of_hiring: formData.sourceOfHiring?.trim() || "",
      employment_status: formData.employmentStatus?.trim() || null,
      employee_type: formData.employeeType?.trim() || null,
      total_experience: formData.totalExperience || 0,
      date_of_join: formData.joiningDate || null,
    };

    try {
      setLoading(true);
      await axiosInstance.put(`/staff/updateworkinfo/${selectedEmployee.id}`, payload);
      setSelectedEmployee({ ...selectedEmployee, ...payload });
      toast.success("Work information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update work information.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayValue = (value) => {
    if (!value || value === "0" || value === "null" || value === "") return "N/A";
    return value;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[14px] font-semibold text-gray-800">Work Information</h3>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              className={`text-sm text-blue-600 hover:underline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
          <Icon
            icon="basil:edit-outline"
            className="w-5 h-5 text-gray-400 cursor-pointer"
            title={isEditing ? "Cancel edit" : "Edit"}
            onClick={() => setIsEditing((prev) => !prev)}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="text-sm space-y-2">
        {dataFields.map((field) => (
          <div key={field.key} className="flex justify-between items-center border-b border-gray-100 py-2">
            {/* Label */}
            <span className="text-gray-500 text-[12px]">{field.label}</span>

            {/* Value / Input */}
            <span className="text-gray-800 font-medium min-w-[160px] text-right">
              {isEditing ? (
                <input
                  type={field.type}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full max-w-[180px] text-[13px]"
                />
              ) : (
                <span className="text-[13px]">{getDisplayValue(formData[field.key])}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <Toaster />
    </div>
  );
}
