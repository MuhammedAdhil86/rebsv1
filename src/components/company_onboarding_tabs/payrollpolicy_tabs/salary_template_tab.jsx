import React, { useEffect, useState } from "react";
import payrollService from "../../../service/payrollService";

const SalaryTemplate = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const items = await payrollService.getSalaryTemplates();

      const formatted = items.map((item) => ({
        name: item.name,
        description: item.description,
        annualCTC: `₹${Number(item.annual_ctc).toLocaleString()}`,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      }));

      setTableData(formatted);
    } catch (err) {
      console.error("Error fetching salary templates:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs font-normal">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">Template Name</th>
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">Description</th>
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">Annual CTC</th>
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">Loading...</td>
            </tr>
          ) : tableData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">No templates found</td>
            </tr>
          ) : (
            tableData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-gray-800">{item.name}</td>
                <td className="px-4 py-2 text-gray-600">{item.description}</td>
                <td className="px-4 py-2 text-gray-800">{item.annualCTC}</td>
                <td className="px-4 py-2">
                  <span className={`font-medium ${item.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination info */}
      <div className="flex justify-between items-center mt-4 text-[11px] text-gray-500 font-medium">
        <div>Rows per page: 10</div>
        <div className="flex items-center gap-2">
          <span>1–{tableData.length} of {tableData.length}</span>
          <button className="text-gray-400 hover:text-gray-600">{`<`}</button>
          <button className="text-gray-400 hover:text-gray-600">{`>`}</button>
        </div>
      </div>
    </div>
  );
};

export default SalaryTemplate;
