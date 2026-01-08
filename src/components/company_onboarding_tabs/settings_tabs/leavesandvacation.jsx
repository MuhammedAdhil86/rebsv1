import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function LeavesVacation({ employee }) {
  // Mock data - replace with employee?.leave_policy or similar if available
  const initialData = {
    policy: "Casual, Sick, +3 more",
    vacationDays: 0,
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Add your save logic/API call here
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800 text-[14px]">
          Leaves and Vacation
        </h3>
        <div className="flex items-center gap-2">
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
      </div>

      {/* Details */}
      <div className="text-sm space-y-4">
        {/* Leave Policy */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <span className="text-gray-500 text-[12px]">Leave Policy</span>
          {isEditing ? (
            <input
              type="text"
              defaultValue={initialData.policy}
              className="border border-gray-300 rounded px-2 py-1 text-gray-800 text-[13px] w-[180px]"
            />
          ) : (
            <span className="font-medium text-gray-800 text-[13px]">
              {initialData.policy}
            </span>
          )}
        </div>

        {/* Vacation */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500 text-[12px]">Vacation</span>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                defaultValue={initialData.vacationDays}
                className="border border-gray-300 rounded px-2 py-1 text-gray-800 text-[13px] w-[60px]"
              />
              <span className="text-[13px]">days</span>
            </div>
          ) : (
            <span className="font-medium text-gray-800 text-[13px]">
              {initialData.vacationDays} days
            </span>
          )}
        </div>
      </div>
    </div>
  );
}