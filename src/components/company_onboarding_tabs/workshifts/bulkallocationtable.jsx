import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const UsersTable = ({
  users = [],               // ✅ SAFE DEFAULT
  filteredUsers = [],       // ✅ SAFE DEFAULT
  loading = false,
  searchTerm = "",
  setSearchTerm = () => {},
  selectedUsers = [],       // ✅ SAFE DEFAULT
  setSelectedUsers = () => {},
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  // Sort handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Sorted users
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      const aValue = a?.[sortConfig.key] ?? "";
      const bValue = b?.[sortConfig.key] ?? "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  // Select all
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

  // Sync checkbox
  useEffect(() => {
    const allSelected =
      sortedUsers.length > 0 &&
      sortedUsers.every((u) => selectedUsers.includes(u.id.toString()));
    setSelectAll(allSelected);
  }, [sortedUsers, selectedUsers]);

  const headers = [
    { label: "Name", key: "full_name" },
    { label: "Designation", key: "designation" },
    { label: "Date of Joining", key: "date_of_join" },
    { label: "Department", key: "department" },
    { label: "Branch", key: "branch" },

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

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="p-5 w-14">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>

              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => handleSort(h.key)}
                  className="p-5 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {h.label}
                    <div className="flex flex-col -space-y-1">
                      <ChevronUp
                        size={12}
                        className={
                          sortConfig.key === h.key &&
                          sortConfig.direction === "asc"
                            ? "text-black"
                            : "text-gray-300"
                        }
                      />
                      <ChevronDown
                        size={12}
                        className={
                          sortConfig.key === h.key &&
                          sortConfig.direction === "desc"
                            ? "text-black"
                            : "text-gray-300"
                        }
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-5">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id.toString())}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className="p-5">{user.full_name}</td>
                  <td className="p-5">{user.designation}</td>
                  <td className="p-5">
                    {user.date_of_join
                      ? new Date(user.date_of_join).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-5">{user.department}</td>
                  <td className="p-5">{user.branch || "-"}</td>
               
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 flex justify-end gap-4 border-t">
          <ChevronLeft size={18} />
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
