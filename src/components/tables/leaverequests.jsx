import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import useLeaveStore from "../../store/useleaveStore";
import LeaveRequest from "../../ui/approve";
import UniversalTable from "../../ui/universal_table";

function LeaveRequestes() {
  const { leaves, fetchLeaves, connectWebSocket, loading, error } =
    useLeaveStore();

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchLeaves();
    connectWebSocket(token);
  }, [fetchLeaves, connectWebSocket, token]);

  // ===== Filtered & searched leaves =====
  const filteredLeaves = useMemo(() => {
    let arr = Array.isArray(leaves) ? [...leaves] : [];

    // Filter by status
    if (filterStatus !== "All") {
      arr = arr.filter((req) => {
        const st = (req.status ?? "").toString().toLowerCase();
        if (filterStatus === "Pending") return st.includes("pending");
        return st === filterStatus.toLowerCase();
      });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      arr = arr.filter((req) => {
        return (
          (req.name ?? "").toLowerCase().includes(q) ||
          (req.reason ?? "").toLowerCase().includes(q) ||
          (req.type ?? "").toLowerCase().includes(q)
        );
      });
    }

    // Sort by applied_on
    arr.sort((a, b) => {
      const dateA = a.applied_on ? new Date(a.applied_on) : new Date(0);
      const dateB = b.applied_on ? new Date(b.applied_on) : new Date(0);
      return dateB - dateA;
    });

    return arr;
  }, [leaves, filterStatus, searchQuery]);

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    const s = status.toString().toLowerCase();
    if (s.includes("approved")) return "bg-green-100 text-green-600";
    if (s.includes("pending")) return "bg-orange-100 text-orange-600";
    if (s.includes("rejected") || s.includes("inactive"))
      return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      width: 160,
      render: (val, row) => {
        const imageSrc =
          row?.image && row.image.trim() !== ""
            ? row.image
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJFYyBlkZfPY6Jb_BDM0gAW2jdMCFsYWxgeQ&s";

        return (
          <div className="flex items-center gap-2">
            <img
              src={imageSrc}
              alt="avatar"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="whitespace-nowrap">{val ?? "-"}</span>
          </div>
        );
      },
    },
    {
      key: "designation",
      label: "Designation",
      width: 140,
      render: (val) => {
        const des = val ?? "";
        const shortDes = des.length > 12 ? des.substring(0, 12) + "…" : des;
        return (
          <span className="truncate block max-w-[120px]" title={des}>
            {shortDes || "-"}
          </span>
        );
      },
    },
    {
      key: "applied_on",
      label: "Applied On",
      width: 120,
      render: (val) => (val ? new Date(val).toLocaleDateString("en-GB") : "—"),
    },
    {
      key: "no_of_days",
      label: "Total Days",
      width: 80,
      render: (val) => (val != null ? val : "-"),
    },
    {
      key: "reason",
      label: "Reason",
      width: 150,
      render: (val) => (
        <span className="truncate block max-w-[140px]" title={val ?? ""}>
          {val ?? "-"}
        </span>
      ),
    },
    {
      key: "remarks",
      label: "Remark",
      width: 120,
      render: (val) => (
        <span
          className="truncate block max-w-[100px]"
          title={val ? val : "Not available"}
        >
          {val || "Not available"}
        </span>
      ),
    },
    {
      key: "type",
      label: "Leave Type",
      width: 120,
      render: (val) => val ?? "-",
    },
    {
      key: "status",
      label: "Status",
      width: 120,
      render: (val) => {
        const status = val ?? "";
        const shortStatus =
          status.length > 8 ? status.substring(0, 8) + "…" : status;
        return (
          <span
            title={status}
            className={`px-3 py-1 rounded-full text-[11px] font-normal whitespace-nowrap inline-block max-w-[100px] text-center ${getStatusColor(
              status,
            )}`}
          >
            {shortStatus}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 px-4 pb-4 bg-[#f9fafb] rounded-xl w-full mx-auto">
      {/* Header: title + filters + search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-base font-medium text-gray-800">Leave Requests</h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 sm:px-4 py-2 text-[12px] rounded-lg border transition ${
                  filterStatus === status
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedLeave(null);
              }}
              className="bg-transparent text-gray-600 w-full focus:outline-none text-sm placeholder:text-[12px]"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
        </div>
      ) : (
        <UniversalTable
          columns={columns}
          data={filteredLeaves}
          rowsPerPage={10}
          rowClickHandler={(row) => {
            setSelectedLeave(row);
            setDrawerOpen(true);
          }}
        />
      )}

      {/* Drawer for selected leave */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full bg-white shadow-2xl rounded-l-2xl w-[600px] max-w-[90vw] overflow-y-auto">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <div className="p-4">
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

      {error && (
        <div className="text-center py-2 text-red-600">Error: {error}</div>
      )}
    </div>
  );
}

export default LeaveRequestes;
