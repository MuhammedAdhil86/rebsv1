import React, { useCallback, useState, useEffect } from "react";
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

  // Local editable state
  const [localEdits, setLocalEdits] = useState({
    employee_id: getValue(employee?.uuid),
    department: getValue(employee?.department),
    designation: getValue(employee?.designation),
    joining_date: getValue(employee?.date_of_join?.split("T")[0]), // handle ISO date
  });

  // Sync when employee changes
  useEffect(() => {
    setLocalEdits({
      employee_id: getValue(employee?.uuid),
      department: getValue(employee?.department),
      designation: getValue(employee?.designation),
      joining_date: getValue(employee?.date_of_join?.split("T")[0]),
    });
  }, [employee]);

  // Handle local edits
  const handleLocalChange = useCallback((field, value) => {
    setLocalEdits((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Submit work info update
  const submitWorkUpdate = useCallback(async () => {
    try {
      if (!employee?.id) {
        toast.error("Employee ID not found.");
        return;
      }

      const updatedData = {
        uuid: localEdits.employee_id || "",
        department: localEdits.department || "",
        designation: localEdits.designation || "",
        date_of_join: localEdits.joining_date || "",
      };

      await axiosInstance.put(`/staff/updateworkinfo/${employee.id}`, updatedData);

      // Update global store
      setSelectedEmployee({
        ...employee,
        ...updatedData,
      });

      toast.success("Work information updated successfully!");

      // Notify parent handler
      handleInputChange("workInfo", "uuid", updatedData.uuid);
      handleInputChange("workInfo", "department", updatedData.department);
      handleInputChange("workInfo", "designation", updatedData.designation);
      handleInputChange("workInfo", "date_of_join", updatedData.date_of_join);

      handleSectionSubmit("workInfo");
    } catch (error) {
      console.error(error);
      toast.error("Error updating work information.");
    }
  }, [
    localEdits,
    employee,
    setSelectedEmployee,
    handleInputChange,
    handleSectionSubmit,
  ]);

  // Field row for consistent style
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
      <SectionHeader title="Work Information" sectionKey="workInfo" />

      <div className="mx-4 pt-2 pl-2 pr-2">
        <div className="bg-white rounded-lg">
          <FieldRow
            label="Employee ID"
            value={localEdits.employee_id}
            isEditable={false}
            field="employee_id"
          />
          <FieldRow
            label="Department"
            value={localEdits.department}
            isEditable={isEditMode && editableSections.workInfo}
            field="department"
          />
          <FieldRow
            label="Designation"
            value={localEdits.designation}
            isEditable={isEditMode && editableSections.workInfo}
            field="designation"
          />
          <FieldRow
            label="Joining Date"
            value={localEdits.joining_date}
            isEditable={isEditMode && editableSections.workInfo}
            type="date"
            field="joining_date"
          />
        </div>
      </div>

      {isEditMode && editableSections.workInfo && (
        <div className="mx-4 mt-4 flex justify-start">
          <button
            onClick={submitWorkUpdate}
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

export default WorkInfoSection;
