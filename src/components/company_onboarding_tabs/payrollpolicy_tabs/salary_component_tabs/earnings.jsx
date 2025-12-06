import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../service/axiosinstance";

const Earnings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${axiosInstance.baseURL2}api/payroll/components?company_id=8&limit=10&offset=0`;
        const res = await axiosInstance.get(url);
        const items = res.data?.data?.items || [];

        // Transform API response to match your existing UI fields
        const formatted = items.map((item) => ({
          template: item.payslip_name || "-",
          earningType: item.name || "-",
          calculationType:
            item.calculation_type === "percentage_ctc"
              ? `Fixed, ${item.value}% of CTC`
              : item.calculation_type === "flat_amount"
              ? `Fixed, Flat Amount of ${item.value}`
              : item.calculation_type || "-",
          epf: item.consider_epf ? "Yes" : "No",
          esi: item.consider_esi ? "Yes" : "No",
          status: item.active ? "Active" : "Inactive",
        }));

        console.log("API Raw Items:", items);
        console.log("Formatted Data:", formatted);
        setData(formatted);
      } catch (err) {
        console.error("Error loading payroll components", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12px] font-normal min-w-[700px]">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 font-medium text-gray-600 text-[12px] whitespace-nowrap">Template Name</th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[12px] whitespace-nowrap">Earning Type</th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[12px] whitespace-nowrap">Calculation Type</th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[12px] whitespace-nowrap">Consider for EPF</th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[12px] whitespace-nowrap">Consider for ESI</th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[12px] whitespace-nowrap">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-gray-800 text-[12px] whitespace-nowrap">{item.template}</td>
                <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">{item.earningType}</td>
                <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">{item.calculationType}</td>
                <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">{item.epf}</td>
                <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">{item.esi}</td>
                <td className="px-4 py-2 text-[12px] whitespace-nowrap">
                  <span className="text-green-600 font-medium">{item.status}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-[12px] text-gray-500 font-medium">
        <div>Rows per page: 10</div>
        <div className="flex items-center gap-2">
          <span>1–{data.length} of {data.length}</span>
          <button className="text-gray-400 hover:text-gray-600">{"<"}</button>
          <button className="text-gray-400 hover:text-gray-600">{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
