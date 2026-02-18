import axiosInstance from "./axiosinstance";

import { getpolicyLookup,updatePolicyStatus,getDifaultleavePolicy,postCloneLeavePolicy } from "../api/api";

const payrollService = {
  // ---------------- POLICY LOOKUPS ----------------
  /**
   * Fetches dropdown data for Leave Policy Applicability
   * @param {string} filterType - e.g., 'department_id', 'branch_id', 'designation_id', or 'gender'
   * @param {string} value - defaults to 'lookup'
   */
  getPolicyLookupData: async (filterType, value = "lookup") => {
    try {
      // Constructs: /staff/get-by/single-filter?department_id=lookup
      const res = await axiosInstance.get(`${getpolicyLookup}?${filterType}=${value}`);
      return res.data || [];
    } catch (err) {
      console.error(`Error in getPolicyLookupData (${filterType}):`, err.response || err);
      throw err;
    }
  },

  // ---------------- SALARY TEMPLATES ----------------
  getSalaryTemplates: async () => {
    try {
      const res = await axiosInstance.get("api/payroll/templates?status=active");
      console.log("Salary Templates API Response:", res);
      console.log("Salary Templates Items:", res.data?.data?.items);
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

  // ---------------- SALARY COMPONENTS ----------------
  createSalaryComponent: async (payload) => {
    try {
      const res = await axiosInstance.post("api/payroll/components", payload);
      console.log("Create Salary Component Response:", res);
      console.log("Create Salary Component Data:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error in createSalaryComponent:", err.response || err);
      throw err;
    }
  },

  // ---------------- LEAVE POLICY ----------------
  addLeavePolicy: async (payload) => {
    try {
      const res = await axiosInstance.post("/leave-policy/add", payload);
      console.log("Add Leave Policy Response:", res);
      console.log("Add Leave Policy Data:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error in addLeavePolicy:", err.response || err);
      throw err;
    }
  },

  updatePolicyStatus: async (id) => {
    try {
      const res = await axiosInstance.patch(
        `${updatePolicyStatus}/${id}`
      );

      console.log("Status Update Response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error in updatePolicyStatus:", err.response || err);
      throw err;
    }
  },

  getDefaultLeavePolicies: async () => {
    try {
      const res = await axiosInstance.get(getDifaultleavePolicy);
      console.log("Default Leave Policy Response:", res.data);
      // Adjust the return path based on your API structure (e.g., res.data?.data)
      return res.data?.data || res.data || [];
    } catch (err) {
      console.error("Error in getDefaultLeavePolicies:", err.response || err);
      throw err;
    }
  },
cloneLeavePolicy: async (ids) => {
    try {
      // The API expects: { "leave_policy_ids": [1, 2, 5] }
      const res = await axiosInstance.post(postCloneLeavePolicy, { 
        leave_policy_ids: ids 
      });
      
      return res.data;
    } catch (err) {
      console.error("Error in cloneLeavePolicy:", err.response || err);
      throw err;
    }
  },

};

export default payrollService;