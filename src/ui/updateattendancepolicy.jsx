import React, { useState, useEffect } from "react";
import { X, Calendar, Clock } from "lucide-react";
import attendancePolicyService from "../service/attendancepolicyService";
import ColorPicker from "./colorpicker";
import toast from "react-hot-toast";

const UpdateAttendancePolicyTab = ({ initialData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policy_name: "",
    policy_code: "",
    policy_colour: "#4CAF50",
    start_time: "",
    end_time: "",
    working_hours: "",
    delay: "00:00:00",
    delay_unpaid_count: 0,
    delay_cut: "",
    late: "00:00:00",
    late_unpaid_count: 0,
    late_cut: "",
    delay_action_type: "",
    delay_fine_amount: null,
    delay_fine_source: null,
    late_action_type: "",
    late_fine_amount: null,
    late_fine_source: null,
    half_day: "",
    break_time_from: "",
    break_time_to: "",
    lunch_break_from: "",
    lunch_break_to: "",
    work_from_home: false,
    over_time_benefit: false,
    over_time_pay: "",
    regularisation_limit: 0,
    regularisation_type: "Monthly",
    start_date: "",
    end_date: "",
    overtime_cap_limit: "00:00:00",
    overtime_cap_period: "Monthly",
  });

  const formatTimeForInput = (timeString) => {
    if (!timeString) return "00:00:00";
    if (typeof timeString === "string" && timeString.includes("T")) {
      return timeString.split("T")[1].split("Z")[0];
    }
    return timeString;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        start_date: initialData.start_date?.split("T")[0] || "",
        end_date: initialData.end_date?.split("T")[0] || "",
        start_time: formatTimeForInput(initialData.start_time),
        end_time: formatTimeForInput(initialData.end_time),
        delay: formatTimeForInput(initialData.delay),
        late: formatTimeForInput(initialData.late),
        half_day: formatTimeForInput(initialData.half_day),
        lunch_break_from: formatTimeForInput(initialData.lunch_break_from),
        lunch_break_to: formatTimeForInput(initialData.lunch_break_to),
        break_time_from: formatTimeForInput(initialData.break_time_from),
        break_time_to: formatTimeForInput(initialData.break_time_to),
        overtime_cap_limit: formatTimeForInput(initialData.overtime_cap_limit),
        delay_action_type: initialData.delay_action_type || "",
        late_action_type: initialData.late_action_type || "",
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Reset logic when switching action types
      if (field === "delay_action_type") {
        if (value !== "day") updated.delay_cut = null;
        if (value !== "fine") {
          updated.delay_fine_amount = null;
          updated.delay_fine_source = null;
        }
      }
      if (field === "late_action_type") {
        if (value !== "day") updated.late_cut = null;
        if (value !== "fine") {
          updated.late_fine_amount = null;
          updated.late_fine_source = null;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const policyId = initialData?.id || initialData?._id || 61;

    const payload = {
      ...formData,
      working_hours: parseFloat(formData.working_hours) || 0.0,
      delay_unpaid_count: parseInt(formData.delay_unpaid_count) || 0,
      late_unpaid_count: parseInt(formData.late_unpaid_count) || 0,
      over_time_pay: parseFloat(formData.over_time_pay) || 0.0,
      regularisation_limit: parseInt(formData.regularisation_limit) || 0,

      // Formatting logic for delay
      delay_fine_amount:
        formData.delay_action_type === "fine"
          ? parseFloat(formData.delay_fine_amount)
          : null,
      delay_fine_source:
        formData.delay_action_type === "fine"
          ? formData.delay_fine_source
          : null,
      delay_cut:
        formData.delay_action_type === "day" ? formData.delay_cut : null,

      // Formatting logic for late (Handles 'email' by sending fine/cut as null)
      late_fine_amount:
        formData.late_action_type === "fine"
          ? parseFloat(formData.late_fine_amount)
          : null,
      late_fine_source:
        formData.late_action_type === "fine" ? formData.late_fine_source : null,
      late_cut: formData.late_action_type === "day" ? formData.late_cut : null,
    };

    try {
      const response = await attendancePolicyService.updatePolicy(
        policyId,
        payload,
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || "Policy Updated Successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-[#F4F6F8] border border-gray-100 rounded-xl text-[12px] focus:outline-none transition-all";
  const labelClass = "text-[12px] font-medium text-gray-700 mb-1.5 block";
  const iconWrapper =
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-900" />
          <h2 className="text-[16px] font-semibold text-gray-900">
            Update Attendance Policy
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left Column */}
        <div className="w-[32%] space-y-4">
          <div>
            <label className={labelClass}>Policy Name</label>
            <input
              type="text"
              className={inputClass}
              value={formData.policy_name}
              onChange={(e) => handleInputChange("policy_name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Policy Code</label>
              <input
                type="text"
                className={inputClass}
                value={formData.policy_code}
                onChange={(e) =>
                  handleInputChange("policy_code", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Policy Color</label>
              <ColorPicker
                value={formData.policy_colour}
                onChange={(color) => handleInputChange("policy_colour", color)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Work From Home</label>
              <select
                className={inputClass}
                value={formData.work_from_home}
                onChange={(e) =>
                  handleInputChange("work_from_home", e.target.value === "true")
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Over Time Benefit</label>
              <select
                className={inputClass}
                value={formData.over_time_benefit}
                onChange={(e) =>
                  handleInputChange(
                    "over_time_benefit",
                    e.target.value === "true",
                  )
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          {formData.over_time_benefit && (
            <div>
              <label className={labelClass}>OverTime Pay</label>
              <input
                type="number"
                className={inputClass}
                value={formData.over_time_pay}
                onChange={(e) =>
                  handleInputChange("over_time_pay", e.target.value)
                }
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>OT Cap Limit</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="00:00:00"
                  className={inputClass}
                  value={formData.overtime_cap_limit}
                  onChange={(e) =>
                    handleInputChange("overtime_cap_limit", e.target.value)
                  }
                />
                <Clock className={iconWrapper} size={16} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Period</label>
              <select
                className={inputClass}
                value={formData.overtime_cap_period}
                onChange={(e) =>
                  handleInputChange("overtime_cap_period", e.target.value)
                }
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Effective From</label>
              <input
                type="date"
                className={inputClass}
                value={formData.start_date}
                onChange={(e) =>
                  handleInputChange("start_date", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Effective To</label>
              <input
                type="date"
                className={inputClass}
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[68%] space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
              {[
                { label: "Check in Time", field: "start_time" },
                { label: "Check out Time", field: "end_time" },
                { label: "Lunch From", field: "lunch_break_from" },
                { label: "Lunch To", field: "lunch_break_to" },
                { label: "Half Day Start", field: "half_day" },
                { label: "Working Hours", field: "working_hours" },
                { label: "Delay Threshold", field: "delay" },
                { label: "Late Threshold", field: "late" },
              ].map((item, idx) => (
                <div key={idx}>
                  <label className={labelClass}>{item.label}</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00:00:00"
                      value={formData[item.field] || ""}
                      className={inputClass}
                      onChange={(e) =>
                        handleInputChange(item.field, e.target.value)
                      }
                    />
                    <Clock className={iconWrapper} size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Delay Card */}
            <div className="bg-[#FFF6E9] border border-[#FDE3C3] rounded-2xl p-5 space-y-4">
              <span className="text-[13px] font-semibold block">
                Delay Logic
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="w-20 bg-white h-10 rounded-xl px-3 text-[12px] border-none"
                  value={formData.delay_unpaid_count}
                  onChange={(e) =>
                    handleInputChange("delay_unpaid_count", e.target.value)
                  }
                />
                <span className="text-[12px]">as</span>
                <select
                  className="flex-1 bg-white h-10 rounded-xl px-3 text-[12px]"
                  value={formData.delay_action_type}
                  onChange={(e) =>
                    handleInputChange("delay_action_type", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="day">Day Cut</option>
                  <option value="fine">Fine</option>
                  <option value="email">Email</option>
                </select>
              </div>
              {formData.delay_action_type === "day" && (
                <select
                  className={inputClass}
                  value={formData.delay_cut}
                  onChange={(e) =>
                    handleInputChange("delay_cut", e.target.value)
                  }
                >
                  <option value="">Select Cut</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Full Day">Full Day</option>
                </select>
              )}
              {formData.delay_action_type === "fine" && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none"
                    value={formData.delay_fine_amount || ""}
                    onChange={(e) =>
                      handleInputChange("delay_fine_amount", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px]"
                    value={formData.delay_fine_source || ""}
                    onChange={(e) =>
                      handleInputChange("delay_fine_source", e.target.value)
                    }
                  >
                    <option value="">Source</option>
                    <option value="payroll">Payroll</option>
                    <option value="hand">Hand</option>
                  </select>
                </div>
              )}
            </div>

            {/* Late Card */}
            <div className="bg-[#FFEBF3] border border-[#FFD2E5] rounded-2xl p-5 space-y-4">
              <span className="text-[13px] font-semibold block">
                Late Logic
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="w-20 bg-white h-10 rounded-xl px-3 text-[12px] border-none"
                  value={formData.late_unpaid_count}
                  onChange={(e) =>
                    handleInputChange("late_unpaid_count", e.target.value)
                  }
                />
                <span className="text-[12px]">as</span>
                <select
                  className="flex-1 bg-white h-10 rounded-xl px-3 text-[12px]"
                  value={formData.late_action_type}
                  onChange={(e) =>
                    handleInputChange("late_action_type", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="day">Day Cut</option>
                  <option value="fine">Fine</option>
                  <option value="email">Email</option>
                </select>
              </div>
              {formData.late_action_type === "day" && (
                <select
                  className={inputClass}
                  value={formData.late_cut}
                  onChange={(e) =>
                    handleInputChange("late_cut", e.target.value)
                  }
                >
                  <option value="">Select Cut</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Full Day">Full Day</option>
                </select>
              )}
              {formData.late_action_type === "fine" && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none"
                    value={formData.late_fine_amount || ""}
                    onChange={(e) =>
                      handleInputChange("late_fine_amount", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px]"
                    value={formData.late_fine_source || ""}
                    onChange={(e) =>
                      handleInputChange("late_fine_source", e.target.value)
                    }
                  >
                    <option value="">Source</option>
                    <option value="payroll">Payroll</option>
                    <option value="hand">Hand</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-10 py-2.5 border border-gray-300 rounded-xl text-[13px] hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-10 py-2.5 bg-black text-white rounded-xl text-[13px] hover:bg-zinc-800 disabled:opacity-50 transition-all"
        >
          {loading ? "Saving..." : "Update Policy"}
        </button>
      </div>
    </div>
  );
};

export default UpdateAttendancePolicyTab;
