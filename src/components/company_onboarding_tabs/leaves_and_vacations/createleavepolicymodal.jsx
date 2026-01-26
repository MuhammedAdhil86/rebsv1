import React, { useState } from 'react';
// Changed VacationDays to Palmtree (standard Lucide icon)
import { X, ChevronDown, Info, Palmtree } from 'lucide-react'; 

const CreateLeavePolicyModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    applicability: "criteria",
    pastLimitType: "set",
    futureLimitType: "set"
  });

  if (!isOpen) return null;

  const labelClass = "text-[12px] font-medium text-gray-700 mb-1.5 block";
  const inputClass = "w-full px-4 py-2 bg-[#F4F6F8] border border-gray-200 rounded-xl text-[12px] focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all";
  const sectionTitle = "text-[13px] font-semibold text-gray-800 mb-4";
  const cardClass = "bg-white p-5 rounded-2xl border border-gray-200 shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#F9FAFB] w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[98vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            {/* Using Palmtree for the vacation-days style */}
            <Palmtree className="text-gray-800" size={24} /> 
            <h2 className="text-[15px] font-semibold text-gray-800">Create a leave policy</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                <input type="text" placeholder="Enter Leave Name, eg: Casual Leave" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Policy Code</label>
                  <input type="text" placeholder="Policy Code (eg: RP)" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Policy Color</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none`}>
                      <option>Choose a color</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Leave Type</label>
                <div className="relative">
                  <select className={`${inputClass} appearance-none`}>
                    <option>PAID / UNPAID</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
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
                  <select className={`${inputClass} appearance-none`}>
                    <option>Yearly/Monthly</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-none" size={14} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Employee Accrues</label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-[#F4F6F8]">
                  <input type="number" defaultValue="0" className="w-full px-4 py-2 bg-transparent text-[12px] focus:outline-none" />
                  <span className="border-l border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-400 flex items-center bg-gray-50">DAYS</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CheckboxRow label="Pro-rate leave balance for new joinees based on their date of joining" checked />
              
              <div className="flex items-center justify-between">
                 <CheckboxRow label="Postpone leave accrued for employees" checked />
                 <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[#F4F6F8]">
                        <input type="text" placeholder="0" className="w-10 py-1 bg-transparent text-center text-[11px] focus:outline-none" />
                        <div className="px-2 py-1 bg-white border-l border-gray-200 text-[10px] flex items-center gap-1">DAYS <ChevronDown size={10}/></div>
                    </div>
                    <span className="text-[11px] text-gray-500">After DOJ</span>
                    <Info size={14} className="text-gray-300" />
                 </div>
              </div>

              <div className="flex items-center justify-between">
                <CheckboxRow label="Reset the leave balances of employees" checked />
                <div className="flex items-center gap-2">
                   <span className="text-[11px] text-gray-500">Every</span>
                   <div className="relative">
                    <select className="bg-[#F4F6F8] border border-gray-200 text-[11px] px-3 py-1 rounded-lg w-28 appearance-none focus:outline-none">
                        <option>Select</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                   </div>
                   <Info size={14} className="text-gray-300" />
                </div>
              </div>
              
              {/* Nested Accrual Section */}
              <div className="ml-8 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                    <CheckboxRow label="Carry forward unused leave balance upon reset?" checked />
                    <div className="flex items-center gap-2">
                        <div className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">Max carry forward days</div>
                        <input type="text" placeholder="0" className="w-10 py-1 bg-[#F4F6F8] border border-gray-200 rounded-lg text-center text-[11px] focus:outline-none" />
                        <Info size={14} className="text-gray-300" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <CheckboxRow label="Encash remaining leave days?" checked />
                    <div className="flex items-center gap-2">
                        <div className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">Max encashment days</div>
                        <input type="text" placeholder="0" className="w-10 py-1 bg-[#F4F6F8] border border-gray-200 rounded-lg text-center text-[11px] focus:outline-none" />
                        <Info size={14} className="text-gray-300" />
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left: Applicability Filters */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Applicability and Validity</h3>
            <label className="text-[11px] font-semibold text-gray-500 mb-3 block">Who all can apply this leave?</label>
            
            <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-4 h-10 shadow-sm">
              <button className={`flex-1 text-[12px] flex items-center justify-center gap-2 bg-white font-semibold`}>
                <div className="w-3.5 h-3.5 border border-gray-300 rounded-full" /> All Employees
              </button>
              <button className={`flex-1 text-[12px] flex items-center justify-center gap-2 border-l border-gray-200 bg-white font-semibold`}>
                <div className="w-3.5 h-3.5 border-4 border-black rounded-full" /> Criteria-Based Employees
              </button>
            </div>

            <div className="flex justify-end mb-3">
                <button className="text-[11px] font-bold text-gray-800 hover:underline">+ Add Criteria</button>
            </div>

            <div className="space-y-3">
              {['Work Locations', 'Departments', 'Designation', 'Gender'].map((label) => (
                <div key={label} className="flex border border-gray-200 rounded-xl overflow-hidden h-10 shadow-sm">
                   <div className="w-1/3 px-4 flex items-center text-[11px] font-medium text-gray-600 border-r border-gray-200 bg-gray-50">{label}</div>
                   <div className="w-2/3 px-4 flex justify-between items-center text-[11px] text-gray-400 bg-white cursor-pointer hover:bg-gray-50">
                     Select <ChevronDown size={14} />
                   </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={onClose} className="px-12 py-2.5 border border-gray-300 rounded-xl text-[13px] font-medium hover:bg-gray-50 transition-all">Cancel</button>
              <button className="px-12 py-2.5 bg-black text-white rounded-xl text-[13px] font-medium hover:bg-zinc-800 shadow-lg active:scale-95 transition-all">Create</button>
            </div>
          </div>

          {/* Bottom Right: Request Preferences */}
          <div className={cardClass}>
            <h3 className={sectionTitle}>Employee Leave Request Preferences</h3>
            <div className="space-y-6">
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <input type="checkbox" defaultChecked className="accent-black w-4 h-4 rounded border-gray-300" />
                   <span className="text-[12px] font-medium">Allow negative leave balance</span>
                   <Info size={14} className="text-gray-300" />
                </div>
                <div className="ml-6 flex items-center bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-2 h-10">
                   <span className="text-[11px] text-gray-500 flex-1">Consider negative leave balance as</span>
                   <div className="flex items-center gap-1 text-[11px] font-bold">Select <ChevronDown size={14} /></div>
                </div>
              </div>

              {/* Past Dates Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <input type="checkbox" defaultChecked className="accent-black w-4 h-4 rounded border-gray-300" />
                   <span className="text-[12px] font-medium">Allow applying for leave on past dates</span>
                   <Info size={14} className="text-gray-300" />
                </div>
                <div className="ml-6 space-y-3">
                   <RadioRow label="No limit on past dates" />
                   <div className="flex items-center gap-4">
                      <RadioRow label="Set Limit" checked />
                      <div className="flex-1 flex border border-gray-200 rounded-xl overflow-hidden bg-[#F4F6F8] h-9">
                        <span className="px-3 flex items-center text-[10px] text-gray-400 border-r border-gray-200 bg-gray-50">days before today</span>
                        <input type="text" defaultValue="0" className="w-full bg-transparent text-center text-[12px] font-medium focus:outline-none" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Future Dates Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <input type="checkbox" defaultChecked className="accent-black w-4 h-4 rounded border-gray-300" />
                   <span className="text-[12px] font-medium">Allow applying for leave on future dates</span>
                   <Info size={14} className="text-gray-300" />
                </div>
                <div className="ml-6 space-y-3">
                   <RadioRow label="No limit on future dates" />
                   <div className="flex items-center gap-4">
                      <RadioRow label="Set Limit" checked />
                      <div className="flex-1 flex border border-gray-200 rounded-xl overflow-hidden bg-[#F4F6F8] h-9">
                        <span className="px-3 flex items-center text-[10px] text-gray-400 border-r border-gray-200 bg-gray-50">days after today</span>
                        <input type="text" defaultValue="0" className="w-full bg-transparent text-center text-[12px] font-medium focus:outline-none" />
                      </div>
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

// Internal Helper Components
const CheckboxRow = ({ label, checked }) => (
  <div className="flex items-center gap-2">
    <input type="checkbox" checked={checked} readOnly className="accent-black w-4 h-4 rounded border-gray-200 shadow-sm" />
    <span className="text-[11px] font-medium text-gray-700">{label}</span>
  </div>
);

const RadioRow = ({ label, checked }) => (
  <div className="flex items-center gap-2 cursor-pointer">
    <div className={`w-3.5 h-3.5 border rounded-full flex items-center justify-center ${checked ? 'border-black' : 'border-gray-300 shadow-inner'}`}>
      {checked && <div className="w-2 h-2 bg-black rounded-full" />}
    </div>
    <span className={`text-[11px] ${checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{label}</span>
  </div>
);

export default CreateLeavePolicyModal;