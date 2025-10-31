//leaveService

export const getLeave = "/admin/leave/get"
export const AddUser = "/user/createstaff"
//AnnouncementService

export const postAnnouncement = "/admin/announcement/add"
export const Login = "/staff/login"
//Employeelist

export const getTotalEmployee = "/admin/staffstatus/list"
export const putStatusUpdate = "/admin/attendance/status/update"

//leaveapproval

export const putLeaveApproval = "/admin/leave/change-status/:leave_id"

//staffstatus

export const getDashboard = "/admin/dashboard/list"

//LOG

export const getLog = "/admin/stafflog/list"

//GetDepartment 

export const getDept = "/user/getdept"

//GetStaffs

export const getStaff = "/master/staff"

//manageEmployee
export const getEmployeeDetails = "/staff/get"

//assetManager

export const getAssets = "/master/asset-type"
export const getAssetDashboard = "/admin/asset/dashboard"
export const postCreateAsset = "/admin/asset/add"
export const getAssetType = "/master/asset-type"
export const getAssetAllocatebyId =(id)=> `/admin/assetallocation/timeline/get/${id}`
export const postAssetAllocation = "/admin/assetallocation/add"
export const postReturnAsset = "/admin/assetallocation/return"
export const addAssetType = "/admin/asset-type/add"

//report

export const getReport = "/admin/staffreport/:month"
export const getReportIndia = "/admin/staff/fullreport"

//Events and Leave Calendar

export const getLeavebyDate = "/admin/leave/getbydate"
export const getEventbyDate = "/admin/event/getbydate"
export const getEvents = "/admin/event/get"
export const postEvents = "/admin/event/add"
export const getTimezone = "/master/timezone"
export const deleteEvent = "/admin/event/delete/:id"
export const cancelEvent = "/admin/event/cancel/:id"

//Digital Assets

export const getDigitalDashboard = "/admin/digital-asset/dashboard"
export const getDigitalAsset = "/admin/digital-asset/get"
export const postCreateDigitalAsset = "/admin/digital-asset/add"
export const getAccountType = "/master/account-type"
export const getAuthenticator = "/master/authenticators"
export const postAllocateDigital = "/admin/digital-assetallocation/add"
export const getDigitalAssetById =(id)=> `/admin/digital-assetallocation/timeline/get/${id}`
export const postReturnDigital = "/admin/digital-assetallocation/return"

//Company Onboarding

export const getCompanyDetails =(id)=> `/company/get/${id}`
export const updateCompanyDet = "/company/update"
export const getOrgType ="/admin/organization-type/get"
export const getCountry = "/master/country"

//Company Structure

export const getBranch = "/branch/get"
export const postBranch = "/branch/add"
export const postDivision =(id)=> `/division/add/${id}`
export const postDepartment = "/admin/department/add"
export const postDesignation = "/admin/designation/add"
export const getDepartment = "/admin/department/get"
export const deleteDepartment = "/admin/department/delete/:id"

//Timeline api

export const getwithDivision = "/branch/getwithdivision"
export const getDesignations = "/admin/designation/get"
export const deleteDesignation = "/admin/designation/delete/:id"

// Organisational Policy

export const postAddAllowance = "/allowance/add"
export const getAllowanceData = "/allowance/get"
export const postAddCompliance = "/compliance/add"
export const getCompliances = "/compliance/get"
export const postCreatePolicy = "/attendance-policy/add"
export const getPolicies = "/attendance-policy/get"
export const getLeavePolicy = "/leave-policy/get"
export const getRoles = "/master/role"
export const deletePolicy = "/attendance-policy/delete/:id"
export const getCompanyPreview = "/company/get"

// Holiday

export const getHoliday = "/admin/holiday/get/default"
export const postAddHoliday = "/admin/holiday/add"
export const postAddCSV = "/admin/holiday/addcsv"

//Leave Policy

export const postLeavePolicy = "/leave-policy/add"
export const getApplicabilityCat = "/admin/applicability-category/get"
export const getGender = "/admin/gender/get" 
export const getMaritalStatus = "/admin/marital-status/get"
export const getEmploymentType = "/admin/applicability-category/get"
export const getClubbingPolicy = "/master/leavetype"


//Week Off

export const postAddWeekOff = "/admin/weekly-off/add"

//Employee Onboard 

export const postBasicInformation = "/staff/add"
export const postAddBankInformation = "/staff/addbankinfo"
export const updateWorkInformation = "/staff/updateworkinfo"
export const updateHierarchyInfo = "/staff/updatehierarchyinfo"
export const updatePersonalInfo = "/staff/updatepersonalinfo"
export const updateIDInfo = "/staff/updateidinfo"
export const updateContactInfo = "/staff/updatecontactinfo"
export const updateWorkExperience = "/staff/addworkexperience"
export const updateEducationalDetails = "/staff/addeducation"
export const updateDependantDetails = "/staff/updatedependantinfo"
export const updateAdditionalInformation = "/staff/addadditionalinfo"
export const getAllDetailsStaff = "/staff/get"
export const putUserActivation = "/staff/toggle-activate"
export const getWeekOff = "/admin/weekly-off/get/:year"

//Allocating Policies 
export const allocateLeavePolicy = "/leave-policy/allocate"
export const getPrivilegeLeavePolicy = "/leave-policy/allocated/get"
export const allocateAttendancePolicy = "/attendance-policy/allocate"
export const getAttendancePolicy = "/attendance-policy/allocated/get"
export const allocateAllowance = "/allowance/allocate"
export const getPrivilegeAllowance = "/allowance/allocated/get"
export const getPrivilegeCompliance = "/compliance/allocated/get"
export const allocateCompliance = "/compliance/allocate"
export const allocateRoles = "/staff/updateusertype"
export const editWorkHourPolicy = "/attendance-policy/update"


export const deleteLeavePolicy = "/leave-policy/delete/:id"
export const deleteAllowance = "/allowance/delete/:id"
export const deleteCompliance = "/compliance/delete/:id"
export const deleteBranch = "/branch/delete/:id"
export const deleteDivision = "/division/delete/:id"

export const postBulkUpload = "/staff/bulkupload"
export const AddStudentApi = "/leads/addstudent"
export const employeeDelete = "/staff/delete/:id"
export const getEmployeeType = "/master/employment-type"
export const getEmployeeStatus = "/master/employment-status"
export const companyPreview = "/company/preview/get"
export const getDepartmentTimeline = "/admin/department/heirarchy/get"

//Advance Salary
export const postCreateAdvanceSalary = "/advance-salary/add"
export const getAdvanceSalary = "/advance-salary/get"


//Travel

export const postAddTravel = "/travel/add"
export const getTravelData = "/travel/get"

//Salary policy

export const getSalaryPolicy = "/salary-policy/get"
export const postSalaryPolicy = "/salary-policy/add"
export const deleteSalaryPolicy = "/salary-policy/delete/:id"

//Reset Password

export const postResetPassword = "/staff/reset-password"

//Work from home
export const getWorkFromHome = "/admin/wfh/get"
export const updateStatus = "/admin/wfh/update"

//Exit Process
export const getTableData = "/exit-process/get"
export const updateQuestionnaire = "/exit-process/update/questionaire"
export const postSeparation = "/exit-process/update/initialstep"
export const getByIdSeparation = "/exit-process/get/:id"
export const updateCheckList = "/exit-process/update/checklist"

//Employee Calendar
export const getEmployeeCalendar = "/admin/staff/workhours/{month}"
export const postEmployeeCalendar = "/admin/attendance/listbymonth"

//File Upload for written Policy
export const writtenFileUpload = "/company/policy-document/add"

//Attachments
export const uploadAttachment = "/staff/admin/document/upload/{uuid}"
export const getCategory = "/admin/document-category/get"
export const getAttachments = "/staff/admin/document/get/{uuid}"

//Hiring
export const getPlatforms = "/admin/platform/get"
export const getVacancies = "/company/vaccancy/get"
export const addVacancies = "/company/vaccancy/add"

// Employee Basic Info
export const updateBasicInfo = (id) => `/staff/updatebasicinfo/${id}`;

// Employee Work Info
export const getWorkInformations = (id) => `/staff/workinfo/${id}`;
export const updateWorkInformations = (id) => `/staff/updateworkinfo/${id}`;


// Attendance
export const getDailyAttendance = "/admin/attendance/musterroll";

// Consolidated Data
export const getConsolidatedData = "/admin/staff/consolidated";
