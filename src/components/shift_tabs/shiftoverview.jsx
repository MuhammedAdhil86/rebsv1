import React, { useEffect } from "react";
import { FiPlus, FiUsers, FiClock, FiUserX } from "react-icons/fi";

// ---------------- IMPORT STORE ----------------
import useShiftDashboardStore from "../../store/shiftoverviewStore";

// ---------------- IMPORT SEPARATE COMPONENTS ----------------
import ShiftCard from "./shiftoverview/shiftcard";
import ShiftSummaryCard from "./shiftoverview/shiftsummarycard";
import ShiftDonutChart from "./shiftoverview/shiftdonutcard";
import RegularShiftPolicyCard from "./shiftoverview/regularshiftpolicard";
import ShiftRulesCard from "./shiftoverview/shiftrulescard";
import ShiftRatioCard from "../graphs/shiftratio";

// ---------------- SUB COMPONENT ----------------
const StatCard = ({ title, value, icon, bg }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-md shadow-sm ${bg} w-[215px]`}>
    <div className="p-2 rounded-full bg-black">
      {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
    </div>
    <div>
      <div className="text-[13px] text-gray-500 font-normal font-[Poppins]">
        {title}
      </div>
      <div className="text-xl font-medium text-gray-900">
        {value}
      </div>
    </div>
  </div>
);

// ---------------- MAIN COMPONENT ----------------
export default function ShiftOverview() {
  const {
    stats,
    shiftDetails,
    policyDetails,
    shiftRules,
    selectedShiftName,
    fetchDashboard,
  } = useShiftDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ✅ PAGE LOAD LOG (STATE DATA)
  useEffect(() => {
    console.log("📦 ShiftOverview Store State:", {
      stats,
      selectedShiftName,
      shiftDetails,
      policyDetails,
      shiftRules,
    });
  }, [stats, shiftDetails, policyDetails, shiftRules, selectedShiftName]);

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      {/* ---------- Top Stats & Buttons ---------- */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex flex-wrap gap-4 justify-start w-full md:w-auto">
          <StatCard
            title="Total Employees"
            value={stats?.totalEmployees ?? 0}
            icon={<FiUsers />}
            bg="bg-[#EBFDEF]"
          />
          <StatCard
            title="Total Shifts"
            value={String(stats?.totalShifts ?? 0).padStart(2, "0")}
            icon={<FiClock />}
            bg="bg-[#E8EFF9]"
          />
          <StatCard
            title="Unallocated"
            value={stats?.unallocatedShifts ?? 0}
            icon={<FiUserX />}
            bg="bg-[#FFEFE7]"
          />
        </div>

        <div className="flex gap-2">
          <button className="bg-white text-black px-2.5 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 shadow-sm border border-gray-200">
            <FiPlus size={14} /> Create Shift
          </button>
          <button className="bg-black text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 shadow-sm">
            <FiPlus size={14} /> Create Attendance Policy
          </button>
        </div>
      </div>

      {/* ---------- Main Grid ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch h-full">
        <div className="space-y-5 flex flex-col h-full">
          <ShiftSummaryCard className="flex-1" />
          <ShiftCard className="flex-1" />
        </div>

        <div className="space-y-5 flex flex-col h-full">
          <ShiftRatioCard className="flex-1" />
          <RegularShiftPolicyCard className="flex-1" />
        </div>

        <div className="space-y-5 flex flex-col h-full">
          <ShiftDonutChart className="flex-1" />
          <ShiftRulesCard className="flex-1" />
        </div>
      </div>
    </div>
  );
}
