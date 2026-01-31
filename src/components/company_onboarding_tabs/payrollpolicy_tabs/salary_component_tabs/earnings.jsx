import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../service/axiosinstance";
import PayrollTable from "../../../../ui/payrolltable";

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
        "api/payroll/components?limit=10&offset=0"
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

      console.log("Formatted Data:", formatted); // ✅ console log added

      setData(formatted);
    } catch (err) {
      console.error("Error loading payroll components:", err.response || err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "template", label: "Template Name", align: "left" },
    { key: "earningType", label: "Earning Type", align: "left" },
    {
      key: "calculationType",
      label: "Calculation Type",
      align: "left",
      render: (value) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "300px" }}>
          {value}
        </div>
      ),
    },
    { key: "epf", label: "EPF", align: "center" },
    { key: "esi", label: "ESI", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => (
        <span
          className={
            value === "Active"
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <PayrollTable
          columns={columns}
          data={data}
          rowsPerPage={6}
          rowClickHandler={(row) => onEdit && onEdit(row.id)}
        />
      )}
    </div>
  );
};

export default Earnings;
