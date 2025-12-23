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

  return (
    <div className="min-h-screen p-3 bg-gray-50">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        {/* Header Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("branch") & setShowAdded(false)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "branch" && !showAdded
                  ? "bg-black text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Branch
            </button>

            <button
              onClick={() => setActiveTab("division") & setShowAdded(false)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "division" ? "bg-black text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Division
            </button>

            <button
              onClick={() => setActiveTab("department") & setShowAdded(false)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "department" ? "bg-black text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Department
            </button>

            <button
              onClick={() => setActiveTab("designation") & setShowAdded(false)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "designation" ? "bg-black text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Designation
            </button>
          </div>

          {/* Added Button */}
          <button
            onClick={() => setShowAdded((prev) => !prev)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
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

        {/* Conditional rendering */}
        {activeTab === "branch" && !showAdded && <AddBranchForm />}
        {activeTab === "branch" && showAdded && <BranchView />}

        {activeTab === "division" && !showAdded && <AddDivisionForm />}
        {activeTab === "division" && showAdded && (
          <div className="text-gray-500 text-center py-10">Division Table Coming Soon...</div>
        )}

        {activeTab === "department" && !showAdded && <AddDepartmentForm />}
        {activeTab === "department" && showAdded && <DepartmentView />}

        {activeTab === "designation" && !showAdded && <AddDesignationForm />}
        {activeTab === "designation" && showAdded && <DesignationView />} {/* ← added DesignationView */}
      </div>
    </div>
  );
};

export default OrganizationalStructure;
