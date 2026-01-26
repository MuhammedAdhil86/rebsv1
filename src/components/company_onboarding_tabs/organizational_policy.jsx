import React, { useState } from "react";
import Shifts from "./workshifts/shifts";
import ShiftBulkAllocation from "./workshifts/shiftbulkallocation";
import AttendancePolicy from "./workshifts/attendancepolicy";
import LeavesAndVacations from "./leaves_and_vacations/leavepolicy";
import EmailTemplates from "./email_template/emailtemplate";
import WeekendsAndOffDays from "./leaves_and_vacations/weeklyoff";

const OrganizationalPolicy = () => {
  const tabs = [
    "Work Shift",
    "Leaves & Holidays",
    "Letter Templates",
    "Email Templates",
    "Staff Onboarding",
    "Employee Code",
    "Holidays",
  ];

  const [activeTab, setActiveTab] = useState("Work Shift");
  const [activeWorkShiftTab, setActiveWorkShiftTab] = useState("Shifts");
  const [activeLeaveTab, setActiveLeaveTab] = useState("Leave Policy");
  
  // New State for Email Template sub-tabs
  const [activeEmailTab, setActiveEmailTab] = useState("Email Template");

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen">
      
      {/* ================= MAIN TABS ================= */}
      <div className="flex flex-wrap gap-1 mb-1 bg-white px-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-[12px] transition-all border
              ${
                activeTab === tab
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div className="bg-white rounded-2xl pt-5 px-4">
        
        {/* ================= WORK SHIFT SECTION ================= */}
        {activeTab === "Work Shift" && (
          <>
            <div className="flex gap-8 border-b border-gray-200 mb-6 px-2 py-2">
              {["Shifts", "Shift Bulk Allocation", "Attendance Policy"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveWorkShiftTab(subTab)}
                  className={`pb-3 text-sm font-medium transition-all relative
                    ${activeWorkShiftTab === subTab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {subTab}
                  {activeWorkShiftTab === subTab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeWorkShiftTab === "Shifts" && <Shifts />}
              {activeWorkShiftTab === "Shift Bulk Allocation" && <ShiftBulkAllocation />}
              {activeWorkShiftTab === "Attendance Policy" && <AttendancePolicy />}
            </div>
          </>
        )}

        {/* ================= LEAVES & VACATIONS SECTION ================= */}
        {activeTab === "Leaves & Holidays" && (
          <>
            <div className="flex gap-8 border-b border-gray-200 mb-6 px-2 py-2">
              {["Leave Policy", "WeeklyOff"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveLeaveTab(subTab)}
                  className={`pb-3 text-sm font-medium transition-all relative
                    ${activeLeaveTab === subTab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {subTab}
                  {activeLeaveTab === subTab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeLeaveTab === "Leave Policy" && <LeavesAndVacations />}
              {activeLeaveTab === "WeeklyOff" && <WeekendsAndOffDays/>}
            </div>
          </>
        )}

        {/* ================= EMAIL TEMPLATES SECTION ================= */}
        {activeTab === "Email Templates" && (
          <>
          
            <div className="flex gap-8 border-b border-gray-200 mb-6 px-2 py-2">
              {["Email Template"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveEmailTab(subTab)}
                  className={`pb-3 text-sm font-medium transition-all relative
                    ${activeEmailTab === subTab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {subTab}
                  {activeEmailTab === subTab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {activeEmailTab === "Email Template" && <EmailTemplates />}
            </div>
          </>
        )}

        {/* ================= OTHER PLACEHOLDERS ================= */}
        {activeTab !== "Work Shift" && 
         activeTab !== "Leaves & Holidays" && 
         activeTab !== "Email Templates" && (
          <div className="py-10 text-center text-gray-400 italic">
            {activeTab} content is under development.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalPolicy;