// service/payrollService.js
import axiosInstance from "./axiosinstance";

const payrollService = {
  // Fetch active salary templates
  getSalaryTemplates: async () => {
    try {
      const response = await axiosInstance.get(
        "api/payroll/templates?status=active",
        { baseURL: axiosInstance.baseURL2 } // Use ngrok
      );
      return response.data?.data?.items || [];
    } catch (error) {
      console.error("Error in payrollService.getSalaryTemplates:", error);
      throw error;
    }
  },

  // ---------------- STATUTORY ----------------

  // Fetch EPF details
  getEPF: async () => {
    try {
      const res = await axiosInstance.get(`${axiosInstance.baseURL2}api/payroll/statutory/epf`);
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getEPF:", err);
      throw err;
    }
  },

  // Enable EPF
  enableEPF: async () => {
    try {
      await axiosInstance.post(`${axiosInstance.baseURL2}api/payroll/statutory/epf/enable`, { enabled: true });
    } catch (err) {
      console.error("Error in payrollService.enableEPF:", err);
      throw err;
    }
  },

  // Disable EPF
  disableEPF: async () => {
    try {
      await axiosInstance.post(`${axiosInstance.baseURL2}api/payroll/statutory/epf/disable`);
    } catch (err) {
      console.error("Error in payrollService.disableEPF:", err);
      throw err;
    }
  },

  // Fetch ESI details
  getESI: async () => {
    try {
      const res = await axiosInstance.get(`${axiosInstance.baseURL2}api/payroll/statutory/esi`);
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getESI:", err);
      throw err;
    }
  },

  // Enable ESI
  enableESI: async () => {
    try {
      await axiosInstance.post(`${axiosInstance.baseURL2}api/payroll/statutory/esi/enable`, { enabled: true });
    } catch (err) {
      console.error("Error in payrollService.enableESI:", err);
      throw err;
    }
  },

  // Disable ESI
  disableESI: async () => {
    try {
      await axiosInstance.post(`${axiosInstance.baseURL2}api/payroll/statutory/esi/disable`);
    } catch (err) {
      console.error("Error in payrollService.disableESI:", err);
      throw err;
    }
  },

  // Fetch Professional Tax details
  getPT: async () => {
    try {
      const res = await axiosInstance.get(`${axiosInstance.baseURL2}api/payroll/statutory/professional-tax`);
      return res.data?.data || {};
    } catch (err) {
      console.error("Error in payrollService.getPT:", err);
      throw err;
    }
  },
};

export default payrollService;
