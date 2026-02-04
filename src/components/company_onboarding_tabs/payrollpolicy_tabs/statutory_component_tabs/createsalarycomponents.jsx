import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import payrollService from "../../../../service/payrollService";

export default function CreateSalaryComponent({ onCancel }) {
  // =========================
  // FORM STATE
  // =========================
  const [salaryName, setSalaryName] = useState("");
  const [payslipName, setPayslipName] = useState("");

  const [calculationType, setCalculationType] = useState("percentage_ctc");
  const [value, setValue] = useState(0);

  const [active, setActive] = useState(true);
  const [taxable, setTaxable] = useState(true);
  const [partSalary, setPartSalary] = useState(true);
  const [proRata, setProRata] = useState(true);
  const [fbp, setFbp] = useState(false);
  const [epf, setEpf] = useState(true);
  const [esi, setEsi] = useState(true);
  const [showPayslip, setShowPayslip] = useState(true);

  // EPF applicability
  const [epfApplicability, setEpfApplicability] = useState("ALWAYS");

  // =========================
  // SAVE HANDLER
  // =========================
  const handleSave = async () => {
    const payload = {
      name: salaryName,
      payslip_name: payslipName,
      component_type: "earning",
      active: active,
      taxable: taxable,
      consider_epf: epf,
      epf_applicability: epf ? epfApplicability : "ALWAYS",
      consider_esi: esi,
      pro_rata: proRata,
      show_in_payslip: showPayslip,
      flexible_benefit: fbp,
      part_of_salary_structure: partSalary,
      calculation_type: calculationType,
      value: Number(value),
    };

    console.log("Salary Component Payload:", payload);

    const loadingToast = toast.loading("Saving salary component...");

    try {
      const res = await payrollService.createSalaryComponent(payload);

      toast.dismiss(loadingToast);

      if (res?.ok) {
        toast.success(res.message || "Salary component created successfully");
        onCancel();
      } else {
        toast.error(res?.message || "Failed to create component");
      }
    } catch (err) {
      toast.dismiss(loadingToast);

      console.error(err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  // =========================
  // CUSTOM UI COMPONENTS
  // =========================
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
          className={`leading-tight cursor-pointer font-medium ${
            isGreenLabel && checked ? "text-green-500" : "text-gray-700"
          }`}
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

  // =========================
  // RENDER
  // =========================
  return (
    <div className="w-full bg-white min-h-screen font-poppins text-[12px] font-normal p-3 rounded-md">
      {/* HEADER */}
      <div className="flex items-center gap-3  border-b border-gray-50">
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-900">
          Create Earning{" "}
          <span className="text-red-500 font-normal ml-2">
            *Indicates mandatory fields
          </span>
        </h2>
      </div>

      <div className="px-10 py-5 max-w-7xl mx-auto">
        {/* INPUT GRID */}
        <div className="grid grid-cols-2 gap-8 mb-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-gray-600">Component name*</label>
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
        <div className="mb-1 py-8 border-y border-gray-100">
          <label className="font-semibold text-gray-700 block mb-6">
            CALCULATION TYPE*
          </label>
          <div className="flex items-center gap-12">
            {["flat", "percentage_basic", "percentage_ctc"].map((type) => (
              <div className="flex items-center gap-4" key={type}>
                <CustomRadio
                  label={type}
                  checked={calculationType === type}
                  onClick={() => setCalculationType(type)}
                />
                {calculationType === type && (
                  <div className="flex items-center h-10 border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-24 px-3 bg-transparent outline-none font-medium text-right"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* OTHER CONFIG */}
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
              checked={proRata}
              onChange={() => setProRata(!proRata)}
            />
          </div>

          <div className="space-y-6">
            <CheckboxOption
              label="Include this as a Flexible Benefit Plan component"
              checked={fbp}
              onChange={() => setFbp(!fbp)}
            />
            {/* EPF */}
            <div>
              <CheckboxOption
                label="Consider for EPF Contribution"
                checked={epf}
                onChange={() => setEpf(!epf)}
              />

              {epf && (
                <div className="ml-6 mt-3 space-y-2">
                  <CustomRadio
                    label="Always"
                    checked={epfApplicability === "ALWAYS"}
                    onClick={() => setEpfApplicability("ALWAYS")}
                  />
                  <CustomRadio
                    label="Only when PF Wage is less than ₹ 15,000"
                    checked={epfApplicability === "PF_WAGE_LT_15000"}
                    onClick={() => setEpfApplicability("PF_WAGE_LT_15000")}
                  />
                </div>
              )}
            </div>
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
