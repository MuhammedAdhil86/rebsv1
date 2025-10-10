import { create } from "zustand";

const useEmployeeStore = create((set) => ({
  employees: [],
  selectedDay: new Date().toISOString().split("T")[0], // default today
  selectedEmployee: null,
  drawerOpen: false,
  refreshTrigger: 0,
  setEmployees: (data) => set({ employees: data }),
  setSelectedDay: (day) => set({ selectedDay: day }),
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));

export default useEmployeeStore;
