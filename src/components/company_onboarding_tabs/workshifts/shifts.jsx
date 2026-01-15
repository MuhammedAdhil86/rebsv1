import React, { useState } from "react";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import CreateShiftModal from "../../../ui/createshiftmodal";

const Shifts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shiftData = [
    { name: "Morning Shift", duration: "08:00:00 Hrs", start: "9:00AM", end: "9:00AM", staff: 2, break: "9:00AM - 1:00PM", reg: "4/month", policy: 2, status: "Active" },
    { name: "Regular Shift", duration: "12:00:00 Hrs", start: "10:00AM", end: "10:00AM", staff: 2, break: "9:00AM - 1:00PM", reg: "5/month", policy: 2, status: "Active" },
    { name: "Mumbai Shift", duration: "06:00:00 Hrs", start: "00:00AM", end: "00:00AM", staff: 2, break: "9:00AM - 1:00PM", reg: "8/month", policy: 2, status: "Expired" },
    { name: "Warehouse Shift", duration: "08:00:00 Hrs", start: "12:00PM", end: "12:00PM", staff: 2, break: "9:00AM - 1:00PM", reg: "8/month", policy: 2, status: "Expired" },
    { name: "Night Shift", duration: "08:00:00 Hrs", start: "05:00PM", end: "05:00PM", staff: 2, break: "9:00AM - 1:00PM", reg: "12/month", policy: 2, status: "Inactive" },
    { name: "Evening Shift", duration: "08:00:00 Hrs", start: "06:00AM", end: "06:00AM", staff: 4, break: "9:00AM - 1:00PM", reg: "10/month", policy: 4, status: "Inactive" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-500 border-green-100";
      case "Expired":
        return "bg-red-50 text-red-500 border-red-100";
      case "Inactive":
        return "bg-indigo-50 text-indigo-500 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] text-gray-800 font-medium">
          Available Shifts
        </h2>
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={14} /> Create Shift
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-gray-50">
              {[
                "Shift Name",
                "Duration",
                "Start time",
                "End Time",
                "Allocated Staffs",
                "Break Time",
                "Regularization Count",
                "Policy count",
                "Status",
              ].map((heading) => (
                <th key={heading} className="pb-3 px-2 text-[12px] font-normal text-gray-800">
                  {["Allocated Staffs", "Break Time", "Regularization Count", "Policy count", "Status"].includes(heading) ? (
                    <div className="text-center">{heading}</div>
                  ) : (
                    <div className="flex items-center gap-1.5">{heading} <SortIcon /></div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {shiftData.map((shift, index) => (
              <tr key={index} className="group">
                <td className="py-3 px-2 text-[12px] text-gray-700">{shift.name}</td>
                <td className="py-3 px-2 text-[12px] text-gray-500">{shift.duration}</td>
                <td className="py-3 px-2 text-[12px] text-gray-500">{shift.start}</td>
                <td className="py-3 px-2 text-[12px] text-gray-500">{shift.end}</td>
                <td className="py-3 px-2 text-[12px] text-gray-600 text-center">{shift.staff}</td>
                <td className="py-3 px-2 text-[12px] text-gray-600 text-center">{shift.break}</td>
                <td className="py-3 px-2 text-[12px] text-gray-600 text-center">{shift.reg}</td>
                <td className="py-3 px-2 text-[12px] text-gray-600 text-center">{shift.policy}</td>
                <td className="py-3 px-2 text-[12px] text-center">
                  <span className={`px-3 py-1 rounded-full border ${getStatusStyle(shift.status)}`}>
                    {shift.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Shift Modal */}
      <CreateShiftModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const SortIcon = () => (
  <div className="flex flex-col">
    <ChevronUp size={8} className="-mb-0.5 text-black" />
    <ChevronDown size={8} />
  </div>
);

export default Shifts;
