import React, { useState } from "react";
import { Check, X } from "lucide-react";

const StatutoryComponents = () => {
  const [activeTab, setActiveTab] = useState("EPF");

  const tabs = ["EPF", "ESI", "Professional Tax", "Labour Welfare Fund"];

  return (
    <div className="font-[Poppins] text-[13px] text-gray-700">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 transition-all ${
              activeTab === tab
                ? "text-black border-b-2 border-black font-medium"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* EPF Content */}
      {activeTab === "EPF" && (
        <div className="rounded-xl">
          <h2 className="font-semibold text-gray-800 mb-3">
            Employee’s Provident Fund
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-gray-500">EPF Number</p>
              <p className="text-gray-800 font-medium">KR/ERN/4646/446</p>
            </div>

            <div>
              <p className="text-gray-500">Contribution Preferences</p>
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-50 border border-green-300 text-green-600">
                    <Check size={12} />
                  </span>
                  <span>Employee PF contribution</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 border border-red-300 text-red-600">
                    <X size={12} />
                  </span>
                  <span>EDLI contribution</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 border border-red-300 text-red-600">
                    <X size={12} />
                  </span>
                  <span>Admin charges</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-500">Deduction Cycle</p>
              <p className="text-gray-800 font-medium">Monthly</p>
            </div>

            <div>
              <p className="text-gray-500">Employee Contribution Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-800 font-medium">
                  12% of Actual PF Wage
                </p>
                <button className="text-xs px-2 py-0.5 border border-gray-300 rounded-md hover:bg-gray-100 transition">
                  View Splitup
                </button>
              </div>
            </div>

            <div>
              <p className="text-gray-500">Allow Employee Level Override</p>
              <p className="text-gray-800 font-medium">No</p>
            </div>

            <div>
              <p className="text-gray-500">Pro-rate Restricted PF Wage</p>
              <p className="text-gray-800 font-medium">No</p>
            </div>

            <div>
              <p className="text-gray-500">
                Consider applicable salary components based on LOP
              </p>
              <p className="text-gray-800 font-medium">
                Yes (when PF wage is less than ₹15,000)
              </p>
            </div>

            <div>
              <p className="text-gray-500">Eligible for ABRY Scheme</p>
              <p className="text-gray-800 font-medium">No</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 text-xs px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              Edit EPF
            </button>
            <button className="flex items-center gap-2 text-xs px-4 py-1.5 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition">
              Disable EPF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatutoryComponents;
