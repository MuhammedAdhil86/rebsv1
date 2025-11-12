import React, { useState, useEffect } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchDailyAttendance } from "../../service/employeeService"; // ✅ use from service

function DailyAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Fetch attendance data
  const fetchAttendanceData = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyAttendance(date);
      const transformed = data.map((item) => ({
        user_name: item.user_name || "N/A",
        designation: item.designation || "N/A",
        check: `${item.checkin || "N/A"} - ${item.checkout || "N/A"}`,
        device: item.device || "N/A",
        workingHours: item.working_hours || "0:00:00",
        status: item.status || "Absent",
        avatar: item.image || `https://i.pravatar.cc/40?u=${item.user_id}`,
      }));

      setAttendanceData(transformed);
      setFilteredData(transformed);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load attendance data");
      setAttendanceData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(attendanceData);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = attendanceData.filter(
        (item) =>
          item.user_name.toLowerCase().includes(lower) ||
          item.designation.toLowerCase().includes(lower) ||
          item.device.toLowerCase().includes(lower) ||
          item.status.toLowerCase().includes(lower)
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, attendanceData]);

  const getStatusColor = (status) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-600";
      case "Late":
        return "bg-blue-100 text-blue-600";
      case "Half Day":
        return "bg-purple-100 text-purple-600";
      case "Check In Missed":
        return "bg-red-100 text-red-600";
      case "Absent":
        return "bg-red-200 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <section className="bg-[#f9fafb] px-3 py-3 w-full max-w-[1280px] mx-auto rounded-xl font-[Poppins]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3">
        <h3 className="text-xl font-medium text-gray-800 tracking-wide">
          Daily Attendance
        </h3>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded-lg bg-white text-sm font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />

          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm flex-1 sm:flex-none shadow-sm">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-gray-700 w-full focus:outline-none text-sm bg-white"
            />
            <Search className="w-4 h-4 bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-white text-gray-700 uppercase text-[13.5px] font-normal">
              <tr>
                {[
                  "Name",
                  "Designation",
                  "Check in - out",
                  "Device",
                  "Working Hours",
                  "Status",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-center border-b border-gray-200 whitespace-nowrap font-normal"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500 text-[13px]"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <td className="px-6 py-3 flex items-center gap-3 text-[12px] text-gray-800 text-left">
                      <img
                        src={row.avatar}
                        alt={row.user_name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <span className="font-medium">{row.user_name}</span>
                    </td>
                    <td className="px-6 py-3 text-[12px] text-gray-700 text-center">
                      {row.designation}
                    </td>
                    <td className="px-6 py-3 text-[12px] text-gray-700 text-center">
                      {row.check}
                    </td>
                    <td className="px-6 py-3 text-[12px] text-gray-700 text-center">
                      {row.device}
                    </td>
                    <td className="px-6 py-3 text-[12px] text-gray-700 text-center">
                      {row.workingHours}
                    </td>
                    <td className="px-6 py-3 text-[12px] text-gray-700 text-center">
                      <span
                        className={`inline-block w-[85px] text-center px-2 py-1 rounded-full text-[11.5px] font-medium ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* ✅ Pagination Row Inside Table */}
            {filteredData.length > itemsPerPage && (
              <tfoot>
                <tr>
                  <td colSpan="6" className="px-6 py-3 text-right border-t">
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </button>

                      <span className="text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </section>
  );
}

export default DailyAttendance;
