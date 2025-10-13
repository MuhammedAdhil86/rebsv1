import { create } from "zustand";
import { getStaffDetails } from "../service/employeeService";

const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  error: null,
  selectedEmployee: null,
  drawerOpen: false,
  refreshTrigger: 0,
  
  // ✅ Date selection state
  selectedDay: null,
  setSelectedDay: (day) => set({ selectedDay: day }),

  // ✅ Basic setters
  setSelectedEmployee: (emp) => set({ selectedEmployee: emp }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setEmployees: (emps) => set({ employees: emps }),
  triggerRefresh: () => set((s) => ({ refreshTrigger: s.refreshTrigger + 1 })),

  // ✅ Fetch employees from API
  fetchEmployees: async () => {
    try {
      set({ loading: true });
      const data = await getStaffDetails();
      set({ employees: data, loading: false });
    } catch (error) {
      console.error("Error fetching employee details:", error);
      set({ error, loading: false });
    }
  },
}));

export default useEmployeeStore;
