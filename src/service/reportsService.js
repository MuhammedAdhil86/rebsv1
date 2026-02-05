import axiosInstance from "./axiosinstance";
import { postPayrollAttendance } from "../api/api";

/**
 * Fetch payroll attendance from the API
 * @param {number} month - 1-based month number (1 = January)
 * @param {number} year - full year, e.g., 2026
 * @param {string} [leaveType] - optional, "Paid" or "Unpaid"
 * @param {string} [accrualMethod] - optional, "Yearly" or "Monthly"
 * @returns {Promise<Array>} Array of employee records
 */
export const fetchPayrollAttendance = async (month, year, leaveType, accrualMethod) => {
  try {
    // Validate inputs
    if (!month || !year) {
      throw new Error("Month and year are required and must be valid numbers.");
    }

    const payload = {
      month: Number(month),
      year: Number(year),
    };

    // Optional fields
    if (leaveType) payload.leave_type = leaveType.toLowerCase();
    if (accrualMethod) payload.accrual_method = accrualMethod.toLowerCase();

    console.log("Calling API:", postPayrollAttendance, "with payload:", payload);

    const response = await axiosInstance.post(postPayrollAttendance, payload);

    // Return employee records or empty array
    return response.data?.data?.employees ?? [];
  } catch (error) {
    console.error("Error fetching payroll attendance:", error.response || error.message || error);
    throw error;
  }
};
