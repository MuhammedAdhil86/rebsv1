import { create } from "zustand";
import {
  fetchEmailTemplates,
  fetchDefaultEmailTemplates, // ✅ new import
} from "../service/mainServices";

/**
 * Zustand store for fetching email templates
 */
const useEmailTemplateStore = create((set) => ({
  // -------------------------------
  // STATES
  // -------------------------------
  templates: [],
  defaultTemplates: [], // ✅ new state
  loading: false,
  error: null,

  // -------------------------------
  // FETCH ALL EMAIL TEMPLATES
  // -------------------------------
  loadTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchEmailTemplates();
      set({
        templates: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching email templates:", error);
      set({
        error: error.message || "Failed to fetch email templates",
        loading: false,
      });
    }
  },

  // -------------------------------
  // FETCH DEFAULT EMAIL TEMPLATES
  // -------------------------------
  loadDefaultTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDefaultEmailTemplates();
      set({
        defaultTemplates: Array.isArray(data) ? data : [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching default email templates:", error);
      set({
        error: error.message || "Failed to fetch default email templates",
        loading: false,
      });
    }
  },
}));

export default useEmailTemplateStore;
