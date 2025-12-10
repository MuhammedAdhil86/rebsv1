import React, { useEffect, useState } from "react";
import payrollService from "../../../service/payrollService";

const SalaryTemplate = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if unmounted

    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await payrollService.getSalaryTemplates(); // Centralized API

        const formatted = items.map((item) => ({
          name: item.name || "-",
          description: item.description || "-",
          annualCTC: `₹${Number(item.annual_ctc || 0).toLocaleString()}`,
          status:
            item.status?.toLowerCase() === "active" ? "Active" : "Inactive",
        }));

        if (isMounted) setTableData(formatted);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to load salary templates. Please try again.");
          setTableData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs font-normal">
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
            tableData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 text-gray-800">{item.name}</td>
                <td className="px-4 py-2 text-gray-600">{item.description}</td>
                <td className="px-4 py-2 text-gray-800">{item.annualCTC}</td>
                <td className="px-4 py-2">
                  <span
                    className={`font-medium ${
                      item.status === "Active" ? "text-green-600" : "text-red-600"
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
};

export default SalaryTemplate;
