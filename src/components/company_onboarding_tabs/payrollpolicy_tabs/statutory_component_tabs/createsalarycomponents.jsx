import { useState, useEffect } from "react";
import axiosInstance from "../../../../service/axiosinstance";

export default function CreateSalaryTemplate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    annual_ctc: "",
    status: "active",
  });

  const [components, setComponents] = useState([]);
  const [mappings, setMappings] = useState([
    { component_id: "", calculation_type: "", value: "" },
  ]);

  // Fetch components from API
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const url = `${axiosInstance.baseURL2}/api/payroll/components?limit=50&offset=0`;
        const res = await axiosInstance.get(url);
        setComponents(res.data?.data?.items || []);
      } catch (e) {
        console.error("Component fetch failed:", e);
      }
    };
    fetchComponents();
  }, []);

  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMappingChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...mappings];
    updated[index][name] = value;
    setMappings(updated);
  };

  const addMapping = () => {
    setMappings([
      ...mappings,
      { component_id: "", calculation_type: "", value: "" },
    ]);
  };

  const removeMapping = (index) => {
    const updated = mappings.filter((_, i) => i !== index);
    setMappings(updated);
  };

  const submitTemplate = async () => {
    try {
      // Only allow valid mappings
      const cleanedMappings = mappings.filter(
        (m) =>
          m.component_id &&
          ["flat", "percentage_ctc", "percentage_basic"].includes(
            m.calculation_type
          ) &&
          m.value !== ""
      );

      if (!form.name || !form.annual_ctc) {
        alert("Template name and Annual CTC are required.");
        return;
      }

      if (cleanedMappings.length === 0) {
        alert(
          "Add at least one mapping with a valid calculation type: flat, percentage_ctc, or percentage_basic"
        );
        return;
      }

      const body = {
        template: {
          name: form.name,
          description: form.description,
          annual_ctc: Number(form.annual_ctc),
          status: form.status,
        },
        mappings: cleanedMappings.map((m) => ({
          component_id: Number(m.component_id),
          calculation_type: m.calculation_type,
          value: Number(m.value),
        })),
      };

      console.log("POST BODY:", body);

      const url =
        "https://agnostically-bonniest-patrice.ngrok-free.dev/api/payroll/templates";

      const res = await axiosInstance.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      alert("Salary Template Created!");
      console.log("SERVER RESPONSE:", res.data);

      // Reset form after success
      setForm({ name: "", description: "", annual_ctc: "", status: "active" });
      setMappings([{ component_id: "", calculation_type: "", value: "" }]);
    } catch (err) {
      console.error("POST ERROR:", err);
      alert(err.response?.data?.message || "Error creating template");
    }
  };

  return (
    <div className="p-6 grid place-items-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 border">
        <h1 className="text-2xl font-bold mb-4">Create Salary Template</h1>

        {/* Template Info */}
        <div className="grid gap-4">
          <input
            name="name"
            placeholder="Template Name"
            value={form.name}
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          />

          <input
            name="annual_ctc"
            placeholder="Annual CTC"
            type="number"
            value={form.annual_ctc}
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          />

          <select
            name="status"
            value={form.status}
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Component Mappings */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Mappings</h2>

        {mappings.map((map, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-3">
            {/* Component Selector */}
            <select
              name="component_id"
              value={map.component_id}
              className="border p-2 rounded"
              onChange={(e) => handleMappingChange(index, e)}
            >
              <option value="">Select Component</option>
              {components.map((c, i) => (
                <option key={`${c.id}-${i}`} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Calculation Type */}
            <select
              name="calculation_type"
              value={map.calculation_type}
              className="border p-2 rounded"
              onChange={(e) => handleMappingChange(index, e)}
            >
              <option value="">Select Type</option>
              <option value="flat">Flat</option>
              <option value="percentage_ctc">% of CTC</option>
              <option value="percentage_basic">% of Basic</option>
            </select>

            {/* Value */}
            <input
              name="value"
              type="number"
              value={map.value}
              placeholder="Value"
              className="border p-2 rounded"
              onChange={(e) => handleMappingChange(index, e)}
            />

            {/* Remove Mapping Button */}
            <button
              className="bg-red-500 text-white rounded px-2"
              onClick={() => removeMapping(index)}
            >
              X
            </button>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            className="bg-blue-600 text-white p-2 rounded"
            onClick={addMapping}
          >
            + Add Component Mapping
          </button>

          <button
            className="bg-green-600 text-white p-2 rounded"
            onClick={submitTemplate}
          >
            Submit Template
          </button>
        </div>
      </div>
    </div>
  );
}
