import React, { useState, useEffect } from "react";
import axiosInstance from "../../../service/axiosinstance";
import Earnings from "./salary_component_tabs/component_earnings_tab";

const SalaryComponents = () => {
  const [activeSubTab, setActiveSubTab] = useState("earnings");
  const [earningsData, setEarningsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const subTabs = [
    { id: "earnings", label: "Earnings" },
    { id: "deductions", label: "Deductions" },
    { id: "benefits", label: "Benefits" },
    { id: "reimbursements", label: "Reimbursements" },
  ];

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get("/api/payroll/components");

        // 1. Log the full response object from Axios
        console.log("Full Axios Response:", response);

        // 2. Log the actual data coming from your Postman URL
        console.log("Response Data Root:", response.data);

        const apiData = response.data?.data?.items;

        // 3. Log specifically what you are trying to set to state
        console.log("Extracted Items Array:", apiData);

        if (Array.isArray(apiData)) {
          setEarningsData(apiData);
        } else {
          setEarningsData([]);
          console.error("Data structure mismatch: 'items' is not an array.");
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to fetch components.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500 animate-pulse font-medium">
          Loading components...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <div className="w-full p-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="fade-in">
        {activeSubTab === "earnings" ? (
          <Earnings data={earningsData} />
        ) : (
          <div className="py-20 text-center text-sm text-gray-400 italic">
            {subTabs.find((t) => t.id === activeSubTab)?.label} configuration
            coming soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryComponents;
