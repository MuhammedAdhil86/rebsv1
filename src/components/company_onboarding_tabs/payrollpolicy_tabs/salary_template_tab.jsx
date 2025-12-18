// SalaryTemplate.jsx
import React, { useEffect, useState } from "react";
import payrollService from "../../../service/payrollService";

export default function SalaryTemplate() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await payrollService.getSalaryTemplates();

        // --- PRODUCTION API RESPONSE NORMALIZATION ---
        const rawItems =
          response?.data?.items ||
          response?.data?.data?.items ||
          response?.items ||
          response ||
          [];

        if (!Array.isArray(rawItems)) {
          console.error("Unexpected API response:", response);
          throw new Error("Invalid API format");
        }

        // --- PRODUCTION NORMALIZATION & TRANSFORMATION ---
        const formatted = rawItems
          .map((item, index) => ({
            id: item.id ?? index, // fallback key
            name: item.name || "-",
            description: item.description || "-",
            annualCTC: `₹${Number(item.annual_ctc || 0).toLocaleString()}`,
            status:
              String(item.status).toLowerCase() === "active" ||
              item.status === true ||
              item.status === 1
                ? "Active"
                : "Inactive",
          }))
          .filter((item) => {
            if (filterStatus === "all") return true;
            return item.status.toLowerCase() === filterStatus;
          });

        if (isMounted) setTableData(formatted);
      } catch (err) {
        console.error("Error loading salary templates:", err);
        if (isMounted) {
          setTableData([]);
          setError("Failed to load salary templates. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTemplates();

    return () => {
      isMounted = false;
    };
  }, [filterStatus]);

  return (
    <div className="overflow-x-auto p-4">
      {/* FILTER SECTION */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm">Status Filter:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border text-sm px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-sm font-normal">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 font-medium text-gray-600">Template Name</th>
            <th className="px-4 py-2 font-medium text-gray-600">Description</th>
            <th className="px-4 py-2 font-medium text-gray-600">Annual CTC</th>
            <th className="px-4 py-2 font-medium text-gray-600">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-red-600">
                {error}
              </td>
            </tr>
          ) : tableData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No templates found
              </td>
            </tr>
          ) : (
            tableData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 text-gray-800">{item.name}</td>
                <td className="px-4 py-2 text-gray-600">{item.description}</td>
                <td className="px-4 py-2 text-gray-800">{item.annualCTC}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      item.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
