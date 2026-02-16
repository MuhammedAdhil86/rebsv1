import React, { useEffect, useState } from "react";
// Change: Import the service as a default object to match your likely export
import dashboardService from "../../service/dashboardService";
import { Icon } from "@iconify/react";
// Change: Ensure this path matches where you save the second file
import AnnouncementModal from "./announcement";

function DashboardHead({ userName, activeTab, setActiveTab }) {
  const [dashboardData, setDashboardData] = useState({
    total_staff: 0,
    present_today: 0,
    on_leave: 0,
    happiness_rate: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data || {});
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-500 w-full font-poppins text-xs">
        Loading dashboard data...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-40 w-full text-red-500 font-poppins text-xs">
        {error}
      </div>
    );

  const GlowButton = ({ children, onClick }) => (
    <button
      className="chat-btn relative overflow-visible rounded-lg px-5 py-3 text-xs font-poppins font-light bg-black text-white flex items-center gap-2"
      onClick={onClick}
    >
      {children}
      <span className="glow" />
      <style>{`
        .chat-btn { position: relative; overflow: visible; cursor: pointer; transition: transform 180ms cubic-bezier(.22, .61, .36, 1); }
        .chat-btn::before { content: ""; position: absolute; inset: 0; padding: 0px 0px 3px 0px; border-radius: 8px; background: linear-gradient(90deg, #6d7cff, #a855f7, #ec4899, #6d7cff); background-size: 300% 100%; animation: slide 3s linear infinite; transition: padding 180ms cubic-bezier(.22, .61, .36, 1); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .chat-btn:hover::before { padding: 1px 1px 5px 1px; }
        .glow { position: absolute; left: 12%; right: 12%; bottom: -8px; height: 10px; border-radius: 9999px; background: linear-gradient(90deg, #6d7cff, #a855f7, #ec4899, #6d7cff); background-size: 300% 100%; animation: slide 3s linear infinite; filter: blur(16px); opacity: 0.55; transition: opacity 180ms ease; }
        @keyframes slide { from { background-position: 0% 0; } to { background-position: 300% 0; } }
      `}</style>
    </button>
  );

  return (
    <div className="w-full bg-white font-poppins">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center w-full sm:px-6 pt-3 pb-3">
        <p className="text-sm text-gray-600">
          Hi, <span className="font-medium">{userName}</span>, welcome back!
        </p>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Icon
              icon="hugeicons:notification-02"
              className="w-5 h-5 text-gray-600"
            />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Icon
              icon="solar:settings-linear"
              className="w-5 h-5 text-gray-600"
            />
          </button>
          <button className="flex items-center gap-2 px-3 py-1 border rounded-full text-[12px]">
            Settings <span className="text-sm font-medium">{userName}</span>
          </button>
        </div>
      </div>

      {/* --- DASHBOARD TITLE --- */}
      <div className="w-full sm:px-6 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-lg sm:text-2xl font-medium">
            {userName} Admin’s Dashboard
          </p>
          <p className="text-[10px] sm:text-[13px] text-gray-400 font-light">
            Track and manage all details here
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <GlowButton onClick={() => setIsAnnounceModalOpen(true)}>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:bullhorn" className="w-4 h-4" />
              Announce
            </div>
          </GlowButton>
          <button className="px-3 sm:px-4 py-3 text-xs rounded-lg border bg-black text-white font-poppins font-normal transition-all hover:bg-gray-800">
            + Add Leave
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full px-4 sm:px-6 mt-4">
        {[
          {
            label: "Total Employees",
            value: dashboardData.total_staff,
            bg: "#EBFDEF",
            icon: "famicons:people-outline",
          },
          {
            label: "Total Present",
            value: dashboardData.present_today,
            bg: "#E8EFF9",
            icon: "mdi:account-tick-outline",
          },
          {
            label: "On Leave",
            value: dashboardData.on_leave,
            bg: "#FFEFE7",
            icon: "fluent-mdl2:leave-user",
          },
          {
            label: "Happiness Rate",
            value: dashboardData.happiness_rate,
            bg: "#FFFBDB",
            icon: "cil:smile",
          },
          {
            label: "Total Absents",
            value: "_",
            bg: "#FFDADA",
            icon: "mdi:account-remove-outline",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="shadow-sm rounded-lg p-3 flex items-center gap-3 transition-all hover:shadow-md"
            style={{ backgroundColor: card.bg }}
          >
            <div className="flex items-center justify-center min-w-10 h-10 rounded-full bg-black text-white">
              <Icon icon={card.icon} className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-gray-500 text-[10px] sm:text-xs truncate uppercase font-semibold">
                {card.label}
              </p>
              <h2 className="text-lg sm:text-xl font-medium text-gray-800">
                {card.value || 0}
              </h2>
            </div>
          </div>
        ))}
      </section>

      {/* --- TABS --- */}
      <section className="bg-white mt-4 sm:mt-6 w-full px-4 sm:px-6">
        <div className="border-b flex flex-wrap gap-4 sm:gap-6 pt-4 text-sm">
          {[
            { label: "Attendance Overview", key: "overview" },
            { label: "Log Details", key: "logdetails" },
            { label: "Leave Requests", key: "leaverequests" },
            { label: "Daily Attendance", key: "dailyAttendance" },
            { label: "Muster Roll", key: "musterRoll" },
            { label: "Regularization", key: "regularization" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "border-b-2 border-black font-medium text-black"
                  : "text-[#AFAFAF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* --- THE MODAL --- */}
      <AnnouncementModal
        isOpen={isAnnounceModalOpen}
        onClose={() => setIsAnnounceModalOpen(false)}
      />
    </div>
  );
}

export default DashboardHead;
