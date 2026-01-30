import axiosInstance from "../service/axiosinstance";
import { postEmployeeListbyMonth } from "../api/api";

// existing
export const fetchAllEmployees = async (activeDate) => {
  try {
    const response = await axiosInstance.get(
      `/admin/staffstatus/list?date=${activeDate}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};


// ✅ NEW FUNCTION (uuid = user_id, month from date)
export const fetchEmployeeAttendanceByMonth = async (uuid, selectedDate) => {
  try {
    const month = new Date(selectedDate).getMonth() + 1;

    const body = {
      user_id: uuid,
      month: month.toString(),
    };

    const response = await axiosInstance.post(
      postEmployeeListbyMonth,
      body
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    return null;
  }
};
