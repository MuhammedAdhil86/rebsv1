import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../ui/pagelayout";
import avatar from "../assets/img/avatar.svg";
import { FiBell, FiSearch, FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { ChevronDown, Shield, UserCheck, UserX, Trash2, MoreVertical } from "lucide-react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import useEmployeeStore from "../store/employeeStore";

const API_BASE_URL = "https://agnostically-bonniest-patrice.ngrok-free.dev"; // 🔗 Backend URL

const TABS = [
  { key: "all", label: "All Employees" },
  { key: "active", label: "Active Employees" },
  { key: "inactive", label: "Inactive Employees" },
];

function ManageEmployees() {
  const { employees, loading, fetchEmployees } = useEmployeeStore();
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("card");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  const filteredData = employees
    .filter((emp) => {
      if (tab === "active") return emp.is_active === true || emp.is_active === "true";
      if (tab === "inactive") return emp.is_active === false || emp.is_active === "false";
      return true;
    })
    .filter((emp) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        emp.first_name?.toLowerCase().includes(term) ||
        emp.last_name?.toLowerCase().includes(term) ||
        emp.department?.toLowerCase().includes(term) ||
        emp.designation?.toLowerCase().includes(term) ||
        emp.ph_no?.toString().includes(term)
      );
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredData.map((d) => d.uuid));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (e, uuid) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      e.target.checked ? [...prev, uuid] : prev.filter((x) => x !== uuid)
    );
  };

  const handleRowClick = (row) => {
    navigate(`/details/${row.id}`);
  };

  // ✅ Bulk Activate / Deactivate
  const bulkUpdateStatus = async (activate) => {
    if (selectedRows.length === 0) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/staff/bulk-toggle-activate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_uuids: selectedRows, activate }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to update users");
      }

      alert(`Users ${activate ? "activated" : "deactivated"} successfully!`);
      setSelectedRows([]);
      fetchEmployees();
    } catch (err) {
      console.error("Bulk update failed:", err);
      alert(`Bulk update failed: ${err.message}`);
    }
  };

  const handleActivateUser = () => bulkUpdateStatus(true);
  const handleDeactivateUser = () => bulkUpdateStatus(false);
  const handleAddPrivilege = () => alert("Add Privilege");

  // ✅ Show delete confirmation modal
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one employee to delete.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // ✅ Confirm & perform bulk delete (fixed logic)
  const confirmBulkDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/staff/bulk-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_uuids: selectedRows, // ✅ FIXED: send UUIDs, not IDs
          reason: deleteReason || "Deleted by admin",
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to delete employees");
      }

      alert("Selected employees deleted successfully!");
      setSelectedRows([]);
      setShowDeleteConfirm(false);
      setDeleteReason("");
      fetchEmployees();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(`Delete failed: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderEmployeeCard = (emp) => (
    <div
      key={emp.id}
      className="bg-white rounded-2xl flex flex-col justify-between h-full transition hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={emp.image || avatar}
            alt={emp.first_name}
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              emp.is_active === true || emp.is_active === "true"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {emp.is_active === true || emp.is_active === "true"
              ? "Active"
              : "Inactive"}
          </span>
          <button
            onClick={() => navigate(`/details/${emp.id}`)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">
          {emp.first_name} {emp.last_name}
        </h3>
        <p className="text-xs text-gray-500">{emp.designation}</p>
      </div>
      <div className="flex flex-col space-y-2 text-sm text-gray-600 bg-gray-100 p-3 rounded-lg mt-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Department</span>
          <span className="text-gray-700">Date of Joining</span>
        </div>
        <div className="flex justify-between">
          <span>{emp.department}</span>
          <span>{formatDate(emp.date_of_join)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon icon="solar:phone-linear" className="text-gray-600 w-4 h-4" />
          <span>{emp.ph_no}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon icon="mage:email" className="text-gray-600 w-4 h-4" />
          <span>{emp.email}</span>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-1">
            <h1 className="text-xl font-semibold text-gray-800">Manage Employees</h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                <FiBell className="w-5 h-5 text-gray-600" />
              </div>
              <img src={avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            </div>
          </div>

          {/* Tabs */}
          <section className="bg-white w-full mb-2">
            <div className="border-b flex flex-wrap gap-4 px-0 pt-2 text-sm text-gray-600">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`pb-2 whitespace-nowrap transition-colors ${
                    tab === t.key
                      ? "border-b-2 border-black font-semibold text-black"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          {/* Controls */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <span className="text-gray-700 font-medium">
              {loading ? "Loading..." : `${filteredData.length} Total Employees`}
            </span>
            <div className="flex items-center space-x-3">
              <button className="flex items-center bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                <FiPlus className="w-4 h-4 mr-1" /> Add Employee
              </button>

              {/* Dropdown */}
              {view === "table" && (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Update Status
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {isDropdownOpen && selectedRows.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={handleAddPrivilege}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Shield size={16} className="mr-2 text-gray-600" /> Add Privilege
                        </button>
                        <button
                          onClick={handleActivateUser}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <UserCheck size={16} className="mr-2 text-gray-600" /> Activate User
                        </button>
                        <button
                          onClick={handleDeactivateUser}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <UserX size={16} className="mr-2 text-gray-600" /> Deactivate User
                        </button>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={handleDelete}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <Trash2 size={16} className="mr-2 text-red-600" /> Delete User
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View Toggle + Search */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-1">
                <button
                  className={`px-4 py-1 rounded-md text-sm font-medium ${
                    view === "table"
                      ? "bg-gray-100 text-gray-800 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setView("table")}
                >
                  Table
                </button>
                <button
                  className={`px-4 py-1 rounded-md text-sm font-medium ${
                    view === "card"
                      ? "bg-gray-100 text-gray-800 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setView("card")}
                >
                  Card
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Conditional Views */}
          {view === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-gray-500 py-10">
                  Loading...
                </div>
              ) : filteredData.length > 0 ? (
                filteredData.map(renderEmployeeCard)
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No employees to show.
                </div>
              )}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-full">
                <div className="border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-12 items-center py-3 text-sm font-medium text-gray-500">
                    <div className="pl-4 col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        onChange={handleSelectAll}
                        checked={
                          selectedRows.length === filteredData.length &&
                          filteredData.length > 0
                        }
                      />
                    </div>
                    <div className="col-span-2">Name</div>
                    <div className="col-span-2">Designation</div>
                    <div className="col-span-2">Date of Joining</div>
                    <div className="col-span-1 px-2">Department</div>
                    <div className="col-span-1 px-2 ml-4">Branch</div>
                    <div className="col-span-1 ml-5">Mobile</div>
                    <div className="col-span-1 ml-12">Status</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                <div className="bg-white text-[2px]">
                  {filteredData.map((row, index) => (
                    <div
                      key={row.id || index}
                      className={`grid grid-cols-12 items-center py-3 text-sm border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                        selectedRows.includes(row.uuid) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleRowClick(row)}
                    >
                      <div className="pl-4 col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600"
                          checked={selectedRows.includes(row.uuid)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleSelectRow(e, row.uuid)}
                        />
                      </div>
                      <div className="font-medium text-gray-900 flex items-center col-span-2">
                        {row.first_name || "N/A"} {row.last_name || "N/A"}
                      </div>
                      <div className="text-gray-700 col-span-2">
                        {row.designation || "N/A"}
                      </div>
                      <div className="text-gray-700 col-span-2">
                        {row.date_of_join ? formatDate(row.date_of_join) : "N/A"}
                      </div>
                      <div className="text-gray-700 col-span-1 px-2">
                        {row.department || "N/A"}
                      </div>
                      <div className="text-gray-700 col-span-1 px-2 ml-6">
                        {row.branch || "N/A"}
                      </div>
                      <div className="text-gray-700 col-span-1">
                        {row.ph_no || "N/A"}
                      </div>
                      <div className="col-span-1 ml-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-9 ${
                            row.is_active === false || row.is_active === "false"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {row.is_active === false || row.is_active === "false"
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </div>
                      <div className="flex justify-center pr-4 col-span-1 ml-10">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[400px] p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to permanently delete
              <span className="font-medium text-gray-900">
                {" "}
                {selectedRows.length} employee(s)
              </span>
              ? This action cannot be undone.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for deletion (optional)
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter reason..."
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageEmployees;
