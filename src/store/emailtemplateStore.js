import { create } from "zustand";
import { fetchEmailTemplates } from "../service/mainServices";

/**
 * Zustand store for fetching email templates
 */
const useEmailTemplateStore = create((set) => ({
  // -------------------------------
  // STATES
  // -------------------------------
  templates: [],
  loading: false,
  error: null,

  // -------------------------------
  // FETCH EMAIL TEMPLATES
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
}));

export default useEmailTemplateStore;
