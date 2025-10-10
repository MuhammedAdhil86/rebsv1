// Base URL
export const BASEURL = "https://rebs-hr-cwhyx.ondigitalocean.app/";

// Authentication
export const Login = "/staff/login";

// User Management
export const USERS = "/user/getall";
export const GetUser = "/user/getall";
export const AddUser = "/user/createstaff";
export const UpdateUser = "/user/updatestaff";

// Leads Management
export const GetLeads = "/user/getleads";
export const UpdateLead = "/user/updatelead";
export const BulkUpdateLead = "/user/bulkupdatelead";
export const UploadBulkLeadApi = "/leads/createbulkmetalead";
export const AddStudentApi = "/leads/addstudent";
export const GetAllDataCount = "/leads/getallmetaleadcount";
export const GetAllMetaLeads = "/leads/getallmetaleads";
export const GiveUpLead = "/leads/giveup";
export const studentProfileUpdate = "/leads/createprofile";
export const NameUpdate = "/leads/updatename";
export const GetLeadInfoById = "/leads/getleadinfo/";
export const GetCallStatus = "/leads/getcallstatus";
export const LeadCallUpdate = "/leads/callstatusupdate";

// Reports
export const StaffwiseCallStatus = "/reports/getstaffwisereport";
export const StaffWiseLeadCount = "/leads/staffwisecallcount/";
export const GetReportByStatusKey = "/reports/getbykey";
export const GetReportByFilterApi = "/reports/getbyfilter";

// Staff & Organization
export const GetAllStaffs = "/master/staff";
export const GetDepartments = "/user/getdept";
export const GetDesignations = "/user/getdesignation";
export const GetCountries = "/country/getall";

// Miscellaneous
export const GetAllSource = "/user/getallsource";
export const GetAllSourceInfo = "/user/getallsourceinfo";
export const GetAllCountry = "/user/getallcountry";
export const GetCallRecords = "/getcallrecords";

// Attendance / Logs
export const getLog = "/attendance/getlog"; // Required by logService.js
