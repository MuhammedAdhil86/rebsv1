import React, { useEffect, useState } from "react";
import LeftSidebar from "./leftsidebox";
import PayrollTable from "../../../ui/payrolltable";
import toast, { Toaster } from "react-hot-toast"; // ✅ Added for feedback

import {
  getAllStaff,
  filterStaff,
  getDepartmentData,
  getBranchData,
  getDesignationData,
  getShiftList,
} from "../../../service/staffservice";

import { allocateShiftBulkUpsert } from "../../../service/companyService";

const ShiftBulkAllocation = () => {
  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterType, setFilterType] = useState("all");
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilterId, setSelectedFilterId] = useState("");

  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchAllUsers(), fetchShifts()]);
    setLoading(false);
  };

  /* ================= COLUMN DEFINITION ================= */
  const columns = [
    {
      key: "selection",
      label: (
        <input
          type="checkbox"
          className="cursor-pointer"
          onChange={(e) => handleSelectAll(e.target.checked)}
          checked={users.length > 0 && selectedUsers.length === users.length}
        />
      ),
      width: 50,
      render: (_, row) => (
        <input
          type="checkbox"
          className="cursor-pointer"
          checked={selectedUsers.includes(row.uuid)} // ✅ Using UUID
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
      key: "branch_name",
      label: "Branch",
      align: "center",
      render: (val) => val || <span className="text-gray-400">N/A</span>,
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
      setUsers([]);
    }
  };

  const fetchShifts = async () => {
    try {
      const data = await getShiftList();
      setShifts(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      setShifts([]);
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
    let data = [];
    if (type === "department") data = await getDepartmentData();
    if (type === "designation") data = await getDesignationData();
    if (type === "branch") data = await getBranchData();
    setFilterOptions(Array.isArray(data) ? data : data?.data || []);
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
      setUsers(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      setUsers([]);
    }
    setLoading(false);
  };

  const handleClearAll = () => {
    setFilterType("all");
    setSelectedFilterId("");
    setFilterOptions([]);
    setSearchTerm("");
    setSelectedUsers([]);
    setFromDate("");
    setToDate("");
    fetchAllUsers();
  };

  const handleShiftChange = (e) => {
    const shiftId = e.target.value;
    setSelectedShift(shiftId);
    const shift = shifts.find((s) => s.id === Number(shiftId));
    setSelectedPolicy(shift?.policies?.[0] || null);
  };

  const handleAllocate = async () => {
    if (!selectedShift) return toast.error("Please select a shift");
    if (selectedUsers.length === 0)
      return toast.error("Please select at least one staff");
    if (!fromDate || !toDate)
      return toast.error("Select both From and To dates");

    const payload = {
      shift_id: Number(selectedShift),
      staff_ids: selectedUsers,
      from_date: `${fromDate}T00:00:00Z`,
      to_date: `${toDate}T00:00:00Z`,
    };

    const allocationPromise = allocateShiftBulkUpsert(payload);

    toast.promise(allocationPromise, {
      loading: "Allocating shifts...",
      success: (response) => {
        if (response.status_code === 200 || response.success) {
          setSelectedUsers([]);
          setFromDate("");
          setToDate("");
          fetchAllUsers();
          return "Shifts allocated successfully!";
        } else {
          throw new Error(response.message || "Failed to allocate");
        }
      },
      error: (err) => {
        // ✅ Capture backend's specific error message
        const backendMsg =
          err.response?.data?.data ||
          err.response?.data?.message ||
          "Check your data and try again";
        return `Error: ${backendMsg}`;
      },
    });
  };

  return (
    <div className="flex gap-4 w-full min-h-screen bg-[#F9FAFB] p-4 font-poppins font-normal text-[12px]">
      <Toaster position="top-right" /> {/* ✅ Add toaster here */}
      <LeftSidebar
        shifts={shifts}
        selectedShift={selectedShift}
        handleShiftChange={handleShiftChange}
        filterType={filterType}
        handleFilterTypeChange={handleFilterTypeChange}
        filterOptions={filterOptions}
        selectedFilterId={selectedFilterId}
        handleFilterSelect={handleFilterSelect}
        users={users}
        handleClearAll={handleClearAll}
        selectedPolicy={selectedPolicy}
        selectedUsersCount={selectedUsers.length}
        handleAllocate={handleAllocate}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-w-0">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <input
            type="text"
            placeholder="Search staff by name..."
            className="w-full max-w-sm p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all font-normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-xs text-gray-500 font-normal">
            {selectedUsers.length} staff selected
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-500 gap-2 font-normal">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="p-4">
              <PayrollTable
                columns={columns}
                data={users}
                rowsPerPage={10}
                searchTerm={searchTerm}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftBulkAllocation;
