import React, { useState, useEffect } from "react";
import axiosInstance from "../../../service/axiosinstance";
import Earnings from "./salary_component_tabs/component_earnings_tab";
import EditSalaryComponent from "./salary_component_tabs/component_edit_earning ";

const SalaryComponents = () => {
  const [activeSubTab, setActiveSubTab] = useState("earnings");
  const [earningsData, setEarningsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE FOR EDIT MODE ---
  const [isEditing, setIsEditing] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const subTabs = [
    { id: "earnings", label: "Earnings" },
    { id: "deductions", label: "Deductions" },
    { id: "benefits", label: "Benefits" },
    { id: "reimbursements", label: "Reimbursements" },
  ];

  const fetchEarnings = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/payroll/components");
      const apiData = response.data?.data?.items;
      console.log("Fetched API Data:", apiData); // LOG 1: Initial Fetch
      if (Array.isArray(apiData)) {
        setEarningsData(apiData);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch components.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  // --- HANDLERS ---
  const handleEditRow = (rowData) => {
    console.log("Step 1: Row Clicked. Data:", rowData); // LOG 2: Data from Table
    setSelectedComponent(rowData);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedComponent(null);
    fetchEarnings();
  };

  if (isEditing) {
    return (
      <EditSalaryComponent
        data={selectedComponent}
        onCancel={handleCloseEdit}
      />
    );
  }

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="w-full p-4">
      <div className="flex border-b border-gray-200 mb-4">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="fade-in">
        {activeSubTab === "earnings" ? (
          <Earnings data={earningsData} onEdit={handleEditRow} />
        ) : (
          <div className="py-20 text-center text-gray-400 italic">
            Coming soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryComponents;
