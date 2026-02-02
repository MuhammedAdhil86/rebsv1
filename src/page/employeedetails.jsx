import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, X } from "lucide-react";
import { Icon } from "@iconify/react";
import DashboardLayout from "../ui/pagelayout";
import avatar from "../assets/img/avatar.svg";
import toast, { Toaster } from "react-hot-toast";

// Zustand Store
import useEmployeeStore from "../store/employeeStore";

// Tabs
import PersonalInfoTab from "../components/profiledetailstabs/personal_info_tab.jsx";
import AttachmentsTab from "../components/profiledetailstabs/attachment_tab.jsx";
import ActivityTab from "../components/profiledetailstabs/activity_tab.jsx"; // <- Added
import Privilege from "../ui/privilages.jsx";
import SettingsTab from "../components/profiledetailstabs/settings_tab.jsx";

import axiosInstance from "../service/axiosinstance.js";

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Personal Info");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const { selectedEmployee, fetchEmployeeById } = useEmployeeStore();

  // Fetch employee on page load
  useEffect(() => {
    if (id) fetchEmployeeById(id);
  }, [id, fetchEmployeeById]);

  // Backend status value
  const isActive =
    selectedEmployee?.is_active === true ||
    selectedEmployee?.is_active === "true";

  // Activate / Deactivate
  const toggleStatus = async () => {
    if (!selectedEmployee?.uuid) return;

    try {
      setStatusUpdating(true);

      const newStatus = !isActive;

      await axiosInstance.put(
        `/staff/toggle-activate/${selectedEmployee.uuid}?activate=${newStatus}`,
      );

      toast.success(
        `Employee ${newStatus ? "activated" : "deactivated"} successfully!`,
      );

      await fetchEmployeeById(selectedEmployee.id);
    } catch (err) {
      toast.error("Status update failed");
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete User
  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      toast.error("Please provide a reason for deletion");
      return;
    }

    try {
      await axiosInstance.delete(`/staff/delete/${selectedEmployee.uuid}`, {
        data: { reason: deleteReason },
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Employee deleted successfully");

      setShowDeleteModal(false);

      setTimeout(() => navigate("/manageemployee"), 1500);
    } catch (err) {
      toast.error("Failed to delete employee");
      console.error(err);
    }
  };

  const sidebarTabs = [
    { name: "Personal Info", icon: "proicons:person" },
    { name: "Activities", icon: "solar:graph-outline" },
    { name: "Attachments", icon: "subway:pin" },
    { name: "Manage Shift", icon: "ic:twotone-manage-history" },
    { name: "Privilege", icon: "carbon:ibm-knowledge-catalog-premium" },
    { name: "Notifications", icon: "hugeicons:notification-02" },
    { name: "Settings", icon: "solar:settings-linear" },
  ];

  return (
    <DashboardLayout userName={selectedEmployee?.first_name || "Employee"}>
      <Toaster position="top-right" />

      <div className="bg-[#f9fafb] min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-6 py-3 border-b shadow-sm rounded-xl mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </button>
            <h1 className="text-lg text-gray-800">Employee Profile</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
            </button>
            <img
              src={selectedEmployee?.image || avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full border object-cover"
            />
          </div>
        </header>

        {/* Layout */}
        <div className="flex gap-3 p-3">
          {/* Sidebar */}
          <aside className="sticky top-4 w-60 bg-white border rounded-2xl p-6 flex flex-col items-center shadow-sm relative">
            <span
              className={`absolute top-2 right-2 px-2 py-1 text-xs rounded flex items-center gap-1 ${
                isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {isActive ? "Active" : "Deactivated"}
            </span>

            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border mt-4">
              <img
                src={selectedEmployee?.image || avatar}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-sm font-medium text-gray-800 text-center">
              {selectedEmployee?.first_name} {selectedEmployee?.last_name}
            </h2>

            <p className="text-[14px] text-gray-500 mb-6">
              {selectedEmployee?.email}
            </p>

            <div className="w-full mt-6 space-y-2 text-[14px]">
              {sidebarTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)} // <- Updated
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded-md ${
                    activeTab === tab.name
                      ? "bg-[#181818] text-white"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    icon={tab.icon}
                    className={`${
                      activeTab === tab.name ? "text-white" : "text-gray-600"
                    }`}
                    width="18"
                  />
                  <span>{tab.name}</span>
                </button>
              ))}

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Icon icon="fluent:delete-20-regular" width="18" />
                Delete User
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto max-h-[85vh] pr-2 scrollbar-none">
            {activeTab === "Activities" ? (
              <ActivityTab employee={selectedEmployee} /> // <- Updated
            ) : activeTab === "Personal Info" ? (
              <PersonalInfoTab employee={selectedEmployee} />
            ) : activeTab === "Attachments" ? (
              <AttachmentsTab
                attachments={selectedEmployee?.attachments || []}
              />
            ) : activeTab === "Privilege" ? (
              <Privilege employee={selectedEmployee} />
            ) : activeTab === "Settings" ? (
              <SettingsTab
                employee={selectedEmployee}
                employeeUUID={selectedEmployee?.uuid}
              />
            ) : (
              <div className="p-6 bg-white rounded-xl shadow-md text-gray-500">
                {activeTab} content coming soon...
              </div>
            )}
          </main>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg relative">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-medium mb-2">Confirm Deletion</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please enter a reason for deleting this employee.
              </p>

              <textarea
                className="w-full border rounded-md p-2 text-sm mb-4"
                rows={3}
                placeholder="Reason for deletion..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              ></textarea>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
