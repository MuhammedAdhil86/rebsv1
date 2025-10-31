import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import useLeaveStore from "../../store/useleaveStore";
import LeaveRequest from "../../ui/approve";

function LeaveRequestes() {
  const { leaves, fetchLeaves, connectWebSocket, loading, error } = useLeaveStore();
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 items per page
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchLeaves();
    connectWebSocket(token);
  }, [fetchLeaves, connectWebSocket, token]);

  const filteredLeaves = useMemo(() => {
    let filtered = [...(leaves || [])];
    if (filterStatus !== "All") {
      filtered = filtered.filter(
        (req) =>
          req.status?.toLowerCase() === filterStatus.toLowerCase() ||
          (filterStatus === "Pending" && req.status?.toLowerCase().includes("pending"))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.name?.toLowerCase().includes(q) ||
          req.reason?.toLowerCase().includes(q) ||
          req.type?.toLowerCase().includes(q)
      );
    }
    filtered.sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on));
    return filtered;
  }, [leaves, filterStatus, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const paginatedLeaves = filteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: "name", label: "Name", width: 120 },
    { key: "designation", label: "Designation", width: 120 },
    { key: "applied_on", label: "Applied On", width: 120 },
    { key: "no_of_days", label: "Total Days", width: 80 },
    { key: "reason", label: "Reason", width: 150 },
    { key: "remarks", label: "Remark", width: 120 },
    { key: "type", label: "Leave Type", width: 120 },
    { key: "status", label: "Status", width: 100 },
    { key: "action", label: "Action", width: 80 },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 sm:p-4 bg-gray-100 rounded-xl w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <h3 className="text-lg font-semibold">Leave Requests</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                  filterStatus === status
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-50 text-sm mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="bg-transparent text-gray-600 w-full focus:outline-none text-sm"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Header Card */}
      <div className="overflow-x-auto w-full rounded-xl shadow-sm bg-white">
        <table className="w-full table-fixed border-collapse rounded-xl" style={{ fontSize: "12.5px" }}>
          <thead className="bg-white text-gray-500 uppercase py-3">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  style={{ minWidth: `${col.width}px`, fontSize: "12.5px" }}
                  className={`px-4 py-4 font-medium text-left ${
                    idx === 0 ? "rounded-tl-xl" : ""
                  } ${idx === columns.length - 1 ? "rounded-tr-xl" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Table Body Card */}
      <div className="overflow-x-auto w-full rounded-xl shadow-sm bg-white ">
        <table className="w-full table-fixed border-collapse rounded-xl" style={{ fontSize: "12.5px" }}>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-gray-500 text-center">
                  Loading leave requests...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-red-600 text-center">
                  Error: {error}
                </td>
              </tr>
            ) : paginatedLeaves.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-gray-500 text-center">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              paginatedLeaves.map((req, idx) => (
                <tr
                  key={req.leave_ref_no || idx}
                  className={`hover:bg-gray-50 ${
                    idx === paginatedLeaves.length - 1 ? "rounded-b-xl" : ""
                  }`}
                >
                  <td className="px-4 py-2">{req.name || "Unknown"}</td>
                  <td className="px-4 py-2">{req.designation || "-"}</td>
                  <td className="px-4 py-2">{req.applied_on ? new Date(req.applied_on).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="px-4 py-2">{req.no_of_days || "-"}</td>
                  <td className="px-4 py-2">{req.reason || "—"}</td>
                  <td className="px-4 py-2">{req.remarks || "NA"}</td>
                  <td className="px-4 py-2">{req.type || "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : req.status.includes("Pending")
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedLeave(req);
                        setDrawerOpen(true);
                      }}
                      className="text-green-600 hover:text-green-800 font-medium underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredLeaves.length > itemsPerPage && (
          <div className="flex justify-between items-center px-4 py-2 border-t text-sm text-gray-600">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-3 py-1 rounded-lg border hover:bg-gray-100 transition ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-3 py-1 rounded-lg border hover:bg-gray-100 transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-black/40" />
          <div className="absolute top-0 right-0 h-full bg-white shadow-2xl rounded-l-2xl w-[600px] max-w-[90vw] overflow-y-auto">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
            >
              ✕
            </button>
            <div className="p-4">
              {selectedLeave ? (
                <LeaveRequest user={selectedLeave} handleClose={() => setDrawerOpen(false)} />
              ) : (
                <p className="text-center text-gray-500 mt-20">No leave selected.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequestes;
