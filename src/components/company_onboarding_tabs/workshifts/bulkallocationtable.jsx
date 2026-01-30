import { useState, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";

const UsersTable = ({
  users = [],
  filteredUsers = [],
  loading = false,
  searchTerm = "",
  setSearchTerm = () => {},
  selectedUsers = [],
  setSelectedUsers = () => {},
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Sorted users
  const sortedUsers = useMemo(() => {
    let data = filteredUsers.length > 0 ? filteredUsers : users;
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a?.[sortConfig.key] ?? "";
      const bValue = b?.[sortConfig.key] ?? "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, filteredUsers, sortConfig]);

  // Select all toggle
  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedUsers(sortedUsers.map((u) => u.id.toString()));
    } else {
      setSelectedUsers([]);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    const id = userId.toString();
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const allSelected =
      sortedUsers.length > 0 &&
      sortedUsers.every((u) => selectedUsers.includes(u.id.toString()));
    setSelectAll(allSelected);
  }, [sortedUsers, selectedUsers]);

  // Define columns for UniversalTable
  const columns = [
    {
      key: "select",
      label: "",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(row.id.toString())}
          onChange={() => handleSelectUser(row.id)}
        />
      ),
      width: 50,
    },
    { key: "full_name", label: "Name" },
    { key: "designation", label: "Designation" },
    {
      key: "date_of_join",
      label: "Date of Joining",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    { key: "department", label: "Department" },
    { key: "branch", label: "Branch", render: (v) => v || "-" },
  ];

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] text-gray-900 font-normal">All Users</h2>
          <span className="bg-[#BEE3F8] text-[#2B6CB0] text-[11px] px-3 py-1 rounded-full">
            {users.length} users
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 bg-white border border-gray-100 rounded-lg text-sm w-72"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
          />
        </div>
      </div>

      {/* Universal Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <p className="p-6 text-center text-gray-500 text-[12px]">Loading...</p>
        ) : sortedUsers.length === 0 ? (
          <p className="p-6 text-center text-gray-500 text-[12px]">No users found</p>
        ) : (
          <UniversalTable
            columns={columns}
            data={sortedUsers}
            rowsPerPage={6}
            rowClickHandler={(row) => console.log("Clicked row:", row)}
          />
        )}
      </div>
    </div>
  );
};

export default UsersTable;
