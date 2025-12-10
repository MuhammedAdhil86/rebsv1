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
};

export default payrollService;
