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
  export const fetchBarAttendance = async () => {
    const response = await axiosInstance.get("/admin/staff/getattendancestatus");
    console.log("hai",response);
    
    return response.data;
};


export const fetchMusterRoll = async (month, year, user_id) => {
  try {
    const response = await axiosInstance.get(
      `/admin/staff/workhours/${month}/${year}`
    );
    console.log("muster roll response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Employee Calendar:", error.message);
    throw error;
  }
};

export const deleteEmployee = async (id, reason) => {
  try {
    const url = employeeDelete.replace(":id", id);
    console.log("id is", id, "reason is", reason);

    const response = await axiosInstance.delete(url, {
      data: { reason },
    });
    console.log("Deleted employee response:", response);

    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
