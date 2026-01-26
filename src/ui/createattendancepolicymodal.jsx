import React, { useState } from 'react';
import { X, Calendar, Clock, ChevronDown } from 'lucide-react';
import attendancePolicyService from '../service/attendancepolicyService';

const CreateAttendancePolicyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    policy_name: "",
    policy_code: "",
    policy_colour: "#2E86C1",
    start_time: "09:00:00",
    end_time: "18:00:00",
    lunch_break_from: "13:30:00",
    lunch_break_to: "14:00:00",
    break_time_from: "13:00:00",
    break_time_to: "13:30:00",
    half_day: "04:00:00",
    late: "00:30:00",
    delay: "00:15:00",
    work_from_home: false,
    over_time_benefit: false,
    regularisation_limit: 1,
    regularisation_type: "Monthly",
    regularize_cap_limit: "01:00:00",
    regularize_cap_period: "Monthly",
    start_date: "2026-01-20",
    end_date: "2026-01-31",
    delay_unpaid_count: 0,
    delay_action_type: "",
    late_unpaid_count: 0,
    late_action_type: "",
  });

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await attendancePolicyService.createPolicy(formData);
      if (response.status === 200 || response.status === 201) {
        alert("Policy Created Successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error creating policy:", error);
      alert("Error: check console for details.");
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-[#F4F6F8] border border-gray-100 rounded-xl text-[12px] font-normal placeholder:text-gray-400 focus:outline-none transition-all";
  const labelClass = "text-[12px] font-medium text-gray-700 mb-1.5 block";
  const iconWrapper = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[98vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-lg">
                <Calendar className="text-gray-600" size={18} />
            </div>
            <h2 className="text-[14px] font-semibold text-gray-800">Create a Policy</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto bg-[#F9FAFB]">
          <div className="flex gap-6">
            
            {/* Left Column */}
            <div className="w-[32%] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className={labelClass}>Policy Name</label>
                <input type="text" placeholder="Enter Policy Name" className={inputClass} onChange={(e) => handleInputChange('policy_name', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Policy Code</label>
                  <input type="text" placeholder="Policy Code (eg: RP)" className={inputClass} onChange={(e) => handleInputChange('policy_code', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Policy Color</label>
                  <div className="relative flex items-center gap-2 bg-[#F4F6F8] border border-gray-100 rounded-xl px-3 py-1.5 h-[38px]">
                    <input type="color" value={formData.policy_colour} className="w-5 h-5 rounded-full cursor-pointer border-none bg-transparent" onChange={(e) => handleInputChange('policy_colour', e.target.value)} />
                    <span className="text-[11px] text-gray-500 uppercase"> color</span>
                    <ChevronDown className="absolute right-2 text-gray-400" size={14} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Work From Home</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none`} onChange={(e) => handleInputChange('work_from_home', e.target.value === 'true')}>
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={14} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Over Time</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none`} onChange={(e) => handleInputChange('over_time_benefit', e.target.value === 'true')}>
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={14} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Regularization</label>
                  <input type="number" placeholder="count" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Period</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none`}>
                      <option>Monthly/Weekly</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={14} />
                  </div>
                </div>
              </div>

              {/* Regularisable Overtime Section (New) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Regularisable OverTime</label>
                  <div className="relative">
                    <input type="text" placeholder="HH:MM" className={inputClass} />
                    <Calendar className={iconWrapper} size={14} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Period</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none`}>
                      <option>Monthly/Weekly</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={14} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Policy Effective From</label>
                  <div className="relative">
                    <input type="text" placeholder="DD/MM/YYYY" className={inputClass} />
                    <Calendar className={iconWrapper} size={14} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Policy Effective To</label>
                  <div className="relative">
                    <input type="text" placeholder="DD/MM/YYYY" className={inputClass} />
                    <Calendar className={iconWrapper} size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-[68%] space-y-6">
              {/* Time Configuration Grid */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                  {[
                    { label: "Check in Time", placeholder: "Enter Check In Time" },
                    { label: "Check out Time", placeholder: "Enter Check Out Time" },
                    { label: "Lunch Break From", placeholder: "Enter Lunch Time from" },
                    { label: "Lunch Break To", placeholder: "Enter Lunch Time To" },
                    { label: "Short Break From", placeholder: "Enter Short Break Time from" },
                    { label: "Short Break To", placeholder: "Enter Short Break Time To" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <label className={labelClass}>{item.label}</label>
                      <div className="relative">
                        <input type="text" placeholder={item.placeholder} className={inputClass} />
                        <Clock className={iconWrapper} size={14} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Half Day / Late / Delay Row */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                  {["Half Day", "Late", "Delay"].map((label) => (
                    <div key={label}>
                      <label className={labelClass}>{label}</label>
                      <div className="relative">
                        <input type="text" placeholder={label} className={inputClass} />
                        <Clock className={iconWrapper} size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Cards: Delay and Late */}
              <div className="flex gap-4">
                {/* Delay Card */}
                <div className="flex-1 bg-[#FFF6E9] border border-[#FDE3C3] rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[13px] font-semibold text-gray-800">Consider</span>
                    <span className="text-[13px] font-semibold text-gray-800">Compensates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="text" placeholder="Count" className="w-20 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm" />
                    <span className="text-[12px] font-medium text-gray-600">Delay as</span>
                    <div className="relative flex-1">
                      <select className="w-full bg-white h-10 rounded-xl px-3 text-[12px] appearance-none border-none shadow-sm">
                        <option value=""></option>
                      </select>
                      <ChevronDown className={iconWrapper} size={14} />
                    </div>
                  </div>
                </div>

                {/* Late Card */}
                <div className="flex-1 bg-[#FFEBF3] border border-[#FFD2E5] rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[13px] font-semibold text-gray-800">Consider</span>
                    <span className="text-[13px] font-semibold text-gray-800">Compensates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="text" placeholder="Count" className="w-20 bg-white h-10 rounded-xl px-3 text-[12px] border-none shadow-sm" />
                    <span className="text-[12px] font-medium text-gray-600">Late as</span>
                    <div className="relative flex-1">
                      <select className="w-full bg-white h-10 rounded-xl px-3 text-[12px] appearance-none border-none shadow-sm">
                        <option value=""></option>
                      </select>
                      <ChevronDown className={iconWrapper} size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-white">
          <button onClick={onClose} className="px-10 py-2.5 border border-gray-300 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-10 py-2.5 bg-black text-white rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/10">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAttendancePolicyModal;