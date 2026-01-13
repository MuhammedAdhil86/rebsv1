import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../../../service/axiosinstance";

export default function SalarySection({ employee }) {
  const [templateName, setTemplateName] = useState("-");
  const [salaryCycle, setSalaryCycle] = useState("Week 1");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!employee?.user_id) return;

    const fetchTemplateAllocation = async () => {
      try {
        const res = await axiosInstance.get(
          `${axiosInstance.baseURL2}api/payroll/template-allocations/user`,
          {
            params: { user_id: employee.user_id },
          }
        );

        const allocation = res.data?.data?.allocation;
        const template = allocation?.template;

        if (template?.name) {
          setTemplateName(template.name);
        }
      } catch (error) {
        console.error("Failed to fetch salary template", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateAllocation();
  }, [employee?.user_id]);

  const handleSave = () => {
    console.log("Saved Salary Data:", {
      templateName,
      salaryCycle,
    });
    setIsEditing(false);
    // TODO: API call if salary cycle is editable
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 text-[14px]">Salary</h3>

        {isEditing ? (
          <button
            onClick={handleSave}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Save
          </button>
        ) : (
          <Icon
            icon="basil:edit-outline"
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-gray-500 text-sm">Loading salary details...</div>
      ) : (
        <div className="text-sm space-y-2">
          {/* Template Name */}
          <div className="flex justify-between items-center border-b border-gray-100 py-2">
            <span className="text-gray-500 text-[12px]">Payroll Template</span>
            <span className="font-medium text-gray-800 text-[13px]">
              {templateName}
            </span>
          </div>

          {/* Salary Cycle */}
          <div className="flex justify-between items-center border-b border-gray-100 py-2">
            <span className="text-gray-500 text-[12px]">Salary Cycle</span>

            {isEditing ? (
              <input
                type="text"
                value={salaryCycle}
                onChange={(e) => setSalaryCycle(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-800 text-[13px] w-[140px]"
              />
            ) : (
              <span className="font-medium text-gray-800 text-[13px]">
                {salaryCycle}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
