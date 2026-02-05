import React, { useEffect, useRef, useState, useMemo } from "react";
import { X, Calendar, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isValid } from "date-fns";

import axiosInstance from "../service/axiosinstance";
import {
  getStaffDetails,
  fetchShiftAllocation,
} from "../service/employeeService";
import toast from "react-hot-toast";

function AddRegularizeModal({ open, data, onClose, onSuccess }) {
  if (!open) return null;

  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [shiftName, setShiftName] = useState("Not Allocated");

  const [form, setForm] = useState({
    staffId: "",
    date: null,
    checkIn: "",
    checkOut: "",
    remarks: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  /* ================= FETCH STAFF ================= */
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staff = await getStaffDetails();
        setStaffList(staff || []);
      } catch (err) {
        console.error("Failed to fetch staff", err);
      }
    };
    fetchStaff();
  }, []);

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (!data) return;

    setForm({
      staffId: data.userId || "",
      date: data.date ? new Date(data.date) : null,
      checkIn: data.checkIn !== "--" ? data.checkIn?.slice(0, 5) : "",
      checkOut: data.checkOut !== "--" ? data.checkOut?.slice(0, 5) : "",
      remarks: data.remarks || "",
    });
  }, [data]);

  /* ================= FETCH SHIFT (VIEW ONLY) ================= */
  useEffect(() => {
    if (!form.staffId) {
      setShiftName("Not Allocated");
      return;
    }

    const loadShift = async () => {
      try {
        const res = await fetchShiftAllocation(form.staffId);
        setShiftName(res?.data?.shift_name || "Not Allocated");
      } catch {
        setShiftName("Not Allocated");
      }
    };

    loadShift();
  }, [form.staffId]);

  /* ================= HELPERS ================= */
  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const buildDateTimeISO = (date, time) => {
    const [hours, minutes] = time.split(":");
    const dt = new Date(date);
    dt.setHours(Number(hours), Number(minutes), 0, 0);
    return dt.toISOString();
  };

  /* ================= WORK HOURS (FORMAL HH:MM:SS) ================= */
  const workHours = useMemo(() => {
    if (!form.date || !form.checkIn || !form.checkOut) return "--";

    const [inH, inM] = form.checkIn.split(":").map(Number);
    const [outH, outM] = form.checkOut.split(":").map(Number);

    const start = new Date(form.date);
    start.setHours(inH, inM, 0, 0);

    const end = new Date(form.date);
    end.setHours(outH, outM, 0, 0);

    if (end <= start) return "--";

    const diffMs = end - start;
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0",
    )}:${String(secs).padStart(2, "0")}`;
  }, [form.date, form.checkIn, form.checkOut]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.staffId || !form.date || !form.checkIn || !form.checkOut) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      user_id: String(form.staffId),
      in: buildDateTimeISO(form.date, form.checkIn),
      out: buildDateTimeISO(form.date, form.checkOut),
      remarks: form.remarks?.trim() || "",
    };

    try {
      setLoading(true);

      await axiosInstance.post(
        "/admin/attendance/regularize/request",
        payload,
        { headers: { "Content-Type": "application/json" } },
      );

      toast.success("Attendance regularized successfully!");
      onSuccess?.();
      onClose(true);
    } catch (err) {
      console.error("Regularization failed", err);
      toast.error("Failed to submit regularization");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-semibold text-sm">Attendance Regularization</h3>
          <button onClick={() => onClose(false)}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-2 gap-6 text-sm">
          {/* STAFF */}
          <div>
            <label className="text-gray-500 text-xs">Staff</label>
            <select
              name="staffId"
              value={form.staffId}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
            >
              <option value="">Select Staff</option>
              {staffList.map((s) => (
                <option key={s.uuid} value={s.uuid}>
                  {`${s.first_name || ""} ${s.last_name || ""}`.trim()}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div className="relative">
            <label className="text-gray-500 text-xs">Date</label>
            <input
              readOnly
              value={
                form.date && isValid(form.date)
                  ? format(form.date, "dd/MM/yyyy")
                  : ""
              }
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
            />
            <Calendar
              size={16}
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="absolute right-4 top-9 cursor-pointer text-gray-400"
            />
            {showDatePicker && (
              <div className="absolute z-50 top-full mt-1">
                <DatePicker
                  selected={form.date}
                  onChange={(date) => {
                    setForm((p) => ({ ...p, date }));
                    setShowDatePicker(false);
                  }}
                  inline
                />
              </div>
            )}
          </div>

          {/* CHECK IN */}
          <div className="relative">
            <label className="text-gray-500 text-xs">Check In</label>
            <input
              readOnly
              value={form.checkIn}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
            />
            <Clock
              size={16}
              onClick={() => checkInRef.current?.showPicker()}
              className="absolute right-4 top-9 cursor-pointer text-gray-400"
            />
            <input
              ref={checkInRef}
              type="time"
              className="hidden"
              value={form.checkIn}
              onChange={(e) =>
                setForm((p) => ({ ...p, checkIn: e.target.value }))
              }
            />
          </div>

          {/* CHECK OUT */}
          <div className="relative">
            <label className="text-gray-500 text-xs">Check Out</label>
            <input
              readOnly
              value={form.checkOut}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
            />
            <Clock
              size={16}
              onClick={() => checkOutRef.current?.showPicker()}
              className="absolute right-4 top-9 cursor-pointer text-gray-400"
            />
            <input
              ref={checkOutRef}
              type="time"
              className="hidden"
              value={form.checkOut}
              onChange={(e) =>
                setForm((p) => ({ ...p, checkOut: e.target.value }))
              }
            />
          </div>

          {/* SHIFT */}
          <div>
            <label className="text-gray-500 text-xs">Shift</label>
            <input
              readOnly
              value={shiftName}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>

          {/* WORK HOURS */}
          <div>
            <label className="text-gray-500 text-xs">Work Hours</label>
            <input
              readOnly
              value={workHours}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50 font-medium"
            />
          </div>

          {/* REMARKS */}
          <div className="col-span-2">
            <label className="text-gray-500 text-xs">Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            {loading ? "Submitting..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddRegularizeModal;
