import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Calendar, ChevronDown } from "lucide-react";
import axiosInstance from "../service/axiosinstance";
import toast from "react-hot-toast";
import ColorPicker from "./colorpicker";

const CreateShiftModal = ({ onClose, refreshData }) => {
  const [shiftName, setShiftName] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [shiftColour, setShiftColour] = useState("");
  const [isCrossShift, setIsCrossShift] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [allPolicies, setAllPolicies] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Fetch policies on mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axiosInstance.get("/attendance-policy/get");
        setAllPolicies(res.data.data || []);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Session expired. Please login again.";
        toast.error(errorMsg);
        if (err.response?.status === 401) {
          window.location.href = "/";
        }
      }
    };
    fetchPolicies();
  }, []);

  // Close dropdown if clicked outside
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
        : [...prev, policyId],
    );
  };

  const handleSubmit = async () => {
    // --- VALIDATION START ---
    if (!shiftName.trim()) {
      toast.error("Shift Name is required");
      return;
    }
    if (policies.length === 0) {
      toast.error("Please select at least one Attendance Policy");
      return;
    }
    if (!shiftCode.trim()) {
      toast.error("Shift Code is required");
      return;
    }
    if (!shiftColour) {
      toast.error("Please select a Shift Color");
      return;
    }
    // --- VALIDATION END ---

    const payload = {
      shift_name: shiftName,
      shift_code: shiftCode,
      shift_colour: shiftColour,
      is_cross_shift: isCrossShift,
      is_default: false,
      policies,
      remarks, // Remarks remains optional
    };

    try {
      setLoading(true);
      const response = await axiosInstance.post("/shifts/add", payload);

      // Dynamic Success Message from Backend
      toast.success(response.data?.message || "Shift created successfully!");

      if (refreshData) refreshData();
      onClose();

      // Reset form
      setShiftName("");
      setShiftCode("");
      setShiftColour("");
      setIsCrossShift(false);
      setPolicies([]);
      setRemarks("");
    } catch (err) {
      // Dynamic Error Message from Backend
      const errorMessage =
        err.response?.data?.message || "Error creating shift";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full h-11 px-3 bg-[#F4F6F8] border border-gray-200 rounded-xl text-[12px] text-[#797979] font-[Poppins] focus:outline-none focus:ring-1 focus:ring-gray-300 flex items-center";
  const labelStyle = "text-[12px] font-[Poppins] text-black mb-1 block";

  return (
    <div className="w-full min-h-screen bg-white p-2 font-[Poppins]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-[Poppins] font-medium"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#F4F6F8] rounded-lg border border-gray-100 p-1">
            <Calendar size={18} />
          </div>
          <h2 className="text-[16px] font-[Poppins] font-medium text-black">
            Create Shift
          </h2>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {/* Shift Name */}
        <div>
          <label className={labelStyle}>
            Shift Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter shift"
            className={inputStyle}
            value={shiftName}
            onChange={(e) => setShiftName(e.target.value)}
          />
        </div>

        {/* Attendance Policies */}
        <div ref={dropdownRef} className="relative">
          <label className={labelStyle}>
            Attendance Policies <span className="text-red-500">*</span>
          </label>
          <div
            className={`${inputStyle} justify-between cursor-pointer`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="truncate">
              {policies.length
                ? allPolicies
                    .filter((p) => policies.includes(p.id))
                    .map((p) => p.policy_name)
                    .join(", ")
                : "Select policies"}
            </span>
            <ChevronDown size={16} />
          </div>

          {dropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-52 overflow-auto text-[12px]">
              {allPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => togglePolicy(policy.id)}
                >
                  <input
                    type="checkbox"
                    checked={policies.includes(policy.id)}
                    readOnly
                    className="mr-2"
                  />
                  {policy.policy_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shift Code */}
        <div>
          <label className={labelStyle}>
            Shift Code <span className="text-red-500">*</span>
          </label>
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
          <label className={labelStyle}>
            Shift Color <span className="text-red-500">*</span>
          </label>
          <ColorPicker
            value={shiftColour}
            onChange={(color) => setShiftColour(color)}
          />
        </div>

        {/* Is Cross Shift */}
        <div className="relative">
          <label className={labelStyle}>Is Cross Shift?</label>
          <select
            className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
            value={isCrossShift}
            onChange={(e) => setIsCrossShift(e.target.value === "true")}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-[38px] text-gray-500 pointer-events-none"
          />
        </div>

        {/* Remarks */}
        <div className="col-span-2">
          <label className={labelStyle}>Remarks</label>
          <textarea
            className={`${inputStyle} h-24 resize-none py-2`}
            placeholder="Add any remarks for this shift"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-8 py-2 border border-gray-300 rounded-xl text-[12px] hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-10 py-2 bg-black text-white rounded-xl text-[12px] hover:bg-neutral-800"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CreateShiftModal;
