import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../service/axiosinstance";
import { getValue } from "../../utils/formatHelpers";
import toast, { Toaster } from "react-hot-toast";
import useEmployeeStore from "../../store/employeeStore";

const WorkInfoSection = ({
  SectionHeader,
  EditableInput,
  isEditMode,
  editableSections,
  handleSectionSubmit,
  handleInputChange,
}) => {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const employee = selectedEmployee;

  // ✅ Format date to "DD MMM YYYY" (e.g., 15 Oct 2025)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [localEdits, setLocalEdits] = useState({
    employeeId: getValue(employee?.uuid),
    department: getValue(employee?.department),
    designation: getValue(employee?.designation),
    joiningDate: formatDate(employee?.date_of_join),
  });

  // Sync local edits when employee changes
  useEffect(() => {
    setLocalEdits({
      employeeId: getValue(employee?.uuid),
      department: getValue(employee?.department),
      designation: getValue(employee?.designation),
      joiningDate: formatDate(employee?.date_of_join),
    });
  }, [employee]);

  // Handle input changes
  const handleLocalChange = useCallback((field, value) => {
    setLocalEdits((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Submit updates
  const submitWorkInfoUpdate = useCallback(async () => {
    if (!employee?.id) {
      toast.error("Employee not selected.");
      return;
    }

    try {
      const updatedData = {
        department: localEdits.department || "",
        designation: localEdits.designation || "",
        date_of_join: localEdits.joiningDate || "",
      };

      await axiosInstance.put(
        `/staff/updateworkinfo/${employee.id}`,
        updatedData
      );

      // Update store
      setSelectedEmployee({ ...employee, ...updatedData });

      toast.success("Work information updated successfully!");

      // Update parent edited state
      handleInputChange("workInfo", "department", updatedData.department);
      handleInputChange("workInfo", "designation", updatedData.designation);
      handleInputChange("workInfo", "date_of_join", updatedData.date_of_join);

      handleSectionSubmit("workInfo");
    } catch (error) {
      console.error(error);
      toast.error("Error updating work information.");
    }
  }, [
    employee,
    localEdits,
    handleInputChange,
    handleSectionSubmit,
    setSelectedEmployee,
  ]);

  if (!employee) return null;

  return (
    <div className="bg-white rounded-lg p-4">
      <SectionHeader title="Work Information" sectionKey="workInfo" />

      <div className="grid grid-cols-2 gap-4 mt-2">
        <EditableInput
          label="Employee ID"
          value={localEdits.employeeId}
          isEditable={false}
        />
        <EditableInput
          label="Department"
          value={localEdits.department}
          isEditable={isEditMode && editableSections.workInfo}
          onChange={(val) => handleLocalChange("department", val)}
        />
        <EditableInput
          label="Designation"
          value={localEdits.designation}
          isEditable={isEditMode && editableSections.workInfo}
          onChange={(val) => handleLocalChange("designation", val)}
        />
        <EditableInput
          label="Joining Date"
          value={localEdits.joiningDate}
          isEditable={isEditMode && editableSections.workInfo}
          type="text" // ✅ Use text so we can show formatted value
          onChange={(val) => handleLocalChange("joiningDate", val)}
        />
      </div>

      {isEditMode && editableSections.workInfo && (
        <div className="mt-4 flex">
          <button
            onClick={submitWorkInfoUpdate}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Submit
          </button>
          <Toaster />
        </div>
      )}
    </div>
  );
};

export default WorkInfoSection;
