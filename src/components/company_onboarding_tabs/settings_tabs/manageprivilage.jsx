import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../../../service/axiosinstance";
import payrollService from "../../../service/payrollService";
import {
  fetchUserPayrollTemplates,
  allocatePayrollTemplate,
} from "../../../service/staffservice";

/* --------------------------
   Reverse Geocode Helper
-------------------------- */
const getPlaceName = async (latitude, longitude) => {
  if (!latitude || !longitude) return "-";
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
      { headers: { "User-Agent": "PrivilegesApp" } },
    );
    const data = await response.json();
    return data.display_name || "-";
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "-";
  }
};

export default function ManagePrivilegesSection({ uuid }) {
  /* --------------------------
     State
  -------------------------- */
  const [userType, setUserType] = useState("-");
  const [shift, setShift] = useState("");
  const [device, setDevice] = useState("-");
  const [location, setLocation] = useState("-");
  const [payrollTemplate, setPayrollTemplate] = useState("-");
  const [shifts, setShifts] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* --------------------------
     Fetch shifts
  -------------------------- */
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

  /* --------------------------
     Fetch salary templates
  -------------------------- */
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await payrollService.getSalaryTemplates();
        setTemplates(data || []);
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };
    fetchTemplates();
  }, []);

  /* --------------------------
     Fetch user privileges
  -------------------------- */
  useEffect(() => {
    if (!uuid) return;

    const fetchPrivileges = async () => {
      setLoading(true);
      try {
        // User Type & Shift
        const shiftRes = await axiosInstance.get(
          `/master/shift-attendance-user-type/${uuid}`,
        );
        const shiftData = shiftRes.data?.data || {};
        setUserType(shiftData.user_type || "-");
        setShift(shiftData.shift_name || "");

        // Device & Location
        const locRes = await axiosInstance.get(
          `/master/location-device/${uuid}`,
        );
        const locData = locRes.data?.data;
        setDevice(locData?.device || "-");

        if (locData?.latitude && locData?.longitude) {
          const place = await getPlaceName(
            Number(locData.latitude),
            Number(locData.longitude),
          );
          setLocation(place);
        } else {
          setLocation("-");
        }

        // Current payroll template
        const templateData = await fetchUserPayrollTemplates(uuid);
        const currentTemplate = templateData?.allocation?.template?.name || "-";
        const currentTemplateId = templateData?.allocation?.template?.id || "";

        setPayrollTemplate(currentTemplate);
        setSelectedTemplateId(currentTemplateId);
      } catch (error) {
        console.error("Failed to fetch privileges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivileges();
  }, [uuid]);

  /* --------------------------
     Save handler
  -------------------------- */
  const handleSave = async () => {
    if (!uuid) return;

    if (!effectiveFrom) {
      alert("Effective From date is required");
      return;
    }

    try {
      // Update shift
      await axiosInstance.put(`/master/update-shift/${uuid}`, {
        shift_name: shift,
      });

      // Allocate payroll template
      await allocatePayrollTemplate({
        user_id: uuid,
        template_id: selectedTemplateId,
        effective_from: new Date(effectiveFrom).toISOString(),
        effective_to: effectiveTo ? new Date(effectiveTo).toISOString() : null,
      });

      const selectedTemplate = templates.find(
        (t) => t.id === Number(selectedTemplateId),
      );

      setPayrollTemplate(selectedTemplate?.name || "-");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save privileges:", error);
    }
  };

  if (!uuid) {
    return <div className="text-gray-500 p-4">Loading privileges...</div>;
  }

  /* --------------------------
     Render
  -------------------------- */
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

      {loading ? (
        <p className="text-gray-500 text-sm">Loading privileges...</p>
      ) : (
        <div className="text-sm space-y-2">
          {/* User Type */}
          <Row label="User Type" value={userType} />

          {/* Work Shift */}
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

          <Row label="Registered Device" value={device} />
          <Row label="Location" value={location} />

          {/* Payroll Template */}
          <div className="flex flex-col gap-2 border-b border-gray-100 py-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-[12px]">
                Payroll Template
              </span>
              {isEditing ? (
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-[13px] w-[180px]"
                >
                  <option value="">Select Template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-medium text-gray-800 text-[13px]">
                  {payrollTemplate}
                </span>
              )}
            </div>

            {/* Date pickers */}
            {isEditing && selectedTemplateId && (
              <div className="flex gap-2 justify-end">
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  required
                  className="border rounded px-2 py-1 text-[12px]"
                />
                <input
                  type="date"
                  value={effectiveTo}
                  onChange={(e) => setEffectiveTo(e.target.value)}
                  className="border rounded px-2 py-1 text-[12px]"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------
   Reusable Row
-------------------------- */
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 py-2">
      <span className="text-gray-500 text-[12px]">{label}</span>
      <span className="font-medium text-gray-800 text-[13px] max-w-[220px] truncate">
        {value || "-"}
      </span>
    </div>
  );
}
