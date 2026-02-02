import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../../../service/axiosinstance";
import payrollService from "../../../service/payrollService";
import {
  fetchUserPayrollTemplates,
  allocatePayrollTemplate,
} from "../../../service/staffservice";
import toast, { Toaster } from "react-hot-toast"; // <-- import toast

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

/* --------------------------
   Main Component
-------------------------- */
export default function ManagePrivilegesSection({ uuid }) {
  const [userType, setUserType] = useState("-");
  const [shift, setShift] = useState("");
  const [device, setDevice] = useState("-");
  const [location, setLocation] = useState("-");
  const [payrollTemplate, setPayrollTemplate] = useState("-");
  const [shifts, setShifts] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Modal states
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);

  // Shift modal state
  const [selectedShiftId, setSelectedShiftId] = useState("");
  const [shiftFrom, setShiftFrom] = useState("");
  const [shiftTo, setShiftTo] = useState("");

  // Payroll modal state
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [payrollFrom, setPayrollFrom] = useState("");
  const [payrollTo, setPayrollTo] = useState("");

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
        toast.error("Failed to fetch shifts");
      }
    };
    fetchShifts();
  }, []);

  /* --------------------------
     Fetch payroll templates
  -------------------------- */
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await payrollService.getSalaryTemplates();
        setTemplates(data || []);
      } catch (err) {
        console.error("Failed to fetch templates", err);
        toast.error("Failed to fetch payroll templates");
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
        const shiftRes = await axiosInstance.get(
          `/master/shift-attendance-user-type/${uuid}`,
        );
        const shiftData = shiftRes.data?.data || {};
        setUserType(shiftData.user_type || "-");
        setShift(shiftData.shift_name || "");
        setSelectedShiftId(shiftData.shift_id || "");

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

        const templateData = await fetchUserPayrollTemplates(uuid);
        const currentTemplate = templateData?.allocation?.template?.name || "-";
        const currentTemplateId = templateData?.allocation?.template?.id || "";
        setPayrollTemplate(currentTemplate);
        setSelectedTemplateId(currentTemplateId);
      } catch (error) {
        console.error("Failed to fetch privileges:", error);
        toast.error("Failed to fetch user privileges");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivileges();
  }, [uuid]);

  /* --------------------------
     Save Shift Allocation
  -------------------------- */
  const saveShift = async () => {
    if (!selectedShiftId || !shiftFrom) {
      toast.error("Please select shift and Effective From date.");
      return;
    }

    if (shiftTo && shiftFrom > shiftTo) {
      toast.error("Effective To date cannot be before Effective From date.");
      return;
    }

    try {
      const payload = {
        shift_id: selectedShiftId,
        staff_id: uuid,
        from_date: new Date(shiftFrom).toISOString(),
        to_date: shiftTo ? new Date(shiftTo).toISOString() : null,
      };

      console.log("Shift allocation payload:", payload);

      await axiosInstance.post("/shifts/allocate", payload);

      const shiftObj = shifts.find((s) => s.id === selectedShiftId);
      setShift(shiftObj?.shift_name || "-");
      setShowShiftModal(false);
      toast.success("Shift updated successfully!");
    } catch (error) {
      console.error("Failed to save shift:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to upsert shift allocation",
      );
    }
  };

  /* --------------------------
     Save Payroll Template
  -------------------------- */
  const savePayroll = async () => {
    if (!selectedTemplateId || !payrollFrom) {
      toast.error("Please select template and Effective From date.");
      return;
    }

    if (payrollTo && payrollFrom > payrollTo) {
      toast.error("Effective To date cannot be before Effective From date.");
      return;
    }

    try {
      const payload = {
        user_id: uuid,
        template_id: selectedTemplateId,
        effective_from: new Date(payrollFrom).toISOString(),
        effective_to: payrollTo ? new Date(payrollTo).toISOString() : null,
      };

      console.log("Payroll allocation payload:", payload);

      await allocatePayrollTemplate(payload);

      const templateObj = templates.find(
        (t) => t.id === Number(selectedTemplateId),
      );
      setPayrollTemplate(templateObj?.name || "-");
      setShowPayrollModal(false);
      toast.success("Payroll template updated successfully!");
    } catch (error) {
      console.error("Failed to save payroll:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to save payroll");
    }
  };

  if (loading)
    return <div className="text-gray-500 p-4">Loading privileges...</div>;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full space-y-4">
      {/* Toast Container */}
      <Toaster position="top-right" />

      <div className="text-sm space-y-2">
        <Row label="User Type" value={userType} />

        <div className="flex justify-between items-center border-b border-gray-100 py-2">
          <span className="text-gray-500 text-[12px]">Work Shift</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 text-[13px]">
              {shift || "-"}
            </span>
            <button
              className="text-blue-600 text-[12px] hover:underline"
              onClick={() => {
                setSelectedShiftId(
                  shifts.find((s) => s.shift_name === shift)?.id || "",
                );
                setShiftFrom(new Date().toISOString().split("T")[0]);
                setShiftTo("");
                setShowShiftModal(true);
              }}
            >
              Change Shift
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 py-2">
          <span className="text-gray-500 text-[12px]">Payroll Template</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 text-[13px]">
              {payrollTemplate || "-"}
            </span>
            <button
              className="text-blue-600 text-[12px] hover:underline"
              onClick={() => {
                setPayrollFrom(new Date().toISOString().split("T")[0]);
                setPayrollTo("");
                setShowPayrollModal(true);
              }}
            >
              Change Payroll Template
            </button>
          </div>
        </div>

        <Row label="Registered Device" value={device} />
        <Row label="Location" value={location} />
      </div>

      {/* Shift Modal */}
      {showShiftModal && (
        <Modal title="Change Shift" onClose={() => setShowShiftModal(false)}>
          <div className="flex flex-col gap-2">
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value="">Select Shift</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shift_name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={shiftFrom}
              onChange={(e) => setShiftFrom(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <input
              type="date"
              value={shiftTo}
              onChange={(e) => setShiftTo(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
              onClick={saveShift}
            >
              Save Shift
            </button>
          </div>
        </Modal>
      )}

      {/* Payroll Modal */}
      {showPayrollModal && (
        <Modal
          title="Change Payroll Template"
          onClose={() => setShowPayrollModal(false)}
        >
          <div className="flex flex-col gap-2">
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={payrollFrom}
              onChange={(e) => setPayrollFrom(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <input
              type="date"
              value={payrollTo}
              onChange={(e) => setPayrollTo(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
              onClick={savePayroll}
            >
              Save Payroll
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* --------------------------
   Reusable Row Component
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

/* --------------------------
   Simple Modal Component
-------------------------- */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[300px] space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <button className="text-gray-500" onClick={onClose}>
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
