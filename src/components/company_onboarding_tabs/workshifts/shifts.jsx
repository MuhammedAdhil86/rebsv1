import React, { useState, useEffect } from "react";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import CreateShiftModal from "../../../ui/createshiftmodal";
import { ShiftDataGet } from "../../../service/companyService"; // ✅ Import your API

const Shifts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shifts from API using getShifts
  useEffect(() => {
    const fetchShiftsData = async () => {
      try {
        const data = await ShiftDataGet(); // ✅ Use centralized API function

        // Map API data to table-friendly format
        const mappedData = data.map((shift) => ({
          name: shift.shift_name,
          duration: `${shift.policies[0]?.working_hours || 0} Hrs`,
          start: formatTime(shift.policies[0]?.start_time),
          end: formatTime(shift.policies[0]?.end_time),
          staff: shift.allocated_employees,
          break: shift.policies[0]?.lunch_break_from
            ? `${formatTime(shift.policies[0].lunch_break_from)} - ${formatTime(
                shift.policies[0].lunch_break_to
              )}`
            : "N/A",
          reg: `${shift.policies[0]?.regularisation_limit || 0}/${shift.policies[0]?.regularisation_type || ""}`,
          policy: shift.policy_count,
          status: shift.allocated_employees > 0 ? "Active" : "Inactive",
        }));

        setShiftData(mappedData);
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchShiftsData();
  }, []);

  // Format 24-hour time to 12-hour
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hour, minute] = timeStr.split(":");
    const hr = parseInt(hour, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHour = hr % 12 === 0 ? 12 : hr % 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[12px] text-gray-800 font-medium">Available Shifts</h2>
        <button
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-[12px] font-medium hover:bg-gray-800 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={14} /> Create Shift
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-[12px]">Loading shifts...</p>
        ) : error ? (
          <p className="text-red-500 text-[12px]">{error}</p>
        ) : (
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
                  <th
                    key={heading}
                    className="pb-3 px-2 text-[12px] font-normal text-gray-800"
                  >
                    {[
                      "Allocated Staffs",
                      "Break Time",
                      "Regularization Count",
                      "Policy count",
                      "Status",
                    ].includes(heading) ? (
                      <div className="text-center">{heading}</div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {heading} <SortIcon />
                      </div>
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
        )}
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
