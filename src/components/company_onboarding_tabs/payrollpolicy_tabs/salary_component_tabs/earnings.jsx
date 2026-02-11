import React from "react";
import PayrollTable from "../../../../ui/payrolltable";

const Earnings = ({ data, onEdit }) => {
  const columns = [
    { key: "payslip_name", label: "Template Name", align: "left" },
    { key: "name", label: "Earning Type", align: "left" },
    {
      key: "calculation_type",
      label: "Calculation Type",
      align: "left",
      render: (value, row) => {
        let text = "-";
        if (value === "percentage_ctc") text = `Fixed, ${row.value}% of CTC`;
        else if (value === "percentage_basic")
          text = `Fixed, ${row.value}% of Basic`;
        else if (value === "flat") text = `Fixed, Flat Amount of ${row.value}`;
        return (
          <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: "300px",
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      key: "consider_epf",
      label: "EPF",
      align: "center",
      render: (v) => (v ? "Yes" : "No"),
    },
    {
      key: "consider_esi",
      label: "ESI",
      align: "center",
      render: (v) => (v ? "Yes" : "No"),
    },
    {
      key: "active",
      label: "Status",
      align: "center",
      render: (v) => (
        <span
          className={
            v ? "text-green-600 font-medium" : "text-red-600 font-medium"
          }
        >
          {v ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div>
      {data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No components found
        </div>
      ) : (
        <PayrollTable
          columns={columns}
          data={data}
          rowsPerPage={6}
          rowClickHandler={(row) => onEdit && onEdit(row)}
        />
      )}
    </div>
  );
};

export default Earnings;
