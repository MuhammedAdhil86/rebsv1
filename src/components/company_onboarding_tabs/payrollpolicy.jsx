import React, { useState } from "react";

/* Common Button */
import CommonButton from "../../ui/bottom";

/* Tabs */
import SalaryTemplate from "./payrollpolicy_tabs/salary_template_tab";
import SalaryComponents from "./payrollpolicy_tabs/salary_components_tab";
import StatutoryComponents from "./payrollpolicy_tabs/statutorycomponents";

/* Create Forms */
import CreateSalaryTemplate from "./payrollpolicy_tabs/statutory_component_tabs/createsalarytemplate";
import CreateSalaryComponent from "./payrollpolicy_tabs/statutory_component_tabs/createsalarycomponents";

const ManagePayrollPolicy = () => {
  const [activeTab, setActiveTab] = useState("salary-template");
  const [showCreate, setShowCreate] = useState(false);

  const tabs = [
    { id: "salary-template", label: "Salary Template" },
    { id: "salary-components", label: "Salary Components" },
    { id: "statutory-components", label: "Statutory Components" },
    { id: "payment-schedules", label: "Payment Schedules" },
    { id: "tax", label: "Tax" },
    { id: "approvals", label: "Approvals" },
  ];

  return (
    <div className="min-h-screen font-[Poppins] text-sm">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

        {/* Tabs + Create Button */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowCreate(false);
                }}
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

          {(activeTab === "salary-template" ||
            activeTab === "salary-components") &&
            !showCreate && (
              <CommonButton
                onClick={() => setShowCreate(true)}
                text="Create New"
                icon="mdi:plus"
              />
            )}
        </div>

        {/* Salary Template Tab */}
        {activeTab === "salary-template" &&
          (showCreate ? (
            <CreateSalaryTemplate setShowCreate={setShowCreate} />
          ) : (
            <SalaryTemplate />
          ))}

        {/* Salary Components Tab */}
        {activeTab === "salary-components" &&
          (showCreate ? (
            <CreateSalaryComponent
              componentId={null}
              onCancel={() => setShowCreate(false)}
            />
          ) : (
            <SalaryComponents />
          ))}

        {/* Statutory Components */}
        {activeTab === "statutory-components" && <StatutoryComponents />}

        {/* Payment Schedules */}
        {activeTab === "payment-schedules" && (
          <div className="text-gray-500 py-4">
            Payment Schedules Tab Content
          </div>
        )}

        {/* Tax */}
        {activeTab === "tax" && (
          <div className="text-gray-500 py-4">Tax Tab Content</div>
        )}

        {/* Approvals */}
        {activeTab === "approvals" && (
          <div className="text-gray-500 py-4">Approvals Tab Content</div>
        )}
      </div>
    </div>
  );
};

export default ManagePayrollPolicy;
