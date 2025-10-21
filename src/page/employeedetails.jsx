import React, { useState } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import DashboardLayout from "../ui/pagelayout";
import avatar from "../assets/img/avatar.svg";

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState("Personal Info"); // ✅ Default selected tab

  const employee = {
    firstName: "Riyas",
    lastName: "Muhammad",
    email: "riyas@gmail.com",
    phone: "+91 9207208965",
    salary: "2,50,000",
    employeeId: "1000434",
    branch: "Head Office",
    department: "Design",
    role: "CEO & Founder",
    joiningDate: "May 10, 2025",
    experience: "1 Year",
    accountName: "Riyas Muhammad",
    ifsc: "38464837",
    branchBank: "Panampilly Nagar",
    accountNo: "29267264568",
    bankName: "Kotak Mahindra",
    workPhone: "+91 9584848484",
    dob: "22 December 1995",
    age: "28",
    gender: "Male",
    maritalStatus: "Not specified",
  };

  const sections = [
    {
      title: "Basic Information",
      data: [
        { label: "First Name", value: employee.firstName },
        { label: "Last Name", value: employee.lastName },
        { label: "Email Address", value: employee.email },
        { label: "Contact Number", value: employee.phone },
        { label: "Salary", value: employee.salary },
        { label: "Employee ID", value: employee.employeeId },
      ],
    },
    {
      title: "Work Information",
      data: [
        { label: "Branch", value: employee.branch },
        { label: "Department", value: employee.department },
        { label: "Role", value: employee.role },
        { label: "Joining Date", value: employee.joiningDate },
        { label: "Experience", value: employee.experience },
      ],
    },
    {
      title: "Bank Information",
      data: [
        { label: "Account Holder", value: employee.accountName },
        { label: "IFSC Code", value: employee.ifsc },
        { label: "Branch", value: employee.branchBank },
        { label: "Account Number", value: employee.accountNo },
        { label: "Bank Name", value: employee.bankName },
      ],
    },
    {
      title: "Personal Details",
      data: [
        { label: "Date of Birth", value: employee.dob },
        { label: "Age", value: employee.age },
        { label: "Gender", value: employee.gender },
        { label: "Marital Status", value: employee.maritalStatus },
      ],
    },
    {
      title: "Contact Details",
      data: [{ label: "Work Phone", value: employee.workPhone }],
    },
  ];

  return (
    <DashboardLayout userName={employee.firstName}>
      {/* ✅ Header Section */}
      <header className="flex items-center justify-between bg-white px-6 py-3 border-b shadow-sm rounded-xl mb-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Employee Profile</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
          </button>
          <img
            src={avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border"
          />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex gap-3 p-1 bg-gray-50 min-h-[700px]">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border rounded-2xl p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={avatar}
              alt="Employee Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{employee.email}</p>
          <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">
            Active
          </span>

          {/* ✅ Sidebar Tabs */}
          <div className="w-full mt-6 space-y-2">
            {[
              "Personal Info",
              "Activities",
              "Attachments",
              "Manage Shift",
              "Privilege",
              "Salary",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-gray-100 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="w-full text-left px-4 py-2 rounded-md text-red-500 hover:bg-red-50">
              Delete User
            </button>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 grid grid-cols-2 gap-4">
          {sections.map((section) => (
            <div
              key={section.title}
              className={`bg-white p-4 rounded-xl shadow-sm border ${
                section.title === "Work Information" ? "min-h-[220px]" : ""
              }`}
            >
              <h3 className="font-semibold text-gray-800 mb-2">
                {section.title}
              </h3>
              <div className="text-sm space-y-1">
                {section.data.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between border-b border-gray-100 py-1"
                  >
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </DashboardLayout>
  );
}
