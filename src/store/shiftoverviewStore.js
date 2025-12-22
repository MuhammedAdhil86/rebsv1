import { create } from "zustand";
import axiosInstance from "../service/axiosinstance";

const useShiftDashboardStore = create((set) => ({
  loading: false,

  // ---------- Dropdown ----------
  availableShifts: [],

  // ---------- Selected ----------
  selectedShiftName: "",

  // ---------- Dashboard Data ----------
  stats: {},
  shiftDetails: [],
  policyDetails: null,
  shiftRules: null,

  /* ---------- Fetch default dashboard ---------- */
  fetchDashboard: async () => {
    set({ loading: true });

    const res = await axiosInstance.get("/shifts/dashboard/stats");
    const data = res.data.data;

    set({
      availableShifts: data.shift_details.map((s) => s.shift_name),
      selectedShiftName: data.shift_details?.[0]?.shift_name,
      stats: {
        totalEmployees: data.total_employees,
        totalShifts: data.total_shifts,
        unallocatedShifts: data.unallocated_shifts,
      },
      shiftDetails: data.shift_details,
      policyDetails: data.policy_details,
      shiftRules: data.shift_rules,
      loading: false,
    });
  },

  /* ---------- Change shift ---------- */
  changeShift: async (shiftName) => {
    set({ loading: true, selectedShiftName: shiftName });

    const res = await axiosInstance.get(
      "/shifts/dashboard/stats",
      { params: { shift_name: shiftName } }
    );

    const data = res.data.data;

    set({
      stats: {
        totalEmployees: data.total_employees,
        totalShifts: data.total_shifts,
        unallocatedShifts: data.unallocated_shifts,
      },
      shiftDetails: data.shift_details,
      policyDetails: data.policy_details,
      shiftRules: data.shift_rules,
      loading: false,
    });
  },
}));

export default useShiftDashboardStore;
