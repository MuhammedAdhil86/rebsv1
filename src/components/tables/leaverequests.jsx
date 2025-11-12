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
  const itemsPerPage = 10;
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

  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const paginatedLeaves = filteredLeaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: "name", label: "Name", width: 200 }, // more flexible
    { key: "designation", label: "Designation", width: 120 },
    { key: "applied_on", label: "Applied On", width: 120 },
    { key: "no_of_days", label: "Total Days", width: 80 },
    { key: "reason", label: "Reason", width: 150 },
    { key: "remarks", label: "Remark", width: 100 }, // reduced width
    { key: "type", label: "Leave Type", width: 120 },
    { key: "status", label: "Status", width: 100 },
    { key: "action", label: "Action", width: 80 },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 px-4 pb-4 bg-[#f9fafb] rounded-xl w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ">
<h3 className="text-lg sm:text-xl font-medium text-gray-800">
  Leave Requests
</h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
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
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-gray-600 w-full focus:outline-none text-sm bg-white"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Header */}
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

      {/* Table Body */}
      <div className="overflow-x-auto w-full rounded-xl shadow-sm bg-white">
        <table
          className="w-full table-fixed border-collapse border-separate"
          style={{ fontSize: "12.5px", borderSpacing: "0 20px" }}
        >
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-gray-500 text-center bg-white rounded-xl">
                  Loading leave requests...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-red-600 text-center bg-white rounded-xl">
                  Error: {error}
                </td>
              </tr>
            ) : paginatedLeaves.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-gray-500 text-center bg-white rounded-xl">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              paginatedLeaves.map((req, idx) => (
                <tr
                  key={req.leave_ref_no || idx}
                  className="bg-white hover:bg-gray-50 shadow-sm transition-all duration-150 rounded-xl"
                >
              <td
  className="px-4 py-2 truncate max-w-[60px]" 
  title={req.name || "Unknown"} // Tooltip shows full name
>
  <div className="flex items-center gap-2 min-w-[120px]">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJFYyBlkZfPY6Jb_BDM0gAW2jdMCFsYWxgeQ&s"
      alt="profile"
      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
    />
    <span className="truncate text-gray-700 font-medium max-w-[60px]" title={req.name}>
      {req.name || "Unknown"}
    </span>
  </div>
</td>


                  <td className="px-4 py-2 truncate max-w-[120px]" title={req.designation || "-"}>
                    {req.designation || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {req.applied_on ? new Date(req.applied_on).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-4 py-2">{req.no_of_days || "-"}</td>
                  <td className="px-4 py-2 truncate max-w-[150px]" title={req.reason || "—"}>
                    {req.reason || "—"}
                  </td>
                  <td className="px-4 py-2 truncate max-w-[100px]" title={req.remarks || "NA"}>
                    {req.remarks || "NA"}
                  </td>
                  <td className="px-4 py-2">{req.type || "—"}</td>

                  {/* Status pill with three dots */}
                  <td className="px-4 py-2 max-w-[100px]">
                    <span
                      title={req.status}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-[100px] text-center ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : req.status?.includes("Pending")
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
