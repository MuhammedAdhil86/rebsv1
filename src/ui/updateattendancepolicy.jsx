import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, ChevronDown } from "lucide-react";
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
    consider_as_halfday: false,
    policy_halfday_type: "",
    for_weekly_off: false,
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
        consider_as_halfday: initialData.consider_as_halfday ?? false,
        policy_halfday_type: initialData.policy_halfday_type || "",
        for_weekly_off: initialData.for_weekly_off ?? false,
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "consider_as_halfday" && value === false) {
        updated.policy_halfday_type = "";
      }
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
    if (formData.consider_as_halfday && !formData.policy_halfday_type) {
      toast.error("Please select a Policy Half Day Type");
      return;
    }

    setLoading(true);
    const policyId = initialData?.id || initialData?._id || 61;

    const payload = {
      ...formData,
      working_hours: parseFloat(formData.working_hours) || 0.0,
      delay_unpaid_count: parseInt(formData.delay_unpaid_count) || 0,
      late_unpaid_count: parseInt(formData.late_unpaid_count) || 0,
      over_time_pay: parseFloat(formData.over_time_pay) || 0.0,
      regularisation_limit: parseInt(formData.regularisation_limit) || 0,
      delay_fine_amount:
        formData.delay_action_type === "fine"
          ? parseFloat(formData.delay_fine_amount)
          : null,
      delay_cut:
        formData.delay_action_type === "day" ? formData.delay_cut : null,
      late_fine_amount:
        formData.late_action_type === "fine"
          ? parseFloat(formData.late_fine_amount)
          : null,
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
    "w-full px-4 py-2.5 bg-[#F4F6F8] border border-gray-100 rounded-xl text-[12px] font-normal placeholder:text-gray-400 focus:outline-none transition-all";
  const labelClass =
    "text-[12px] font-medium text-gray-700 mb-1.5 block font-['Poppins']";
  const iconWrapper =
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 space-y-6  overflow-y-auto font-['Poppins']">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-900" />
          <h2 className="text-[16px]  text-gray-900">
            Update Attendance Policy
          </h2>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Column - Matches Create UI precisely */}
        <div className="w-[32%] space-y-4 border-r pr-6 border-gray-50">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Consider Half Day</label>
              <select
                className={inputClass}
                value={formData.consider_as_halfday}
                onChange={(e) =>
                  handleInputChange(
                    "consider_as_halfday",
                    e.target.value === "true",
                  )
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>For Weekly Off</label>
              <select
                className={inputClass}
                value={formData.for_weekly_off}
                onChange={(e) =>
                  handleInputChange("for_weekly_off", e.target.value === "true")
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          {formData.consider_as_halfday && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <label className={`${labelClass} text-blue-600`}>
                Half Day Type *
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} border-blue-100 bg-blue-50/30`}
                  value={formData.policy_halfday_type}
                  onChange={(e) =>
                    handleInputChange("policy_halfday_type", e.target.value)
                  }
                >
                  <option value="">Select Half</option>
                  <option value="First Half">First Half</option>
                  <option value="Second Half">Second Half</option>
                </select>
                <ChevronDown className={iconWrapper} size={14} />
              </div>
            </div>
          )}

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

        {/* Right Column - Matches Create UI precisely */}
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

          <div className="grid grid-cols-2 gap-4">
            {/* Delay Logic Card */}
            <div className="bg-[#FFF6E9] border border-[#FDE3C3] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-gray-800  text-[13px]">
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
                    <option value="day">Day Cut</option>
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
                    value={formData.delay_cut || ""}
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
                    value={formData.delay_fine_amount || ""}
                    onChange={(e) =>
                      handleInputChange("delay_fine_amount", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm"
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

            {/* Late Logic Card */}
            <div className="bg-[#FFEBF3] border border-[#FFD2E5] rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center text-gray-800 text-[13px]">
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
                    <option value="day">Day Cut</option>
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
                    value={formData.late_cut || ""}
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
                    value={formData.late_fine_amount || ""}
                    onChange={(e) =>
                      handleInputChange("late_fine_amount", e.target.value)
                    }
                  />
                  <select
                    className="w-1/2 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm"
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

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-10 py-2.5 border border-gray-300 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-10 py-2.5 bg-black text-white rounded-xl text-[13px] font-medium hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg"
        >
          {loading ? "Saving..." : "Update Policy"}
        </button>
      </div>
    </div>
  );
};

export default UpdateAttendancePolicyTab;
