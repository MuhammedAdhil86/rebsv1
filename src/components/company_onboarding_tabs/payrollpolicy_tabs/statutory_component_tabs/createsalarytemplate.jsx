import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../service/axiosinstance";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, X, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import GlowButton from "../../../helpers/glowbutton";

export default function CreateSalaryTemplate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    annual_ctc: "",
    status: "active",
  });
  const [components, setComponents] = useState([]);
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await axiosInstance.get(
          "api/payroll/components?limit=50&offset=0",
        );
        const items = res.data?.data?.items || [];
        const unique = Array.from(
          new Map(items.map((item) => [item.id, item])).values(),
        );
        setComponents(unique);
      } catch (err) {
        toast.error("Failed to load components");
      }
    };
    fetchComponents();
  }, []);

  useEffect(() => {
    if (!components.length) return;
    const defaultBasic = components.find(
      (c) => c.company_id === 0 && c.name.toLowerCase() === "basic",
    );
    const fixedAllowance = components.find(
      (c) => c.company_id === 0 && c.name.toLowerCase() === "fixed allowance",
    );
    const initial = [];
    if (defaultBasic) {
      initial.push({
        id: uuidv4(),
        component_id: defaultBasic.id,
        calculation_type: defaultBasic.calculation_type,
        value: defaultBasic.value,
        monthly_amount: 0,
        annual_amount: 0,
        isDefault: true,
      });
    }
    if (fixedAllowance) {
      initial.push({
        id: uuidv4(),
        component_id: fixedAllowance.id,
        calculation_type: fixedAllowance.calculation_type,
        value: 0,
        monthly_amount: 0,
        annual_amount: 0,
        isFixed: true,
      });
    }
    setMappings(initial);
  }, [components]);

  const round2 = (num) => Number(Number(num).toFixed(2));

  const getBasicAnnual = (arr) => {
    const basic = arr.find((m) => {
      const comp = components.find(
        (c) => String(c.id) === String(m.component_id),
      );
      return comp?.name?.toLowerCase() === "basic";
    });
    return Number(basic?.annual_amount || 0);
  };

  const computeAmounts = (rawMappings, annualCTC) => {
    const ctc = Number(annualCTC) || 0;

    let temp = rawMappings.map((m) => {
      if (m.isFixed) return { ...m, annual_amount: 0, monthly_amount: 0 };

      let annual = 0;
      const val = Number(m.value || 0);

      if (m.calculation_type === "percentage_ctc") {
        annual = (val / 100) * ctc;
      } else if (m.calculation_type === "flat") {
        annual = val * 12;
      }

      return {
        ...m,
        annual_amount: Number(annual.toFixed(2)),
        monthly_amount: Number((annual / 12).toFixed(2)),
      };
    });

    const basicAnnual = getBasicAnnual(temp);

    temp = temp.map((m) => {
      if (m.calculation_type === "percentage_basic") {
        const annual = (Number(m.value || 0) / 100) * basicAnnual;
        return {
          ...m,
          annual_amount: Number(annual.toFixed(2)),
          monthly_amount: Number((annual / 12).toFixed(2)),
        };
      }
      return m;
    });

    const totalWithoutFixed = temp
      .filter((m) => !m.isFixed)
      .reduce((sum, m) => sum + Number(m.annual_amount || 0), 0);

    let remaining = Number((ctc - totalWithoutFixed).toFixed(2));
    if (remaining < 0) {
      toast.error("Total exceeds Annual CTC");
      return rawMappings;
    }

    temp = temp.map((m) => {
      if (m.isFixed) {
        return {
          ...m,
          value: remaining,
          annual_amount: remaining,
          monthly_amount: Number((remaining / 12).toFixed(2)),
        };
      }
      return m;
    });

    return temp;
  };

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
            component_id: data.id,
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
    setMappings((prev) => [
      ...prev,
      {
        id: uuidv4(),
        component_id: "",
        calculation_type: "",
        value: "",
        monthly_amount: 0,
        annual_amount: 0,
      },
    ]);
  };

  const deleteMapping = (id) => {
    setMappings((prev) =>
      computeAmounts(
        prev.filter((m) => !m.isDefault && !m.isFixed && m.id !== id),
        form.annual_ctc,
      ),
    );
  };

  useEffect(() => {
    setMappings((prev) => computeAmounts(prev, form.annual_ctc));
  }, [form.annual_ctc]);

  const totalAnnual = mappings.reduce(
    (sum, m) => sum + Number(m.annual_amount || 0),
    0,
  );
  const totalMonthly = round2(totalAnnual / 12);

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name || !form.annual_ctc) {
      toast.error("Template name and Annual CTC are required");
      return;
    }

    const payload = {
      template: {
        name: form.name,
        description: form.description,
        annual_ctc: Number(form.annual_ctc),
        status: form.status,
      },
      mappings: mappings.map((m) => {
        let valueToSend = Number(m.value || 0);
        if (m.calculation_type === "flat") {
          valueToSend = Number((m.annual_amount / 12).toFixed(2));
        }
        return {
          component_id: m.component_id,
          calculation_type: m.calculation_type,
          value: valueToSend,
        };
      }),
    };

    try {
      const res = await axiosInstance.post("/api/payroll/templates", payload);
      toast.success(res.data?.message || "Salary template saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save template");
    }
  };

  return (
    <div
      className="min-h-screen bg-white rounded-xl p-6 font-['Poppins'] text-[#111827]"
      style={{ fontSize: "12px" }}
    >
      <Toaster position="top-right" />

      {/* Header */}
      <div
        className="flex items-center gap-2 mb-6 pb-4 cursor-pointer border-b border-gray-200"
        onClick={() => window.history.back()}
      >
        <ChevronLeft size={16} className="cursor-pointer" />
        <span className="font-medium text-[12px]">New Salary Template</span>
      </div>

      {/* Top Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="">Template Name</label>
          <input
            name="name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleTemplateChange}
            className="bg-[#F3F4F6] border-none p-2.5 rounded-lg outline-none text-[12px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label>Description</label>
          <input
            name="description"
            placeholder="Enter description"
            value={form.description}
            onChange={handleTemplateChange}
            className="bg-[#F3F4F6] border-none p-2.5 rounded-lg outline-none text-[12px]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="">Annual CTC</label>
          <div className="relative flex items-center bg-[#F3F4F6] rounded-lg px-3 whitespace-nowrap">
            <span className="text-gray-500 mr-2">₹</span>
            <input
              name="annual_ctc"
              type="number"
              value={form.annual_ctc}
              onChange={handleTemplateChange}
              className="bg-transparent border-none py-2.5 w-full outline-none text-[12px] min-w-0"
            />
            <span className="text-gray-400 ml-2 whitespace-nowrap">
              per year
            </span>
          </div>
        </div>
      </div>

      {/* Table Heading with top & bottom border */}
      <div className="grid grid-cols-12 gap-4 px-1 mb-4 font-medium text-black uppercase border-t border-b py-2">
        <div className="col-span-4">Salary Components</div>
        <div className="col-span-3">Calculation Type</div>
        <div className="col-span-2 text-center">Monthly Amount</div>
        <div className="col-span-2 text-center">Annual Amount</div>
        <div className="col-span-1"></div>
      </div>

      <div className="space-y-4">
        <div className="font-semibold text-gray-800 px-1 py-1">Earning</div>

        {mappings.map((m, index) => (
          <div key={m.id} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              {m.isDefault || m.isFixed ? (
                <div className="p-2 text-gray-700">
                  {components.find((c) => c.id === m.component_id)?.name ||
                    "Component"}
                </div>
              ) : (
                <select
                  name="component_id"
                  value={m.component_id}
                  onChange={(e) => handleMappingChange(index, e)}
                  className="w-full bg-white border p-2 rounded-lg text-[12px]"
                >
                  <option value="">Select Component</option>
                  {components
                    .filter((c) => c.company_id !== 0)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="col-span-3">
              <div className="flex rounded-lg bg-[#F3F4F6]">
                <input
                  type="number"
                  name="value"
                  value={m.value}
                  onChange={(e) => handleMappingChange(index, e)}
                  disabled={m.isFixed}
                  className="w-1/2 p-2 text-center bg-transparent outline-none"
                />
                <div className="w-1/2 p-2 text-[10px] text-gray-500 flex items-center justify-center uppercase">
                  {m.calculation_type?.split("_").join(" ") || "Fixed Amount"}
                </div>
              </div>
            </div>

            <div className="col-span-2 text-center bg-[#F3F4F6] p-2 rounded-lg">
              {m.monthly_amount.toLocaleString("en-IN")}
            </div>

            <div className="col-span-2 text-center">
              {m.annual_amount.toLocaleString("en-IN")}
            </div>

            <div className="col-span-1 text-center">
              {!m.isDefault && !m.isFixed && (
                <X
                  size={14}
                  className="cursor-pointer text-gray-400 hover:text-red-500"
                  onClick={() => deleteMapping(m.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Component */}
      <div
        className="mt-4 flex items-center gap-1 cursor-pointer font-semibold"
        onClick={addComponent}
      >
        <Plus size={14} />
        <span className="border-b">Add Components</span>
      </div>

      {/* Summary */}
      <div className="mt-10 bg-[#F3F4F6] rounded-lg p-4 flex justify-between">
        <span>Cost to Company</span>
        <div className="flex gap-20">
          <span>₹ {totalMonthly.toLocaleString("en-IN")}</span>
          <span>₹ {totalAnnual.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-8">
        <button className="px-6 py-2 border rounded-lg">Cancel</button>
        <GlowButton onClick={handleSave}>Save</GlowButton>
      </div>
    </div>
  );
}
