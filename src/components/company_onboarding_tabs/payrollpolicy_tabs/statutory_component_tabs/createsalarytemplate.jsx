import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../service/axiosinstance";

const CreateSalaryTemplate = () => {
  const [template, setTemplate] = useState({
    name: "",
    description: "",
    annual_ctc: "",
    status: "active",
  });

  const [mapping, setMapping] = useState({
    component_id: "",
    component_name: "",
    calculation_type: "percentage_ctc",
    value: "",
  });

  const [components, setComponents] = useState([]);

  // ----------------------------------------------------
  // Fetch Component List
  // ----------------------------------------------------
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/payroll/components?limit=50&offset=0",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        console.log("Components API:", res.data);

        setComponents(res.data?.data?.items || []);
      } catch (err) {
        console.error("Failed to load components:", err);
      }
    };

    fetchComponents();
  }, []);

  // ----------------------------------------------------
  // Input Handlers
  // ----------------------------------------------------
  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleMappingChange = (field, value) => {
    setMapping((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Select component and store both ID + Name
  const handleComponentSelect = (value) => {
    const selected = components.find((c) => c.id === Number(value));

    setMapping((prev) => ({
      ...prev,
      component_id: selected?.id || "",
      component_name: selected?.name || "",
    }));
  };

  // ----------------------------------------------------
  // Submit Template
  // ----------------------------------------------------
  const handleSubmit = async () => {
    const payload = {
      template: {
        ...template,
        annual_ctc: parseFloat(template.annual_ctc),
      },
      mappings: [
        {
          component_id: mapping.component_id,
          calculation_type: mapping.calculation_type,
          value: parseFloat(mapping.value),
        },
      ],
    };

    console.log("Final Payload:", payload);

    try {
      const res = await axiosInstance.post("/api/payroll/templates", payload);
      console.log("Template Created:", res.data);
      alert("Template created successfully!");
    } catch (err) {
      console.error("Error creating template:", err);
      alert("Failed to create template");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-[12px] font-normal">
      <h2 className="text-[16px] font-semibold mb-4">Create Salary Template</h2>

      {/* Template Info */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border mb-6">
        <div>
          <label className="block mb-1">Template Name</label>
          <input
            type="text"
            name="name"
            value={template.name}
            onChange={handleTemplateChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Annual CTC</label>
          <input
            type="number"
            name="annual_ctc"
            value={template.annual_ctc}
            onChange={handleTemplateChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={template.description}
            onChange={handleTemplateChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Component Mapping */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px] text-[12px]">
          <thead>
            <tr className="bg-gray-100 border">
              <th className="px-3 py-2">Component Name</th>
              <th className="px-3 py-2">Calculation Type</th>
              <th className="px-3 py-2">Value</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border">
              {/* Component Dropdown */}
              <td className="px-3 py-2">
                <select
                  value={mapping.component_id}
                  onChange={(e) => handleComponentSelect(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                >
                  <option value="">Select Component</option>

                  {components.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Calculation Type */}
              <td className="px-3 py-2">
                <select
                  value={mapping.calculation_type}
                  onChange={(e) =>
                    handleMappingChange("calculation_type", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                >
                  <option value="flat">Flat</option>
                  <option value="percentage_ctc">Percentage of CTC</option>
                </select>
              </td>

              {/* Value */}
              <td className="px-3 py-2">
                <input
                  type="number"
                  value={mapping.value}
                  onChange={(e) =>
                    handleMappingChange("value", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
        >
          Save Template
        </button>
      </div>
    </div>
  );
};

export default CreateSalaryTemplate;
