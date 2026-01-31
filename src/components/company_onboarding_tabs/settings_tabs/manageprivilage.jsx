import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../../../service/axiosinstance";
import { fetchUserPayrollTemplates } from "../../../service/staffservice"; // ✅ Import payroll function

/* 🔁 Reverse-geocode (same as LogDetails) */
const getPlaceName = async (latitude, longitude) => {
  if (!latitude || !longitude) return "-";
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
      { headers: { "User-Agent": "PrivilegesApp" } }
    );
    const data = await response.json();
    return data.display_name || "-";
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "-";
  }
};

export default function ManagePrivilegesSection({ uuidcc }) {
  const [userType, setUserType] = useState("-");
  const [shift, setShift] = useState("");
  const [device, setDevice] = useState("-");
  const [location, setLocation] = useState("Calculating...");
  const [isEditing, setIsEditing] = useState(false);

  const [shifts, setShifts] = useState([]);
  const [payrollTemplate, setPayrollTemplate] = useState("-"); // ✅ Payroll template state

  /* =========================
     Fetch shifts for dropdown
  ========================= */
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await axiosInstance.get("/shifts/fetch");
        setShifts(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch shifts:", error);
      }
    };
    fetchShifts();
  }, []);

  /* =========================
     Fetch privileges + payroll
  ========================= */
  useEffect(() => {
    if (!uuidcc) return;

    const fetchPrivileges = async () => {
      try {
        /* 1️⃣ USER TYPE / SHIFT */
        const shiftRes = await axiosInstance.get(
          `/master/shift-attendance-user-type/${uuidcc}`
        );
        const shiftData = shiftRes.data?.data || {};
        setUserType(shiftData.user_type || "-");
        setShift(shiftData.shift_name || "");

        /* 2️⃣ LOCATION / DEVICE */
        const locRes = await axiosInstance.get(
          `/master/location-device/${uuidcc}`
        );
        const locData = locRes.data?.data;
        setDevice(locData?.device || "-");

        if (locData?.latitude && locData?.longitude) {
          const place = await getPlaceName(
            Number(locData.latitude),
            Number(locData.longitude)
          );
          setLocation(place);
        } else {
          setLocation("-");
        }

        /* 3️⃣ PAYROLL TEMPLATE */
        const templateData = await fetchUserPayrollTemplates(uuidcc);
        // templateData may return allocation object, extract name safely
        setPayrollTemplate(templateData?.allocation?.template?.name || "-");

      } catch (error) {
        console.error("Failed to fetch privileges:", error);
        setLocation("-");
        setPayrollTemplate("-");
      }
    };

    fetchPrivileges();
  }, [uuidcc]);

  /* =========================
     Save handler (API optional)
  ========================= */
  const handleSave = () => {
    console.log("Updated Shift:", shift);
    setIsEditing(false);
    // 🔥 Call update API here if needed
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 text-[14px]">
          Manage Privileges
        </h3>

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

      {/* Privileges */}
      <div className="text-sm space-y-2">
        {/* User Type */}
        <div className="flex justify-between items-center border-b border-gray-100 py-2">
          <span className="text-gray-500 text-[12px]">User Type</span>
          <span className="font-medium text-gray-800 text-[13px]">
            {userType}
          </span>
        </div>

        {/* Shift (Dropdown when editing) */}
        <div className="flex justify-between items-center border-b border-gray-100 py-2">
          <span className="text-gray-500 text-[12px]">Work Shift</span>

          {isEditing ? (
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-[13px] w-[180px]"
            >
              <option value="">Select Shift</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.shift_name}>
                  {s.shift_name}
                </option>
              ))}
            </select>
          ) : (
            <span className="font-medium text-gray-800 text-[13px]">
              {shift || "-"}
            </span>
          )}
        </div>

        {/* Device */}
        <div className="flex justify-between items-center border-b border-gray-100 py-2">
          <span className="text-gray-500 text-[12px]">Registered Device</span>
          <span className="font-medium text-gray-800 text-[13px]">
            {device}
          </span>
        </div>

        {/* Location */}
        <div className="flex justify-between items-center border-b border-gray-100 py-2">
          <span className="text-gray-500 text-[12px]">Location</span>
          <span
            className="font-medium text-gray-800 text-[13px] max-w-[220px] truncate cursor-help"
            title={location}
          >
            {location}
          </span>
        </div>

        {/* Payroll Template */}
        <div className="flex justify-between items-center border-b border-gray-100 py-2">
          <span className="text-gray-500 text-[12px]">Payroll Template</span>
          <span className="font-medium text-gray-800 text-[13px]">
            {payrollTemplate}
          </span>
        </div>
      </div>
    </div>
  );
}
