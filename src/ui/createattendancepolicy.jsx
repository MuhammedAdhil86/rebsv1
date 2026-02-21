import React, { useState } from "react";
import { X, Calendar, Clock, ChevronDown } from "lucide-react";
import attendancePolicyService from "../service/attendancepolicyService";
import ColorPicker from "./colorpicker";

const CreateAttendancePolicyTab = ({ onClose }) => {
  const [formData, setFormData] = useState({
    policy_name: "",
    policy_code: "",
    policy_colour: "#4CAF50",
    start_time: "",
    end_time: "",
    working_hours: "",
    delay: "",
    delay_unpaid_count: "",
    delay_cut: "",
    late: "",
    late_unpaid_count: "",
    late_cut: "",
    delay_action_type: "",
    delay_fine_amount: "", // Changed from null to empty string for input handling
    delay_fine_source: "", // Changed from null to empty string
    late_action_type: "",
    late_fine_amount: "",
    late_fine_source: "",
    half_day: "",
    break_time_from: "",
    break_time_to: "",
    lunch_break_from: "",
    lunch_break_to: "",
    work_from_home: false,
    over_time_benefit: false,
    over_time_pay: "",
    regularisation_limit: "",
    regularisation_type: "Monthly",
    start_date: "",
    end_date: "",
    overtime_cap_limit: "",
    overtime_cap_period: "Monthly",
  });

  const handleInputChange = (field, value) => {
    if (
      [
        "delay_fine_amount",
        "late_fine_amount",
        "over_time_pay",
        "working_hours",
      ].includes(field)
    ) {
      if (value !== "" && parseFloat(value) < 0) return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // 1. Helper for strict backend source requirements (payroll/hand)
    const getSafeSource = (type, source) => {
      if (type !== "fine") return null;
      const s = source?.toLowerCase();
      // If action is fine, backend REQUIRES payroll or hand. Default to payroll if empty.
      return s === "payroll" || s === "hand" ? s : "payroll";
    };

    // 2. Map payload to EXACTLY match working Postman structure
    const payload = {
      policy_name: formData.policy_name,
      policy_code: formData.policy_code,
      policy_colour: formData.policy_colour,

      // Force HH:MM:SS format
      start_time: formData.start_time || "00:00:00",
      end_time: formData.end_time || "00:00:00",
      delay: formData.delay || "00:00:00",
      late: formData.late || "00:00:00",
      half_day: formData.half_day || "00:00:00",
      break_time_from: formData.break_time_from || "00:00:00",
      break_time_to: formData.break_time_to || "00:00:00",
      lunch_break_from: formData.lunch_break_from || "00:00:00",
      lunch_break_to: formData.lunch_break_to || "00:00:00",
      overtime_cap_limit: formData.overtime_cap_limit || "00:00:00",

      // Force Numeric Types (Required by your backend)
      working_hours: Number(formData.working_hours) || 0,
      delay_unpaid_count: Number(formData.delay_unpaid_count) || 0,
      late_unpaid_count: Number(formData.late_unpaid_count) || 0,
      over_time_pay: parseFloat(formData.over_time_pay) || 0.0,
      regularisation_limit: Number(formData.regularisation_limit) || 0,

      // Delay Logic
      delay_action_type: formData.delay_action_type || "email",
      delay_fine_amount:
        formData.delay_action_type === "fine"
          ? Number(formData.delay_fine_amount)
          : 0,
      delay_fine_source: getSafeSource(
        formData.delay_action_type,
        formData.delay_fine_source,
      ),
      delay_cut:
        formData.delay_action_type === "day" ? formData.delay_cut : null,

      // Late Logic
      late_action_type: formData.late_action_type || "email",
      late_fine_amount:
        formData.late_action_type === "fine"
          ? Number(formData.late_fine_amount)
          : 0,
      late_fine_source: getSafeSource(
        formData.late_action_type,
        formData.late_fine_source,
      ),
      late_cut: formData.late_action_type === "day" ? formData.late_cut : null,

      // Enums & Booleans
      regularisation_type: formData.regularisation_type,
      overtime_cap_period: formData.overtime_cap_period,
      work_from_home: Boolean(formData.work_from_home),
      over_time_benefit: Boolean(formData.over_time_benefit),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    };

    try {
      const response = await attendancePolicyService.createPolicy(payload);
      if (response.status === 200 || response.status === 201) {
        alert("Policy Created Successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Backend Error Detail:", error.response?.data);
      alert(
        `Error: ${error.response?.data?.message || "Internal Server Error"}`,
      );
    }
  };

  // Styles preserved exactly as your original code
  const inputClass =
    "w-full px-4 py-2.5 bg-[#F4F6F8] border border-gray-100 rounded-xl text-[12px] font-normal placeholder:text-gray-400 focus:outline-none transition-all";
  const labelClass =
    "text-[12px] font-medium text-gray-700 mb-1.5 block font-['Poppins']";
  const iconWrapper =
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto font-['Poppins']">
      {/* UI is 100% identical to your original code */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-900" />
          <h2 className="text-[16px] font-semibold text-gray-900">
            Create a Policy
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
        <div className="w-[32%] space-y-4">
          <div>
            <label className={labelClass}>Policy Name</label>
            <input
              type="text"
              placeholder="Enter Policy Name"
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
                placeholder="RP"
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
            <div className="animate-in fade-in slide-in-from-top-1">
              <label className={labelClass}>OverTime Pay (per hour)</label>
              <input
                type="number"
                placeholder="eg: 150.0"
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
              <label className={labelClass}>Regularization Limit</label>
              <input
                type="number"
                placeholder="count"
                className={inputClass}
                value={formData.regularisation_limit}
                onChange={(e) =>
                  handleInputChange("regularisation_limit", e.target.value)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Period</label>
              <select
                className={inputClass}
                value={formData.regularisation_type}
                onChange={(e) =>
                  handleInputChange("regularisation_type", e.target.value)
                }
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>OverTime Cap Limit</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="HH:MM"
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

        <div className="w-[68%] space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 gap-x-10 gap-y-4">
            {[
              {
                label: "Check in Time",
                field: "start_time",
                placeholder: "09:30:00",
              },
              {
                label: "Check out Time",
                field: "end_time",
                placeholder: "18:30:00",
              },
              {
                label: "Lunch Break From",
                field: "lunch_break_from",
                placeholder: "13:30:00",
              },
              {
                label: "Lunch Break To",
                field: "lunch_break_to",
                placeholder: "14:00:00",
              },
              {
                label: "Short Break From",
                field: "break_time_from",
                placeholder: "11:00:00",
              },
              {
                label: "Short Break To",
                field: "break_time_to",
                placeholder: "11:15:00",
              },
              {
                label: "Half Day Start Time",
                field: "half_day",
                placeholder: "13:30:00",
              },
              {
                label: "Total Working Hours",
                field: "working_hours",
                placeholder: "8",
              },
              {
                label: "Late Limit (Time)",
                field: "late",
                placeholder: "00:30:00",
              },
              {
                label: "Delay Limit (Time)",
                field: "delay",
                placeholder: "00:10:00",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <label className={labelClass}>{item.label}</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={item.placeholder}
                    value={formData[item.field]}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFF6E9] border border-[#FDE3C3] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-gray-800 font-semibold text-[13px]">
                <span>Consider Delay</span>
                <span>Compensates</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Count"
                  className="w-20 bg-white h-10 rounded-xl px-3 text-[12px] shadow-sm border-none"
                  value={formData.delay_unpaid_count}
                  onChange={(e) =>
                    handleInputChange("delay_unpaid_count", e.target.value)
                  }
                />
                <span className="text-[12px] font-medium text-gray-600">
                  as
                </span>
                <div className="relative flex-1">
                  <select
                    className="w-full bg-white h-10 rounded-xl px-3 text-[12px] appearance-none shadow-sm border-none"
                    value={formData.delay_action_type}
                    onChange={(e) =>
                      handleInputChange("delay_action_type", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="day">Day</option>
                    <option value="fine">Fine</option>
                    <option value="email">Email</option>
                  </select>
                  <ChevronDown className={iconWrapper} size={14} />
                </div>
              </div>
              {formData.delay_action_type === "day" && (
                <div className="relative animate-in slide-in-from-top-1">
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
                  <ChevronDown className={iconWrapper} size={14} />
                </div>
              )}
              {formData.delay_action_type === "fine" && (
                <div className="flex gap-2 animate-in slide-in-from-top-1">
                  <input
                    type="number"
                    placeholder="Amt"
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm"
                    value={formData.delay_fine_amount}
                    onChange={(e) =>
                      handleInputChange("delay_fine_amount", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm"
                    value={formData.delay_fine_source}
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

            <div className="bg-[#FFEBF3] border border-[#FFD2E5] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-gray-800 font-semibold text-[13px]">
                <span>Consider Late</span>
                <span>Compensates</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Count"
                  className="w-20 bg-white h-10 rounded-xl px-3 text-[12px] shadow-sm border-none"
                  value={formData.late_unpaid_count}
                  onChange={(e) =>
                    handleInputChange("late_unpaid_count", e.target.value)
                  }
                />
                <span className="text-[12px] font-medium text-gray-600">
                  as
                </span>
                <div className="relative flex-1">
                  <select
                    className="w-full bg-white h-10 rounded-xl px-3 text-[12px] appearance-none shadow-sm border-none"
                    value={formData.late_action_type}
                    onChange={(e) =>
                      handleInputChange("late_action_type", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="day">Day</option>
                    <option value="fine">Fine</option>
                    <option value="email">Email</option>
                  </select>
                  <ChevronDown className={iconWrapper} size={14} />
                </div>
              </div>
              {formData.late_action_type === "day" && (
                <div className="relative animate-in slide-in-from-top-1">
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
                  <ChevronDown className={iconWrapper} size={14} />
                </div>
              )}
              {formData.late_action_type === "fine" && (
                <div className="flex gap-2 animate-in slide-in-from-top-1">
                  <input
                    type="number"
                    placeholder="Amt"
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm"
                    value={formData.late_fine_amount}
                    onChange={(e) =>
                      handleInputChange("late_fine_amount", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm"
                    value={formData.late_fine_source}
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

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-10 py-2.5 border border-gray-300 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-10 py-2.5 bg-black text-white rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all shadow-lg"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateAttendancePolicyTab;
