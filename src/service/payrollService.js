import axiosInstance from "./axiosinstance";

const API = axiosInstance.baseURL2; // ngrok URL (no trailing slash)

const payrollService = {
  /* ---------------- SALARY TEMPLATE ---------------- */

  getSalaryTemplates: async () => {
    try {
      const res = await axiosInstance.get(
        "api/payroll/templates?status=active",
        { baseURL: API }
      );
      return res.data?.data?.items || [];
    } catch (err) {
      console.error("Error in payrollService.getSalaryTemplates:", err);
      throw err;
    }
  },

  /* ---------------- STATUTORY: EPF ---------------- */

  getEPF: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/epf", {
        baseURL: API,
      });
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getEPF:", err);
      throw err;
    }
  },

  enableEPF: async () => {
    try {
      return await axiosInstance.post(
        "api/payroll/statutory/epf/enable",
        { enabled: true },
        { baseURL: API }
      );
    } catch (err) {
      console.error("Error in payrollService.enableEPF:", err);
      throw err;
    }
  },

  disableEPF: async () => {
    try {
      return await axiosInstance.post(
        "api/payroll/statutory/epf/disable",
        {},
        { baseURL: API }
      );
    } catch (err) {
      console.error("Error in payrollService.disableEPF:", err);
      throw err;
    }
  },

  /* ---------------- STATUTORY: ESI ---------------- */

  getESI: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/statutory/esi", {
        baseURL: API,
      });
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getESI:", err);
      throw err;
    }
  },

  enableESI: async () => {
    try {
      return await axiosInstance.post(
        "api/payroll/statutory/esi/enable",
        { enabled: true },
        { baseURL: API }
      );
    } catch (err) {
      console.error("Error in payrollService.enableESI:", err);
      throw err;
    }
  },

  disableESI: async () => {
    try {
      return await axiosInstance.post(
        "api/payroll/statutory/esi/disable",
        {},
        { baseURL: API }
      );
    } catch (err) {
      console.error("Error in payrollService.disableESI:", err);
      throw err;
    }
  },

  /* ---------------- PROFESSIONAL TAX ---------------- */

  getPT: async () => {
    try {
      const res = await axiosInstance.get(
        "api/payroll/statutory/professional-tax",
        { baseURL: API }
      );
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getPT:", err);
      throw err;
    }
  },
};

export default payrollService;
