import axiosInstance from "./axiosinstance";

/**
 * Service to handle attendance policy API calls
 */
const attendancePolicyService = {
  /**
   * Create a new attendance policy
   * @param {Object} policyData - The policy object from the form
   * @returns {Promise} - Axios promise
   */
  createPolicy: async (policyData) => {
    try {
      const response = await axiosInstance.post('attendance-policy/add', policyData);
      return response;
    } catch (error) {
      // Errors are already partially handled by your axiosInstance interceptors (like 401)
      throw error;
    }
  }
};

export default attendancePolicyService;