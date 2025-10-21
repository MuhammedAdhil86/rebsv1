import React, { useCallback, useState, useEffect } from "react";
import axiosInstance from "../../service/axiosinstance";
import { getValue } from "../../utils/formatHelpers";
import toast, { Toaster } from "react-hot-toast";
import useEmployeeStore from "../../store/employeeStore";

const ContactDetailsSection = ({
  SectionHeader,
  EditableInput,
  isEditMode,
  editableSections,
  handleSectionSubmit,
  handleInputChange,
}) => {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const employee = selectedEmployee;

  // Local state for form edits
  const [localEdits, setLocalEdits] = useState({
    address: getValue(employee?.present_address),
    city: getValue(employee?.city),
    state: getValue(employee?.state),
    zip_code: getValue(employee?.zip_code),
  });

  // Sync with store when employee changes
  useEffect(() => {
    setLocalEdits({
      address: getValue(employee?.present_address),
      city: getValue(employee?.city),
      state: getValue(employee?.state),
      zip_code: getValue(employee?.zip_code),
    });
  }, [employee]);

  // Handle field changes
  const handleLocalChange = useCallback((field, value) => {
    setLocalEdits((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Submit update API call
  const submitContactUpdate = useCallback(async () => {
    try {
      if (!employee?.id) {
        toast.error("Employee ID not found.");
        return;
      }

      const updatedData = {
        present_address: localEdits.address || "",
        city: localEdits.city || "",
        state: localEdits.state || "",
        zip_code: localEdits.zip_code || "",
      };

      await axiosInstance.put(`/staff/updatecontactinfo/${employee.id}`, updatedData);

      // Update global store
      setSelectedEmployee({
        ...employee,
        ...updatedData,
      });

      toast.success("Contact details updated successfully!");

      // Update parent edit handlers
      handleInputChange("contactDetails", "present_address", updatedData.present_address);
      handleInputChange("contactDetails", "city", updatedData.city);
      handleInputChange("contactDetails", "state", updatedData.state);
      handleInputChange("contactDetails", "zip_code", updatedData.zip_code);

      handleSectionSubmit("contactDetails");
    } catch (error) {
      console.error(error);
      toast.error("Error updating contact details.");
    }
  }, [
    localEdits,
    employee,
    setSelectedEmployee,
    handleInputChange,
    handleSectionSubmit,
  ]);

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
      <SectionHeader title="Contact Details" sectionKey="contactDetails" />

      <div className="mx-4 pt-2 pl-2 pr-2">
        <div className="bg-white rounded-lg">
          <FieldRow
            label="Address"
            value={localEdits.address}
            isEditable={isEditMode && editableSections.contactDetails}
            field="address"
          />
          <FieldRow
            label="City"
            value={localEdits.city}
            isEditable={isEditMode && editableSections.contactDetails}
            field="city"
          />
          <FieldRow
            label="State"
            value={localEdits.state}
            isEditable={isEditMode && editableSections.contactDetails}
            field="state"
          />
          <FieldRow
            label="Zip Code"
            value={localEdits.zip_code}
            isEditable={isEditMode && editableSections.contactDetails}
            field="zip_code"
          />
        </div>
      </div>

      {isEditMode && editableSections.contactDetails && (
        <div className="mx-4 mt-4 flex justify-start">
          <button
            onClick={submitContactUpdate}
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

export default ContactDetailsSection;
