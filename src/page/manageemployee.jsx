import React, { useState, useEffect } from "react";
import DashboardLayout from "../ui/pagelayout";
import avatar from "../assets/img/avatar.svg";
import { FiBell, FiSearch, FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { Icon } from "@iconify/react";
import { getStaffDetails } from "../service/employeeService";

const TABS = [
  { key: "all", label: "All Employees" },
  { key: "active", label: "Active Employees" },
  { key: "inactive", label: "Inactive Employees" },
];

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getStaffDetails();
        const formatted = data.map((emp) => ({
          id: emp.id,
          name: `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
          designation: emp.designation || "N/A",
          department: emp.department || "N/A",
          phone: emp.ph_no || "N/A",
          email: emp.email || "N/A",
          is_active: emp.is_active,
          date_of_join: formatDate(emp.date_of_join),
          img: emp.img || avatar,
        }));
        setEmployees(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees
    .filter((emp) => {
      if (tab === "active")
        return emp.is_active === true || emp.is_active === "true";
      if (tab === "inactive")
        return emp.is_active === false || emp.is_active === "false";
      return true;
    })
    .filter((emp) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        emp.name.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        emp.phone.toString().includes(term)
      );
    });

  const renderEmployeeCard = (emp) => (
    <div
      key={emp.id}
      className="bg-white rounded-2xl shadow border border-gray-200 p-6 flex flex-col justify-between h-full transition hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={emp.img}
            alt={emp.name}
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
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800">{emp.name}</h3>
        <p className="text-xs text-gray-500">{emp.designation}</p>
      </div>

      <div className="flex flex-col space-y-2 text-sm text-gray-600 bg-gray-100 p-3 rounded-lg mt-2">
        <div className="flex justify-between">
          <span className="text-gray-700">Department</span>
          <span className="text-gray-700">Date of Joining</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">{emp.department}</span>
          <span className="text-gray-700">{emp.date_of_join}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon icon="solar:phone-linear" className="text-gray-600 w-4 h-4" />
          <span>{emp.phone}</span>
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
        {/* Scrollable content wrapper like Dashboard */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-1">
            <h1 className="text-xl font-semibold text-gray-800">
              Manage Employees
            </h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                <FiBell className="w-5 h-5 text-gray-600" />
              </div>
              <img
                src={avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
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
              {loading
                ? "Loading..."
                : `${filteredEmployees.length} Total Employees`}
            </span>

            <div className="flex items-center space-x-2">
              <button className="flex items-center bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                <FiPlus className="w-4 h-4 mr-1" />
                Add Employee
              </button>

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

          {/* Employee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                Loading...
              </div>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => renderEmployeeCard(emp))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No employees to show.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ManageEmployees;
