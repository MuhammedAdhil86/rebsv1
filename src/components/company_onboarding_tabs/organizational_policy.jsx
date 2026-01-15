import React, { useState } from "react";
import Shifts from "./workshifts/shifts";
import ShiftBulkAllocation from "./workshifts/shiftbulkallocation";
import AttendancePolicy from "./workshifts/attendancepolicy";

const OrganizationalPolicy = () => {
  const tabs = [
    "Work Shift",
    "Leaves & Vacations",
    "Letter Templates",
    "Email Templates",
    "Staff Onboarding",
    "Employee Code",
    "Holidays",
  ];

  const [activeTab, setActiveTab] = useState("Work Shift");
  const [activeWorkShiftTab, setActiveWorkShiftTab] = useState("Shifts");

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
      <div className="bg-white rounded-2xl pt-5 px-2">
        
        {/* ================= WORK SHIFT SECTION ================= */}
        {activeTab === "Work Shift" && (
          <>
            {/* Sub-tabs: Shifts | Shift Bulk Allocation | Attendance Policy */}
            <div className="flex gap-8 border-t border-b border-gray-200 mb-6 px-2 py-2 bg-gray-50">
              {["Shifts", "Shift Bulk Allocation", "Attendance Policy"].map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setActiveWorkShiftTab(subTab)}
                  className={`pb-3 text-sm font-medium transition-all relative
                    ${
                      activeWorkShiftTab === subTab
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {subTab}
                  {activeWorkShiftTab === subTab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Sub Tab Content */}
            <div className="mt-4">
              {activeWorkShiftTab === "Shifts" && <Shifts />}
              {activeWorkShiftTab === "Shift Bulk Allocation" && <ShiftBulkAllocation />}
              {activeWorkShiftTab === "Attendance Policy" && <AttendancePolicy />}
            </div>
          </>
        )}

        {/* ================= OTHER PLACEHOLDERS ================= */}
        {activeTab !== "Work Shift" && (
          <div className="py-10 text-center text-gray-400 italic">
            {activeTab} content is under development.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationalPolicy;
