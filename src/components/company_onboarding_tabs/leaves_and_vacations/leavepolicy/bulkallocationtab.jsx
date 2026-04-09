import React, { useEffect, useState } from "react";
import { Search, Info, Users, Filter } from "lucide-react";
import PayrollTable from "../../../../ui/payrolltable";
import toast, { Toaster } from "react-hot-toast";
import payrollService from "../../../../service/payrollService";
import {
  getAllStaff,
  filterStaff,
  getDepartmentData,
  getBranchData,
  getDesignationData,
} from "../../../../service/staffservice";

const BulkAllocationTab = ({ policies }) => {
  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterType, setFilterType] = useState("all");
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilterId, setSelectedFilterId] = useState("");

  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchInitialData();
  }, [policies]);

  const fetchInitialData = async () => {
    setLoading(true);
    await fetchAllUsers();
    setLoading(false);
  };

  /* ================= COLUMN DEFINITION ================= */
  const columns = [
    {
      key: "selection",
      label: (
        <input
          type="checkbox"
          className="cursor-pointer accent-black"
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={users.length > 0 && selectedUsers.length === users.length}
        />
      ),
      width: 50,
      render: (_, row) => (
        <input
          type="checkbox"
          className="cursor-pointer accent-black"
          checked={selectedUsers.includes(row.uuid)}
          onChange={() => toggleUserSelection(row.uuid)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    { key: "full_name", label: "Staff Name", align: "left" },
    { key: "employee_id", label: "Staff ID", align: "center" },
    { key: "department_name", label: "Department", align: "center" },
    { key: "designation_name", label: "Designation", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (val) => (
        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-normal border border-green-100 uppercase">
          {val || "Active"}
        </span>
      ),
    },
  ];

  /* ================= SELECTION LOGIC ================= */
  const toggleUserSelection = (uuid) => {
    setSelectedUsers((prev) =>
      prev.includes(uuid) ? prev.filter((u) => u !== uuid) : [...prev, uuid],
    );
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedUsers(users.map((u) => u.uuid));
    } else {
      setSelectedUsers([]);
    }
  };

  /* ================= API ACTIONS ================= */
  const fetchAllUsers = async () => {
    try {
      const data = await getAllStaff();
      const staffList = Array.isArray(data) ? data : data?.data || [];
      setUsers(staffList);
      setSelectedUsers([]);
    } catch (error) {
      toast.error("Failed to load staff list");
      setUsers([]);
    }
  };

  const handleFilterTypeChange = async (type) => {
    setFilterType(type);
    setSelectedFilterId("");
    setFilterOptions([]);
    setSelectedUsers([]);

    if (type === "all") {
      setLoading(true);
      await fetchAllUsers();
      setLoading(false);
      return;
    }

    try {
      let data = [];
      if (type === "department") data = await getDepartmentData();
      if (type === "designation") data = await getDesignationData();
      if (type === "branch") data = await getBranchData();

      const options = Array.isArray(data) ? data : data?.data || [];
      setFilterOptions(options);
    } catch (error) {
      toast.error(`Could not load ${type} data`);
    }
  };

  const handleFilterSelect = async (id) => {
    setSelectedFilterId(id);
    setSelectedUsers([]);
    if (!id) return;

    setLoading(true);
    let params = {};
    if (filterType === "department") params.department_id = id;
    if (filterType === "designation") params.designation_id = id;
    if (filterType === "branch") params.branch_id = id;

    try {
      const data = await filterStaff(params);
      const filteredList = Array.isArray(data) ? data : data?.data || [];
      setUsers(filteredList);
    } catch (error) {
      toast.error("Filtering failed");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ACTION ================= */
  const handleAllocate = async () => {
    if (!selectedPolicyId)
      return toast.error("Please select a leave policy first");
    if (selectedUsers.length === 0)
      return toast.error("Please select at least one staff member");

    const payload = {
      leave_policy_id: parseInt(selectedPolicyId, 10),
      staff_ids: selectedUsers,
    };

    setSubmitting(true);
    try {
      const response = await payrollService.bulkAllocateLeave(payload);

      if (response.success || response.status_code === 200) {
        toast.success(response.message || "Policy successfully allocated!");
        setSelectedUsers([]);
        setSelectedPolicyId("");
        fetchAllUsers();
      } else {
        toast.error(response.message || "Backend rejected the allocation");
      }
    } catch (error) {
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.data ||
        error.message ||
        "Unknown server error";

      toast.error(`Error: ${backendError}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500 font-['Poppins'] font-normal">
      <Toaster position="top-right" />

      {/* --- LEFT SIDEBAR: CONTROLS --- */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-6">
          {/* Policy Selection */}
          <div>
            <label className="text-[12px] text-gray-800 uppercase tracking-tight block mb-3 font-normal">
              Select Policy
            </label>
            <select
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black transition-all font-normal"
            >
              <option value="">-- Choose Leave Template --</option>
              {policies?.map((policy) => (
                <option key={policy.id} value={policy.id}>
                  {policy.name}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-gray-50" />

          {/* Filtering Controls */}
          <div>
            <label className="text-[12px] text-gray-800 uppercase tracking-tight block mb-3 font-normal">
              Target Audience
            </label>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {["all", "department", "designation", "branch"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterTypeChange(type)}
                  className={`px-2 py-2 rounded-lg text-[10px] capitalize border transition-all font-normal ${
                    filterType === type
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {filterType !== "all" && (
              <select
                value={selectedFilterId}
                onChange={(e) => handleFilterSelect(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black animate-in slide-in-from-top-2 duration-200 font-normal"
              >
                <option value="">-- Select {filterType} --</option>
                {filterOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name || opt.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <hr className="border-gray-50" />

          {/* Final Action */}
          <div className="pt-2">
            <button
              disabled={submitting || selectedUsers.length === 0}
              onClick={handleAllocate}
              className={`w-full py-3.5 rounded-lg text-[12px] transition-all shadow-sm flex items-center justify-center gap-2 font-normal ${
                submitting || selectedUsers.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-zinc-800 active:scale-[0.98]"
              }`}
            >
              {submitting
                ? "Processing..."
                : `Allocate to ${selectedUsers.length} Staff`}
            </button>
            <p className="text-[10px] text-gray-400 mt-3 text-center flex items-center justify-center gap-1 font-normal">
              IDs will be sent as an array of strings
            </p>
          </div>
        </div>
      </div>

      {/* --- RIGHT CONTENT: STAFF TABLE --- */}
      <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col min-w-0">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-xl">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search staff by name or ID..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-gray-200 transition-all font-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-normal">
            {selectedUsers.length} SELECTED
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3 font-normal">
              <div className="w-8 h-8 border-3 border-gray-100 border-t-black rounded-full animate-spin" />
              <span className="text-xs animate-pulse">
                Updating Staff List...
              </span>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <PayrollTable
                columns={columns}
                data={users}
                rowsPerPage={12}
                searchTerm={searchTerm}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkAllocationTab;
