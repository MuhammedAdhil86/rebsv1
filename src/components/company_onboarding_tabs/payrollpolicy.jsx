import React, { useState } from "react";
import { Icon } from "@iconify/react";

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

  const tableData = [
    {
      name: "Regular",
      description: "35k",
      annualCTC: "₹6,00,000",
      status: "Active",
    },
    {
      name: "Standard Employee Package",
      description:
        "This salary structure includes basic earnings, allowances, and benefits for full-time employees.",
      annualCTC: "₹6,00,000",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen p-1 font-[Poppins] text-sm">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        {/* Tabs + Create Button */}
        <div className="flex justify-between items-center mb-5">
          {/* Tabs (Left) */}
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Create Button (Right) */}
          <button className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs rounded-md hover:bg-gray-800 transition font-medium">
            <Icon icon="mdi:plus" className="text-sm" />
            Create New
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs font-normal">
         <thead>
  <tr className="text-left bg-gray-50 border-b border-gray-200">
    <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
      Template Name
    </th>
    <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
      Description
    </th>
    <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
      Annual CTC
    </th>
    <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
      Status
    </th>
  </tr>
</thead>

            <tbody>
              {tableData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-gray-800">{item.name}</td>
                  <td className="px-4 py-2 text-gray-600">{item.description}</td>
                  <td className="px-4 py-2 text-gray-800">{item.annualCTC}</td>
                  <td className="px-4 py-2">
                    <span className="text-green-600 font-medium">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination (mocked UI) */}
        <div className="flex justify-between items-center mt-4 text-[11px] text-gray-500 font-medium">
          <div>Rows per page: 10</div>
          <div className="flex items-center gap-2">
            <span>1–2 of 2</span>
            <button className="text-gray-400 hover:text-gray-600">
              <Icon icon="mdi:chevron-left" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePayrollPolicy;
