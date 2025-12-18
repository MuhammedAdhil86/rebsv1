import { useState } from "react";
import axiosInstance from "../../../../service/axiosinstance";

export default function CreateSalaryComponent() {
  const API_URL =
    "https://agnostically-bonniest-patrice.ngrok-free.dev/api/payroll/components";

  const [form, setForm] = useState({
    name: "",
    internal_name: "",
    payslip_name: "",
    component_type: "earning",
    active: true,
    taxable: true,
    consider_epf: true,
    consider_esi: true,
    pro_rata: true,
    show_in_payslip: true,
    flexible_benefit: false,
    part_of_salary_structure: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitData = async () =>
    {
    try {
      const res = await axiosInstance.post(API_URL, form);
      alert("Component Created Successfully!");
      console.log("API Response:", res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create component");
    }
  };

  return (
    <div className="grid place-items-center p-6">
      <div className="w-full bg-white shadow-xl rounded-xl p-6 border max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Create Salary Component</h1>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-5">

          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1 h-10"
              placeholder="Basic Salary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Internal Name</label>
            <input
              name="internal_name"
              value={form.internal_name}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1 h-10"
              placeholder="basic_salary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Payslip Name</label>
            <input
              name="payslip_name"
              value={form.payslip_name}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1 h-10"
              placeholder="Basic"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Component Type</label>
            <select
              name="component_type"
              value={form.component_type}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1 h-10"
            >
              <option value="earning">Earning</option>
              <option value="deduction">Deduction</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-4 mt-6">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Active
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="taxable"
              checked={form.taxable}
              onChange={handleChange}
            />
            Taxable
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="consider_epf"
              checked={form.consider_epf}
              onChange={handleChange}
            />
            Consider EPF
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="consider_esi"
              checked={form.consider_esi}
              onChange={handleChange}
            />
            Consider ESI
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="pro_rata"
              checked={form.pro_rata}
              onChange={handleChange}
            />
            Pro Rata
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="show_in_payslip"
              checked={form.show_in_payslip}
              onChange={handleChange}
            />
            Show in Payslip
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="flexible_benefit"
              checked={form.flexible_benefit}
              onChange={handleChange}
            />
            Flexible Benefit
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="part_of_salary_structure"
              checked={form.part_of_salary_structure}
              onChange={handleChange}
            />
            Part of Salary Structure
          </label>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button className="border px-6 py-2 rounded">Cancel</button>
          <button
            onClick={submitData}
            className="bg-black text-white px-7 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
