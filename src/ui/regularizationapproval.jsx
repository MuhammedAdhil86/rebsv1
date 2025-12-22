import React, { useEffect, useState } from "react";
import { Calendar, Clock, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../service/axiosinstance";

const RegularizationApprovalModal = ({
  open,
  data,
  shiftData,
  onClose,
  onSuccess,
  onOptimisticUpdate, // 🔥 NEW (table update)
}) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- SET DEFAULT REMARK FROM FETCH ---------- */
  useEffect(() => {
    setRemarks(data?.remarks || "");
  }, [data]);

  if (!open || !data) return null;

  /* ---------- APPROVE / REJECT ---------- */
  const handleAction = async (status) => {
    if (loading) return; // 🔒 prevent double click

    const previousStatus = data.status; // for rollback

    try {
      setLoading(true);

      // ⚡ OPTIMISTIC UPDATE (instant table change)
      onOptimisticUpdate?.(data.id, status);

      await axiosInstance.put(
        "/admin/attendance/regularize/approval",
        {
          request_id: data.id,
          status,
          remarks,
        }
      );

      toast.success(
        status === "approved"
          ? "Regularization approved successfully"
          : "Regularization rejected successfully"
      );

      onClose();
      onSuccess?.(); // background refresh
    } catch (error) {
      console.error("Approval error:", error);

      // 🔁 rollback optimistic update
      onOptimisticUpdate?.(data.id, previousStatus);

      toast.error("Failed to update regularization");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 border rounded-lg">
              <Calendar size={18} />
            </div>
            <h2 className="font-semibold text-[15px]">
              Attendance Regularization Request
            </h2>
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
            <div>
              <label className="text-[11px] text-gray-400">Staff Name</label>
              <input readOnly value={data.name} className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm" />
              <p className="text-[10px] text-orange-500 text-right italic">
                {data.designation}
              </p>
            </div>

            <div>
              <label className="text-[11px] text-gray-400">Date</label>
              <input readOnly value={data.date} className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm" />
            </div>

            <div>
              <label className="text-[11px] text-gray-400">Check In</label>
              <div className="relative">
                <input readOnly value={data.checkIn} className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm" />
                <Clock size={16} className="absolute right-4 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400">Check Out</label>
              <div className="relative">
                <input readOnly value={data.checkOut} className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm" />
                <Clock size={16} className="absolute right-4 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400">Shift</label>
              <div className="relative">
                <select readOnly className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg appearance-none">
                  <option>{shiftData?.shift_name || "Not Allocated"}</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-3.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400">Hours Worked</label>
              <input readOnly value={data.workingHours} className="w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm font-medium" />
            </div>
          </div>

          <div className="mb-10">
            <label className="text-[11px] text-gray-400">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-5 py-4 bg-gray-100 rounded-xl text-sm min-h-[110px]"
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm">
              Regularization Remaining :
              <span className="ml-1">{data.remaining || 0}</span>
            </p>

            <div className="flex gap-4">
              <button
                disabled={loading}
                onClick={() => handleAction("rejected")}
                className="px-12 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold disabled:opacity-60"
              >
                Reject
              </button>

              <button
                disabled={loading}
                onClick={() => handleAction("approved")}
                className="px-12 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold disabled:opacity-60"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularizationApprovalModal;
