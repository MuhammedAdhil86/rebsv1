import React, { useEffect, useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import { format, isValid } from "date-fns";

import axiosInstance from "../service/axiosinstance";
import { getStaffDetails } from "../service/employeeService";

function AddRegularizeModal({ open, data, onClose }) {
  if (!open) return null;

  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);

  const [form, setForm] = useState({
    staffId: "",
    date: null,
    checkIn: "",
    checkOut: "",
    remarks: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

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
      checkIn: data.checkIn !== "--" ? data.checkIn : "",
      checkOut: data.checkOut !== "--" ? data.checkOut : "",
      remarks: data.remarks || "",
    });
  }, [data]);

  /* ================= HELPERS ================= */
  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const normalizeTime = (time) => {
    if (!time) return "";
    return time.length === 5 ? `${time}:00` : time;
  };

  const buildDateTime = (date, time) => {
    return `${format(date, "yyyy-MM-dd")} ${normalizeTime(time)}`;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.staffId || !form.date || !form.checkIn || !form.checkOut) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      user_id: String(form.staffId), // 🔥 MUST be string
      in: buildDateTime(form.date, form.checkIn),
      out: buildDateTime(form.date, form.checkOut),
      remarks: form.remarks?.trim() || "",
    };

    console.log("FINAL PAYLOAD 👉", payload); // ✅ DEBUG SAFE

    try {
      setLoading(true);

      await axiosInstance.post(
        "/admin/attendance/regularize/request",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      onClose();
    } catch (err) {
      console.error("Regularization failed", err);
      alert("Failed to submit regularization");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-semibold text-sm">
            Attendance Regularization
          </h3>
          <button onClick={onClose}>
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
              <DatePicker
                selected={form.date}
                onChange={(date) => {
                  setForm((p) => ({ ...p, date }));
                  setShowDatePicker(false);
                }}
                inline
              />
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
              onClick={() => setShowCheckInPicker(!showCheckInPicker)}
              className="absolute right-4 top-9 cursor-pointer text-gray-400"
            />
            {showCheckInPicker && (
              <TimePicker
                value={form.checkIn}
                onChange={(v) => {
                  setForm((p) => ({ ...p, checkIn: v }));
                  setShowCheckInPicker(false);
                }}
                format="HH:mm"
                clearIcon={null}
                clockIcon={null}
              />
            )}
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
              onClick={() => setShowCheckOutPicker(!showCheckOutPicker)}
              className="absolute right-4 top-9 cursor-pointer text-gray-400"
            />
            {showCheckOutPicker && (
              <TimePicker
                value={form.checkOut}
                onChange={(v) => {
                  setForm((p) => ({ ...p, checkOut: v }));
                  setShowCheckOutPicker(false);
                }}
                format="HH:mm"
                clearIcon={null}
                clockIcon={null}
              />
            )}
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
          <button onClick={onClose} className="px-6 py-2 border rounded-lg">
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
