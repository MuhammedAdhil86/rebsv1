import { useState, useEffect } from "react";
import axiosInstance from "../../../../service/axiosinstance";
import toast, { Toaster } from "react-hot-toast";

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
      id: Date.now() + Math.random(),
      component_id: "",
      calculation_type: "",
      value: "",
      monthly_amount: 0,
      annual_amount: 0,
    },
  ]);

  // Fetch components
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await axiosInstance.get(
          "api/payroll/components?limit=50&offset=0"
        );
        setComponents(res.data?.data?.items || []);
      } catch (err) {
        console.error("Component fetch error:", err);
        toast.error("Failed to load components");
      }
    };
    fetchComponents();
  }, []);

  // ---------- Helper functions ----------
  const getBasicAnnual = (computedMappings) => {
    const basicMapping = computedMappings.find((m) => {
      const comp = components.find(
        (c) => String(c.id) === String(m.component_id)
      );
      return comp && comp.name && comp.name.toLowerCase().includes("basic");
    });
    return Number(basicMapping?.annual_amount || 0);
  };

  const computeAmounts = (rawMappings, annualCTC) => {
    const annual = Number(annualCTC) || 0;

    const withAnnual = rawMappings.map((m) => {
      const calc = m.calculation_type;
      const valNum = Number(m.value || 0);
      let annual_amount = 0;

      if (calc === "percentage_ctc") annual_amount = (valNum / 100) * annual;
      else if (calc === "flat") annual_amount = valNum;
      else if (calc === "percentage_basic") annual_amount = 0;
      else annual_amount = 0;

      return { ...m, annual_amount: Math.round(annual_amount) };
    });

    const basicAnnual = getBasicAnnual(withAnnual);
    const final = withAnnual.map((m) => {
      if (m.calculation_type === "percentage_basic") {
        const valNum = Number(m.value || 0);
        return { ...m, annual_amount: Math.round((valNum / 100) * basicAnnual) };
      }
      return m;
    });

    return final.map((m) => ({
      ...m,
      monthly_amount: Math.round(
        (Number(m.annual_amount || 0) || 0) / 12
      ),
    }));
  };

  const sumPercentForType = (arr, type) =>
    arr.reduce(
      (s, m) =>
        m.calculation_type === type ? s + Number(m.value || 0) : s,
      0
    );

  const sumFlat = (arr) =>
    arr.reduce(
      (s, m) =>
        m.calculation_type === "flat" ? s + Number(m.value || 0) : s,
      0
    );

  const remainingPercentCTC = (arr) =>
    Math.max(100 - sumPercentForType(arr, "percentage_ctc"), 0);

  const remainingPercentBasic = (arr) =>
    Math.max(100 - sumPercentForType(arr, "percentage_basic"), 0);

  const remainingFlatAmount = (arr, annualCTC) =>
    Math.max(Number(annualCTC || 0) - sumFlat(arr), 0);

  useEffect(() => {
    setMappings((prev) => computeAmounts(prev, form.annual_ctc));
  }, [form.annual_ctc, components.length]);

  // ---------- Handlers ----------
  const handleTemplateChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMappingChange = (index, e) => {
    const { name, value } = e.target;

    setMappings((prev) => {
      const updated = prev.map((m) => ({ ...m }));
      updated[index][name] = value;

      if (name === "calculation_type") {
        const ct = value;
        const annualCTC = Number(form.annual_ctc) || 0;

        if (ct === "percentage_ctc") {
          const totalPct = sumPercentForType(updated, "percentage_ctc");
          updated[index].value =
            totalPct === 0
              ? 100
              : Math.max(
                  100 - totalPct + Number(updated[index].value || 0),
                  0
                );
        } else if (ct === "percentage_basic") {
          const totalPct = sumPercentForType(updated, "percentage_basic");
          updated[index].value =
            totalPct === 0
              ? 100
              : Math.max(
                  100 - totalPct + Number(updated[index].value || 0),
                  0
                );
        } else if (ct === "flat") {
          const usedFlat = sumFlat(updated);
          updated[index].value = Math.max(annualCTC - usedFlat, 0);
        } else updated[index].value = "";
      }

      if (name === "value") {
        const thisType = updated[index].calculation_type;

        if (
          thisType === "percentage_ctc" ||
          thisType === "percentage_basic"
        ) {
          const total = updated.reduce(
            (s, m, i) =>
              m.calculation_type === thisType
                ? s +
                  (i === index
                    ? Number(value || 0)
                    : Number(m.value || 0))
                : s,
            0
          );

          if (total > 100) {
            const otherSum = updated.reduce(
              (s, m, i) =>
                m.calculation_type === thisType && i !== index
                  ? s + Number(m.value || 0)
                  : s,
              0
            );
            updated[index].value = +Math.max(100 - otherSum, 0).toFixed(2);
          } else updated[index].value = value;
        } else if (thisType === "flat") {
          const annualCTC = Number(form.annual_ctc) || 0;
          const otherFlat = updated.reduce(
            (s, m, i) =>
              m.calculation_type === "flat" && i !== index
                ? s + Number(m.value || 0)
                : s,
            0
          );

          updated[index].value =
            Number(value) > annualCTC - otherFlat
              ? Math.max(annualCTC - otherFlat, 0)
              : value;
        }
      }

      return computeAmounts(updated, form.annual_ctc);
    });
  };

  const addMapping = () => {
    setMappings((prev) => {
      const next = prev.map((m) => ({ ...m }));
      const annualCTC = Number(form.annual_ctc) || 0;

      let defaultCalc = "";
      let defaultVal = "";

      if (next.length > 0) {
        const first = next[0];
        defaultCalc = first.calculation_type || "";

        if (defaultCalc === "percentage_ctc")
          defaultVal = remainingPercentCTC(next);
        else if (defaultCalc === "percentage_basic")
          defaultVal = remainingPercentBasic(next);
        else if (defaultCalc === "flat")
          defaultVal = remainingFlatAmount(next, annualCTC);
      } else {
        defaultCalc = "percentage_ctc";
        defaultVal = 100;
      }

      next.push({
        id: Date.now() + Math.random(),
        component_id: "",
        calculation_type: defaultCalc,
        value: defaultVal,
        monthly_amount: 0,
        annual_amount: 0,
      });

      return computeAmounts(next, form.annual_ctc);
    });
  };

  const deleteMapping = (id) => {
    setMappings((prev) =>
      computeAmounts(
        prev.filter((m) => m.id !== id),
        form.annual_ctc
      )
    );
  };

  const submitTemplate = async () => {
    try {
      const body = {
        template: { ...form, annual_ctc: Number(form.annual_ctc) },
        mappings: mappings.map((m) => ({
          component_id: Number(m.component_id),
          calculation_type: m.calculation_type,
          value: Number(m.value),
        })),
      };

      await axiosInstance.post("api/payroll/templates", body);

      toast.success("Salary Template Created Successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("CREATE ERROR:", err.response?.data || err);
      toast.error(
        err.response?.data?.message || "Failed to create salary template"
      );
    }
  };

  const totalAnnual = mappings.reduce(
    (s, m) => s + Number(m.annual_amount || 0),
    0
  );
  const totalMonthly = Math.round(totalAnnual / 12);

  return (
    <>
      <Toaster position="top-right" />
<div className="grid place-items-center">
      <div className="w-full bg-white shadow-xl rounded-2xl p-6 border">
        <h1 className="text-[16px] mb-4">New Salary Template</h1>

        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <label className="text-xs text-gray-400">Template Name</label>
            <input
              name="name"
              placeholder="Enter name"
              className="border p-2 rounded w-full mt-1"
              onChange={handleTemplateChange}
              value={form.name}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Description</label>
            <input
              name="description"
              placeholder="Enter description"
              className="border p-2 rounded w-full mt-1"
              onChange={handleTemplateChange}
              value={form.description}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Annual CTC</label>
            <div className="flex items-center border rounded mt-1">
              <input
                name="annual_ctc"
                placeholder="0"
                type="number"
                className="w-full outline-none"
                onChange={handleTemplateChange}
                value={form.annual_ctc}
              />
              <span className="ml-2 text-gray-500">per year</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 py-3 px-2 bg-gray-100 text-sm font-semibold border-b">
          <span>Salary Components</span>
          <span>Calculation Type</span>
          <span>Value</span>
          <span>Monthly Amount</span>
          <span>Annual Amount</span>
        </div>

        <div className="mt-3 font-bold text-sm mb-2">Earning</div>

        {mappings.map((map, index) => (
          <div key={map.id} className="grid grid-cols-5 gap-4 py-3 px-2 border-b items-center">
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
              type="number"
              placeholder="0"
              className="border p-2 rounded"
              value={map.value}
              onChange={(e) => handleMappingChange(index, e)}
            />

            <div className="border p-2 rounded bg-gray-100 text-right text-gray-700">
              ₹ {Number(map.monthly_amount || 0).toLocaleString()}
            </div>

            <div className="border p-2 rounded bg-gray-100 text-right text-gray-700 flex justify-between items-center">
              <span>₹ {Number(map.annual_amount || 0).toLocaleString()}</span>
              <button
                className="text-gray-500 hover:text-red-600 ml-3 text-xl"
                onClick={() => deleteMapping(map.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <div className="mt-3">
          <button onClick={addMapping} className="text-blue-600 text-sm flex items-center">
            + Add Components
          </button>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-[16px]">
            <div>Cost to Company</div>
            <div className="flex gap-12">
              <div>₹ {Number(totalMonthly || 0).toLocaleString()}</div>
              <div>₹ {Number(totalAnnual || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="border px-6 py-2 rounded">Cancel</button>
          <button onClick={submitTemplate} className="bg-black text-white px-8 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
    </>
  );
}


























