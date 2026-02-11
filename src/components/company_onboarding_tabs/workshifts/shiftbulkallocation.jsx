import React, { useEffect, useState } from "react";
import LeftSidebar from "./leftsidebox";
import UsersTable from "./bulkallocationtable";

import {
  getAllStaff,
  filterStaff,
  getDepartmentData,
  getBranchData,
  getDesignationData,
  getShiftList,
} from "../../../service/staffservice";

import { allocateShiftBulkUpsert } from "../../../service/companyService"; // your API

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

  const [selectedUsers, setSelectedUsers] = useState([]); // NEW: selected user IDs

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchAllUsers();
    fetchShifts();
  }, []);

  /* ================= FETCH USERS ================= */
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllStaff();
      setUsers(Array.isArray(data) ? data : []);
      setSelectedUsers([]); // reset selection on reload
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
    setLoading(false);
  };

  /* ================= FETCH SHIFTS ================= */
  const fetchShifts = async () => {
    try {
      const data = await getShiftList();
      setShifts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setShifts([]);
    }
  };

  /* ================= FILTER TYPE ================= */
  const handleFilterTypeChange = async (type) => {
    setFilterType(type);
    setSelectedFilterId("");
    setFilterOptions([]);
    setSelectedUsers([]); // reset selection

    if (type === "all") {
      fetchAllUsers();
      return;
    }

    let data = [];
    if (type === "department") data = await getDepartmentData();
    if (type === "designation") data = await getDesignationData();
    if (type === "branch") data = await getBranchData();

    setFilterOptions(Array.isArray(data) ? data : []);
  };

  /* ================= FILTER VALUE ================= */
  const handleFilterSelect = async (id) => {
    setSelectedFilterId(id);
    setSelectedUsers([]); // reset selection
    if (!id) return;

    setLoading(true);

    let params = {};
    if (filterType === "department") params.department_id = id;
    if (filterType === "designation") params.designation_id = id;
    if (filterType === "branch") params.branch_id = id;

    try {
      const data = await filterStaff(params);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setUsers([]);
    }

    setLoading(false);
  };

  /* ================= CLEAR ================= */
  const handleClearAll = () => {
    setFilterType("all");
    setSelectedFilterId("");
    setFilterOptions([]);
    setSearchTerm("");
    setSelectedUsers([]);
    fetchAllUsers();
  };

  /* ================= SEARCH ================= */
  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ================= SHIFT CHANGE ================= */
  const handleShiftChange = (e) => {
    const shiftId = e.target.value;
    setSelectedShift(shiftId);

    const shift = shifts.find((s) => s.id === Number(shiftId));
    setSelectedPolicy(shift?.policies?.[0] || null);
  };

  /* ================= ALLOCATE ================= */
  const handleAllocate = async () => {
    if (!selectedShift) {
      alert("Please select a shift!");
      return;
    }
    if (selectedUsers.length === 0) {
      alert("Please select at least one user!");
      return;
    }

    try {
      // POST request for bulk allocation
      await allocateShiftBulkUpsert({
        shift_id: Number(selectedShift), // ensure number
        staff_ids: selectedUsers.map(String), // ensure array of strings
      });

      alert("Shift allocated successfully!");
      setSelectedUsers([]); // reset selection
      fetchAllUsers(); // refresh table
    } catch (error) {
      console.error("Allocation error:", error);
      alert("Failed to allocate shift. Check console.");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="flex gap-4 w-full min-h-screen bg-[#F9FAFB]  font-normal ">
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
        selectedUsersCount={selectedUsers.length} // sidebar count
        handleAllocate={handleAllocate} // sidebar allocate
      />

      <UsersTable
        users={users}
        filteredUsers={filteredUsers}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedUsers={selectedUsers} // selected rows
        setSelectedUsers={setSelectedUsers}
      />
    </div>
  );
};

export default ShiftBulkAllocation;
