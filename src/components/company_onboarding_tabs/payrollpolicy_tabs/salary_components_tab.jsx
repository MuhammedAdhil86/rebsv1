import React, { useState } from "react";
import Earnings from "./salary_component_tabs/earnings";

const SalaryComponents = () => {
  const [activeSubTab, setActiveSubTab] = useState("earnings");

  const subTabs = [
    { id: "earnings", label: "Earnings" },
    { id: "deductions", label: "Deductions" },
    { id: "benefits", label: "Benefits" },
    { id: "reimbursements", label: "Reimbursements" },
  ];

  return (
    <div className="w-full">
      {/* Sub Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              activeSubTab === tab.id
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tab Content */}
      {activeSubTab === "earnings" && <Earnings />}
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
