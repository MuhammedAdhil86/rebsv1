import axiosInstance from "../service/axiosinstance";

// Fetch employees for a given date
export const fetchAllEmployees = async (activeDate) => {
  try {
    const response = await axiosInstance.get(`/admin/staffstatus/list?date=${activeDate}`);

    // Usually the array is inside response.data.data
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};
