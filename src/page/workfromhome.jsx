import React from "react";
import { MoreHorizontal } from "lucide-react";
import SideBar from "../components/sidebar";

function WorkFromHome() {
  // Dummy Data
  const requests = {
    recent: [
      {
        name: "Greeshna r",
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
    Pending: "text-yellow-500 bg-yellow-100",
    Approved: "text-green-600 bg-green-100",
    Rejected: "text-red-600 bg-red-100",
  };

  // Card Component
  const RequestCard = ({ req }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border relative w-[280px]">
      {/* Name + Status */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm">{req.name}</p>
          <span
            className={`text-[11px] px-2 py-1 rounded-full ${statusColors[req.status]}`}
          >
            {req.status}
          </span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-600 mt-3 line-clamp-3">{req.reason}</p>

      {/* Dates */}
      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>{req.start}</span>
        <span>{req.end}</span>
      </div>

      {/* Actions (only for Pending) */}
      {req.status === "Pending" && (
        <div className="flex gap-2 mt-4">
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
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-6">Work From Home</h2>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Recent requests{" "}
              <span className="text-gray-400">( {requests.recent.length} )</span>
            </h3>
            <div className="flex flex-col gap-4">
              {requests.recent.map((req, i) => (
                <RequestCard key={i} req={req} />
              ))}
            </div>
          </div>

          {/* Approved Requests */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Approved requests{" "}
              <span className="text-gray-400">
                ( {requests.approved.length} )
              </span>
            </h3>
            <div className="flex flex-col gap-4">
              {requests.approved.map((req, i) => (
                <RequestCard key={i} req={req} />
              ))}
            </div>
          </div>

          {/* Rejected Requests */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Rejected requests{" "}
              <span className="text-gray-400">
                ( {requests.rejected.length} )
              </span>
            </h3>
            <div className="flex flex-col gap-4">
              {requests.rejected.map((req, i) => (
                <RequestCard key={i} req={req} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkFromHome;
