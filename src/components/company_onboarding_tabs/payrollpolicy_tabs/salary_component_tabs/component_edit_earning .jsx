import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

export default function ComponentsEditearnings({ data, onCancel, onSave }) {
  const [earningType, setEarningType] = useState("");
  const [salaryName, setSalaryName] = useState("");
  const [payslipName, setPayslipName] = useState("");
  const [calculationType, setCalculationType] = useState("percentage_basic");
  const [value, setValue] = useState(0);

  const [active, setActive] = useState(false);
  const [taxable, setTaxable] = useState(false);
  const [partSalary, setPartSalary] = useState(false);
  const [proRata, setProRata] = useState(false);
  const [fbp, setFbp] = useState(false);
  const [epf, setEpf] = useState(false);
  const [esi, setEsi] = useState(false);
  const [showPayslip, setShowPayslip] = useState(false);

  // Populate from row data
  useEffect(() => {
    if (!data) return;
    setEarningType(data.name || "");
    setSalaryName(data.internal_name || "");
    setPayslipName(data.payslip_name || "");
    setCalculationType(data.calculation_type || "percentage_basic");
    setValue(data.value || 0);
    setActive(data.active || false);
    setTaxable(data.taxable || false);
    setPartSalary(data.part_of_salary_structure || false);
    setProRata(data.pro_rata || false);
    setFbp(data.flexible_benefit || false);
    setEpf(data.consider_epf || false);
    setEsi(data.consider_esi || false);
    setShowPayslip(data.show_in_payslip || false);
  }, [data]);

  const handleSave = () => {
    const updatedRow = {
      ...data,
      name: earningType,
      internal_name: salaryName,
      payslip_name: payslipName,
      calculation_type: calculationType,
      value,
      active,
      taxable,
      part_of_salary_structure: partSalary,
      pro_rata: proRata,
      flexible_benefit: fbp,
      consider_epf: epf,
      consider_esi: esi,
      show_in_payslip: showPayslip,
    };
    onSave(updatedRow);
  };

  const CustomRadio = ({ label, checked, onClick }) => (
    <label
      className="flex items-center gap-2.5 cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
          checked ? "bg-black border-black" : "bg-white border-gray-300"
        }`}
      >
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
      <span className="text-gray-800 font-medium">{label}</span>
    </label>
  );

  const CheckboxOption = ({
    label,
    description,
    checked,
    onChange,
    isGreenLabel,
  }) => (
    <div className="flex items-start gap-3">
      <div className="relative flex items-center pt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:bg-black checked:border-black"
        />
        <svg
          className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div className="flex flex-col">
        <label
          className={`leading-tight cursor-pointer font-medium ${isGreenLabel && checked ? "text-green-500" : "text-gray-700"}`}
        >
          {label}
        </label>
        {description && (
          <p className="text-gray-400 mt-1 max-w-sm leading-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white min-h-screen font-poppins text-[12px] font-normal">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-50">
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-900">
          Edit Earning{" "}
          <span className="text-red-500 font-normal ml-2">
            *Indicates mandatory fields
          </span>
        </h2>
      </div>

      <div className="px-10 py-8 max-w-7xl mx-auto">
        {/* INPUT GRID */}
        <div className="grid grid-cols-3 gap-8 mb-10">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-gray-600">Earning Type*</label>
            <input
              type="text"
              value={earningType}
              onChange={(e) => setEarningType(e.target.value)}
              className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-gray-600">Component Name*</label>
            <input
              type="text"
              value={salaryName}
              onChange={(e) => setSalaryName(e.target.value)}
              className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-gray-600">
              Name in Payslip*
            </label>
            <input
              type="text"
              value={payslipName}
              onChange={(e) => setPayslipName(e.target.value)}
              className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* CALCULATION TYPE */}
        <div className="mb-6 py-8 border-y border-gray-100">
          <label className="font-semibold text-gray-700 block mb-6">
            CALCULATION TYPE*
          </label>
          <div className="flex items-center gap-12">
            {["flat", "percentage_basic", "percentage_ctc"].map((type) => (
              <div className="flex items-center gap-4" key={type}>
                <CustomRadio
                  label={
                    type === "flat"
                      ? "Flat Amount"
                      : type === "percentage_basic"
                        ? "Percentage of Basic"
                        : "Percentage of CTC"
                  }
                  checked={calculationType === type}
                  onClick={() => setCalculationType(type)}
                />
                {calculationType === type && (
                  <div className="flex items-center h-10 border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
                    {type === "flat" && (
                      <span className="px-3 text-gray-400 border-r border-gray-200 bg-gray-100 h-full flex items-center">
                        ₹
                      </span>
                    )}
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-24 px-3 bg-transparent outline-none font-medium text-right"
                    />
                    {type !== "flat" && (
                      <span className="px-3 text-gray-400 border-l border-gray-200 bg-gray-100 h-full flex items-center">
                        %
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* OTHER CONFIGURATIONS */}
        <h3 className="font-bold text-gray-900 mb-8">Other Configurations</h3>
        <div className="grid grid-cols-2 gap-x-20 gap-y-8 mb-16">
          <div className="space-y-6">
            <CheckboxOption
              label="Mark as Active"
              isGreenLabel
              checked={active}
              onChange={() => setActive(!active)}
            />
            <CheckboxOption
              label="This is a taxable earning"
              description="The income tax amount will be divided equally and deducted every month across the financial year."
              checked={taxable}
              onChange={() => setTaxable(!taxable)}
            />
            <CheckboxOption
              label="Make this earning a part of the employee's salary structure"
              checked={partSalary}
              onChange={() => setPartSalary(!partSalary)}
            />
            <CheckboxOption
              label="Calculate on pro-rata basis"
              description="Pay will be adjusted based on employee working days."
              checked={proRata}
              onChange={() => setProRata(!proRata)}
            />
          </div>
          <div className="space-y-6">
            <CheckboxOption
              label="Include this as a Flexible Benefit Plan component"
              description="FBP allows your employees to personalise their salary structure by choosing how much they want to receive under each FBP component."
              checked={fbp}
              onChange={() => setFbp(!fbp)}
            />
            <CheckboxOption
              label="Consider for EPF Contribution"
              checked={epf}
              onChange={() => setEpf(!epf)}
            />
            <CheckboxOption
              label="Consider for ESI Contribution"
              checked={esi}
              onChange={() => setEsi(!esi)}
            />
            <CheckboxOption
              label="Show this component in payslip"
              checked={showPayslip}
              onChange={() => setShowPayslip(!showPayslip)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 py-8 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-8 py-2.5 font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-2.5 font-medium bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
