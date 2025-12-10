import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../service/axiosinstance";

const CreateSalaryComponent = ({ setShowCreate }) => {
  const [components, setComponents] = useState([]);
  const [loadingComponents, setLoadingComponents] = useState(true);

  const [form, setForm] = useState({
    selected_component_id: "",
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

  // -----------------------------------------------------
  // FIXED: Fetch components properly using baseURL2
  // -----------------------------------------------------
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await axiosInstance.get(
          `${axiosInstance.baseURL2}/api/payroll/components?limit=10&offset=0`
        );

        console.log("Fetched Components:", res.data);
        setComponents(res.data?.data?.items || []);
      } catch (err) {
        console.error("Error fetching components:", err);
        alert("Failed to load components.");
      } finally {
        setLoadingComponents(false);
      }
    };

    fetchComponents();
  }, []);

  // -----------------------------------------------------
  // Handle dropdown + input changes
  // -----------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "selected_component_id") {
      const selected = components.find((c) => c.id === Number(value));

      if (selected) {
        console.log("Selected Component:", selected);

        setForm({
          ...form,
          selected_component_id: selected.id,
          name: selected.name,
          internal_name: selected.internal_name,
          payslip_name: selected.payslip_name,
          component_type: selected.component_type,
          active: selected.active,
          taxable: selected.taxable,
          consider_epf: selected.consider_epf,
          consider_esi: selected.consider_esi,
          pro_rata: selected.pro_rata,
          show_in_payslip: selected.show_in_payslip,
          flexible_benefit: selected.flexible_benefit,
          part_of_salary_structure: selected.part_of_salary_structure,
        });
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -----------------------------------------------------
  // Submit
  // -----------------------------------------------------
  const handleSubmit = async () => {
    try {
      const payload = { ...form };
      delete payload.selected_component_id;

      const response = await axiosInstance.post(
        `${axiosInstance.baseURL2}/api/payroll/components`,
        payload
      );

      console.log("Component Created Response:", response);
      alert(response.data.message || "Component created successfully!");
      setShowCreate(false);
    } catch (error) {
      console.error("Axios Error:", error);
      alert(error.response?.data?.message || "Error occurred.");
    }
  };

  const checkboxFields = [
    "active",
    "taxable",
    "consider_epf",
    "consider_esi",
    "show_in_payslip",
    "pro_rata",
    "flexible_benefit",
    "part_of_salary_structure",
  ];

  // -----------------------------------------------------
  // UI (unchanged)
  // -----------------------------------------------------
  return (
    <div className="p-4 max-w-3xl mx-auto text-[12px]">
      <h2 className="text-[16px] mb-4 font-semibold">Create Salary Component</h2>

      <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg border border-gray-200 mb-6">
        
        {/* Dropdown */}
        <div>
          <label className="block mb-1">Select Component</label>
          <select
            name="selected_component_id"
            value={form.selected_component_id}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            disabled={loadingComponents}
          >
            <option value="">-- Select Component --</option>

            {components.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
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

        {/* Checkboxes */}
        <div className="col-span-2 grid grid-cols-2 gap-4 mt-2">
          {checkboxFields.map((field) => (
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
