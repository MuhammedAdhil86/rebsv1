import React, { useState } from "react";
import axiosInstance from "../../../../service/axiosinstance";

const CreateSalaryTemplate = () => {
  const [template, setTemplate] = useState({
    company_id: 8, // static
    name: "",
    description: "",
    annual_ctc: "",
    status: "active",
  });

  const [mappings, setMappings] = useState([
    { component_id: 11, calculation_type: "percentage_ctc", value: "" }, // static component_id
  ]);

  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleMappingChange = (index, field, value) => {
    const updated = [...mappings];
    updated[index][field] = value;
    setMappings(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      template: {
        ...template,
        annual_ctc: parseFloat(template.annual_ctc), // convert to number
      },
      mappings: mappings.map((m) => ({
        ...m,
        value: parseFloat(m.value), // convert to number
      })),
    };

    console.log("Final Payload:", payload);

    try {
      const url = `${axiosInstance.baseURL2}api/payroll/templates`;
      const res = await axiosInstance.post(url, payload);
      console.log("API Response:", res.data);
      alert("Template created successfully!");
    } catch (err) {
      console.error("Error creating template", err);
      alert("Failed to create template");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto text-[12px] font-normal">
      <h2 className="text-[16px] font-normal mb-4">Create Salary Template</h2>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div>
          <label className="block mb-1 text-gray-600 font-normal">Template Name</label>
          <input
            type="text"
            name="name"
            value={template.name}
            onChange={handleTemplateChange}
            className="w-full border px-2 py-1 rounded text-[12px] font-normal"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600 font-normal">Annual CTC</label>
          <input
            type="number"
            name="annual_ctc"
            value={template.annual_ctc}
            onChange={handleTemplateChange}
            className="w-full border px-2 py-1 rounded text-[12px] font-normal"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1 text-gray-600 font-normal">Description</label>
          <textarea
            name="description"
            value={template.description}
            onChange={handleTemplateChange}
            className="w-full border px-2 py-1 rounded text-[12px] font-normal"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px] font-normal min-w-[700px]">
          <thead>
            <tr className="text-left bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 font-normal">Component ID</th>
              <th className="px-4 py-2 font-normal">Calculation Type</th>
              <th className="px-4 py-2 font-normal">Value</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-normal">{item.component_id}</td>

                <td className="px-4 py-2 font-normal">
                  <select
                    value={item.calculation_type}
                    onChange={(e) => handleMappingChange(idx, "calculation_type", e.target.value)}
                    className="border px-2 py-1 rounded text-[12px] font-normal"
                  >
                    <option value="flat">Flat</option>
                    <option value="percentage_ctc">Percentage of CTC</option>
                  </select>
                </td>

                <td className="px-4 py-2 font-normal">
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleMappingChange(idx, "value", e.target.value)}
                    className="border px-2 py-1 rounded text-[12px] font-normal"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-black text-white rounded text-[12px] font-normal hover:bg-gray-800"
        >
          Save Template
        </button>
      </div>
    </div>
  );
};

export default CreateSalaryTemplate;
