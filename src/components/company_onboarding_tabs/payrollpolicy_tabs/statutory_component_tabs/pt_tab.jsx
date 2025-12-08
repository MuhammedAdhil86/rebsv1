import React, { useState } from "react";
import { FiExternalLink, FiX } from "react-icons/fi";

const ProfessionalTaxTab = ({ data }) => {
  const [open, setOpen] = useState(false);

  const ptSlabs = data?.pt_slabs || [];

  return (
    <div className="px-2 sm:px-4 md:px-6 font-poppins text-[12px]">
      {/* Title + description */}
      <h3 className="font-medium text-[14px] sm:text-[15px] text-gray-800 flex items-center gap-1">
        Professional Tax{" "}
        <span className="text-gray-500 font-normal text-[12px]">
          (This tax is levied on an employee's income by the State Government. Tax slabs differ in each state)
        </span>
      </h3>

      {/* Content Section */}
      <div className="mt-5 space-y-5 text-gray-700">
        {/* PT Number */}
        <div className="flex gap-3">
          <span className="w-[150px] font-normal text-gray-600">PT Number</span>
          <span className="text-gray-800">{data.pt_number}</span>
        </div>

        {/* State */}
        <div className="flex gap-3">
          <span className="w-[150px] font-normal text-gray-600">State</span>
          <span className="text-gray-800">{data.state}</span>
        </div>

        {/* Deduction */}
        <div className="flex gap-3">
          <span className="w-[150px] font-normal text-gray-600">Deduction Cycle</span>
          <span className="text-gray-800">{data.deduction_cycle}</span>
        </div>

        {/* PT Slabs */}
        <div className="flex gap-3 items-center">
          <span className="w-[150px] font-normal text-gray-600">PT Slabs</span>
          <button
            className="text-black font-medium underline flex items-center gap-1 hover:text-blue-600 transition"
            onClick={() => setOpen(true)}
          >
            View Tax Slabs <FiExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Line Divider */}
      <hr className="mt-6 border-gray-200" />

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div className="ml-auto w-[400px] bg-white p-6 shadow-lg transform transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800 text-[14px]">Tax Slabs</h4>
              <button onClick={() => setOpen(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {ptSlabs.map((slab, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded p-3 flex flex-col gap-1 hover:shadow-sm transition"
                >
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Salary:</span>
                    <span className="text-gray-800">{slab.min_salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Salary:</span>
                    <span className="text-gray-800">{slab.max_salary ?? "No Limit"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Amount:</span>
                    <span className="text-gray-800">{slab.tax_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="text-gray-800">{slab.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective From:</span>
                    <span className="text-gray-800">{new Date(slab.effective_from).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active:</span>
                    <span className="text-gray-800">{slab.is_active ? "Yes" : "No"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTaxTab;
