import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../service/axiosinstance";

const CreateSalaryComponent = ({ setShowCreate }) => {
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [form, setForm] = useState({
    company_id: "",
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
    display_order: 1,
  });

  // ----------------------------------------------------
  // Load company list (dropdown)
  // ----------------------------------------------------
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosInstance.get(
          `${axiosInstance.baseURL2}/api/companies`
        );
        setCompanies(res.data.data || []);
      } catch (err) {
        console.error("Error loading companies:", err);
        alert("Failed to load companies.");
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // ----------------------------------------------------
  // Handle input change
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ----------------------------------------------------
  // Submit form
  // ----------------------------------------------------
  const handleSubmit = async () => {
    if (!form.company_id) {
      alert("Please select a company.");
      return;
    }

    const payload = {
      ...form,
      company_id: Number(form.company_id), // IMPORTANT FIX
      display_order: Number(form.display_order),
    };

    try {
      const response = await axiosInstance.post(
        `${axiosInstance.baseURL2}/api/payroll/components`,
        payload
      );

      alert(response.data.message || "Component created successfully!");
      setShowCreate(false);

    } catch (error) {
      console.error("Axios Error:", error);

      if (error.response) {
        alert(error.response.data.message || "Error occurred.");
      } else {
        alert("Network error. Check API URL.");
      }
    }
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="p-4 max-w-3xl mx-auto text-[12px]">

      <h2 className="text-[16px] mb-4 font-semibold">Create Salary Component</h2>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">

        {/* Company Dropdown */}
        <div>
          <label className="block mb-1">Company</label>
          <select
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="">-- Select Company --</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* Component Name */}
        <div>
          <label className="block mb-1">Component Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Internal Name */}
        <div>
          <label className="block mb-1">Internal Name</label>
          <input
            type="text"
            name="internal_name"
            value={form.internal_name}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Payslip Name */}
        <div>
          <label className="block mb-1">Payslip Name</label>
          <input
            type="text"
            name="payslip_name"
            value={form.payslip_name}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Component Type */}
        <div>
          <label className="block mb-1">Component Type</label>
          <select
            name="component_type"
            value={form.component_type}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="earning">Earning</option>
            <option value="deduction">Deduction</option>
          </select>
        </div>

        {/* Display Order */}
        <div>
          <label className="block mb-1">Display Order</label>
          <input
            type="number"
            name="display_order"
            value={form.display_order}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* Checkbox Group */}
        <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
          {[
            "active",
            "taxable",
            "consider_epf",
            "consider_esi",
            "show_in_payslip",
            "pro_rata",
            "flexible_benefit",
            "part_of_salary_structure",
          ].map((field) => (
            <label key={field} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={field}
                checked={form[field]}
                onChange={handleChange}
              />
              {field.replace(/_/g, " ").toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={() => setShowCreate(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Component
        </button>
      </div>
    </div>
  );
};

export default CreateSalaryComponent;
