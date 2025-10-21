import React, { useCallback, useState, useEffect } from "react";
import axiosInstance from "../../service/axiosinstance";
import { getValue } from "../../utils/formatHelpers";
import toast, { Toaster } from "react-hot-toast";
import useEmployeeStore from "../../store/employeeStore";

const HierarchyInfoSection = ({
  SectionHeader,
  isEditMode,
  editableSections,
  handleSectionSubmit,
  handleInputChange,
}) => {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const employee = selectedEmployee;

  // --- Local editable state ---
  const [localEdits, setLocalEdits] = useState({
    manager: getValue(employee?.manager),
    team: getValue(employee?.team),
  });

  // --- Sync with selected employee ---
  useEffect(() => {
    setLocalEdits({
      manager: getValue(employee?.manager),
      team: getValue(employee?.team),
    });
  }, [employee]);

  // --- Handle input changes locally ---
  const handleLocalChange = useCallback((field, value) => {
    setLocalEdits((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // --- Submit hierarchy info update ---
  const submitHierarchyUpdate = useCallback(async () => {
    try {
      if (!employee?.id) {
        toast.error("Employee ID not found.");
        return;
      }

      const updatedData = {
        manager: localEdits.manager || "",
        team: localEdits.team || "",
      };

      await axiosInstance.put(
        `/staff/updatehierarchyinfo/${employee.id}`,
        updatedData
      );

      // Update employee store
      setSelectedEmployee({
        ...employee,
        ...updatedData,
      });

      toast.success("Hierarchy information updated successfully!");

      // Update parent handlers
      handleInputChange("hierarchyInfo", "manager", updatedData.manager);
      handleInputChange("hierarchyInfo", "team", updatedData.team);

      handleSectionSubmit("hierarchyInfo");
    } catch (error) {
      console.error(error);
      toast.error("Error updating hierarchy information.");
    }
  }, [
    employee,
    localEdits,
    setSelectedEmployee,
    handleInputChange,
    handleSectionSubmit,
  ]);

  // --- FieldRow reusable component ---
  const FieldRow = useCallback(
    ({ label, value, isEditable, field, type = "text" }) => (
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
          <span className="text-[12px] text-gray-900 font-medium">
            {value || "-"}
          </span>
        )}
      </div>
    ),
    [handleLocalChange, employee?.id]
  );

  if (!employee) return null;

  return (
    <div className="bg-white rounded-lg">
      <SectionHeader title="Hierarchy Information" sectionKey="hierarchyInfo" />

      <div className="mx-4 pt-2 pl-2 pr-2">
        <div className="bg-white rounded-lg">
          <FieldRow
            label="Manager"
            value={localEdits.manager}
            isEditable={isEditMode && editableSections.hierarchyInfo}
            field="manager"
          />
          <FieldRow
            label="Team"
            value={localEdits.team}
            isEditable={isEditMode && editableSections.hierarchyInfo}
            field="team"
          />
        </div>
      </div>

      {isEditMode && editableSections.hierarchyInfo && (
        <div className="mx-4 mt-4 flex justify-start">
          <button
            onClick={submitHierarchyUpdate}
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

export default HierarchyInfoSection;
