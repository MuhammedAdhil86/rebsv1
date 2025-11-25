import axiosInstance from "./axiosinstance";

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard/list");

    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;
