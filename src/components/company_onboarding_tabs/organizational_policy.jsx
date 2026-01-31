import React, { useState } from "react";
import Shifts from "./workshifts/shifts";
import ShiftBulkAllocation from "./workshifts/shiftbulkallocation";
import AttendancePolicy from "./workshifts/attendancepolicy";
import LeavesAndVacations from "./leaves_and_vacations/leavepolicy";
import WeekendsAndOffDays from "./leaves_and_vacations/weeklyoff";
import EmailTemplates from "./email_template/emailtemplate";

const OrganizationalPolicy = () => {
  const tabs = [
    { id: "work-shift", label: "Work Shift" },
    { id: "leaves-holidays", label: "Leaves & Holidays" },
    { id: "letter-templates", label: "Letter Templates" },
    { id: "email-templates", label: "Email Templates" },
    { id: "staff-onboarding", label: "Staff Onboarding" },
    { id: "employee-code", label: "Employee Code" },
    { id: "holidays", label: "Holidays" },
  ];

  const [activeTab, setActiveTab] = useState("work-shift");
  const [activeWorkShiftTab, setActiveWorkShiftTab] = useState("Shifts");
  const [activeLeaveTab, setActiveLeaveTab] = useState("Leave Policy");
  const [activeEmailTab, setActiveEmailTab] = useState("Email Template");

  return (
    <div className="w-full bg-[#fcfcfc] min-h-screen p-2">
      {/* ================= MAIN TABS ================= */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 h-[40px] text-xs rounded-md border font-medium transition-all flex items-center justify-center
              ${
                activeTab === tab.id
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        {/* WORK SHIFT */}
        {activeTab === "work-shift" && (
          <>
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              {["Shifts", "Shift Bulk Allocation", "Attendance Policy"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveWorkShiftTab(subTab)}
                  className={`pb-2 text-sm font-medium transition-all relative
                    ${activeWorkShiftTab === subTab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {subTab}
                  {activeWorkShiftTab === subTab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />
                  )}
                </button>
              ))}
            </div>
            <div>
              {activeWorkShiftTab === "Shifts" && <Shifts />}
              {activeWorkShiftTab === "Shift Bulk Allocation" && <ShiftBulkAllocation />}
              {activeWorkShiftTab === "Attendance Policy" && <AttendancePolicy />}
            </div>
          </>
        )}

        {/* LEAVES & HOLIDAYS */}
        {activeTab === "leaves-holidays" && (
          <>
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              {["Leave Policy", "WeeklyOff"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveLeaveTab(subTab)}
                  className={`pb-2 text-sm font-medium transition-all relative
                    ${activeLeaveTab === subTab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {subTab}
                  {activeLeaveTab === subTab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />
                  )}
                </button>
              ))}
            </div>
            <div>
              {activeLeaveTab === "Leave Policy" && <LeavesAndVacations />}
              {activeLeaveTab === "WeeklyOff" && <WeekendsAndOffDays />}
            </div>
          </>
        )}

        {/* EMAIL TEMPLATES */}
        {activeTab === "email-templates" && (
          <>
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              {["Email Template"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveEmailTab(subTab)}
                  className={`pb-2 text-sm font-medium transition-all relative
                    ${activeEmailTab === subTab ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {subTab}
                  {activeEmailTab === subTab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />
                  )}
                </button>
              ))}
            </div>
            <div>
              {activeEmailTab === "Email Template" && <EmailTemplates />}
            </div>
          </>
        )}

        {/* OTHER PLACEHOLDERS */}
        {!["work-shift", "leaves-holidays", "email-templates"].includes(activeTab) && (
          <div className="py-10 text-center text-gray-400 italic">
            {tabs.find((t) => t.id === activeTab)?.label} content is under development.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalPolicy;
