import React, { useState } from 'react';
import { X, Calendar, Clock, ChevronDown } from 'lucide-react';

const CreateAttendancePolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [delayAs, setDelayAs] = useState('');
  const [lateAs, setLateAs] = useState('');
  const [delayDay, setDelayDay] = useState('');
  const [lateDay, setLateDay] = useState('');

  const inputClass =
    "w-full px-4 py-2.5 bg-[#F4F6F8] border border-gray-200 rounded-xl text-[12px] font-normal placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all";
  const labelClass =
    "text-[12px] font-normal text-gray-800 mb-1.5 block";
  const iconWrapper =
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-[12px] font-normal">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-700" size={20} />
            <h2 className="text-[12px] font-normal text-gray-800">Create a Policy</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto bg-[#F9FAFB]">
          <div className="flex gap-6 h-full">

            {/* Left Sidebar Section */}
            <div className="w-1/3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              <div>
                <label className={labelClass}>Policy Name</label>
                <input type="text" placeholder="Enter Policy Name" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Policy Code</label>
                  <input type="text" placeholder="Policy Code (eg: RP)" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Policy Color</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none text-gray-400`}>
                      <option>Choose a color</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Work From Home</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none text-gray-400`}>
                      <option>Yes /No</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={16} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Over Time</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none text-gray-400`}>
                      <option>Yes / No</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Regularization</label>
                  <input type="text" placeholder="count" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Period</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none text-gray-400`}>
                      <option>Monthly/Weekly</option>
                    </select>
                    <ChevronDown className={iconWrapper} size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Policy Effective From</label>
                <div className="relative">
                  <input type="text" placeholder="DD/MM/YYYY" className={inputClass} />
                  <Calendar className={iconWrapper} size={16} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Policy Effective To</label>
                <div className="relative">
                  <input type="text" placeholder="DD/MM/YYYY" className={inputClass} />
                  <Calendar className={iconWrapper} size={16} />
                </div>
              </div>
            </div>

            {/* Right Main Section */}
            <div className="w-2/3 space-y-6">

              {/* Time Configuration Grid */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { label: "Check in Time", placeholder: "Enter Check In Time" },
                  { label: "Check out Time", placeholder: "Enter Check Out Time" },
                  { label: "Lunch Break From", placeholder: "Enter Lunch Time from" },
                  { label: "Lunch Break To", placeholder: "Enter Lunch Time To" },
                  { label: "Short Break From", placeholder: "Enter Short Break Time from" },
                  { label: "Short Break To", placeholder: "Enter Short Break Time To" },
                ].map((field, i) => (
                  <div key={i}>
                    <label className={labelClass}>{field.label}</label>
                    <div className="relative">
                      <input type="text" placeholder={field.placeholder} className={inputClass} />
                      <Clock className={iconWrapper} size={16} />
                    </div>
                  </div>
                ))}

                <div className="col-span-2 grid grid-cols-3 gap-6 pt-2">
                  {[
                    { label: "Half Day", placeholder: "Half Day" },
                    { label: "Late", placeholder: "Late" },
                    { label: "Delay", placeholder: "Delay" },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className={labelClass}>{field.label}</label>
                      <div className="relative">
                        <input type="text" placeholder={field.placeholder} className={inputClass} />
                        <Clock className={iconWrapper} size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules/Compensates Section */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex gap-6">

                {/* Delay Card */}
                <div className="flex-1 bg-[#FFF4E5] border border-[#FFD9A7] rounded-xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-normal text-gray-800">Consider</span>
                    <span className="text-[12px] font-normal text-gray-800">Compensates</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input className="w-24 bg-white rounded-lg px-3 py-2 text-[12px]" placeholder="Count" />
                    <span className="text-[12px]">Delay as</span>
                    <div className="relative flex-1">
                      <select
                        className="w-full bg-white rounded-lg px-3 py-2 text-[12px] appearance-none"
                        value={delayAs}
                        onChange={(e) => setDelayAs(e.target.value)}
                      >
                        <option></option>
                        <option value="day">Day</option>
                        <option value="fine">Fine</option>
                        <option value="email">Email</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                  </div>

                  {delayAs === 'day' && (
                    <div className="flex gap-4 mt-4 text-[12px]">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="delayDay" onChange={() => setDelayDay('half')} />
                        Half Day
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="delayDay" onChange={() => setDelayDay('full')} />
                        Full Day
                      </label>
                    </div>
                  )}

                  {delayAs === 'fine' && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <input className="bg-white rounded-lg px-3 py-2 text-[12px]" placeholder="Fine Source" />
                      <input className="bg-white rounded-lg px-3 py-2 text-[12px]" placeholder="Fine Amount" />
                    </div>
                  )}
                </div>

                {/* Late Card */}
                <div className="flex-1 bg-[#FFE9F2] border border-[#FFB8D6] rounded-xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-normal text-gray-800">Consider</span>
                    <span className="text-[12px] font-normal text-gray-800">Compensates</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input className="w-24 bg-white rounded-lg px-3 py-2 text-[12px]" placeholder="Count" />
                    <span className="text-[12px]">Late as</span>
                    <div className="relative flex-1">
                      <select
                        className="w-full bg-white rounded-lg px-3 py-2 text-[12px] appearance-none"
                        value={lateAs}
                        onChange={(e) => setLateAs(e.target.value)}
                      >
                        <option></option>
                        <option value="day">Day</option>
                        <option value="fine">Fine</option>
                        <option value="email">Email</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    </div>
                  </div>

                  {lateAs === 'day' && (
                    <div className="flex gap-4 mt-4 text-[12px]">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="lateDay" onChange={() => setLateDay('half')} />
                        Half Day
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="lateDay" onChange={() => setLateDay('full')} />
                        Full Day
                      </label>
                    </div>
                  )}

                  {lateAs === 'fine' && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <input className="bg-white rounded-lg px-3 py-2 text-[12px]" placeholder="Fine Source" />
                      <input className="bg-white rounded-lg px-3 py-2 text-[12px]" placeholder="Fine Amount" />
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-100 bg-white">
          <button onClick={onClose} className="px-12 py-2.5 border border-gray-300 rounded-lg text-[12px]">
            Cancel
          </button>
          <button className="px-14 py-2.5 bg-black text-white rounded-lg text-[12px]">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAttendancePolicyModal;
