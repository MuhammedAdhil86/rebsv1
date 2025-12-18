import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../service/axiosinstance";

const Earnings = ({ onEdit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${axiosInstance.baseURL2}api/payroll/components?limit=10&offset=0`
      );

      const items = res.data?.data?.items || [];

      const formatted = items.map((item) => {
        let calculationText = "-";
        if (item.calculation_type === "percentage_ctc") {
          calculationText = `Fixed, ${item.value}% of CTC`;
        } else if (item.calculation_type === "percentage_basic") {
          calculationText = `Fixed, ${item.value}% of Basic`;
        } else if (item.calculation_type === "flat") {
          calculationText = `Fixed, Flat Amount of ${item.value}`;
        }

        return {
          id: item.id,
          template: item.payslip_name || "-",
          earningType: item.name || "-",
          calculationType: calculationText,
          epf: item.consider_epf ? "Yes" : "No",
          esi: item.consider_esi ? "Yes" : "No",
          status: item.active ? "Active" : "Inactive",
        };
      });

      setData(formatted);
    } catch (err) {
      console.error("Error loading payroll components:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12px] min-w-[700px]">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2">Template Name</th>
            <th className="px-4 py-2">Earning Type</th>
            <th className="px-4 py-2">Calculation Type</th>
            <th className="px-4 py-2">EPF</th>
            <th className="px-4 py-2">ESI</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No data found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onEdit(item.id)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-2">{item.template}</td>
                <td className="px-4 py-2">{item.earningType}</td>
                <td className="px-4 py-2">{item.calculationType}</td>
                <td className="px-4 py-2">{item.epf}</td>
                <td className="px-4 py-2">{item.esi}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      item.status === "Active"
                        ? "text-green-600"
                        : "text-red-600"
                    }
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

export default Earnings;
