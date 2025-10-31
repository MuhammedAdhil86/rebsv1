import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useEmployeeStore from "../../store/employeeStore";
import axiosInstance from "../../service/axiosinstance";
import toast, { Toaster } from "react-hot-toast";

export default function HierarchyInfoSection() {
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    reporting_manager_id: selectedEmployee?.reporting_manager_id || "",
    reporting_manager: selectedEmployee?.reporting_manager || "",
  });
  const [reportingManagers, setReportingManagers] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axiosInstance.get("/master/staff");
        setReportingManagers(response.data.data);
      } catch (error) {
        console.error("Error fetching reporting staff:", error);
      }
    };

    if (isEditing) {
      fetchManagers();
    }
  }, [isEditing]);

  if (!selectedEmployee) {
    return <p className="p-4 text-gray-500">Loading hierarchy info...</p>;
  }

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.reporting_manager_id) {
      toast.error("Please select a reporting manager");
      return;
    }

    try {
      await axiosInstance.put(
        `/staff/updatehierarchyinfo/${selectedEmployee.id}`,
        { reporting_manager_id: formData.reporting_manager_id }
      );

      setSelectedEmployee({
        ...selectedEmployee,
        reporting_manager: formData.reporting_manager,
        reporting_manager_id: formData.reporting_manager_id,
      });

      toast.success("Hierarchy updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update hierarchy");
      console.error(error);
    }
  };

  const data = [
    { label: "Reporting Manager", key: "reporting_manager" },
    { label: "Reporting Manager ID", key: "reporting_manager_id" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border w-full max-w-md mx-auto">
      <Toaster />
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Hierarchy Information</h3>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={handleSave}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Save
            </button>
          )}
          <Icon
            icon="basil:edit-outline"
            className={`w-5 h-5 cursor-pointer ${isEditing ? "text-black" : "text-gray-400"}`}
            onClick={() => setIsEditing((prev) => !prev)}
          />
        </div>
      </div>

      <div className="text-sm space-y-1">
        {/* Reporting Manager */}
        <div className="flex justify-between border-b border-gray-100 py-1">
          <span className="text-gray-500">Reporting Manager</span>
          <span className="font-medium text-gray-800">
            {isEditing ? (
              <select
                value={formData.reporting_manager_id}
                onChange={(e) => {
                  const manager = reportingManagers.find((m) => m.id === e.target.value);
                  handleChange("reporting_manager_id", e.target.value);
                  handleChange("reporting_manager", manager?.name || "");
                }}
                className="border border-gray-300 rounded px-1 py-0.5 text-gray-800"
              >
                <option value="">Select Manager</option>
                {reportingManagers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            ) : (
              formData.reporting_manager || "-"
            )}
          </span>
        </div>

        {/* Reporting Manager ID */}
        <div className="flex justify-between border-b border-gray-100 py-1">
          <span className="text-gray-500">Reporting Manager ID</span>
          <span className="font-medium text-gray-800">
            {formData.reporting_manager_id || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
