import axiosInstance from "./axiosinstance";
import { postPayrollAttendance } from "../api/api";

export const fetchPayrollAttendance = async (month, year) => {
  try {
    // debug check (optional)
    console.log("Calling API:", postPayrollAttendance);

    const response = await axiosInstance.post(postPayrollAttendance, {
      month: Number(month),
      year: Number(year),
    });

    return response.data?.data?.employees ?? [];
  } catch (error) {
    console.error("Error fetching payroll attendance:", error.response || error);
    throw error;
  }
};
