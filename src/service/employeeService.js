// employeeService.js

import { getEmployeeDetails } from "../api/api"; // API endpoint
import axiosInstance from "../service/axiosinstance";

// Fetch staff details
export const getStaffDetails = async () => {
  try {
    const response = await axiosInstance.get(getEmployeeDetails);
    console.log("Staff details response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching staff details:", error);
    throw error;
  }
};
