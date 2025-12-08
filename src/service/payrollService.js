// service/payrollService.js
import axiosInstance from "./axiosinstance";

const COMPANY_ID = 8; // Adjust as needed

const payrollService = {
  // EPF
  getEPF: async () => {
    const url = `api/payroll/statutory/epf?company_id=${COMPANY_ID}`;
    const response = await axiosInstance.get(url);
    return response.data?.data || null;
  },

  enableEPF: async () => {
    const url = `api/payroll/statutory/epf/${COMPANY_ID}/enable`;
    const response = await axiosInstance.post(url, { enabled: true });
    return response.data?.data || null;
  },

  disableEPF: async () => {
    const url = `api/payroll/statutory/epf/${COMPANY_ID}/disable`;
    const response = await axiosInstance.post(url, { enabled: false });
    return response.data?.data || null;
  },

  // ESI
  getESI: async () => {
    const url = `api/payroll/statutory/esi?company_id=${COMPANY_ID}`;
    const response = await axiosInstance.get(url);
    return response.data?.data || null;
  },

  enableESI: async () => {
    const url = `api/payroll/statutory/esi/${COMPANY_ID}/enable`;
    const response = await axiosInstance.post(url, { enabled: true });
    return response.data?.data || null;
  },

  disableESI: async () => {
    const url = `api/payroll/statutory/esi/${COMPANY_ID}/disable`;
    const response = await axiosInstance.post(url, { enabled: false });
    return response.data?.data || null;
  },

  // Professional Tax
  getProfessionalTax: async () => {
    const url = `api/payroll/statutory/professional-tax?company_id=${COMPANY_ID}`;
    const response = await axiosInstance.get(url);
    return response.data?.data || null;
  },
};

export default payrollService;
