import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../../../service/axiosinstance";

/* 🔁 Reverse-geocode function (same as LogDetails) */
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

export default function ManagePrivilegesSection({ uuid }) {
  const [userType, setUserType] = useState("-");
  const [shift, setShift] = useState("-");
  const [device, setDevice] = useState("-");
  const [location, setLocation] = useState("Calculating...");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!uuid) return;

    const fetchPrivileges = async () => {
      try {
        /* 1️⃣ SHIFT / USER TYPE */
        const shiftRes = await axiosInstance.get(
          `/master/shift-attendance-user-type/${uuid}`
        );
        const shiftData = shiftRes.data?.data || {};

        setUserType(shiftData.user_type || "-");
        setShift(shiftData.shift_name || "-");

        /* 2️⃣ LOCATION / DEVICE */
        const locRes = await axiosInstance.get(
          `/master/location-device/${uuid}`
        );
        const locData = locRes.data?.data;

        console.log("Location API:", locData);

        setDevice(locData?.device || "-");

        /* 🔁 Reverse-geocode latitude/longitude */
        if (locData?.latitude && locData?.longitude) {
          const place = await getPlaceName(
            Number(locData.latitude),
            Number(locData.longitude)
          );
          setLocation(place);
        } else {
          setLocation("-");
        }
      } catch (error) {
        console.error("Failed to fetch privileges:", error);
        setLocation("-");
      }
    };

    fetchPrivileges();
  }, [uuid]);

  /* =========================
     Construct privileges array
  ========================= */
  const privileges = [
    { label: "User Type", value: userType },
    { label: "Work Shift", value: shift },
    { label: "Registered Device", value: device },
    { label: "Location", value: location },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 text-[14px]">
          Manage Privileges
        </h3>
        <Icon
          icon="basil:edit-outline"
          className="w-5 h-5 text-gray-400 cursor-pointer"
          onClick={() => setIsEditing(true)}
        />
      </div>

      {/* Privileges List */}
      <div className="text-sm space-y-2">
        {privileges.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center border-b border-gray-100 py-2"
          >
            <span className="text-gray-500 text-[12px]">{item.label}</span>
            {/* ⭐ Hover shows full location */}
            <span
              className="font-medium text-gray-800 text-[13px] max-w-[220px] truncate cursor-help"
              title={item.value}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
