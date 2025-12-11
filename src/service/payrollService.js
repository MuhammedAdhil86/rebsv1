import axiosInstance from "./axiosinstance"; // Ensure this path is correct

const payrollService = {
  // ---------------- SALARY TEMPLATES ----------------
  getSalaryTemplates: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/templates?status=active", {
        baseURL: axiosInstance.baseURL2,
      });
      return res.data?.data?.items || [];
    } catch (err) {
      console.error("Error in payrollService.getSalaryTemplates:", err.response || err);
      throw err;
    }
  },

  // ---------------- EPF ----------------
  getEPF: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/epf", {
        baseURL: axiosInstance.baseURL2,
      });
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getEPF:", err.response || err);
      throw err;
    }
  },

  enableEPF: async () => {
    try {
      const res = await axiosInstance.post(
        "api/payroll/statutory/epf/enable",
        { enabled: true },
        { baseURL: axiosInstance.baseURL2 }
      );
      return res.data;
    } catch (err) {
      console.error("Error in payrollService.enableEPF:", err.response || err);
      throw err;
    }
  },

  disableEPF: async () => {
    try {
      const res = await axiosInstance.post(
        "api/payroll/statutory/epf/disable",
        {},
        { baseURL: axiosInstance.baseURL2 }
      );
      return res.data;
    } catch (err) {
      console.error("Error in payrollService.disableEPF:", err.response || err);
      throw err;
    }
  },

  // ---------------- ESI ----------------
  getESI: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/esi", {
        baseURL: axiosInstance.baseURL2,
      });
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getESI:", err.response || err);
      throw err;
    }
  },

  enableESI: async () => {
    try {
      const res = await axiosInstance.post(
        "api/payroll/statutory/esi/enable",
        { enabled: true },
        { baseURL: axiosInstance.baseURL2 }
      );
      return res.data;
    } catch (err) {
      console.error("Error in payrollService.enableESI:", err.response || err);
      throw err;
    }
  },

  disableESI: async () => {
    try {
      const res = await axiosInstance.post(
        "api/payroll/statutory/esi/disable",
        {},
        { baseURL: axiosInstance.baseURL2 }
      );
      return res.data;
    } catch (err) {
      console.error("Error in payrollService.disableESI:", err.response || err);
      throw err;
    }
  },

  // ---------------- PROFESSIONAL TAX ----------------
  getPT: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/professional-tax", {
        baseURL: axiosInstance.baseURL2,
      });
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getPT:", err.response || err);
      throw err;
    }
  },

  // ---------------- LABOUR WELFARE FUND ----------------
  getLWF: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/lwf", {
        baseURL: axiosInstance.baseURL2,
      });
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getLWF:", err.response || err);
      throw err;
    }
  },
enableLWF: async ({ state, deduction_cycle }) => {
  if (!state) throw new Error("State is required to enable LWF");
  if (!deduction_cycle) throw new Error("Deduction cycle is required");

  const res = await axiosInstance.post(
    "api/payroll/statutory/lwf/enable",
    { enabled: true, state, deduction_cycle },
    { baseURL: axiosInstance.baseURL2 }
  );
  return res.data;
},


  disableLWF: async () => {
    try {
      const res = await axiosInstance.post(
        "api/payroll/statutory/lwf/disable",
        {}, // no body needed
        { baseURL: axiosInstance.baseURL2 }
      );
      return res.data;
    } catch (err) {
      console.error("Error in payrollService.disableLWF:", err.response || err);
      throw err;
    }
  },
};

export default payrollService;
