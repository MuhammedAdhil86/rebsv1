import React, { useState } from "react";
import Earnings from "./salary_component_tabs/earnings";
import EditEarning from "./salary_component_tabs/edit_earning ";

const SalaryComponents = () => {
  const [activeSubTab, setActiveSubTab] = useState("earnings");
  const [editingId, setEditingId] = useState(null);

  const subTabs = [
    { id: "earnings", label: "Earnings" },
    { id: "deductions", label: "Deductions" },
    { id: "benefits", label: "Benefits" },
    { id: "reimbursements", label: "Reimbursements" },
  ];

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="w-full">

      {/* SUB TABS */}
      <div className="flex border-b border-gray-200 mb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setEditingId(null);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeSubTab === tab.id
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* EARNINGS TAB */}
      {activeSubTab === "earnings" && (
        <>
          {!editingId ? (
            <Earnings onEdit={handleEdit} />
          ) : (
            <EditEarning
              componentId={editingId}
              onCancel={handleCancelEdit}
            />
          )}
        </>
      )}

      {/* PLACEHOLDER TABS */}
      {activeSubTab !== "earnings" && (
        <div className="py-6 text-center text-sm text-gray-500">
          {subTabs.find(t => t.id === activeSubTab)?.label} coming soon
        </div>
      )}
    </div>
  );
};

export default SalaryComponents;
