import React, { useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import Earnings from "./salary_component_tabs/earnings";
import EditEarning from "./salary_component_tabs/edit_earning ";

const SalaryComponents = () => {
  const [activeSubTab, setActiveSubTab] = useState("earnings");
  const [isEditingEarnings, setIsEditingEarnings] = useState(false);

  const subTabs = [
    { id: "earnings", label: "Earnings" },
    { id: "deductions", label: "Deductions" },
    { id: "benefits", label: "Benefits" },
    { id: "reimbursements", label: "Reimbursements" },
  ];

  return (
    <div className="w-full">

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 mb-4">
        <div className="flex">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setIsEditingEarnings(false);
              }}
              className={`px-4 py-2 text-[16px] font-medium border-b-2 transition-all ${
                activeSubTab === tab.id
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Edit Earnings Button */}
        {activeSubTab === "earnings" && !isEditingEarnings && (
          <button
            onClick={() => setIsEditingEarnings(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-1.5 rounded-md transition font-medium"
          >
            Edit Earnings
          </button>
        )}

        {/* Back Button with React Icon (NO TEXT) */}
        {isEditingEarnings && (
          <button
            onClick={() => setIsEditingEarnings(false)}
            className=" hover:text-gray-800 text-sm px-3 py-1 flex items-center"
          >
            <FiChevronLeft size={18} color="black" />
          </button>
        )}
      </div>

      {/* Earnings Tab Content */}
      {activeSubTab === "earnings" &&
        (isEditingEarnings ? <EditEarning /> : <Earnings />)}

      {/* Other Tabs */}
      {activeSubTab === "deductions" && (
        <div className="text-gray-500 py-6 text-sm text-center">
          Deductions table coming soon
        </div>
      )}

      {activeSubTab === "benefits" && (
        <div className="text-gray-500 py-6 text-sm text-center">
          Benefits table coming soon
        </div>
      )}

      {activeSubTab === "reimbursements" && (
        <div className="text-gray-500 py-6 text-sm text-center">
          Reimbursements table coming soon
        </div>
      )}
    </div>
  );
};

export default SalaryComponents;
