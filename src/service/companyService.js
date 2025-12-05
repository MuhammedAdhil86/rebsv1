import axiosInstance from "../service/axiosinstance";
import {
  getBranch,
  getDepartment,
  getDesignations,
  getCompanyDetails,
  allocateAttendancePolicy,
  getShifts,
  allocateLeavePolicy,
  allocateAllowance,
  allocateCompliance,
  getRoles,
  allocateRoles,
  getPolicies,
  getLeavePolicy,
  getAllowanceData,
  getCompliances,
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
export const allocateAttPolicy = async (uuid, attendanceData) => {
  try {
    const response = await axiosInstance.post(
      `${allocateAttendancePolicy}`,
      attendanceData
    );
    return response.data;
  } catch (error) {
    console.error("Error allocating attendance policy:", error);
    throw error;
  }
};

export const ShiftDataGet = async () => {
  try {
    const response = await axiosInstance.get(getShifts);
    console.log("shift details response:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching shift details:", error);
    throw error;
  }
};


export const getShiftPolicyById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/shifts/staff/get/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching attendance policy:", error);
    throw error;
  }
};


export const allocateLeaPolicy = async (uuid, policyData) => {
  try {
    const response = await axiosInstance.post(
      `${allocateLeavePolicy}/${uuid}`,
      policyData
    );
    return response.data;
  } catch (error) {
    console.error("Error allocating leave policy:", error);
    throw error;
  }
};


export const fetchPrivilegeLeavePolicy = async (employeeUuid) => {
  try {
    const response = await axiosInstance.get(
      `/leave-policy/allocated/get/${employeeUuid}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching leave policy:", error);
    throw error;
  }
};

export const fetchPrivilegeAllowance = async (employeeUuid) => {
  try {
    const response = await axiosInstance.get(`/allowance/allocated/get/${employeeUuid}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching allowance policy:", error);
    throw error;
  }
};


export const allocateAllowanceData = async (uuid, allowanceData) => {
  try {
    const response = await axiosInstance.post(
      `${allocateAllowance}/${uuid}`,
      allowanceData
    );
    return response.data;
  } catch (error) {
    console.error("Error allocating allowance policy:", error);
    throw error;
  }
};


export const fetchPrivilegeCompliance = async (employeeUuid) => {
  try {
    const response = await axiosInstance.get(`/compliance/allocated/get/${employeeUuid}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching compliance policy:", error);
    throw error;
  }
};


export const allocateComplianceData = async (uuid, complianceData) => {
  try {
    const response = await axiosInstance.post(
      `${allocateCompliance}/${uuid}`,
      complianceData
    );
    return response.data;
  } catch (error) {
    console.error("Error allocating Compliance policy:", error);
    throw error;
  }
};

export const fetchRoles = async () => {
  try {
    const response = await axiosInstance.get(getRoles);
    console.log("role details response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching roles details:", error);
    throw error;
  }
};

export const allocateRolesData = async (uuid, rolesData) => {
  try {
    const response = await axiosInstance.put(
      `${allocateRoles}/${uuid}`,
      rolesData
    );
    return response.data;
  } catch (error) {
    console.error("Error allocating Compliance policy:", error);
    throw error;
  }
};

export const fetchPolicyData = async () => {
  try {
    const response = await axiosInstance.get(getPolicies);
    console.log("policy details response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching policy details:", error);
    throw error;
  }
};


export const fetchLeavePolicy = async () => {
  try {
    const response = await axiosInstance.get(getLeavePolicy);
    console.log("leave details response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching leave details:", error);
    throw error;
  }
};


export const AllowanceDataGet = async () => {
  try {
    const response = await axiosInstance.get(getAllowanceData);
    console.log("allowance details response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching allowance details:", error);
    throw error;
  }
};

export const ComplianceDataGet = async () => {
  try {
    const response = await axiosInstance.get(getCompliances);
    console.log("compliance details response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching compliace details:", error);
    throw error;
  }
};

export const changeAttendanceReq = async (uuid, attendanceStatus) => {
  try {
    const response = await axiosInstance.put(`/staff/attendance-require/${uuid}`, attendanceStatus);
    return response.data;
  } catch (error) {
    console.error("Error updating attendance required status:", error);
    throw error;
  }
};

export const fetchEmployeeShift = async (user_id,month,year) => {
  try {
    const response = await axiosInstance.get(`/shift-policy/get/${user_id}/${month}/${year}`);
    console.log("employee shift details:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employee shift:", error);
    throw error;
  }
};


export const addShift = async (shiftData, user_id, start_date, end_date) => {
  try {
    // Pass start_date and end_date directly in the URL path
    const response = await axiosInstance.post(
      `/shift-policy/allocate/${user_id}/${start_date}/${end_date}`, 
      shiftData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding shift:", error);
    throw error;
  }
};


export const fetchTimeline = async (month, year, user_id) => {
  try {
    const response = await axiosInstance.get(`/admin/staff/activity/timeline/${month}/${year}/${user_id}`);
    console.log("timeline activity response:", response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching timeline activity:", error);
    throw error;
  }
};


export const fetchPieChart = async (month, year, user_id) => {
  try {
    const response = await axiosInstance.get(`/admin/staff/evaluation/${month}/${year}/${user_id}`);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching piechart activity:", error);
    throw error;
  }
};
