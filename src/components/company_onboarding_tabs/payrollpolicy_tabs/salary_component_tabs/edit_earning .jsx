import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../service/axiosinstance";
import toast from "react-hot-toast";

export default function EditEarning({ componentId, onCancel }) {
  const [loading, setLoading] = useState(true);

  // =========================
  // FORM STATE
  // =========================
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

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    if (!componentId) return;

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `${axiosInstance.baseURL2}api/payroll/components/${componentId}`
        );

        console.log("Edit Earning GET response:", res);
        console.log("Edit Earning GET data:", res?.data?.data);

        const d = res.data.data;

        setEarningType(d.name || "");
        setSalaryName(d.internal_name || "");
        setPayslipName(d.payslip_name || "");
        setCalculationType(d.calculation_type || "percentage_basic");
        setValue(d.value || 0);

        setActive(d.active || false);
        setTaxable(d.taxable || false);
        setPartSalary(d.part_of_salary_structure || false);
        setProRata(d.pro_rata || false);
        setFbp(d.flexible_benefit || false);
        setEpf(d.consider_epf || false);
        setEsi(d.consider_esi || false);
        setShowPayslip(d.show_in_payslip || false);
      } catch (err) {
        console.error("Error fetching component:", err);
        toast.error(
          err?.response?.data?.message || "Failed to fetch component data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [componentId]);

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    const payload = {
      name: earningType,
      internal_name: salaryName,
      payslip_name: payslipName,
      component_type: "earning",
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

    console.log("Edit Earning PUT payload:", payload);

    try {
      const res = await axiosInstance.put(
        `${axiosInstance.baseURL2}api/payroll/components/${componentId}`,
        payload
      );

      console.log("Edit Earning PUT response:", res);
      toast.success(res?.data?.message || "Updated successfully");
      onCancel();
    } catch (err) {
      console.error("Error updating component:", err);
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading...</div>;
  }

  // =========================
  // UI HELPERS
  // =========================
  const InputField = ({ label, value, onChange }) => (
    <div>
      <label className="text-gray-700 text-xs block mb-1">{label}*</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full h-9 border border-gray-200 bg-gray-50 rounded-sm px-3 py-1 text-sm text-gray-800 focus:ring-0 focus:border-pink-500"
      />
    </div>
  );

  const CheckboxOption = ({ label, description, checked, onChange }) => (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-4 h-4 border border-gray-300 rounded-sm appearance-none cursor-pointer checked:bg-black checked:border-black checked:text-white"
        style={{
          backgroundImage: checked
            ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
            : "none",
          backgroundColor: checked ? "black" : "white",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "12px",
        }}
      />
      <div>
        <span className="text-sm text-gray-800">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 max-w-sm">
            {description}
          </p>
        )}
      </div>
    </label>
  );

  // =========================
  // UI
  // =========================
  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <div className="mb-8">
        <h2 className="text-lg text-gray-800 mb-1">Edit Earning</h2>
        <span className="text-xs text-red-600">
          * indicates mandatory fields
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <InputField
          label="Earning Type"
          value={earningType}
          onChange={(e) => setEarningType(e.target.value)}
        />
        <InputField
          label="Name In Salary"
          value={salaryName}
          onChange={(e) => setSalaryName(e.target.value)}
        />
        <InputField
          label="Name In Payslip"
          value={payslipName}
          onChange={(e) => setPayslipName(e.target.value)}
        />
      </div>

      <div className="mb-10">
        <label className="text-xs text-gray-700 block mb-3">
          Calculation Type*
        </label>

        <div className="flex items-center gap-10">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              checked={calculationType === "flat"}
              onChange={() => setCalculationType("flat")}
            />
            Flat Amount
          </label>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={calculationType === "percentage_basic"}
                onChange={() => setCalculationType("percentage_basic")}
              />
              Percentage of Basic
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={calculationType === "percentage_ctc"}
                onChange={() => setCalculationType("percentage_ctc")}
              />
              Percentage of CTC
            </label>

            <div className="flex items-center h-9 border border-gray-300 rounded-sm overflow-hidden">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-20 h-full px-2 text-sm text-right border-none focus:ring-0"
              />
              <div className="px-2 bg-gray-50 border-l text-sm">%</div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-sm text-gray-700 mb-4">Other Configurations</h3>

      <div className="grid grid-cols-2 gap-8 text-sm">
        <div className="space-y-4">
          <CheckboxOption
            label="Mark as Active"
            checked={active}
            onChange={() => setActive(!active)}
          />
          <CheckboxOption
            label="This is a taxable earning"
            checked={taxable}
            onChange={() => setTaxable(!taxable)}
          />
          <CheckboxOption
            label="Make this earning a part of the employee’s salary structure"
            checked={partSalary}
            onChange={() => setPartSalary(!partSalary)}
          />
          <CheckboxOption
            label="Calculate on pro-rata basis"
            checked={proRata}
            onChange={() => setProRata(!proRata)}
          />
        </div>

        <div className="space-y-4">
          <CheckboxOption
            label="Include this as a Flexible Benefit Plan component"
            checked={fbp}
            onChange={() => setFbp(!fbp)}
          />
          <CheckboxOption
            label="Consider for PF Contribution"
            checked={epf}
            onChange={() => setEpf(!epf)}
          />
          <CheckboxOption
            label="Consider for ESIC Contribution"
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

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
        <button onClick={onCancel} className="px-5 h-9 border">
          Cancel
        </button>
        <button onClick={handleSave} className="px-5 h-9 bg-black text-white">
          Save
        </button>
      </div>
    </div>
  );
}
