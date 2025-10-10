import React, { useEffect, useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import useLeaveStore from "../../store/useleaveStore";
import LeaveRequest from "../../ui/approve"; // ✅ Import your component

function LeaveRequestes() {
  const { leaves, fetchLeaves, connectWebSocket, loading, error } =
    useLeaveStore();

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false); // ✅ for drawer
  const [selectedLeave, setSelectedLeave] = useState(null); // ✅ selected leave

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
          (filterStatus === "Pending" &&
            req.status?.toLowerCase().includes("pending"))
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

  if (loading) return <p>Loading leave requests...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <section className="bg-gray-100 rounded-xl shadow-sm overflow-x-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Leave Requests</h3>

          <div className="flex items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
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

            {/* Search Bar */}
            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-gray-50 text-sm">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-gray-600 w-40 focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm rounded-lg overflow-hidden">
          <thead className="bg-white text-gray-500 text-left text-xs uppercase">
            <tr>
              {[
                "Name",
                "Designation",
                "Applied On",
                "Total Days",
                "Reason",
                "Remark",
                "Leave Type",
                "Status",
                "Action",
              ].map((col) => (
                <th key={col} className="px-4 py-3 font-medium">
                  <div className="flex items-center">
                    {col}
                    <span className="flex flex-col">
                      <ChevronUp className="w-3 h-3 -mb-1 text-gray-300" />
                      <ChevronDown className="w-3 h-3 text-gray-300" />
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y bg-white text-center align-middle">
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              filteredLeaves.map((req, idx) => (
                <tr key={req.leave_ref_no || idx}>
                  <td className="px-4 py-3 flex justify-center items-center align-middle">
                    {req.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 align-middle">{req.designation || "-"}</td>
                  <td className="px-4 py-3 align-middle">
                    {req.applied_on
                      ? new Date(req.applied_on).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 align-middle">{req.no_of_days || "-"}</td>
                  <td className="px-4 py-3 align-middle">{req.reason || "—"}</td>
                  <td className="px-4 py-3 align-middle">{req.remarks || "NA"}</td>
                  <td className="px-4 py-3 align-middle">{req.type || "—"}</td>
                  <td className="px-4 py-3 align-middle">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : req.status === "Pending" ||
                            req.status === "Pending for Admin Approval"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
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
      </section>

      {/* ✅ Drawer Section */}
      {drawerOpen && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-300 ${
            drawerOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {/* Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            className={`absolute inset-0 bg-black/40 transition-opacity ${
              drawerOpen ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          {/* Drawer Panel */}
          <div
            className={`absolute top-0 right-0 h-full bg-white shadow-2xl rounded-l-2xl w-[600px] max-w-[90vw] transform transition-transform duration-300 ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
            >
              ✕
            </button>

            <div className="p-4 overflow-y-auto h-full">
              {selectedLeave ? (
                <LeaveRequest
                  user={selectedLeave}
                  handleClose={() => setDrawerOpen(false)}
                />
              ) : (
                <p className="text-center text-gray-500 mt-20">
                  No leave selected.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LeaveRequestes;
