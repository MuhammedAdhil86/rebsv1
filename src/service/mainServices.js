import axiosInstance from "./axiosinstance";
import {
  getCategory,
  getEmailPurposes,
  getEmailPlaceholders,
  postCreateEmailTemplate,
  getEmailTemplates,
  updateEmailTemplate
} from "../api/api";

// -------------------- BASE URL 2 for email APIs --------------------
axiosInstance.baseURL2 = "https://blank-exclude-venues-finds.trycloudflare.com/";

/**
 * Helper: log only in development
 */
const devLog = (...args) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

// -------------------- General API Calls (use default baseURL) --------------------
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

// -------------------- Email API Calls (use baseURL2) --------------------
export const fetchEmailPurposes = async () => {
  try {
    const response = await axiosInstance.get(`${axiosInstance.baseURL2}${getEmailPurposes}`);
    devLog("Email Purposes Response:", response);
    return response?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching email purposes:", error?.response?.data || error?.message);
    return []; // Return empty array instead of throwing to prevent modal crash
  }
};

export const fetchEmailPlaceholders = async () => {
  try {
    const response = await axiosInstance.get(`${axiosInstance.baseURL2}${getEmailPlaceholders}`);
    devLog("Email Placeholders Response:", response);
    return response?.data?.data ?? [];
  } catch (error) {
    console.error("Error fetching placeholders:", error?.response?.data || error?.message);
    return []; // Return empty array to prevent crash
  }
};

export const createEmailTemplate = async ({ name, purpose, subject, body_html }) => {
  try {
    const payload = { name, purpose, subject, body_html };
    const response = await axiosInstance.post(
      `${axiosInstance.baseURL2}${postCreateEmailTemplate}`,
      payload
    );
    devLog("Create Email Template Response:", response);
    return response?.data;
  } catch (error) {
    console.error("Error creating email template:", error?.response?.data || error?.message);
    throw error;
  }
};

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
      error?.response?.data ||
      error?.message ||
      "Failed to fetch email templates";
    console.error("fetchEmailTemplates error:", { url, error: errorMessage });
    throw new Error(errorMessage);
  }
};

export const updateEmailTemplateService = async ({ purpose, name, subject, body_html }) => {
  if (!purpose) {
    throw new Error("Purpose is required to update the template");
  }

  let url = ""; // ✅ declare outside try so catch can access it

  try {
    url = `${axiosInstance.baseURL2}${updateEmailTemplate.replace("{purpose}", purpose)}`;

    const payload = { name, subject, body_html };

    const response = await axiosInstance.put(url, payload);

    devLog("Update Email Template Response:", response);

    return response?.data || {};
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to update email template";

    console.error("updateEmailTemplateService error:", { url, error: errorMessage });

    throw new Error(errorMessage);
  }
};
