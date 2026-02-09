import axiosInstance from "./axiosinstance";
import { postPayrollAttendance, getEmployeeBankInfo,getPayrollAnalyticsRun } from "../api/api";

/**
 * Fetch payroll attendance from the API
 */
export const fetchPayrollAttendance = async (month, year, leaveType, accrualMethod) => {
  try {
    if (!month || !year) {
      throw new Error("Month and year are required and must be valid numbers.");
    }

    const payload = {
      month: Number(month),
      year: Number(year),
    };

    if (leaveType) payload.leave_type = leaveType.toLowerCase();
    if (accrualMethod) payload.accrual_method = accrualMethod.toLowerCase();

    const response = await axiosInstance.post(postPayrollAttendance, payload);

    return response.data?.data?.employees ?? [];
  } catch (error) {
    console.error("Error fetching payroll attendance:", error.response || error.message || error);
    throw error;
  }
};


/**
 * Fetch employee bank info from API
 * @returns {Promise<Array>}
 */
export const fetchEmployeeBankInfo = async (userUuid) => {
  try {
    const response = await axiosInstance.get(getEmployeeBankInfo, {
      params: userUuid ? { user_uuid: userUuid } : {},
    });

    return response.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching employee bank info:", error);
    throw error;
  }
};
/**
 * Fetch payroll analytics
 * @param {number} month
 * @param {number} year
 * @returns {Promise<Array>}
 */
export const fetchPayrollAnalytics = async (month, year) => {
  try {
    if (!month || !year) {
      throw new Error("Month and year are required");
    }

    const response = await axiosInstance.get(getPayrollAnalyticsRun, {
      params: {
        month: Number(month),
        year: Number(year),
      },
    });

    return response.data?.data ?? [];
  } catch (error) {
    console.error(
      "Error fetching payroll analytics:",
      error.response || error.message || error
    );
    throw error;
  }
};