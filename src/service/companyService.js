import axiosInstance from "../service/axiosinstance";
import {
  getBranch,
  getDepartment,
  getDesignations,
  getCompanyDetails,
} from "../api/api";

export const getBranchData = async () => {
  try {
    const response = await axiosInstance.get(getBranch);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch details:", error);
    throw error;
  }
};

export const getDepartmentData = async () => {
  try {
    const response = await axiosInstance.get(getDepartment);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching department details:", error);
    throw error;
  }
};

export const getDesignationData = async () => {
  try {
    const response = await axiosInstance.get(getDesignations);
 
    return response.data.data;
  } catch (error) {
    console.error("Error fetching designations details:", error);
    throw error;
  }
};

export const getOrganisationDetails = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const companyId = userData?.company?.id;

    if (!companyId) throw new Error("Company ID not found in localStorage.");

    const response = await axiosInstance.get(getCompanyDetails(companyId));
    console.log("Company details response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};
