import React, { useCallback, useState, useEffect } from "react";
import axiosInstance from "../../service/axiosinstance";
import { getValue } from "../../utils/formatHelpers";
import toast, { Toaster } from "react-hot-toast";
import useEmployeeStore from "../../store/employeeStore";

const DependantDetailsSection = ({
  SectionHeader,
  isEditMode,
  editableSections,
  handleSectionSubmit,
  handleInputChange,
}) => {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const employee = selectedEmployee;

  // --- Local state for editable values ---
  const [localEdits, setLocalEdits] = useState({
    dependant_name: getValue(employee?.dependant_name),
    dependant_relation: getValue(employee?.dependant_relation),
    dependant_date_of_birth: getValue(employee?.dependant_date_of_birth?.split("T")[0]),
  });

  // --- Update local state when employee changes ---
  useEffect(() => {
    setLocalEdits({
      dependant_name: getValue(employee?.dependant_name),
      dependant_relation: getValue(employee?.dependant_relation),
      dependant_date_of_birth: getValue(employee?.dependant_date_of_birth?.split("T")[0]),
    });
  }, [employee]);

  // --- Handle field change locally ---
  const handleLocalChange = useCallback((field, value) => {
    setLocalEdits((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // --- Submit dependant details update ---
  const submitDependantUpdate = useCallback(async () => {
    try {
      if (!employee?.id) {
        toast.error("Employee ID not found.");
        return;
      }

      const updatedData = {
        dependant_name: localEdits.dependant_name || "",
        dependant_relation: localEdits.dependant_relation || "",
        dependant_date_of_birth: localEdits.dependant_date_of_birth || "",
      };

      await axiosInstance.put(`/staff/updatedependantdetails/${employee.id}`, updatedData);

      // Update the global store
      setSelectedEmployee({
        ...employee,
        ...updatedData,
      });

      toast.success("Dependant details updated successfully!");

      // Update parent handlers
      handleInputChange("dependantDetails", "dependant_name", updatedData.dependant_name);
      handleInputChange("dependantDetails", "dependant_relation", updatedData.dependant_relation);
      handleInputChange("dependantDetails", "dependant_date_of_birth", updatedData.dependant_date_of_birth);

      handleSectionSubmit("dependantDetails");
    } catch (error) {
      console.error(error);
      toast.error("Error updating dependant details.");
    }
  }, [
    localEdits,
    employee,
    setSelectedEmployee,
    handleInputChange,
    handleSectionSubmit,
  ]);

  // --- UI Field Row (Reusable) ---
  const FieldRow = useCallback(
    ({ label, value, isEditable, type = "text", field }) => (
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <span className="text-[12px] font-medium text-gray-700">{label}</span>
        {isEditable ? (
          <input
            key={`${field}-${employee?.id}`}
            type={type}
            value={value || ""}
            onChange={(e) => handleLocalChange(field, e.target.value)}
            className="text-sm text-gray-900 text-right bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
          />
        ) : (
          <span className="text-[12px] text-gray-900 font-medium">{value || "-"}</span>
        )}
      </div>
    ),
    [handleLocalChange, employee?.id]
  );

  if (!employee) return null;

  return (
    <div className="bg-white rounded-lg">
      <SectionHeader title="Dependant Details" sectionKey="dependantDetails" />

      <div className="mx-4 pt-2 pl-2 pr-2">
        <div className="bg-white rounded-lg">
          <FieldRow
            label="Dependant Name"
            value={localEdits.dependant_name}
            isEditable={isEditMode && editableSections.dependantDetails}
            field="dependant_name"
          />
          <FieldRow
            label="Relation"
            value={localEdits.dependant_relation}
            isEditable={isEditMode && editableSections.dependantDetails}
            field="dependant_relation"
          />
          <FieldRow
            label="Date of Birth"
            value={localEdits.dependant_date_of_birth}
            isEditable={isEditMode && editableSections.dependantDetails}
            type="date"
            field="dependant_date_of_birth"
          />
        </div>
      </div>

      {isEditMode && editableSections.dependantDetails && (
        <div className="mx-4 mt-4 flex justify-start">
          <button
            onClick={submitDependantUpdate}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors mb-3 mr-5"
          >
            Submit
          </button>
          <Toaster />
        </div>
      )}
    </div>
  );
};

export default DependantDetailsSection;
