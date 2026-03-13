import React, { useState } from "react";
import DashboardLayout from "../ui/pagelayout";
import PayrollTable from "../ui/payrolltable";
import CreateEmailTemplateView from "../ui/letteremailcreate";
import CreatePdfTemplateView from "../ui/letterpdfcreate";
import { FiBell, FiPlus } from "react-icons/fi";

const Letter = () => {
  const [activeTab, setActiveTab] = useState("email"); // "email" or "pdf"
  const [isCreating, setIsCreating] = useState(false);

  // Common Placeholders used in both Email and PDF
  const placeholders = [
    "CompanyLogo",
    "JoiningDate",
    "FirstName",
    "LastName",
    "Designation",
    "Department",
    "Company",
    "ReportingManager",
    "Salary",
    "CompanyEmail",
  ];

  // Specific Purposes based on your request
  const emailPurposes = ["offer_letter_email", "appointment_letter_email"];
  const letterPurposes = ["offer_letter_pdf", "appointment_letter_pdf"];

  const columns = [
    { key: "id", label: "ID", align: "left" },
    { key: "name", label: "Template Name", align: "left" },
    { key: "category", label: "Category", align: "center" },
    { key: "date", label: "Updated Date", align: "center" },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-[10px]">
          {val}
        </span>
      ),
    },
  ];

  // Static Data for Demo
  const dummyData = [
    {
      id: "TMP-01",
      name:
        activeTab === "email"
          ? "Welcome Email Template"
          : "Standard Offer Letter",
      category: "HR",
      date: "2026-03-13",
      status: "Active",
    },
  ];

  return (
    <DashboardLayout userName="Admin">
      <div className="font-poppins font-normal px-3">
        {/* --- HEADER --- */}
        <div className="bg-white flex justify-between items-center p-4 mb-4 shadow-sm rounded-lg">
          <h1 className="text-[16px] text-gray-800">Document Management</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300">
              <FiBell className="text-gray-600 text-lg" />
            </div>
            <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* --- TAB NAVIGATION (Hidden when Creating) --- */}
        {!isCreating && (
          <div className="flex gap-6 border-b px-2 mb-3 text-[12px]">
            <button
              onClick={() => setActiveTab("email")}
              className={`pb-2 transition-all ${
                activeTab === "email"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              Email Letter
            </button>
            <button
              onClick={() => setActiveTab("pdf")}
              className={`pb-2 transition-all ${
                activeTab === "pdf"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              PDF Letter
            </button>
          </div>
        )}

        {/* --- CONTENT AREA --- */}
        {!isCreating ? (
          /* TABLE VIEW */
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-[16px] text-gray-700">
                {activeTab === "email" ? "Email Letter" : "PDF Letter"}{" "}
                Templates
              </h2>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] hover:bg-gray-800 transition-all"
              >
                <FiPlus size={14} /> Create{" "}
                {activeTab === "email" ? "Email" : "PDF"}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <PayrollTable
                columns={columns}
                data={dummyData}
                rowsPerPage={6}
              />
            </div>
          </div>
        ) : (
          /* CREATE VIEW */
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            {activeTab === "email" ? (
              <CreateEmailTemplateView
                type="Email Letter"
                onBack={() => setIsCreating(false)}
                availablePurposes={emailPurposes}
                availablePlaceholders={placeholders}
              />
            ) : (
              <CreatePdfTemplateView
                type="PDF Letter"
                onBack={() => setIsCreating(false)}
                availablePurposes={letterPurposes}
                availablePlaceholders={placeholders}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Letter;
