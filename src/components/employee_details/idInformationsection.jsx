import React, { useCallback, useState, useEffect } from "react";
import axiosInstance from "../../service/axiosinstance";
import { getValue } from "../../utils/formatHelpers";
import toast, { Toaster } from "react-hot-toast";
import useEmployeeStore from "../../store/employeeStore";

const IdInformationSection = ({
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
    uan: getValue(employee?.uan),
    pan: getValue(employee?.pan),
    aadhar: getValue(employee?.aadhar),
  });

  // --- Sync with selected employee ---
  useEffect(() => {
    setLocalEdits({
      uan: getValue(employee?.uan),
      pan: getValue(employee?.pan),
      aadhar: getValue(employee?.aadhar),
    });
  }, [employee]);

  // --- Handle local input change ---
  const handleLocalChange = useCallback((field, value) => {
    setLocalEdits((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // --- Submit update to backend ---
  const submitIdInfoUpdate = useCallback(async () => {
    try {
      if (!employee?.id) {
        toast.error("Employee ID not found.");
        return;
      }

      const updatedData = {
        uan: localEdits.uan || "",
        pan: localEdits.pan || "",
        aadhar: localEdits.aadhar || "",
      };

      await axiosInstance.put(`/staff/updateidinfo/${employee.id}`, updatedData);

      // update store
      setSelectedEmployee({
        ...employee,
        ...updatedData,
      });

      toast.success("ID information updated successfully!");

      // propagate changes upward
      handleInputChange("idInformation", "uan", updatedData.uan);
      handleInputChange("idInformation", "pan", updatedData.pan);
      handleInputChange("idInformation", "aadhar", updatedData.aadhar);

      handleSectionSubmit("idInformation");
    } catch (error) {
      console.error(error);
      toast.error("Error updating ID information.");
    }
  }, [
    employee,
    localEdits,
    setSelectedEmployee,
    handleInputChange,
    handleSectionSubmit,
  ]);

  // --- Field Row reusable ---
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
          <span className="text-[12px] text-gray-900 font-medium">{value || "-"}</span>
        )}
      </div>
    ),
    [handleLocalChange, employee?.id]
  );

  if (!employee) return null;

  return (
    <div className="bg-white rounded-lg">
      <SectionHeader title="ID Information" sectionKey="idInformation" />

      <div className="mx-4 pt-2 pl-2 pr-2">
        <div className="bg-white rounded-lg">
          <FieldRow
            label="UAN"
            value={localEdits.uan}
            isEditable={isEditMode && editableSections.idInformation}
            field="uan"
          />
          <FieldRow
            label="PAN"
            value={localEdits.pan}
            isEditable={isEditMode && editableSections.idInformation}
            field="pan"
          />
          <FieldRow
            label="Aadhar"
            value={localEdits.aadhar}
            isEditable={isEditMode && editableSections.idInformation}
            field="aadhar"
          />
        </div>
      </div>

      {isEditMode && editableSections.idInformation && (
        <div className="mx-4 mt-4 flex justify-start">
          <button
            onClick={submitIdInfoUpdate}
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

export default IdInformationSection;
