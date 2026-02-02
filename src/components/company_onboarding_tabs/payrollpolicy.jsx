import React, { useState } from "react";
import { Icon } from "@iconify/react";

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
  const [showFilter, setShowFilter] = useState(false);

  // Multi-select filter: default is all true
  const [filterOptions, setFilterOptions] = useState({
    active: true,
    inactive: true,
  });

  const tabs = [
    { id: "salary-template", label: "Salary Template" },
    { id: "salary-components", label: "Salary Components" },
    { id: "statutory-components", label: "Statutory Components" },
    { id: "payment-schedules", label: "Payment Schedules" },
    { id: "tax", label: "Tax" },
    { id: "approvals", label: "Approvals" },
  ];

  const toggleFilterOption = (option) => {
    setFilterOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="min-h-screen font-[Poppins] text-sm">
      <div className="border rounded-2xl shadow-sm p-3">
        {/* Tabs + Buttons */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowCreate(false);
                  setShowFilter(false);
                }}
                className={`px-3 h-[30px] text-xs rounded-md border font-medium transition-all flex items-center justify-center
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

          <div className="flex items-center gap-2">
            {/* Filter icon only for Salary Template */}
            {activeTab === "salary-template" && (
              <div className="relative">
                <button
                  onClick={() => setShowFilter((prev) => !prev)}
                  className="p-1 rounded-md hover:bg-gray-100 transition"
                  title="Filter"
                >
                  <Icon icon="mdi:filter-variant" width={20} height={20} />
                </button>

                {/* Multi-select filter box */}
                {showFilter && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md z-50 p-2">
                    {["active", "inactive"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm cursor-pointer mb-1"
                      >
                        <input
                          type="checkbox"
                          checked={filterOptions[option]}
                          onChange={() => toggleFilterOption(option)}
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create New button */}
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
        </div>

        {/* Render Tabs */}
        {activeTab === "salary-template" &&
          (showCreate ? (
            <CreateSalaryTemplate
              setShowCreate={setShowCreate}
              filterOptions={filterOptions} // pass the selected options
            />
          ) : (
            <SalaryTemplate filterOptions={filterOptions} />
          ))}

        {activeTab === "salary-components" &&
          (showCreate ? (
            <CreateSalaryComponent
              componentId={null}
              onCancel={() => setShowCreate(false)}
            />
          ) : (
            <SalaryComponents />
          ))}

        {activeTab === "statutory-components" && <StatutoryComponents />}

        {activeTab === "payment-schedules" && (
          <div className="text-gray-500 py-4">
            Payment Schedules Tab Content
          </div>
        )}

        {activeTab === "tax" && (
          <div className="text-gray-500 py-4">Tax Tab Content</div>
        )}

        {activeTab === "approvals" && (
          <div className="text-gray-500 py-4">Approvals Tab Content</div>
        )}
      </div>
    </div>
  );
};

export default ManagePayrollPolicy;
