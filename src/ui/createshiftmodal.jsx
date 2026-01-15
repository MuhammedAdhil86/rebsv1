import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import axiosInstance from "../service/axiosinstance";
import toast from "react-hot-toast"; // toast import

const CreateShiftModal = ({ isOpen, onClose }) => {
  // Form state
  const [shiftName, setShiftName] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [shiftColour, setShiftColour] = useState("#4CAF50");
  const [isCrossShift, setIsCrossShift] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch attendance policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axiosInstance.get("/attendance-policy/get");
        setAllPolicies(res.data.data || []);
      } catch (err) {
        console.error(
          "Error fetching attendance policies:",
          err.response?.data || err.message
        );
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          window.location.href = "/";
        }
      }
    };
    fetchPolicies();
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePolicy = (policyId) => {
    setPolicies((prev) =>
      prev.includes(policyId)
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId]
    );
  };

  const handleSubmit = async () => {
    const payload = {
      shift_name: shiftName,
      shift_code: shiftCode,
      shift_colour: shiftColour,
      is_cross_shift: isCrossShift,
      is_default: false,
      policies,
    };

    try {
      setLoading(true);
      const res = await axiosInstance.post("/shifts/add", payload);
      console.log("Shift created:", res.data);
      toast.success("Shift created successfully!");
      onClose();
      setShiftName("");
      setShiftCode("");
      setShiftColour("#4CAF50");
      setIsCrossShift(false);
      setPolicies([]);
    } catch (err) {
      console.error(
        "Error creating shift:",
        err.response?.data || err.message
      );
      toast.error("Error creating shift");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const inputStyle =
    "w-full px-4 py-3 bg-[#F4F6F8] border border-gray-200 rounded-xl text-sm text-[#797979] placeholder:text-[#797979] focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all";
  const labelStyle = "text-[13px] text-black mb-2 block";

  // ✅ Return modal without top-level conditional to avoid React warnings
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F4F6F8] rounded-lg text-black border border-gray-100">
                  <Calendar size={20} />
                </div>
                <h2 className="text-lg text-black tracking-tight">Create Shift</h2>
              </div>
              <button
                onClick={onClose}
                className="text-black hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-8 grid grid-cols-2 gap-x-10 gap-y-6">
              {/* Shift Name */}
              <div>
                <label className={labelStyle}>Shift Name</label>
                <input
                  type="text"
                  placeholder="Enter shift"
                  className={inputStyle}
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                />
              </div>

              {/* Attendance Policies Dropdown */}
              <div ref={dropdownRef} className="relative">
                <label className={labelStyle}>Attendance Policies</label>
                <div
                  className={`${inputStyle} flex items-center justify-between cursor-pointer`}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <span>
                    {policies.length
                      ? allPolicies
                          .filter((p) => policies.includes(p.id))
                          .map((p) => p.policy_name)
                          .join(", ")
                      : "Select policies"}
                  </span>
                  <ChevronDown size={18} />
                </div>

                {dropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-auto">
                    {allPolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => togglePolicy(policy.id)}
                      >
                        <input
                          type="checkbox"
                          checked={policies.includes(policy.id)}
                          readOnly
                          className="mr-2"
                        />
                        <span>{policy.policy_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shift Code */}
              <div>
                <label className={labelStyle}>Shift Code</label>
                <input
                  type="text"
                  placeholder="Shift Code (eg: NS)"
                  className={inputStyle}
                  value={shiftCode}
                  onChange={(e) => setShiftCode(e.target.value)}
                />
              </div>

              {/* Shift Color */}
              <div>
                <label className={labelStyle}>Shift Color</label>
                <input
                  type="color"
                  className={`${inputStyle} h-12 w-full p-1`}
                  value={shiftColour}
                  onChange={(e) => setShiftColour(e.target.value)}
                />
              </div>

              {/* Is Cross Shift */}
              <div>
                <label className={labelStyle}>Is Cross Shift?</label>
                <select
                  className={inputStyle}
                  value={isCrossShift}
                  onChange={(e) => setIsCrossShift(e.target.value === "true")}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 p-8 border-t border-gray-100 bg-white">
              <button
                onClick={onClose}
                className="px-10 py-3 border border-gray-300 rounded-xl text-sm text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-12 py-3 bg-black text-white rounded-xl text-sm hover:bg-neutral-800 transition-all shadow-sm"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateShiftModal;
