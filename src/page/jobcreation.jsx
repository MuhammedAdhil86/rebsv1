import React, { useState } from "react";
import DashboardLayout from "../ui/pagelayout";
import avatar from "../assets/img/avatar.svg";
import { FiBell } from "react-icons/fi";
import { Icon } from "@iconify/react";
import rebsLogo from "../assets/img/indeedemail.com logo.png";
import IneededLogo from "../assets/img/indeedemail.com logo (1).png";
import { RiUploadLine } from "react-icons/ri";

const JobCreation = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState({
    jobTitle: "",
    designation: "",
    description: "",
    salary: "",
    period: "Monthly",
    experience: "",
    area: "",
    expiryDate: "",
    jobType: "Full-time",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Job Created! (Demo)");
  };

  const platforms = [
    { name: "LinkedIn", logo: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
    { name: "Instagram", logo: "https://cdn-icons-png.flaticon.com/512/174/174855.png" },
    { name: "Indeed", logo: IneededLogo },
    { name: "Rebs Jobs", logo: rebsLogo },
  ];

  const labelStyle = "block text-gray-400 text-[11px] font-medium mb-1";

  return (
    <DashboardLayout userName="Admin" onLogout={() => alert("Logout")}>
      {/* Header */}
      <div className="bg-white flex justify-between items-center flex-wrap gap-4 p-3 mb-2">
        <h1 className="text-[15px] font-semibold text-gray-800">Job Creation</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300">
            <FiBell className="text-gray-600 text-lg" />
          </div>
          <button className="text-[13px] text-gray-700 border border-gray-300 px-5 py-1 rounded-full">
            Settings
          </button>
          <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden">
            <img src={avatar} alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Main Content Area - White Background */}
      <div className=" overflow-auto min-h-[600px] p-1 rounded-2xl">
        {activeTab === "create" && (
          <div className="bg-white rounded-2xl p-2 flex flex-col gap-6 shadow-sm">
            {/* Upload Vacancy Poster */}
            <div className="flex items-center justify-between rounded-xl px-5 py-5 bg-[#f9fafb]">
              <div className="flex-1">
                <h3 className="text-[13px] font-semibold text-gray-800">Upload Vacancy Poster</h3>
                <p className="text-[10px] text-gray-500 mt-1">
                  Ensure the poster includes all necessary details such as job title, description,
                  qualifications, and application deadline.
                </p>
              </div>

              <button
                className="bg-black text-white px-6 py-2 rounded-md text-[11px] font-[400] font-poppins flex items-center gap-2 border border-gray-300 hover:bg-gray-100 transition"
              >
                <RiUploadLine className="text-lg" /> Upload Image
              </button>
            </div>

        {/* Three Equal Columns */}
<div className="grid grid-cols-3 gap-6 rounded-2xl relative bg-white p-4">
  {/* Left Column */}
  <div className="flex flex-col gap-4">
    <div>
      <label className={labelStyle} htmlFor="jobTitle">Job Title</label>
      <input
        type="text"
        name="jobTitle"
        id="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-[#f9fafb] focus:outline-none focus:border-black"
      />
    </div>
    <div className="flex-1 flex flex-col">
      <label className={labelStyle} htmlFor="description">Job Description</label>
      <textarea
        name="description"
        id="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full h-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-[#f9fafb] focus:outline-none focus:border-black resize-none"
      />
    </div>
  </div>

  {/* Middle Column */}
  <div className="flex flex-col gap-4">
    <div>
      <label className={labelStyle} htmlFor="designation">Designation</label>
      <input
        type="text"
        name="designation"
        id="designation"
        value={formData.designation}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-[#f9fafb] focus:outline-none focus:border-black"
      />
    </div>

    {/* Grid Inputs */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelStyle} htmlFor="salary">Salary Offered</label>
        <input
          type="text"
          name="salary"
          id="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-10 bg-[#f9fafb] focus:outline-none focus:border-black"
        />
      </div>
      <div>
        <label className={labelStyle} htmlFor="period">Salary Period</label>
        <select
          name="period"
          id="period"
          value={formData.period}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 text-sm h-10 text-gray-600 bg-[#f9fafb] focus:outline-none focus:border-black"
        >
          <option className="text-xs text-gray-400">Monthly</option>
          <option className="text-xs text-gray-400">Yearly</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelStyle} htmlFor="experience">Years of Experience</label>
        <input
          type="text"
          name="experience"
          id="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-10 bg-[#f9fafb] focus:outline-none focus:border-black"
        />
      </div>
      <div>
        <label className={labelStyle} htmlFor="area">Area of Work</label>
        <select
          name="area"
          id="area"
          value={formData.area}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 text-sm h-10 text-gray-600 bg-[#f9fafb] focus:outline-none focus:border-black"
        >
          <option className="text-xs text-gray-400">Marketing</option>
          <option className="text-xs text-gray-400">Development</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelStyle} htmlFor="expiryDate">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          id="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-10 bg-[#f9fafb] focus:outline-none focus:border-black appearance-none hide-date-placeholder"
        />
      </div>
      <div>
        <label className={labelStyle} htmlFor="jobType">Job Type</label>
        <select
          name="jobType"
          id="jobType"
          value={formData.jobType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 text-sm h-10 text-gray-600 bg-[#f9fafb] focus:outline-none focus:border-black"
        >
          <option className="text-xs text-gray-400">Full-time</option>
          <option className="text-xs text-gray-400">Part-time</option>
        </select>
      </div>
    </div>

    <div>
      <label className={labelStyle} htmlFor="location">Work Location</label>
      <input
        type="text"
        name="location"
        id="location"
        value={formData.location}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-[#f9fafb] focus:outline-none focus:border-black"
      />
    </div>
  </div>

  {/* Right Column */}
  <div className="flex flex-col relative">
    <h3 className="text-gray-800 font-medium mb-2 text-[14px]">Posted on</h3>
    <div className="grid grid-cols-2 gap-4 mb-16">
      {platforms.map((item, i) => {
        const [selected, setSelected] = useState(false);
        return (
          <div
            key={i}
            onClick={() => setSelected(!selected)}
            className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 bg-[#f9fafb]"
          >
            <img src={item.logo} alt={item.name} className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="font-medium text-[12px]">{item.name}</span>
              <span className="text-[8px] text-gray-500">Company name</span>
            </div>
            <div
              className={`ml-auto w-4 h-4 rounded-full border flex items-center justify-center transition ${
                selected ? "bg-black" : "bg-white"
              }`}
            >
              {selected && <Icon icon="charm:tick" className="text-white w-3 h-3" />}
            </div>
          </div>
        );
      })}
    </div>

    <button
      type="submit"
      onClick={handleSubmit}
      className="absolute bottom-0 right-0 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition text-[11px] font-[400] font-poppins"
    >
      Create
    </button>
  </div>
</div>

          </div>
        )}

        {activeTab === "about" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">About</h2>
            <p className="text-gray-600 text-sm">
              This is a demo job creation page following the same layout as Settings.
            </p>
          </div>
        )}
      </div>

      {/* CSS for hiding date placeholder */}
      <style>
        {`
          .hide-date-placeholder::-webkit-datetime-edit-text,
          .hide-date-placeholder::-webkit-datetime-edit-month-field,
          .hide-date-placeholder::-webkit-datetime-edit-day-field,
          .hide-date-placeholder::-webkit-datetime-edit-year-field {
            color: transparent;
          }
          .hide-date-placeholder::-webkit-calendar-picker-indicator {
            opacity: 1;
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default JobCreation;
