import React from "react";
import { MoreHorizontal } from "lucide-react";
import { FiBell } from "react-icons/fi";
import DashboardLayout from "../ui/pagelayout";

function WorkFromHome() {
  const requests = {
    recent: [
      {
        name: "Greeshma r",
        status: "Pending",
        reason:
          "Due to minor health issues, I would like to request permission to work from home for the day to ensure productivity while also recovering",
        start: "25/09/2024",
        end: "25/09/2024",
      },
      {
        name: "Gokul S",
        status: "Pending",
        reason:
          "Due to minor health issues, I would like to request permission to work from home for the day to ensure productivity while also recovering",
        start: "25/09/2024",
        end: "26/09/2024",
      },
    ],
    approved: [
      {
        name: "Aleona Eldhose",
        status: "Approved",
        reason:
          "Due to minor health issues, I would like to request permission to work from home for the day to ensure productivity while also recovering",
        start: "25/09/2024",
        end: "25/09/2024",
      },
    ],
    rejected: [
      {
        name: "Rohith E R",
        status: "Rejected",
        reason:
          "Due to minor health issues, I would like to request permission to work from home for the day to ensure productivity while also recovering",
        start: "23/09/2024",
        end: "25/09/2024",
      },
    ],
  };

  const statusColors = {
    Pending: "text-yellow-500",
    Approved: "text-green-600",
    Rejected: "text-red-600",
  };

  const RequestCard = ({ req }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{req.name}</p>

          <span className={`text-[11px] flex items-center gap-1 ${statusColors[req.status]}`}>
            <span
              className={`w-2 h-2 rounded-full ${
                req.status === "Pending"
                  ? "bg-yellow-600"
                  : statusColors[req.status].replace("text", "bg")
              }`}
            ></span>
            {req.status}
          </span>
        </div>

        <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
      </div>

      {/* ✅ ONLY CHANGE — Reason section wrapped in background */}
      <div className="bg-[#f9fafb] p-3 rounded-lg mt-3">
        <p className="text-[11px] font-semibold text-gray-700">Reason :</p>

        <p className="text-xs text-gray-600 mt-1 leading-relaxed ">
          {req.reason}
        </p>

        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span className="bg-white px-3 py-1 rounded">{req.start}</span>
          <span className="bg-white px-3 py-1 rounded">{req.end}</span>
        </div>
      </div>
      {/* END CHANGE */}

      {req.status === "Pending" && (
        <div className="flex gap-2 mt-5">
          <button className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-red-400 text-red-500 hover:bg-red-50">
            Reject
          </button>
          <button className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-black text-white hover:bg-gray-800">
            Approve
          </button>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout userName="Admin" onLogout={() => {}}>
      <div className="bg-white flex justify-between items-center p-4 mb-4 shadow-sm rounded-lg">
        <h1 className="text-lg font-medium text-gray-800">Work From Home</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300">
            <FiBell className="text-gray-600 text-lg" />
          </div>

          <button className="text-sm text-gray-700 border border-gray-300 px-4 py-1 rounded-full">
            Settings
          </button>

          <div className="w-9 h-9 rounded-full border border-gray-200 overflow-hidden">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4 transition-all duration-300">

        <div>
          <h3 className="text-sm font-medium mb-3">
            Recent Requests{" "}
            <span className="text-gray-400">( {requests.recent.length} )</span>
          </h3>

          <div className="flex flex-col gap-4">
            {requests.recent.map((req, i) => (
              <RequestCard key={i} req={req} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">
            Approved Requests{" "}
            <span className="text-gray-400">( {requests.approved.length} )</span>
          </h3>

          <div className="flex flex-col gap-4">
            {requests.approved.map((req, i) => (
              <RequestCard key={i} req={req} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">
            Rejected Requests{" "}
            <span className="text-gray-400">( {requests.rejected.length} )</span>
          </h3>

          <div className="flex flex-col gap-4">
            {requests.rejected.map((req, i) => (
              <RequestCard key={i} req={req} />
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default WorkFromHome;
