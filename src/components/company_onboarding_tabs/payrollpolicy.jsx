import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SalaryTemplate from "./payrollpolicy_tabs/salary_template_tab";
import SalaryComponents from "./payrollpolicy_tabs/salary_components_tab";
import StatutoryComponents from "./payrollpolicy_tabs/statutorycomponents";

const ManagePayrollPolicy = () => {
  const [activeTab, setActiveTab] = useState("salary-template");

  const tabs = [
    { id: "salary-template", label: "Salary Template" },
    { id: "salary-components", label: "Salary Components" },
    { id: "statutory-components", label: "Statutory Components" },
    { id: "payment-schedules", label: "Payment Schedules" },
    { id: "tax", label: "Tax" },
    { id: "approvals", label: "Approvals" },
  ];

  return (
    <div className="min-h-screen p-1 font-[Poppins] text-sm">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        {/* Tabs + Create Button */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 h-[40px] text-xs rounded-md border font-medium transition-all flex items-center justify-center
                  ${
                    activeTab === tab.id
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Only show "Create New" for Salary Components */}
          {activeTab === "salary-components" && (
            <button className="flex items-center justify-center gap-1 px-3 h-[40px] bg-black text-white text-xs rounded-md hover:bg-gray-800 transition font-medium">
              <Icon icon="mdi:plus" className="text-sm" />
              Create New
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "salary-template" && <SalaryTemplate />}
          {activeTab === "salary-components" && <SalaryComponents />}
          {activeTab === "statutory-components" && <StatutoryComponents />}
          {activeTab === "payment-schedules" && (
            <div className="text-gray-500 py-4">Payment Schedules Tab Content</div>
          )}
          {activeTab === "tax" && <div className="text-gray-500 py-4">Tax Tab Content</div>}
          {activeTab === "approvals" && (
            <div className="text-gray-500 py-4">Approvals Tab Content</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePayrollPolicy;
