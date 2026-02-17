import axiosInstance from "./axiosinstance";
import { postAnnouncement, getDept, getStaff } from "../api/api"; // Import getStaff here

const announceService = {
  addAnnouncement: async (announcementData) => {
    try {
      console.log(
        "Data being sent to backend for announcement:",
        announcementData
      );

      const response = await axiosInstance.post(
        postAnnouncement,
        announcementData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Error adding announcement:", error);
      throw error;
    }
  },

  fetchDepartments: async () => {
    try {
      const response = await axiosInstance.post(getDept);

      console.log("Departments fetched:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }
  },

  fetchStaff: async () => {
    try {
      const response = await axiosInstance.get(getStaff);
      console.log("Staff fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
  },
};

export default announceService;
