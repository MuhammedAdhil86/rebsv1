import React, { useState } from "react";
import Earnings from "./salary_component_tabs/earnings_tab";
import EditEarning from "./salary_component_tabs/edit_earning ";

const SalaryComponents = () => {
  const [activeSubTab, setActiveSubTab] = useState("earnings");
  const [editingData, setEditingData] = useState(null);

  // Dummy earnings data
  const [earningsData, setEarningsData] = useState([
    {
      id: 1,
      name: "Basic Pay",
      internal_name: "basic_pay",
      payslip_name: "Basic",
      calculation_type: "percentage_basic",
      value: 50,
      active: true,
      taxable: true,
      part_of_salary_structure: true,
      pro_rata: false,
      flexible_benefit: false,
      consider_epf: true,
      consider_esi: true,
      show_in_payslip: true,
    },
    {
      id: 2,
      name: "Bonus",
      internal_name: "bonus",
      payslip_name: "Bonus",
      calculation_type: "flat",
      value: 1000,
      active: true,
      taxable: false,
      part_of_salary_structure: false,
      pro_rata: false,
      flexible_benefit: false,
      consider_epf: false,
      consider_esi: false,
      show_in_payslip: true,
    },
  ]);

  const subTabs = [
    { id: "earnings", label: "Earnings" },
    { id: "deductions", label: "Deductions" },
    { id: "benefits", label: "Benefits" },
    { id: "reimbursements", label: "Reimbursements" },
  ];

  // Open Edit form
  const handleEdit = (row) => {
    setEditingData(row);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingData(null);
  };

  // Save updated row
  const handleSave = (updatedRow) => {
    const updatedData = earningsData.map((row) =>
      row.id === updatedRow.id ? updatedRow : row,
    );
    setEarningsData(updatedData);
    setEditingData(null);
  };

  return (
    <div className="w-full p-4">
      {/* SUB TABS */}
      <div className="flex border-b border-gray-200 mb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setEditingData(null);
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
          {!editingData ? (
            <Earnings data={earningsData} onEdit={handleEdit} />
          ) : (
            <EditEarning
              data={editingData}
              onCancel={handleCancelEdit}
              onSave={handleSave}
            />
          )}
        </>
      )}

      {/* PLACEHOLDER TABS */}
      {activeSubTab !== "earnings" && (
        <div className="py-6 text-center text-sm text-gray-500">
          {subTabs.find((t) => t.id === activeSubTab)?.label} coming soon
        </div>
      )}
    </div>
  );
};

export default SalaryComponents;
