import React from "react";
import { MoreHorizontal } from "lucide-react";

const statusColors = {
  Pending: "text-yellow-500",
  Approved: "text-green-600",
  Rejected: "text-red-600",
};

function sanitizeRequest(req) {
  const { id, user_name, is_approved, ...allowed } = req;
  return allowed;
}

const regularizationRequests = {
  pending: [
    sanitizeRequest({
      id: 101,
      user_id: "EMP012",
      name: "Alice Johnson",
      designation_name: "Software Engineer",
      in_date: "2025-11-12T09:10:00Z",
      out_date: "2025-11-12T18:20:00Z",
      status: "Pending",
      is_approved: false,
      approved_by: null,
      approved_on: null,
      requested_on: "2025-11-13T08:50:00Z",
      company: "TechCorp",
      remarks: "Forgot to punch out in the evening",
    }),
    sanitizeRequest({
      id: 102,
      user_id: "EMP014",
      name: "Brian Smith",
      designation_name: "QA Analyst",
      in_date: "2025-11-13T09:05:00Z",
      out_date: "2025-11-13T17:50:00Z",
      status: "Pending",
      is_approved: false,
      approved_by: null,
      approved_on: null,
      requested_on: "2025-11-14T09:10:00Z",
      company: "InnovaSoft",
      remarks: "Missed morning punch",
    }),
  ],
  approved: [
    sanitizeRequest({
      id: 201,
      user_id: "EMP015",
      name: "Catherine Lee",
      designation_name: "Developer",
      in_date: "2025-10-05T09:00:00Z",
      out_date: "2025-10-05T18:00:00Z",
      status: "Approved",
      is_approved: true,
      approved_by: "EMP001",
      approved_on: "2025-10-06T08:45:00Z",
      requested_on: "2025-10-05T18:10:00Z",
      company: "TechCorp",
      remarks: "System error during punch",
    }),
    sanitizeRequest({
      id: 202,
      user_id: "EMP016",
      name: "David Kumar",
      designation_name: "UI Designer",
      in_date: "2025-10-08T09:15:00Z",
      out_date: "2025-10-08T18:10:00Z",
      status: "Approved",
      is_approved: true,
      approved_by: "EMP002",
      approved_on: "2025-10-09T08:40:00Z",
      requested_on: "2025-10-08T18:20:00Z",
      company: "InnovaSoft",
      remarks: "Forgot to punch out in evening",
    }),
  ],
  rejected: [
    sanitizeRequest({
      id: 301,
      user_id: "EMP017",
      name: "Emma Watson",
      designation_name: "HR Manager",
      in_date: "2025-09-20T09:10:00Z",
      out_date: "2025-09-20T17:50:00Z",
      status: "Rejected",
      is_approved: false,
      approved_by: "EMP003",
      approved_on: "2025-09-21T09:00:00Z",
      requested_on: "2025-09-20T18:00:00Z",
      company: "TechCorp",
      remarks: "Duplicate entry",
    }),
    sanitizeRequest({
      id: 302,
      user_id: "EMP018",
      name: "Frank Miller",
      designation_name: "Business Analyst",
      in_date: "2025-09-22T09:05:00Z",
      out_date: "2025-09-22T17:55:00Z",
      status: "Rejected",
      is_approved: false,
      approved_by: "EMP004",
      approved_on: "2025-09-23T08:50:00Z",
      requested_on: "2025-09-22T18:05:00Z",
      company: "InnovaSoft",
      remarks: "Incorrect punch times",
    }),
  ],
};

const RegularizeCard = ({ req }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border w-full">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[12px]">{req.name}</p>
        <p className="text-[11px] text-gray-500">{req.designation_name}</p>
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

    <div className="bg-[#f9fafb] p-3 rounded-lg mt-3">
      <p className="text-[11px] text-gray-700">Remarks :</p>
      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{req.remarks}</p>

      {req.status === "Approved" && req.approved_by && (
        <>
          <p className="text-[11px] text-gray-700 mt-3">Approved By :</p>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{req.approved_by}</p>
        </>
      )}

      {req.status === "Rejected" && req.approved_by && (
        <>
          <p className="text-[11px] text-gray-700 mt-3">Rejected By :</p>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{req.approved_by}</p>
        </>
      )}

      {req.company && (
        <>
          <p className="text-[11px] text-gray-700 mt-3">Company :</p>
          <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{req.company}</p>
        </>
      )}

      <div className="flex justify-between mt-4 text-[11px] text-gray-500">
        <span className="bg-white px-3 py-1 rounded">{new Date(req.in_date).toLocaleDateString()}</span>
        <span className="bg-white px-3 py-1 rounded">{new Date(req.out_date).toLocaleDateString()}</span>
      </div>
    </div>

    {req.status === "Pending" && (
      <div className="flex gap-2 mt-5">
        <button className="flex-1 px-3 py-1.5 text-[11px] rounded-lg border border-red-400 text-red-500 hover:bg-red-50">Reject</button>
        <button className="flex-1 px-3 py-1.5 text-[11px] rounded-lg bg-black text-white hover:bg-gray-800">Approve</button>
      </div>
    )}
  </div>
);

export default function RegularizationTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
      <div>
        <h3 className="text-[12px] mb-3">Pending Requests <span className="text-gray-400">({regularizationRequests.pending.length})</span></h3>
        <div className="flex flex-col gap-4">
          {regularizationRequests.pending.map((req, i) => <RegularizeCard key={i} req={req} />)}
        </div>
      </div>

      <div>
        <h3 className="text-[12px] mb-3">Approved Requests <span className="text-gray-400">({regularizationRequests.approved.length})</span></h3>
        <div className="flex flex-col gap-4">
          {regularizationRequests.approved.map((req, i) => <RegularizeCard key={i} req={req} />)}
        </div>
      </div>

      <div>
        <h3 className="text-[12px] mb-3">Rejected Requests <span className="text-gray-400">({regularizationRequests.rejected.length})</span></h3>
        <div className="flex flex-col gap-4">
          {regularizationRequests.rejected.map((req, i) => <RegularizeCard key={i} req={req} />)}
        </div>
      </div>
    </div>
  );
}
