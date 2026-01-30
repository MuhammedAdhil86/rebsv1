import axiosInstance from "./axiosinstance";

const payrollService = {
  // ---------------- SALARY TEMPLATES ----------------
  getSalaryTemplates: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/templates?status=active");
      return res.data?.data?.items || [];
    } catch (err) {
      console.error("Error in getSalaryTemplates:", err.response || err);
      throw err;
    }
  },

  // ---------------- EPF ----------------
  getEPF: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/epf");
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in getEPF:", err.response || err);
      throw err;
    }
  },

  enableEPF: async () => {
    try {
      const res = await axiosInstance.post("api/payroll/statutory/epf/enable", { enabled: true });
      return res.data;
    } catch (err) {
      console.error("Error in enableEPF:", err.response || err);
      throw err;
    }
  },

  disableEPF: async () => {
    try {
      const res = await axiosInstance.post("api/payroll/statutory/epf/disable");
      return res.data;
    } catch (err) {
      console.error("Error in disableEPF:", err.response || err);
      throw err;
    }
  },

  // ---------------- ESI ----------------
  getESI: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/esi");
      console.log("ESI FULL RESPONSE 👉", res.data);
      console.log("ESI DATA OBJECT 👉", res.data?.data);
      console.log("ESI ROW EXISTS 👉", res.data?.data?.row_exists);
      console.log("ESI ENABLED 👉", res.data?.data?.enabled);
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in getESI:", err.response || err);
      throw err;
    }
  },

  enableESI: async () => {
    try {
      const res = await axiosInstance.post("api/payroll/statutory/esi/enable", { enabled: true });
      return res.data;
    } catch (err) {
      console.error("Error in enableESI:", err.response || err);
      throw err;
    }
  },

  disableESI: async () => {
    try {
      const res = await axiosInstance.post("api/payroll/statutory/esi/disable");
      return res.data;
    } catch (err) {
      console.error("Error in disableESI:", err.response || err);
      throw err;
    }
  },

  // ---------------- PROFESSIONAL TAX ----------------
  getPT: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/professional-tax");
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in getPT:", err.response || err);
      throw err;
    }
  },

  // ---------------- LABOUR WELFARE FUND ----------------
  getLWF: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/lwf");
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in getLWF:", err.response || err);
      throw err;
    }
  },

  enableLWF: async ({ state, deduction_cycle }) => {
    if (!state) throw new Error("State is required to enable LWF");
    if (!deduction_cycle) throw new Error("Deduction cycle is required");

    const res = await axiosInstance.post("api/payroll/statutory/lwf/enable", {
      enabled: true,
      state,
      deduction_cycle,
    });
    return res.data;
  },

  disableLWF: async () => {
    try {
      const res = await axiosInstance.post("api/payroll/statutory/lwf/disable");
      return res.data;
    } catch (err) {
      console.error("Error in disableLWF:", err.response || err);
      throw err;
    }
  },

  // ---------------- LABOUR WELFARE FUND (UPSERT) ----------------
  upsertLWF: async ({ state, deduction_cycle, description }) => {
    try {
      if (!state) throw new Error("State is required");
      if (!deduction_cycle) throw new Error("Deduction cycle is required");

      const res = await axiosInstance.put("api/payroll/statutory/lwf/upsert", {
        state,
        deduction_cycle,
        description,
      });
      return res.data;
    } catch (err) {
      console.error("Error in upsertLWF:", err.response || err);
      throw err;
    }
  },
};

export default payrollService;
