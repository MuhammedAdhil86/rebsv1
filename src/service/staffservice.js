import axiosInstance from "./axiosinstance";
import { getDepartment, getBranch, getDesignations,postShiftcreate } from "../api/api";

/* ================= STAFF ================= */

// Default – All users
export const getAllStaff = async () => {
  try {
    const res = await axiosInstance.get(
      `${axiosInstance.baseURL2}staff/get-by/filter`
    );

    console.log("API response:", res); // Debug: see full Axios response

    if (res && res.data && res.data.data) {
      return res.data.data; // array of users
    } else {
      console.warn("API returned unexpected structure:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching all staff:", error);
    return [];
  }
};


// Filtered users
export const filterStaff = async (params) => {
  try {
    const res = await axiosInstance.get(
      `${axiosInstance.baseURL2}staff/get-by/filter`,
      { params }
    );
    return res.data.data; // filtered users array
  } catch (error) {
    console.error("Error filtering staff:", error);
    return [];
  }
};

/* ================= DROPDOWNS ================= */

export const getDepartmentData = async () => {
  const res = await axiosInstance.get(getDepartment);
  return res.data.data;
};

export const getBranchData = async () => {
  const res = await axiosInstance.get(getBranch);
  return res.data.data;
};

export const getDesignationData = async () => {
  const res = await axiosInstance.get(getDesignations);
  return res.data.data;
};
 
export const createShift = async (shiftData) => {
  try {
    const res = await axiosInstance.post(postShiftcreate, shiftData);
    console.log("Shift creation response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating shift:", error);
    throw error; // so the caller knows it failed
  }
};