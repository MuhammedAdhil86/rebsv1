import React from "react";
import { X } from "lucide-react";

const AllocatePayrollModal = ({ isOpen, onClose, onConfirm, month, year }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-['Poppins'] font-normal text-[12px]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="text-sm font-semibold text-gray-800">
            Allocate Payroll
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-500 leading-relaxed">
            This action will generate payroll records for all active staff for
            the period of
            <span className="text-blue-600 font-medium">
              {" "}
              {month} {year}
            </span>
            . Existing draft records for this period may be updated.
          </p>

          <div>
            <label className="block text-[11px] text-gray-600 mb-1">
              Remarks (Optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 transition-all text-[12px]"
              placeholder="e.g. Monthly batch processing"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
          >
            Allocate Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocatePayrollModal;
