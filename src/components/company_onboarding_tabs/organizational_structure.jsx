import React, { useState } from "react";
import AddBranchForm from "./corganizational_structure_tab/addbranchform";
import AddDivisionForm from "./corganizational_structure_tab/adddivisionform";
import AddDepartmentForm from "./corganizational_structure_tab/adddepartmentform";
import AddDesignationForm from "./corganizational_structure_tab/adddesignationform";

const OrganizationalStructure = () => {
  const [activeTab, setActiveTab] = useState("branch");

  return (
    <div className="min-h-screen p-3 bg-gray-50">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 ">
        {/* Header Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("branch")}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "branch"
                  ? "bg-black text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Branch
            </button>

            <button
              onClick={() => setActiveTab("division")}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "division"
                  ? "bg-black text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Division
            </button>

            <button
              onClick={() => setActiveTab("department")}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "department"
                  ? "bg-black text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Department
            </button>

            <button
              onClick={() => setActiveTab("designation")}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeTab === "designation"
                  ? "bg-black text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Add Designation
            </button>
          </div>

          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition">
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

        {/* Form Component */}
        {activeTab === "branch" && <AddBranchForm />}
        {activeTab === "division" && <AddDivisionForm />}
        {activeTab === "department" && <AddDepartmentForm />}
        {activeTab === "designation" && <AddDesignationForm />}
      </div>
    </div>
  );
};

export default OrganizationalStructure;
