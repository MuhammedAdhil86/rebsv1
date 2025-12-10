// service/payrollService.js
import axiosInstance from "./axiosinstance";

const payrollServices = {
  getSalariesTemplates: async () => {
    try {
      const url = "api/payroll/templates?status=active";
      const res = await axiosInstance.get(url, {
        baseURL: axiosInstance.baseURL2,  // make sure baseURL2 is correct (ngrok URL)
      });

      console.log("Salary Templates API Response:", res.data);
      return res.data?.data?.items || [];
    } catch (error) {
      console.error("Error fetching salary templates:", error);
      return [];
    }
  },
};

export default payrollServices;
