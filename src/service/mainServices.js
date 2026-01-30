import axiosInstance from "./axiosinstance";
import {
  getCategory,
  getEmailPurposes,
  getEmailPlaceholders,
  postCreateEmailTemplate,
  getEmailTemplates,
  updateEmailTemplate,
  uploadEmailTemplateFile,
  getDefulatEmailTemplate,
  postCloneEmailTemplate
} from "../api/api";

// -------------------- BASE URL 2 for email APIs --------------------
axiosInstance.baseURL2 =
  "https://organization-wonderful-net-buyers.trycloudflare.com/";

/**
 * Helper: log only in development
 */
const devLog = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

// -------------------- General API Calls --------------------
export const fetchCategory = async () => {
  try {
    const response = await axiosInstance.get(getCategory);
    devLog("Category Response:", response);
    return response?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching category:", error?.response?.data || error?.message);
    throw error;
  }
};

export const fetchAttachments = async (uuid) => {
  try {
    const endpoint = `/staff/admin/document/get/${uuid}`;
    const response = await axiosInstance.get(endpoint);
    devLog("Attachments Response:", response);
    return response?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching attachments:", error?.response?.data || error?.message);
    throw error;
  }
};

export const attachmentUpload = async (employeeUUID, attachmentData) => {
  try {
    const endpoint = `/staff/admin/document/upload/${employeeUUID}`;
    const response = await axiosInstance.post(endpoint, attachmentData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    devLog("Upload Response:", response);
    return response?.data;
  } catch (error) {
    console.error("Error adding attachment:", error?.response?.data || error?.message);
    throw error;
  }
};

// -------------------- Email API Calls --------------------
export const fetchEmailPurposes = async () => {
  try {
    const response = await axiosInstance.get(
      `${axiosInstance.baseURL2}${getEmailPurposes}`
    );

    devLog("Email Purposes Response:", response);
    return response?.data?.data ?? [];
  } catch (error) {
    console.error(
      "Error fetching email purposes:",
      error?.response?.data || error?.message
    );
    return [];
  }
};

export const fetchEmailPlaceholders = async () => {
  try {
    const response = await axiosInstance.get(
      `${axiosInstance.baseURL2}${getEmailPlaceholders}`
    );

    devLog("Email Placeholders Response:", response);

    const rawData = response?.data?.data ?? [];

    // Map for dropdown usage
    return rawData.map((item) => ({
      label: item.placeholder,
      placeholder: item.placeholder,
    }));
  } catch (error) {
    console.error(
      "Error fetching placeholders:",
      error?.response?.data || error?.message
    );
    return [];
  }
};

// -------------------- CREATE EMAIL TEMPLATE --------------------
export const createEmailTemplate = async ({
  name,
  purpose,
  subject,
  body_html,
  is_manual,
}) => {
  try {
    const payload = {
      name,
      subject,
      body_html,
      is_manual: Boolean(is_manual),
    };

    // only send purpose if provided
    if (purpose) {
      payload.purpose = purpose;
    }

    devLog("Create Email Template Payload:", payload);

    const response = await axiosInstance.post(
      `${axiosInstance.baseURL2}${postCreateEmailTemplate}`,
      payload
    );

    devLog("Create Email Template Response:", response);

    return response?.data;
  } catch (error) {
    console.error(
      "Error creating email template:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

// -------------------- FETCH EMAIL TEMPLATES --------------------
export const fetchEmailTemplates = async () => {
  const url = `${axiosInstance.baseURL2}${getEmailTemplates}`;

  try {
    const response = await axiosInstance.get(url);
    devLog("Email Templates API Response:", response);

    const data = response?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch email templates";

    console.error("fetchEmailTemplates error:", { url, error: errorMessage });
    throw new Error(errorMessage);
  }
};

// -------------------- UPDATE EMAIL TEMPLATE --------------------
export const updateEmailTemplateService = async ({
  purpose,
  name,
  subject,
  body_html,
}) => {
  if (!purpose) {
    throw new Error("Purpose is required to update the template");
  }

  let url = "";

  try {
    url = `${axiosInstance.baseURL2}${updateEmailTemplate.replace(
      "{purpose}",
      purpose
    )}`;

    const payload = { name, subject, body_html };

    const response = await axiosInstance.put(url, payload);

    devLog("Update Email Template Response:", response);

    return response?.data || {};
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update email template";

    console.error("updateEmailTemplateService error:", { url, error: errorMessage });

    throw new Error(errorMessage);
  }
};


// -------------------- UPLOAD EMAIL TEMPLATE FILE --------------------
export const uploadEmailTemplateFileService = async (fileData) => {
  try {
    const formData = new FormData();
    Object.keys(fileData).forEach((key) => formData.append(key, fileData[key]));

    const response = await axiosInstance.post(
      `${axiosInstance.baseURL2}${uploadEmailTemplateFile}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    devLog("Upload Email Template Response:", response);
    return response?.data;
  } catch (error) {
    console.error(
      "Error uploading email template file:",
      error?.response?.data || error?.message
    );
    throw error;
  }
};

export const fetchDefaultEmailTemplates = async () => {
  const url = `${axiosInstance.baseURL2}${getDefulatEmailTemplate}`;

  try {
    const response = await axiosInstance.get(url);
    devLog("Default Email Templates:", response);

    const data = response?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch default email templates"
    );
  }
};
export const cloneDefaultEmailTemplate = async (default_template_id) => {
  try {
    const payload = { default_template_id };
    devLog("Clone Default Template Payload:", payload);

    const response = await axiosInstance.post(
      `${axiosInstance.baseURL2}${postCloneEmailTemplate}`,
      payload
    );

    devLog("Clone Default Template Response:", response);
    return response?.data;
  } catch (error) {
    console.error("Error cloning default template:", error?.response?.data || error?.message);
    throw error;
  }
};
