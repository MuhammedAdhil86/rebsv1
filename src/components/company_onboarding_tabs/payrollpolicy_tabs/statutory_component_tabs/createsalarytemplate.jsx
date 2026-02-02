import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../service/axiosinstance";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, X, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid"; // For unique mapping IDs

export default function CreateSalaryTemplate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    annual_ctc: "",
    status: "active",
  });

  const [components, setComponents] = useState([]);
  const [mappings, setMappings] = useState([
    {
      id: uuidv4(),
      component_id: "",
      calculation_type: "",
      value: "",
      monthly_amount: 0,
      annual_amount: 0,
    },
  ]);

  // Fetch all components
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await axiosInstance.get(
          "api/payroll/components?limit=50&offset=0",
        );
        setComponents(res.data?.data?.items || []);
      } catch (err) {
        toast.error("Failed to load components");
      }
    };
    fetchComponents();
  }, []);

  // ---------- Calculation Logic ----------
  const getBasicAnnual = (arr) => {
    const basic = arr.find((m) => {
      const comp = components.find(
        (c) => String(c.id) === String(m.component_id),
      );
      return comp?.name?.toLowerCase().includes("basic");
    });
    return Number(basic?.annual_amount || 0);
  };

  const computeAmounts = (rawMappings, annualCTC) => {
    const ctc = Number(annualCTC) || 0;

    // First pass: percentage_ctc and flat amounts
    let temp = rawMappings.map((m) => {
      let annual = 0;
      const val = Number(m.value || 0);

      if (m.calculation_type === "percentage_ctc") {
        annual = (val / 100) * ctc;
      } else if (m.calculation_type === "flat") {
        annual = val;
      }

      const monthly = Math.round(annual / 12);
      return { ...m, monthly_amount: monthly, annual_amount: monthly * 12 };
    });

    // Second pass: percentage_basic
    const basicAnnual = getBasicAnnual(temp);
    temp = temp.map((m) => {
      if (m.calculation_type === "percentage_basic") {
        const annual = (Number(m.value || 0) / 100) * basicAnnual;
        const monthly = Math.round(annual / 12);
        return { ...m, monthly_amount: monthly, annual_amount: monthly * 12 };
      }
      return m;
    });

    return temp;
  };

  // Recompute whenever annual_ctc or components change
  useEffect(() => {
    setMappings((prev) => computeAmounts(prev, form.annual_ctc));
  }, [form.annual_ctc, components]);

  // ---------- Handlers ----------
  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMappingChange = async (index, e) => {
    const { name, value } = e.target;

    if (name === "component_id") {
      try {
        const res = await axiosInstance.get(`api/payroll/components/${value}`);
        const data = res.data?.data;

        setMappings((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            component_id: value,
            calculation_type: data.calculation_type,
            value: data.value,
          };
          return computeAmounts(updated, form.annual_ctc);
        });
      } catch {
        toast.error("Failed to fetch component details");
      }
      return;
    }

    setMappings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return computeAmounts(updated, form.annual_ctc);
    });
  };

  const addComponent = () => {
    setMappings((prev) =>
      computeAmounts(
        [
          ...prev,
          {
            id: uuidv4(),
            component_id: "",
            calculation_type: "",
            value: "",
            monthly_amount: 0,
            annual_amount: 0,
          },
        ],
        form.annual_ctc,
      ),
    );
  };

  const deleteMapping = (id) => {
    setMappings((prev) =>
      computeAmounts(
        prev.filter((m) => m.id !== id),
        form.annual_ctc,
      ),
    );
  };

  // ---------- Submit Template ----------
  const submitTemplate = async () => {
    try {
      const validMappings = mappings.filter(
        (m) =>
          m.component_id &&
          m.calculation_type &&
          m.value !== "" &&
          !isNaN(Number(m.value)),
      );

      if (!form.name || !form.annual_ctc || validMappings.length === 0) {
        toast.error(
          "Please fill all required fields and add at least one component",
        );
        return;
      }

      const body = {
        template: { ...form, annual_ctc: Number(form.annual_ctc) },
        mappings: validMappings.map((m) => ({
          component_id: Number(m.component_id),
          calculation_type: m.calculation_type,
          value: Number(m.value),
        })),
      };

      await axiosInstance.post("/api/payroll/templates", body);
      toast.success("Salary Template Created Successfully!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      let msg = "Failed to create template";
      if (err.response?.data) {
        const data = err.response.data;
        msg = data.message || data.error || JSON.stringify(data);
      }
      toast.error(msg);
      console.error("Backend error:", err.response?.data || err.message);
    }
  };

  // ---------- Totals ----------
  const totalAnnual = mappings.reduce(
    (s, m) => s + Number(m.annual_amount || 0),
    0,
  );
  const totalMonthly = Math.round(totalAnnual / 12);

  // ---------- UI ----------
  return (
    <div
      className="min-h-screen bg-white p-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Toaster position="top-right" />

      {/* Navigation Header */}
      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
        <ChevronLeft size={18} className="cursor-pointer text-black" />
        <h1 className="text-[14px] font-normal text-black">
          New Salary Template
        </h1>
      </div>

      <div className="max-w-full mx-auto">
        {/* Top Header Inputs */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="space-y-1">
            <label className="text-[12px] text-black font-normal">
              Template Name
            </label>
            <input
              name="name"
              className="w-full bg-[#F3F4F6] border-none rounded-md p-2.5 text-[12px] font-normal outline-none text-black placeholder:text-black"
              placeholder="Enter name"
              value={form.name}
              onChange={handleTemplateChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] text-black font-normal">
              Description
            </label>
            <input
              name="description"
              className="w-full bg-[#F3F4F6] border-none rounded-md p-2.5 text-[12px] font-normal outline-none text-black placeholder:text-black"
              placeholder="Enter description"
              value={form.description}
              onChange={handleTemplateChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] text-black font-normal">
              Annual CTC
            </label>
            <div className="flex items-center bg-[#F3F4F6] rounded-md px-3">
              <span className="text-[12px] text-black">₹</span>
              <input
                name="annual_ctc"
                type="number"
                className="w-full bg-transparent border-none p-2.5 text-[12px] outline-none font-normal text-black placeholder:text-black"
                value={form.annual_ctc}
                placeholder="0"
                onChange={handleTemplateChange}
              />
              <span className="text-[11px] text-black whitespace-nowrap font-normal">
                per year
              </span>
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 text-[12px] font-normal text-black py-3 px-2 border-t border-b border-gray-200 mb-4 bg-white">
          <div className="col-span-4">Salary Components</div>
          <div className="col-span-3 text-center">Calculation Type</div>
          <div className="col-span-2 text-center">Monthly Amount</div>
          <div className="col-span-2 text-center">Annual Amount</div>
          <div className="col-span-1"></div>
        </div>

        {/* Mappings */}
        <div className="space-y-0">
          <div className="text-[12px] font-normal text-black px-2 py-2">
            Earning
          </div>
          {mappings.map((m, index) => (
            <div
              key={m.id}
              className="grid grid-cols-12 gap-4 items-center px-2 py-4 border-t border-b border-gray-200"
            >
              <div className="col-span-4">
                <select
                  name="component_id"
                  className="w-full text-[12px] border-none bg-transparent focus:ring-0 font-normal outline-none cursor-pointer text-black"
                  value={m.component_id}
                  onChange={(e) => handleMappingChange(index, e)}
                >
                  <option value="">Select Component</option>
                  {components.map((c, idx) => (
                    <option key={`${c.id}-${idx}`} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3 flex justify-center">
                <div className="flex border border-gray-200 rounded-md bg-[#F3F4F6] overflow-hidden">
                  <input
                    name="value"
                    type="number"
                    className="w-16 p-1.5 text-[12px] bg-transparent border-r border-gray-200 text-center outline-none font-normal text-black"
                    value={m.value}
                    onChange={(e) => handleMappingChange(index, e)}
                  />
                  <select
                    name="calculation_type"
                    className="text-[11px] bg-transparent border-none focus:ring-0 px-2 font-normal cursor-pointer text-black"
                    value={m.calculation_type}
                    onChange={(e) => handleMappingChange(index, e)}
                  >
                    <option value="">Select Type</option>
                    <option value="flat">Flat</option>
                    <option value="percentage_ctc">% of CTC</option>
                    <option value="percentage_basic">% of Basic</option>
                  </select>
                </div>
              </div>

              <div className="col-span-2">
                <div className="bg-[#F3F4F6] rounded-md p-2 text-center text-[12px] font-normal text-black">
                  ₹ {Number(m.monthly_amount || 0).toLocaleString()}
                </div>
              </div>

              <div className="col-span-2 text-center text-[12px] font-normal text-black">
                ₹ {Number(m.annual_amount || 0).toLocaleString()}
              </div>

              <div className="col-span-1 flex justify-end">
                <X
                  className="w-4 h-4 text-black cursor-pointer hover:text-red-500"
                  onClick={() => deleteMapping(m.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addComponent}
          className="mt-6 flex items-center gap-1 text-[12px] font-normal text-black hover:opacity-70 px-2"
        >
          <Plus size={14} /> Add Components
        </button>

        {/* Footer Totals */}
        <div className="mt-8 bg-[#F3F4F6] rounded-lg p-5 border-t border-b border-gray-200 flex justify-between items-center">
          <span className="text-[12px] font-normal text-black">
            Cost to Company
          </span>
          <div className="flex gap-20 pr-12 text-[12px] font-normal text-black">
            <span>₹ {totalMonthly.toLocaleString()}</span>
            <span>₹ {totalAnnual.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-10">
          <button className="px-8 py-2 border border-gray-200 rounded-lg text-[12px] font-normal text-black">
            Cancel
          </button>
          <button
            onClick={submitTemplate}
            className="px-8 py-2 bg-[#111827] text-white rounded-lg text-[12px] font-normal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
