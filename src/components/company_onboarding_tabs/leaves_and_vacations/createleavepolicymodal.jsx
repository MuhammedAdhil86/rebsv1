import React, { useState } from "react";
import { X, ChevronDown, Info, Palmtree } from "lucide-react";
import ColorPicker from "../../../ui/colorpicker";
import payrollService from "../../../service/payrollService";
import toast from "react-hot-toast";

const CreateLeavePolicyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    leave_type: "Paid",
    color: "#00AEEF",
    description: "",
    accrual_method: "monthly",
    employee_accrues: 0,
    prorate_for_new_joiners: true,
    postpone_accrual: false,
    postpone_accrual_value: 0,
    postpone_accrual_period: "days",
    reset_leave_balance: true,
    reset_leave_period: "yearly",
    carry_forward: false,
    carry_forward_limit: 0,
    encash_leave: false,
    encash_limit: 0,
    allow_negative_balance: false,
    consider_negative_balance: "",
    allow_past_leave: false,
    past_leave_limit: null,
    allow_future_leave: false,
    future_leave_limit: null,
    is_active: true,
  });

  // UI-only state for logic toggles
  const [pastLimitType, setPastLimitType] = useState("set");
  const [futureLimitType, setFutureLimitType] = useState("set");

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Clean the body to match exactly your requirement
      const requestBody = {
        ...formData,
        employee_accrues: Number(formData.employee_accrues),
        postpone_accrual_value: Number(formData.postpone_accrual_value),
        carry_forward_limit: Number(formData.carry_forward_limit),
        encash_limit: Number(formData.encash_limit),
        past_leave_limit: formData.allow_past_leave
          ? Number(formData.past_leave_limit)
          : null,
        future_leave_limit: formData.allow_future_leave
          ? Number(formData.future_leave_limit)
          : null,
        description: formData.description || `${formData.name} policy`,
      };

      await payrollService.addLeavePolicy(requestBody);
      toast.success("Leave policy created successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to create leave policy");
      console.error(error);
    }
  };

  const labelClass = "text-[12px] font-medium text-gray-700 mb-1.5 block";
  const inputClass =
    "w-full px-4 py-2 bg-[#F4F6F8] border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all";
  const sectionTitle = "text-[13px] font-semibold text-gray-800 mb-4";
  const cardClass = "bg-white p-5 rounded-2xl border border-gray-200 shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#F9FAFB] w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[98vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Palmtree className="text-gray-800" size={24} />
            <h2 className="text-[15px] font-semibold text-gray-800">
              Create a leave policy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-6">
          {/* Top Left: Basic Info */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Applicability and Validity</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Leave Name</label>
                <input
                  type="text"
                  placeholder="Enter Leave Name, eg: Casual Leave"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Policy Code</label>
                  <input
                    type="text"
                    placeholder="Policy Code (eg: RP)"
                    className={inputClass}
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Policy Color</label>
                  <ColorPicker
                    value={formData.color}
                    onChange={(color) => handleChange("color", color)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Leave Type</label>
                <div className="relative">
                  <select
                    className={`${inputClass} appearance-none`}
                    value={formData.leave_type}
                    onChange={(e) => handleChange("leave_type", e.target.value)}
                  >
                    <option value="Paid">PAID</option>
                    <option value="Unpaid">UNPAID</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={14}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Right: Accrual Rules */}
          <div className={cardClass}>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>Accrual Method</label>
                <div className="relative">
                  <select
                    className={`${inputClass} appearance-none`}
                    value={formData.accrual_method}
                    onChange={(e) =>
                      handleChange("accrual_method", e.target.value)
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-none"
                    size={14}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Employee Accrues</label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-[#F4F6F8]">
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-transparent text-[12px] focus:outline-none"
                    value={formData.employee_accrues}
                    onChange={(e) =>
                      handleChange("employee_accrues", e.target.value)
                    }
                  />
                  <span className="border-l border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-400 flex items-center bg-gray-50">
                    DAYS
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CheckboxRow
                label="Pro-rate leave balance for new joinees based on their date of joining"
                checked={formData.prorate_for_new_joiners}
                onChange={(e) =>
                  handleChange("prorate_for_new_joiners", e.target.checked)
                }
              />

              <div className="flex items-center justify-between">
                <CheckboxRow
                  label="Postpone leave accrued for employees"
                  checked={formData.postpone_accrual}
                  onChange={(e) =>
                    handleChange("postpone_accrual", e.target.checked)
                  }
                />
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[#F4F6F8]">
                    <input
                      type="text"
                      className="w-10 py-1 bg-transparent text-center text-[11px] focus:outline-none"
                      value={formData.postpone_accrual_value}
                      onChange={(e) =>
                        handleChange("postpone_accrual_value", e.target.value)
                      }
                    />
                    <div className="px-2 py-1 bg-white border-l border-gray-200 text-[10px] flex items-center gap-1">
                      DAYS <ChevronDown size={10} />
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500">After DOJ</span>
                  <Info size={14} className="text-gray-300" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <CheckboxRow
                  label="Reset the leave balances of employees"
                  checked={formData.reset_leave_balance}
                  onChange={(e) =>
                    handleChange("reset_leave_balance", e.target.checked)
                  }
                />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500">Every</span>
                  <div className="relative">
                    <select
                      className="bg-[#F4F6F8] border border-gray-200 text-[11px] px-3 py-1 rounded-lg w-28 appearance-none focus:outline-none"
                      value={formData.reset_leave_period}
                      onChange={(e) =>
                        handleChange("reset_leave_period", e.target.value)
                      }
                    >
                      <option value="yearly">Yearly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <ChevronDown
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                      size={12}
                    />
                  </div>
                  <Info size={14} className="text-gray-300" />
                </div>
              </div>

              <div className="ml-8 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <CheckboxRow
                    label="Carry forward unused leave balance upon reset?"
                    checked={formData.carry_forward}
                    onChange={(e) =>
                      handleChange("carry_forward", e.target.checked)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">
                      Max days
                    </div>
                    <input
                      type="text"
                      className="w-10 py-1 bg-[#F4F6F8] border border-gray-200 rounded-lg text-center text-[11px] focus:outline-none"
                      value={formData.carry_forward_limit}
                      onChange={(e) =>
                        handleChange("carry_forward_limit", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <CheckboxRow
                    label="Encash remaining leave days?"
                    checked={formData.encash_leave}
                    onChange={(e) =>
                      handleChange("encash_leave", e.target.checked)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                      Max days
                    </div>
                    <input
                      type="text"
                      className="w-10 py-1 bg-[#F4F6F8] border border-gray-200 rounded-lg text-center text-[11px] focus:outline-none"
                      value={formData.encash_limit}
                      onChange={(e) =>
                        handleChange("encash_limit", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left: Applicability Filters */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Applicability and Validity</h3>
            {/* Applicability button toggles omitted for brevity, assuming Criteria-based UI */}
            <div className="space-y-3">
              {["Work Locations", "Departments", "Designation", "Gender"].map(
                (label) => (
                  <div
                    key={label}
                    className="flex border border-gray-200 rounded-xl overflow-hidden h-10 shadow-sm"
                  >
                    <div className="w-1/3 px-4 flex items-center text-[11px] font-medium text-gray-600 border-r border-gray-200 bg-gray-50">
                      {label}
                    </div>
                    <div className="w-2/3 px-4 flex justify-between items-center text-[11px] text-gray-400 bg-white cursor-pointer">
                      Select <ChevronDown size={14} />
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={onClose}
                className="px-12 py-2.5 border border-gray-300 rounded-xl text-[13px] font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-12 py-2.5 bg-black text-white rounded-xl text-[13px] font-medium hover:bg-zinc-800 shadow-lg active:scale-95 transition-all"
              >
                Create
              </button>
            </div>
          </div>

          {/* Bottom Right: Request Preferences */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Employee Leave Request Preferences</h3>
            <div className="space-y-6">
              <div>
                <CheckboxRow
                  label="Allow negative leave balance"
                  checked={formData.allow_negative_balance}
                  onChange={(e) =>
                    handleChange("allow_negative_balance", e.target.checked)
                  }
                />
                <div className="ml-6 mt-2 flex items-center bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-2 h-10">
                  <span className="text-[11px] text-gray-500 flex-1">
                    Consider as
                  </span>
                  <select
                    className="bg-transparent text-[11px] font-bold focus:outline-none"
                    value={formData.consider_negative_balance}
                    onChange={(e) =>
                      handleChange("consider_negative_balance", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <CheckboxRow
                  label="Allow applying for leave on past dates"
                  checked={formData.allow_past_leave}
                  onChange={(e) =>
                    handleChange("allow_past_leave", e.target.checked)
                  }
                />
                <div className="ml-6 space-y-3 mt-2">
                  <RadioRow
                    label="No limit on past dates"
                    checked={pastLimitType === "none"}
                    onClick={() => setPastLimitType("none")}
                  />
                  <div className="flex items-center gap-4">
                    <RadioRow
                      label="Set Limit"
                      checked={pastLimitType === "set"}
                      onClick={() => setPastLimitType("set")}
                    />
                    <input
                      type="text"
                      className="flex-1 bg-[#F4F6F8] border border-gray-200 rounded-xl px-3 py-1 text-[11px] focus:outline-none"
                      placeholder="days before today"
                      value={formData.past_leave_limit || ""}
                      onChange={(e) =>
                        handleChange("past_leave_limit", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <CheckboxRow
                  label="Allow applying for leave on future dates"
                  checked={formData.allow_future_leave}
                  onChange={(e) =>
                    handleChange("allow_future_leave", e.target.checked)
                  }
                />
                <div className="ml-6 space-y-3 mt-2">
                  <RadioRow
                    label="No limit on future dates"
                    checked={futureLimitType === "none"}
                    onClick={() => setFutureLimitType("none")}
                  />
                  <div className="flex items-center gap-4">
                    <RadioRow
                      label="Set Limit"
                      checked={futureLimitType === "set"}
                      onClick={() => setFutureLimitType("set")}
                    />
                    <input
                      type="text"
                      className="flex-1 bg-[#F4F6F8] border border-gray-200 rounded-xl px-3 py-1 text-[11px] focus:outline-none"
                      placeholder="days after today"
                      value={formData.future_leave_limit || ""}
                      onChange={(e) =>
                        handleChange("future_leave_limit", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckboxRow = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="accent-black w-4 h-4 rounded border-gray-200 shadow-sm"
    />
    <span className="text-[11px] font-medium text-gray-700">{label}</span>
  </div>
);

const RadioRow = ({ label, checked, onClick }) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
    <div
      className={`w-3.5 h-3.5 border rounded-full flex items-center justify-center ${checked ? "border-black" : "border-gray-300 shadow-inner"}`}
    >
      {checked && <div className="w-2 h-2 bg-black rounded-full" />}
    </div>
    <span
      className={`text-[11px] ${checked ? "text-gray-900 font-medium" : "text-gray-500"}`}
    >
      {label}
    </span>
  </div>
);

export default CreateLeavePolicyModal;
