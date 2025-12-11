import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateSalaryTemplate() {
  const API_BASE = "https://agnostically-bonniest-patrice.ngrok-free.dev/api/payroll";

  const [form, setForm] = useState({
    name: "",
    description: "",
    annual_ctc: "",
    status: "active",
  });

  const [components, setComponents] = useState([]);
  const [mappings, setMappings] = useState([
    { id: Date.now(), component_id: "", calculation_type: "", value: "" },
  ]);

  // ================================
  // FETCH COMPONENTS
  // ================================
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const url = `${API_BASE}/components?limit=50&offset=0`;
        const token = localStorage.getItem("authToken");

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComponents(res.data?.data?.items || []);
      } catch (err) {
        console.error("Component fetch error:", err);
      }
    };

    fetchComponents();
  }, []);

  // ================================
  // INPUT HANDLERS
  // ================================
  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMappingChange = (index, e) => {
    const { name, value } = e.target;

    setMappings((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const addMapping = () => {
    setMappings((prev) => [
      ...prev,
      { id: Date.now(), component_id: "", calculation_type: "", value: "" },
    ]);
  };

  // ================================
  // SUBMIT TEMPLATE
  // ================================
  const submitTemplate = async () => {
    try {
      const postURL = `${API_BASE}/templates`; // EXACT SAME AS POSTMAN
      const token = localStorage.getItem("authToken");

      const body = {
        template: {
          name: form.name,
          description: form.description,
          annual_ctc: Number(form.annual_ctc),
          status: form.status,
        },
        mappings: mappings.map((m) => ({
          component_id: Number(m.component_id),
          calculation_type: m.calculation_type,
          value: Number(m.value),
        })),
      };

      console.log("POST BODY:", body);
      console.log("POST URL:", postURL);

      const response = await axios.post(postURL, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // SAME AS POSTMAN
        },
      });

      console.log("SERVER RESPONSE:", response.data);

      alert("Salary Template Created Successfully!");

    } catch (err) {
      console.error("CREATE ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create salary template");
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="p-6 grid place-items-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 border">
        <h1 className="text-2xl font-bold mb-4">Create Salary Template</h1>

        <div className="grid gap-4">
          <input
            name="name"
            placeholder="Template Name"
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          />

          <input
            name="description"
            placeholder="Description"
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          />

          <input
            name="annual_ctc"
            placeholder="Annual CTC"
            type="number"
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          />

          <select
            name="status"
            className="border p-2 rounded"
            onChange={handleTemplateChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Mappings</h2>

        {mappings.map((map, index) => (
          <div key={map.id} className="grid grid-cols-3 gap-2 mb-3">
            <select
              name="component_id"
              className="border p-2 rounded"
              value={map.component_id}
              onChange={(e) => handleMappingChange(index, e)}
            >
              <option value="">Select Component</option>
              {components.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="calculation_type"
              className="border p-2 rounded"
              value={map.calculation_type}
              onChange={(e) => handleMappingChange(index, e)}
            >
              <option value="">Select Type</option>
              <option value="flat">Flat</option>
              <option value="percentage_ctc">% of CTC</option>
              <option value="percentage_basic">% of Basic</option>
            </select>

            <input
              name="value"
              placeholder="Value"
              type="number"
              value={map.value}
              className="border p-2 rounded"
              onChange={(e) => handleMappingChange(index, e)}
            />
          </div>
        ))}

        <button
          className="bg-blue-600 text-white p-2 rounded w-full mt-2"
          onClick={addMapping}
        >
          + Add Component Mapping
        </button>

        <button
          className="bg-green-600 text-white p-2 rounded w-full mt-2"
          onClick={submitTemplate}
        >
          Submit Template
        </button>
      </div>
    </div>
  );
}
