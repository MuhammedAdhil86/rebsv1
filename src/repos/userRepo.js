import axios from "axios";
import {
  BASEURL,
  Login,
  AddUser,
  UpdateUser,
  GetLeads,
  BulkUpdateLead,
  GetAllStaffs,
  GetDepartments,
  GetDesignations,
  UploadBulkLeadApi,
  GetAllMetaLeads,
  GetAllDataCount,
  AddStudentApi,
  StaffwiseCallStatus,
  StaffWiseLeadCount,
  GetReportByStatusKey,
  GiveUpLead,
  studentProfileUpdate,
  NameUpdate,
  GetLeadInfoById,
  GetCallStatus,
  LeadCallUpdate,
  GetReportByFilterApi,
  GetAllSource,
  GetAllSourceInfo,
  GetAllCountry,
} from "../api/api";

const ApiServices = axios.create({
  baseURL: BASEURL,
});

// Helper function for all requests
const request = async (method, url, data = null, config = {}, requiresAuth = true) => {
  try {
    const headers = { ...config.headers };

    if (requiresAuth) {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await ApiServices.request({
      method,
      url,
      data,
      headers,
      ...config,
    });

    console.log("Backend Response:", response);

    // Update token if returned in headers
    const newToken = response.headers["authorization"];
    if (newToken) localStorage.setItem("authToken", newToken);

    if (response.status >= 200 && response.status < 300) return response.data;
    else throw new Error(`Server returned status ${response.status}`);
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};

// ========== API Functions ==========

// User login
export const UserLogin = async (requestData) => {
  console.log("Logging in with:", requestData);
  const response = await request("post", Login, requestData, {}, false); // <--- no token required
  localStorage.setItem("authToken", response.data.token);
  localStorage.setItem("userData", JSON.stringify(response.data));
  return response;
};

// Employee
export const CreateEmployee = async (requestData) => await request("post", AddUser, requestData);
export const UpdateEmployee = async (requestData) => await request("post", UpdateUser, requestData);

// Users / Leads
export const GetAllUsers = async () => await request("post", GetLeads, {});
export const UpdateLeadData = async (requestData) => await request("post", UpdateLead, requestData);
export const BulkUpdateLeadData = async (requestData) => await request("post", BulkUpdateLead, requestData);

// Staff / Dept / Designation
export const GetStaffs = async () => await request("post", GetAllStaffs, {});
export const GetDepartment = async () => await request("post", GetDepartments, {});
export const GetDesignation = async () => await request("post", GetDesignations, {});

// Upload Bulk Leads
export const UploadBulkData = async (formDataFile) =>
  await request("post", UploadBulkLeadApi, formDataFile, { headers: { "Content-Type": "multipart/form-data" } });

// Meta Leads
export const GetMetaLeads = async () => await request("post", GetAllMetaLeads, {});
export const GetLeadsCount = async () => await request("get", GetAllDataCount);

// Add User Lead
export const AddUserLead = async (requestData) => await request("post", AddStudentApi, requestData);

// Staff-wise reports
export const GetCallStatusByStaffId = async (requestData) => await request("post", StaffwiseCallStatus, requestData);
export const StaffWiseLeadsCount = async (staffId) => await request("get", `${StaffWiseLeadCount}${staffId}`);
export const GetReportByKey = async (requestData) => await request("post", GetReportByStatusKey, requestData);

// Student / Lead updates
export const UpdateStudentProfile = async (requestData) => await request("post", studentProfileUpdate, requestData);
export const GiveUpLeadData = async (requestData) => await request("post", GiveUpLead, requestData);
export const UpdateNameApiCall = async (requestData) => await request("post", NameUpdate, requestData);
export const GetLeadsById = async (leadId) => await request("get", `${GetLeadInfoById}${leadId}`);
export const GetCallStatusData = async () => await request("post", GetCallStatus, {});
export const UpdateLeadStatus = async (requestData) => await request("post", LeadCallUpdate, requestData);
export const GetReportByFilter = async (requestData) => await request("post", GetReportByFilterApi, requestData);

// Source / Country
export const GetSourceData = async () => await request("get", GetAllSource);
export const GetSourceInfoData = async () => await request("get", GetAllSourceInfo);
export const GetCountryData = async () => await request("get", GetAllCountry);
