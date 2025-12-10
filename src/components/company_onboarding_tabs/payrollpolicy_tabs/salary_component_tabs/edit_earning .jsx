import React, { useState } from "react";
// Ensure that the Poppins font is imported into your project (e.g., in your main CSS file)

export default function EditEarning() {
  // Use "percentage" as the initial state to match the image
  const [calculationType, setCalculationType] = useState("percentage");
  
  // States for all checkboxes to match the image's checked/unchecked state
  const [isActive, setIsActive] = useState(true);
  const [isTaxable, setIsTaxable] = useState(false);
  const [isPartSalaryStructure, setIsPartSalaryStructure] = useState(true);
  const [isProRata, setIsProRata] = useState(false);
  const [isFBPComponent, setIsFBPComponent] = useState(false);
  const [isPFCContribution, setIsPFCContribution] = useState(true);
  const [isESICContribution, setIsESICContribution] = useState(true);
  const [isShowInPayslip, setIsShowInPayslip] = useState(true);

  // A helper component for the input fields
  const InputField = ({ label, defaultValue }) => (
    <div>
      <label className="text-gray-700 text-xs font-[Poppins] block mb-1">
        {label}*
      </label>
      <input
        type="text"
        className="w-full h-9 border border-gray-200 bg-gray-50 rounded-sm px-3 py-1 text-sm text-gray-800 font-[Poppins] focus:ring-0 focus:border-pink-500"
        defaultValue={defaultValue}
      />
    </div>
  );

  // Checkbox component
  const CheckboxOption = ({ label, description, checked, onChange }) => (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-4 h-4 border border-gray-300 rounded-sm appearance-none cursor-pointer 
                   checked:bg-black checked:border-black checked:text-white 
                   focus:ring-0"
        style={{
          backgroundImage: checked
            ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
            : "none",
          backgroundColor: checked ? "black" : "white",
        }}
      />
      <div className="flex flex-col">
        <span className="text-sm text-gray-800 font-[Poppins] leading-tight">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 font-[Poppins] max-w-sm leading-snug">
            {description}
          </p>
        )}
      </div>
    </label>
  );

  return (
    <div className="w-full bg-white p-6 rounded-lg font-[Poppins]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-lg text-gray-800 font-[Poppins] mb-1">
          Edit Earning
        </h2>
        <span className="text-xs text-red-600 font-[Poppins]">
          * indicates mandatory fields
        </span>
      </div>

      {/* Top Inputs */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <InputField label="Earning Type" defaultValue="House Rent Allowance" />
        <InputField label="Name In Salary" defaultValue="House Rent Allowance" />
        <InputField label="Name In Payslip" defaultValue="House Rent Allowance" />
      </div>

      {/* Calculation Type */}
      <div className="mb-10">
        <label className="text-xs text-gray-700 font-[Poppins] block mb-3">
          Calculation Type*
        </label>

        <div className="flex items-center gap-10">

          {/* Flat Amount Radio */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="calculationType"
              checked={calculationType === "amount"}
              onChange={() => setCalculationType("amount")}
              className="w-4 h-4 border border-gray-300 rounded-full appearance-none cursor-pointer focus:ring-0"
              style={{
                backgroundImage:
                  calculationType === "amount"
                    ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
                    : "none",
                backgroundColor: calculationType === "amount" ? "black" : "white",
                backgroundSize: "12px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
            <span className="text-gray-800 font-[Poppins]">Flat Amount</span>
          </label>

          {/* Percentage of Basic Radio & Input */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="calculationType"
                checked={calculationType === "percentage"}
                onChange={() => setCalculationType("percentage")}
                className="w-4 h-4 border border-gray-300 rounded-full appearance-none cursor-pointer focus:ring-0"
                style={{
                  backgroundImage:
                    calculationType === "percentage"
                      ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
                      : "none",
                  backgroundColor: calculationType === "percentage" ? "black" : "white",
                  backgroundSize: "12px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              <span className="text-gray-800 font-[Poppins]">
                Percentage of Basic
              </span>
            </label>

            {calculationType === "percentage" && (
              <div className="flex items-center h-9 border border-gray-300 bg-white rounded-sm overflow-hidden">
                <input
                  type="number"
                  className="w-20 h-full px-2 py-1 text-sm text-gray-800 text-right font-[Poppins] border-none focus:ring-0 bg-transparent"
                  defaultValue={50.0}
                  step="0.01"
                />
                <div className="flex items-center h-full border-l border-gray-300 bg-gray-50 px-2">
                  <span className="text-gray-700 text-sm font-[Poppins]">%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Other Configuration */}
      <h3 className="text-sm text-gray-700 font-[Poppins] mb-4">
        Other Configurations
      </h3>

      <div className="grid grid-cols-2 gap-8 text-sm">
        {/* Left Column */}
        <div className="space-y-4">
          <CheckboxOption
            label="Mark as Active"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />

          <CheckboxOption
            label="This is a taxable earning"
            checked={isTaxable}
            onChange={() => setIsTaxable(!isTaxable)}
            description={
              "The income tax amount will be divided equally and deducted every month across the financial year."
            }
          />

          <CheckboxOption
            label="Make this earning a part of the employee’s salary structure"
            checked={isPartSalaryStructure}
            onChange={() => setIsPartSalaryStructure(!isPartSalaryStructure)}
          />

          <CheckboxOption
            label="Calculate on pro-rata basis"
            checked={isProRata}
            onChange={() => setIsProRata(!isProRata)}
            description={"Pay will be adjusted based on employee working days."}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <CheckboxOption
            label="Include this as a Flexible Benefit Plan component"
            checked={isFBPComponent}
            onChange={() => setIsFBPComponent(!isFBPComponent)}
            description={
              "FBP allows your employees to personalise their salary structure by choosing how much they want to receive under each FBP component."
            }
          />

          <CheckboxOption
            label="Consider for PF Contribution"
            checked={isPFCContribution}
            onChange={() => setIsPFCContribution(!isPFCContribution)}
          />

          <CheckboxOption
            label="Consider for ESIC Contribution"
            checked={isESICContribution}
            onChange={() => setIsESICContribution(!isESICContribution)}
          />

          <CheckboxOption
            label="Show this component in payslip"
            checked={isShowInPayslip}
            onChange={() => setIsShowInPayslip(!isShowInPayslip)}
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
        <button className="px-5 h-9 bg-white border border-gray-300 text-gray-800 rounded-sm text-sm font-[Poppins] hover:bg-gray-50 transition">
          Cancel
        </button>

        <button className="px-5 h-9 bg-black text-white rounded-sm text-sm font-[Poppins] hover:bg-gray-800 transition">
          Save
        </button>
      </div>
    </div>
  );
}
