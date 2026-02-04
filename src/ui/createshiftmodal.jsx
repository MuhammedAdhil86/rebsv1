import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import axiosInstance from "../service/axiosinstance";
import toast from "react-hot-toast";
import ColorPicker from "./colorpicker";

const CreateShiftModal = ({ isOpen, onClose }) => {
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

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axiosInstance.get("/attendance-policy/get");
        setAllPolicies(res.data.data || []);
      } catch (err) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/";
      }
    };
    fetchPolicies();
  }, []);

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
    const payload = {
      shift_name: shiftName,
      shift_code: shiftCode,
      shift_colour: shiftColour,
      is_cross_shift: isCrossShift,
      is_default: false,
      policies,
      remarks,
    };

    try {
      setLoading(true);
      await axiosInstance.post("/shifts/add", payload);
      toast.success("Shift created successfully!");
      onClose();

      setShiftName("");
      setShiftCode("");
      setShiftColour("");
      setIsCrossShift(false);
      setPolicies([]);
      setRemarks("");
    } catch (err) {
      toast.error("Error creating shift");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Unified styles
  const inputStyle =
    "w-full h-11 px-3 bg-[#F4F6F8] border border-gray-200 rounded-xl text-[12px] text-[#797979] font-[Poppins] focus:outline-none focus:ring-1 focus:ring-gray-300 flex items-center";

  const labelStyle = "text-[12px] font-[Poppins] text-black mb-1 block";

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-[Poppins]">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="bg-[#F4F6F8] rounded-lg border border-gray-100 p-1">
                  <Calendar size={18} />
                </div>
                <h2 className="text-[16px] font-medium text-black">
                  Create Shift
                </h2>
              </div>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-5">
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

              {/* Attendance Policies */}
              <div ref={dropdownRef} className="relative">
                <label className={labelStyle}>Attendance Policies</label>
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

                {/* Custom dropdown arrow */}
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
            <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-100">
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
        </div>
      )}
    </>
  );
};

export default CreateShiftModal;
