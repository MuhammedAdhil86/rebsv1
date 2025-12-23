import React, { useEffect, useState, useRef } from "react";
import { DropdownMenuIcon } from "@radix-ui/react-icons";
import useShiftDashboardStore from "../../../store/shiftoverviewStore";

const DEFAULT_VISIBLE = 4;

const ShiftCard = ({ className }) => {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { shiftDetails, selectedShiftName, changeShift } =
    useShiftDashboardStore();

  const selectedShift = shiftDetails.find(
    (s) => s.shift_name === selectedShiftName
  );

  const peopleList = selectedShift?.users || [];

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visiblePeople = showAll
    ? peopleList
    : peopleList.slice(0, DEFAULT_VISIBLE);

  const PersonRow = ({ person }) => (
    <div className="flex items-center justify-between py-1 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <img
          src={
            person.image ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt={person.full_name}
          className="w-7 h-7 rounded-full object-cover"
        />
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-gray-800 truncate">
            {person.full_name}
          </div>
          <div className="text-[10px] text-gray-500 truncate">
            {person.designation || "-"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`bg-white rounded-xl p-3 shadow-sm w-full h-[360px] flex flex-col ${className}`}
    >
      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-start mb-2">
        <div
          ref={dropdownRef}
          className="relative flex items-center gap-1 text-[14px] text-gray-800 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {selectedShiftName || "Select Shift"}
          <DropdownMenuIcon className="w-5 h-5 text-gray-500" />

          {open && (
            <div className="absolute top-7 left-0 w-52 bg-white border rounded-lg shadow-lg z-[9999]">
              {shiftDetails.map((shift) => (
                <div
                  key={shift.shift_name}
                  onClick={() => {
                    changeShift(shift.shift_name);
                    setShowAll(false);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                    selectedShiftName === shift.shift_name
                      ? "bg-gray-50 font-medium"
                      : ""
                  }`}
                >
                  {shift.shift_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-green-100 text-green-600 rounded-full px-3 py-1 text-xs font-medium">
          {peopleList.length} Staffs
        </div>
      </div>

      {/* ---------------- PEOPLE LIST (SCROLL ONLY) ---------------- */}
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {visiblePeople.map((p, index) => (
          <PersonRow key={index} person={p} />
        ))}
      </div>

      {/* ---------------- FOOTER ---------------- */}
      {peopleList.length > DEFAULT_VISIBLE && (
        <div className="mt-2 text-right">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            {showAll ? "Show less" : "View all people"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShiftCard;
