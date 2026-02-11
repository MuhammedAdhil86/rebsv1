import React from "react";
import PayrollTable from "../../../../ui/payrolltable";

const Earnings = ({ data, onEdit }) => {
  const columns = [
    {
      key: "name",
      label: "Component Name",
      align: "left",
      render: (value) => (
        <span className="font-poppins font-normal text-black">{value}</span>
      ),
    },
    {
      key: "payslip_name",
      label: "Payslip Name",
      align: "left",
      render: (value) => (
        <span className="font-poppins font-normal text-black">{value}</span>
      ),
    },
    {
      key: "calculation_type",
      label: "Calculation Type",
      align: "left",
      render: (value, row) => {
        let text = "-";
        // Logic using your specific keys and values
        if (value === "percentage_ctc") {
          text = ` ${row.value}% of CTC`;
        } else if (value === "percentage_basic") {
          text = ` ${row.value}% of Basic`;
        } else if (value === "flat") {
          text = ` Flat Amount of ${row.value}`;
        }

        return (
          <div className="max-w-[250px] break-words whitespace-normal font-poppins font-normal text-black">
            {text}
          </div>
        );
      },
    },
    {
      key: "consider_epf",
      label: "EPF",
      align: "center",
      render: (v) => (
        <span className="font-poppins font-normal text-black">
          {v ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "consider_esi",
      label: "ESI",
      align: "center",
      render: (v) => (
        <span className="font-poppins font-normal text-black">
          {v ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "active",
      label: "Status",
      align: "center",
      render: (v) => (
        <span
          className={`font-poppins font-normal ${
            v ? "text-green-600" : "text-red-600"
          }`}
        >
          {v ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full">
      {data.length === 0 ? (
        <div className="text-center py-16 font-poppins font-normal text-black bg-gray-50 rounded-lg">
          No payroll components found.
        </div>
      ) : (
        <PayrollTable
          columns={columns}
          data={data}
          rowsPerPage={10}
          rowClickHandler={(row) => onEdit && onEdit(row)}
        />
      )}
    </div>
  );
};

export default Earnings;
