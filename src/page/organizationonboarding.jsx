import React, { useState } from "react";
import DashboardLayout from "../ui/pagelayout";
import AddBasicInformation from "../components/company_onboarding_tabs/add_basicinfo_tab";
import OrganizationalStructure from "../components/company_onboarding_tabs/organizational_structure";
import ManagePayrollPolicy from "../components/company_onboarding_tabs/payrollpolicy";


const OrganizationOnboarding = () => {
  const [activeTab, setActiveTab] = useState("details"); // tab state

  return (
    <DashboardLayout>
      <div className="rounded-2xl overflow-auto bg-[#f7f8fa] min-h-screen">
        {/* Header */}
        <div className="flex items-center bg-white px-8 py-4 border-b border-gray-200 rounded-t-2xl w-full">
          <button className="text-sm text-gray-600 mr-2 hover:text-black">
            &lt; Back
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Organization Onboarding
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center mb-6 px-2 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "details"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Organizational Details
          </button>

          <button
            onClick={() => setActiveTab("structure")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "structure"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Organizational Structure
          </button>

          <button
            onClick={() => setActiveTab("payroll")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "payroll"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Payroll Policy
          </button>
        </div>

        {/* Section Title */}
        <div className="px-8 mt-2">
          {activeTab === "details" && (
            <h2 className="font-[Poppins] font-medium text-[20px] text-gray-800 mb-2">
              Add Basic Information
            </h2>
          )}
          {activeTab === "structure" && (
            <h2 className="font-[Poppins] font-medium text-[20px] text-gray-800 mb-2">
              Organizational Structure
            </h2>
          )}
          {activeTab === "payroll" && (
            <h2 className="font-[Poppins] font-medium text-[16px] text-gray-800 ">
             Manage Payroll Policy
            </h2>
          )}
        </div>

        {/* Child Components */}
        {activeTab === "details" && <AddBasicInformation />}
        {activeTab === "structure" && <OrganizationalStructure />}
        {activeTab === "payroll" && (
          <div className="px-3 mt-4">
            <ManagePayrollPolicy/> {/* ✅ Your real payroll policy UI */}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizationOnboarding;
