import { create } from "zustand";
import axiosInstance from "../service/axiosinstance";

const useLeaveStore = create((set, get) => ({
  // -------------------------------
  // STATES
  // -------------------------------
  leaves: [],
  employees: [],
  leaveTypes: [],
  loading: false,
  error: null,
  socket: null,

  // -------------------------------
  // FETCH LEAVES
  // -------------------------------
  fetchLeaves: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/leave/get");
      set({ leaves: response.data.data || [], loading: false });
    } catch (error) {
      console.error("Error fetching leaves:", error);
      set({ error: error.message, loading: false });
    }
  },

  // -------------------------------
  // FETCH EMPLOYEES
  // -------------------------------
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/master/staff");
      set({ employees: response.data.data || [], loading: false });
    } catch (error) {
      console.error("Error fetching employees:", error);
      set({ error: error.message, loading: false });
    }
  },

  // -------------------------------
  // FETCH LEAVE TYPES
  // -------------------------------
  fetchLeaveTypes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/master/leavetype");
      set({ leaveTypes: response.data.data || [], loading: false });
    } catch (error) {
      console.error("Error fetching leave types:", error);
      set({ error: error.message, loading: false });
    }
  },

  // -------------------------------
  // APPLY LEAVE (ADMIN)
  // -------------------------------
  applyLeaveAdmin: async (employeeId, leaveData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/admin/leave/apply?employeeId=${employeeId}`,
        leaveData
      );
      await get().fetchLeaves(); // refresh leave list
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error applying leave:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // -------------------------------
  // APPROVE / REJECT LEAVE
  // -------------------------------
  updateLeaveStatus: async (leaveId, status, remarks) => {
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));
      const updated_by = localUser?.id || "2";

      await axiosInstance.put(`/admin/leave/change-status/${leaveId}`, {
        status,
        updated_by,
        remarks,
      });

      // Update leave in state
      set((state) => ({
        ...state,
        leaves: state.leaves.map((l) =>
          l.leave_ref_no === leaveId ? { ...l, status, remarks } : l
        ),
      }));
    } catch (error) {
      console.error("Error updating leave status:", error);
      throw error; // propagate to UI
    }
  },

  // -------------------------------
  // WEBSOCKET CONNECTION
  // -------------------------------
  connectWebSocket: (token) => {
    if (get().socket) return; // prevent multiple connections

    const socket = new WebSocket(
      `wss://rebs-hr-cwhyx.ondigitalocean.app/ws?token=${encodeURIComponent(token)}`
    );

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      socket.send(JSON.stringify({ type: "greeting", content: "Hello server" }));
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (
          (msg.type === "apply_leave" || msg.type === "manager_leave_approval") &&
          msg.data
        ) {
          set((state) => {
            const exists = state.leaves.some(
              (req) => req.leave_ref_no === msg.data.leave_ref_no
            );

            if (!exists) {
              return { ...state, leaves: [msg.data, ...state.leaves] };
            }

            return {
              ...state,
              leaves: state.leaves.map((req) =>
                req.leave_ref_no === msg.data.leave_ref_no
                  ? { ...req, ...msg.data }
                  : req
              ),
            };
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket closed. Reconnecting in 2s...");
      setTimeout(() => get().connectWebSocket(token), 2000);
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);

    set({ socket });
  },
}));

export default useLeaveStore;
