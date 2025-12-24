import React, { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, MoreVertical, Pencil, Eye, Plus } from "lucide-react";
import toast from "react-hot-toast";

import UniversalTable from "../../ui/universal_table";
import {
  fetchRegularizationRequests,
  fetchShiftAllocation,
} from "../../service/employeeService";

import AddRegularizeModal from "../../ui/addregularize";
import RegularizationApprovalModal from "../../ui/regularizationapproval";

/* ================= ACTION MENU ================= */
const ActionMenu = ({ row, openMenuId, setOpenMenuId, onEdit }) => {
  const isOpen = openMenuId === row.id;
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 6, left: rect.right - 140 });
    }
    setOpenMenuId(isOpen ? null : row.id);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [setOpenMenuId]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="w-32 bg-white border rounded-lg shadow-xl z-[999999]"
          >
            <button
              onClick={() => {
                setOpenMenuId(null);
                onEdit(row);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4" />
            Edit
            </button>

            <button
              onClick={() => {
                setOpenMenuId(null);
                toast("View coming soon");
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

/* ================= MAIN COMPONENT ================= */
function RegularizationTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [selectedRow, setSelectedRow] = useState(null);
  const [shiftData, setShiftData] = useState(null);
  const [modalType, setModalType] = useState(null); // "add" | "approve" | null

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchRegularizationRequests();

      const transformed = res.data.map((item) => {
        const inDate = item.in_date ? new Date(item.in_date) : null;

        return {
          id: item.id,
          userId: item.user_id,
          name: item.user_name || "N/A",
          designation: item.designation_name || "N/A",
          date: inDate
            ? inDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "--",
          checkIn: inDate
            ? inDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--",
          checkOut: item.out_date
            ? new Date(item.out_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--",
          workingHours: item.total_work_hours || "--",
          status: item.status || "pending",
          avatar:
            item.user_image ||
            `https://i.pravatar.cc/40?u=${item.user_id}`,
          remarks: item.remarks || "",
          remaining: item.remaining || 0,
        };
      });

      setData(transformed);
    } catch {
      toast.error("Failed to load regularization requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= OPTIMISTIC STATUS UPDATE ================= */
  const handleOptimisticUpdate = (id, status) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status } : row
      )
    );
  };

  /* ================= STATUS COLOR ================= */
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      key: "name",
      label: "Name",
      width: 180,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar} className="w-7 h-7 rounded-full" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: "designation",
      label: "Designation",
      width: 160,
      render: (val) => (
        <span className="truncate block max-w-[140px]">{val}</span>
      ),
    },
    { key: "date", label: "Date", width: 120 },
    { key: "checkIn", label: "Check In", width: 120 },
    { key: "checkOut", label: "Check Out", width: 120 },
    { key: "workingHours", label: "Working Hours", width: 140 },
    {
      key: "status",
      label: "Status",
      width: 120,
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-full text-[12px] ${getStatusColor(
            val
          )}`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      width: 60,
      render: (_, row) => (
        <ActionMenu
          row={row}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onEdit={async (row) => {
            setSelectedRow(row);
            try {
              const shiftResponse = await fetchShiftAllocation(row.userId);
              setShiftData(
                shiftResponse?.data || { shift_name: "Not Allocated" }
              );
            } catch {
              setShiftData({ shift_name: "Not Allocated" });
            }
            setModalType("approve");
          }}
        />
      ),
    },
  ];

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const q = searchTerm.toLowerCase();
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [data, searchTerm]);

  /* ================= ADD REGULARIZE ================= */
  const handleRegularizeClick = () => {
    setSelectedRow({
      name: "",
      date: "",
      checkIn: "",
      checkOut: "",
      workingHours: "",
      remarks: "",
    });
    setShiftData(null);
    setModalType("add");
  };

  return (
    <>
      <div className="bg-[#f9fafb] rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">Regularization Requests</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegularizeClick}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm h-10"
            >
              <Plus className="w-4 h-4" />
              Regularize
            </button>

            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white h-10">
              <input
                className="outline-none text-sm"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">Loading...</div>
        ) : (
          <UniversalTable columns={columns} data={filteredData} rowsPerPage={10} />
        )}
      </div>

      {/* ================= MODALS ================= */}
      {modalType === "add" &&
        createPortal(
 <AddRegularizeModal
  open
  data={selectedRow}
  shiftData={shiftData}
  onClose={() => {
    setModalType(null);
    setSelectedRow(null);
    setShiftData(null);
  }}
  onSuccess={fetchData}   // ✅ ADD THIS LINE
/>
,
          document.body
        )}

      {modalType === "approve" &&
        createPortal(
          <RegularizationApprovalModal
            open
            data={selectedRow}
            shiftData={shiftData}
            onClose={() => {
              setModalType(null);
              setSelectedRow(null);
              setShiftData(null);
            }}
            onSuccess={fetchData}
            onOptimisticUpdate={handleOptimisticUpdate}
          />,
          document.body
        )}
    </>
  );
}

export default RegularizationTable;
