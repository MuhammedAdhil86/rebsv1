import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function ActionCenterSection() {
  const actionList = ["Terminate", "Suspend", "Send Warning", "Custom Action"];
  
  const [selectedActions, setSelectedActions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const toggleAction = (action) => {
    setSelectedActions((prev) =>
      prev.includes(action)
        ? prev.filter((a) => a !== action)
        : [...prev, action]
    );
  };

  const handleSave = () => {
    console.log("Saved actions:", selectedActions);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 text-[14px]">Action Center</h3>
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

      {/* Actions Grid */}
      <div className="grid grid-cols-4 gap-3 text-center text-sm">
        {actionList.map((action) => {
          const selected = selectedActions.includes(action);
          return (
            <div
              key={action}
              onClick={() => isEditing && toggleAction(action)}
              className={`rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm cursor-pointer transition-transform duration-200 ${
                selected
                  ? "bg-[#D9C9FF] scale-105"
                  : "bg-[#F4EEFF] hover:scale-105"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selected ? "bg-[#C1A0FF]" : "bg-[#E3D3FF]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    selected ? "bg-[#6A40E4]" : "bg-[#6A40E4]"
                  }`}
                ></div>
              </div>
              <p className="text-[13px] mt-2 text-gray-700">{action}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
