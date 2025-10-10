import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getLogEntriesForDate } from "../service/logService";

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchLogs = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLogEntriesForDate(date);
      setLogs(data);
    } catch (err) {
      setError(err.response?.data || err.message || "Unknown error");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate]);

  if (loading) return <p className="p-4">Loading logs...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {JSON.stringify(error)}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Staff Logs</h2>

      {/* Date picker */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>

      {/* Logs table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Device</th>
              <th className="px-4 py-2 border-b">Time</th>
              <th className="px-4 py-2 border-b">Location</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) =>
              log.attendance?.map((att) => (
                <tr key={att.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{att.id}</td>
                  <td className="px-4 py-2 border-b">{att.name}</td>
                  <td className="px-4 py-2 border-b">{att.role || "Employee"}</td>
                  <td className="px-4 py-2 border-b">{att.location_info?.device || "Unknown"}</td>
                  <td className="px-4 py-2 border-b">
                    {att.time ? new Date(att.time).toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-2 border-b">{att.location_info?.name || "Unknown"}</td>
                  <td className="px-4 py-2 border-b">{att.status === "IN" ? "Login" : "Logout"}</td>
                </tr>
              ))
            )}
            {logs.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No logs found for selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogPage;
