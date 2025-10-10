import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import DashboardLayout from "../ui/pagelayout";// ✅ Reuse layout
import avatar from "../assets/img/avatar.svg";
import { FiUser, FiLock, FiInfo, FiLogOut } from "react-icons/fi";

function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    company: "",
    phone: "",
  });

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      duration: 3000,
      style: { background: "#333", color: "#fff", borderRadius: "8px" },
    });
    setTimeout(() => navigate("/"), 800);
  };

  useEffect(() => {
    if (user) {
      const u = user.user || user;
      setFormData({
        firstName: u.first_name || "",
        lastName: u.last_name || "",
        email: u.email || "",
        jobTitle: u.designation || "",
        company: u.company || "",
        phone: u.ph_no || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully (demo)", {
      duration: 3000,
      style: { background: "#333", color: "#fff" },
    });
  };

  return (
    <DashboardLayout userName={formData.firstName || "User"} onLogout={handleLogout}>
      {/* ✅ All existing page content intact */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-gray-800">Settings</h1>
        <div className="w-9 h-9 rounded-full overflow-hidden border">
          <img src={avatar} alt="User" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left menu */}
        <div className="w-72 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{formData.email}</p>

          <div className="w-full space-y-2">
            <button
              onClick={() => setActiveTab("personal")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                activeTab === "personal"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiUser className="text-lg" /> Personal Info
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                activeTab === "password"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiLock className="text-lg" /> Change Password
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                activeTab === "about"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiInfo className="text-lg" /> About Us
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiLogOut className="text-lg" /> Logout
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {activeTab === "personal" && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Personal Info
              </h2>
              <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
                {/* Form fields remain exactly the same */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-md text-sm hover:bg-gray-800 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Change Password
              </h2>
              <p className="text-gray-600 text-sm">
                This section allows users to update their passwords.
              </p>
            </div>
          )}

          {activeTab === "about" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">About Us</h2>
              <p className="text-gray-600 text-sm">
                REBS HR System is a comprehensive employee management platform
                built for efficiency and user-friendliness.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
