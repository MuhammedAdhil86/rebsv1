import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function SalarySection() {
  const initialSalary = [
    { label: "Allowances", value: "HRA, DA, SA" },
    { label: "Salary Cycle", value: "Week 1" },
  ];

  const [salaryData, setSalaryData] = useState(initialSalary);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (index, newValue) => {
    const updated = [...salaryData];
    updated[index].value = newValue;
    setSalaryData(updated);
  };

  const handleSave = () => {
    console.log("Saved salary data:", salaryData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 text-[14px]">Salary</h3>
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

      {/* Salary Details */}
      <div className="text-sm space-y-2">
        {salaryData.map(({ label, value }, index) => (
          <div
            key={label}
            className={`flex justify-between items-center border-b border-gray-100 py-2`}
          >
            <span className="text-gray-500 text-[12px]">{label}</span>
            {isEditing ? (
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-800 text-[13px] w-[160px]"
              />
            ) : (
              <span className="font-medium text-gray-800 text-[13px]">{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
