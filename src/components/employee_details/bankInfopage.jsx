import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../service/axiosinstance";
import { getValue } from "../../utils/formatHelpers";
import toast, { Toaster } from "react-hot-toast";
import useEmployeeStore from "../../store/employeeStore";

const BankInfoSection = ({
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
    bank_name: getValue(employee?.bank_name),
    account_number: getValue(employee?.account_number),
    ifsc: getValue(employee?.ifsc),
    branch: getValue(employee?.branch),
  });

  // --- Sync local edits when employee changes ---
  useEffect(() => {
    setLocalEdits({
      bank_name: getValue(employee?.bank_name),
      account_number: getValue(employee?.account_number),
      ifsc: getValue(employee?.ifsc),
      branch: getValue(employee?.branch),
    });
  }, [employee]);

  // --- Handle local input changes ---
  const handleLocalChange = useCallback((field, value) => {
    setLocalEdits((prev) => ({ ...prev, [field]: value }));
  }, []);

  // --- Submit bank info update ---
  const submitBankInfoUpdate = useCallback(async () => {
    try {
      if (!employee?.id) {
        toast.error("Employee ID missing.");
        return;
      }

      const updatedData = {
        bank_name: localEdits.bank_name || "",
        account_number: localEdits.account_number || "",
        ifsc: localEdits.ifsc || "",
        branch: localEdits.branch || "",
      };

      await axiosInstance.put(
        `/staff/updatebankinfo/${employee.id}`,
        updatedData
      );

      setSelectedEmployee({ ...employee, ...updatedData });
      toast.success("Bank information updated successfully!");

      handleInputChange("bankInfo", "bank_name", updatedData.bank_name);
      handleInputChange("bankInfo", "account_number", updatedData.account_number);
      handleInputChange("bankInfo", "ifsc", updatedData.ifsc);
      handleInputChange("bankInfo", "branch", updatedData.branch);

      handleSectionSubmit("bankInfo");
    } catch (error) {
      console.error(error);
      toast.error("Error updating bank information.");
    }
  }, [employee, localEdits, setSelectedEmployee, handleInputChange, handleSectionSubmit]);

  // --- Reusable FieldRow ---
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
      <SectionHeader title="Bank Information" sectionKey="bankInfo" />

      <div className="mx-4 pt-2 pl-2 pr-2">
        <div className="bg-white rounded-lg">
          <FieldRow
            label="Bank Name"
            value={localEdits.bank_name}
            isEditable={isEditMode && editableSections.bankInfo}
            field="bank_name"
          />
          <FieldRow
            label="Account Number"
            value={localEdits.account_number}
            isEditable={isEditMode && editableSections.bankInfo}
            field="account_number"
          />
          <FieldRow
            label="IFSC Code"
            value={localEdits.ifsc}
            isEditable={isEditMode && editableSections.bankInfo}
            field="ifsc"
          />
          <FieldRow
            label="Branch"
            value={localEdits.branch}
            isEditable={isEditMode && editableSections.bankInfo}
            field="branch"
          />
        </div>
      </div>

      {isEditMode && editableSections.bankInfo && (
        <div className="mx-4 mt-4 flex justify-start">
          <button
            onClick={submitBankInfoUpdate}
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

export default BankInfoSection;
