import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useEmployeeStore from "../../store/employeeStore";
import axiosInstance from "../../service/axiosinstance";
import toast, { Toaster } from "react-hot-toast";

export default function BankInfoSection() {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  // Initialize formData from store
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        account_holder_name: selectedEmployee.account_holder_name || "",
        ifsc: selectedEmployee.ifsc || "",
        bank_branch: selectedEmployee.bank_branch || "",
        account_number: selectedEmployee.account_number || "",
        bank_name: selectedEmployee.bank_name || "",
      });
    }
  }, [selectedEmployee]);

  const data = [
    { label: "Account Holder", key: "account_holder_name" },
    { label: "IFSC Code", key: "ifsc" },
    { label: "Branch", key: "bank_branch" },
    { label: "Account Number", key: "account_number" },
    { label: "Bank Name", key: "bank_name" },
  ];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData || !selectedEmployee?.id) return;

    const payload = {
      account_holder_name: formData.account_holder_name || "",
      ifsc: formData.ifsc || "",
      bank_branch: formData.bank_branch || "",
      account_number: formData.account_number || "",
      bank_name: formData.bank_name || "",
    };

    try {
      setLoading(true);
      console.log("🔹 PUT Payload:", payload);

      const response = await axiosInstance.put(
        `/staff/updatebankinfo/${selectedEmployee.id}`,
        payload
      );

      console.log("✅ Response:", response.data);

      // Update employee store
      setSelectedEmployee({ ...selectedEmployee, ...payload });

      toast.success("Bank information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating bank info:", error);
      toast.error("Failed to update bank information.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData)
    return <p className="p-4 text-gray-500">Loading bank info...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-lg">
          Bank Information
        </h3>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className={`text-sm text-blue-600 font-medium hover:underline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
          <Icon
            icon="basil:edit-outline"
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => setIsEditing((prev) => !prev)}
            title={isEditing ? "Cancel edit" : "Edit"}
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="text-sm space-y-2">
        {data.map((item) => (
          <div
            key={item.key}
            className="flex justify-between border-b border-gray-100 py-2 items-center"
          >
            <span className="text-gray-500">{item.label}</span>
            {isEditing ? (
              <input
                type="text"
                value={formData[item.key] || ""}
                onChange={(e) => handleChange(item.key, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-full max-w-[160px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium text-gray-800 break-words max-w-[160px] text-right">
                {formData[item.key] || "-"}
              </span>
            )}
          </div>
        ))}
      </div>

      <Toaster />
    </div>
  );
}
