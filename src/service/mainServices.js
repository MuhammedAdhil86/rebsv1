import axiosInstance from "./axiosinstance";
import { getCategory } from "../api/api";

// ⭐ Fetch Categories
export const fetchCategory = async () => {
  try {
    const response = await axiosInstance.get(getCategory);
    console.log("Category Response:", response);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// ⭐ Fetch Attachments for Employee
export const fetchAttachments = async (uuid) => {
  try {
    const endpoint = `/staff/admin/document/get/${uuid}`;
    const response = await axiosInstance.get(endpoint);
    console.log("Attachments Response:", response);

    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching attachments:", error);
    throw error;
  }
};

// ⭐ Upload Attachment for Employee
export const attachmentUpload = async (employeeUUID, attachmentData) => {
  try {
    const endpoint = `/staff/admin/document/upload/${employeeUUID}`;

    const response = await axiosInstance.post(endpoint, attachmentData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error adding attachment:", error);
    throw error;
  }
};
