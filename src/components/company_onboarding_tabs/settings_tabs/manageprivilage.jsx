import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../../../service/axiosinstance";
import toast from "react-hot-toast";

export default function ManagePrivilegesSection({ uuid }) {
  const [privileges, setPrivileges] = useState([
    { label: "User Type", key: "user_type", value: "" },
    { label: "Work Shift", key: "shift_name", value: "" },
    { label: "Registered Device", key: "device", value: "iPhone 17 Pro Max" },
    { label: "Location", key: "location", value: "Ernakulam" },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Fetch attendance/shift/user_type data from ngrok API
  useEffect(() => {
    if (!uuid) return;

    const fetchPrivileges = async () => {
      try {
        console.log("Fetching privileges for UUID:", uuid);

        const response = await axiosInstance.get(
          axiosInstance.baseURL2 + `master/shift-attendance-user-type/${uuid}`
        );

        console.log("Raw API response:", response);

        const data = response.data?.data;
        console.log("Processed data from API:", data);

        if (!data) return;

        setPrivileges((prev) =>
          prev.map((item) => {
            if (item.key === "user_type") return { ...item, value: data.user_type || "N/A" };
            if (item.key === "shift_name") return { ...item, value: data.shift_name || "N/A" };
            return item;
          })
        );
      } catch (error) {
        console.error("Failed to fetch privileges:", error);
        toast.error("Failed to load privileges");
      }
    };

    fetchPrivileges();
  }, [uuid]);

  const handleChange = (index, newValue) => {
    const updated = [...privileges];
    updated[index].value = newValue;
    setPrivileges(updated);
  };

  const handleSave = () => {
    console.log("Saved privileges:", privileges);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 text-[14px]">Manage Privileges</h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Save
            </button>
          ) : (
            <Icon
              icon="basil:edit-outline"
              className="w-5 h-5 text-gray-400 cursor-pointer"
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>

      {/* Privileges List */}
      <div className="text-sm space-y-2">
        {privileges.map(({ label, value }, index) => (
          <div
            key={label}
            className="flex justify-between items-center border-b border-gray-100 py-2"
          >
            <span className="text-gray-500 text-[12px]">{label}</span>
            {isEditing ? (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-gray-800 text-[13px] w-[160px]"
              />
            ) : (
              <span className="font-medium text-gray-800 text-[13px]">{value || "---"}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
