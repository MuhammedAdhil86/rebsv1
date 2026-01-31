import React, { useState } from "react";
import AddBranchForm from "./corganizational_structure_tab/addbranchform";
import AddDivisionForm from "./corganizational_structure_tab/adddivisionform";
import AddDepartmentForm from "./corganizational_structure_tab/adddepartmentform";
import AddDesignationForm from "./corganizational_structure_tab/adddesignationform";
import BranchView from "./viewdata/branchview";
import DepartmentView from "./viewdata/departmentview";
import DesignationView from "./viewdata/designationview";

const OrganizationalStructure = () => {
  const [activeTab, setActiveTab] = useState("branch");
  const [showAdded, setShowAdded] = useState(false);

  const tabs = [
    { id: "branch", label: "Add Branch" },
    { id: "division", label: "Add Division" },
    { id: "department", label: "Add Department" },
    { id: "designation", label: "Add Designation" },
  ];

  return (
    <div className="min-h-screen p-3 bg-gray-50">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        {/* Header Tabs */}
        <div className="flex justify-between items-center mb-6">
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowAdded(false);
                }}
                className={`px-3 h-[40px] text-xs rounded-md border font-medium transition-all flex items-center justify-center
                  ${
                    activeTab === tab.id && !showAdded
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Show Added Button */}
    <button
  onClick={() => setShowAdded((prev) => !prev)}
  className="px-3 h-[40px] text-xs rounded-md border font-normal transition-all flex items-center justify-center
  border-gray-300 text-gray-700 hover:bg-gray-100 font-[Poppins]"
>
  {activeTab === "branch"
    ? "Added Branches"
    : activeTab === "division"
    ? "Added Divisions"
    : activeTab === "department"
    ? "Added Departments"
    : activeTab === "designation"
    ? "Added Designations"
    : "Added Branches"}
</button>

        </div>

        {/* Conditional Rendering */}
        {activeTab === "branch" && !showAdded && <AddBranchForm />}
        {activeTab === "branch" && showAdded && <BranchView />}

        {activeTab === "division" && !showAdded && <AddDivisionForm />}
        {activeTab === "division" && showAdded && (
          <div className="text-gray-500 text-center py-10">Division Table Coming Soon...</div>
        )}

        {activeTab === "department" && !showAdded && <AddDepartmentForm />}
        {activeTab === "department" && showAdded && <DepartmentView />}

        {activeTab === "designation" && !showAdded && <AddDesignationForm />}
        {activeTab === "designation" && showAdded && <DesignationView />}
      </div>
    </div>
  );
};

export default OrganizationalStructure;
