import React from "react";

const Earnings = () => {
  const data = [
    {
      template: "Basic",
      earningType: "Basic",
      calculationType: "Fixed, 50% of CTC",
      epf: "Yes",
      esi: "Yes",
      status: "Active",
    },
    {
      template: "House Rent Allowance",
      earningType: "House Rent Allowance",
      calculationType: "Fixed, 50% of CTC",
      epf: "No",
      esi: "Yes",
      status: "Active",
    },
    {
      template: "Conveyance Allowance",
      earningType: "Conveyance Allowance",
      calculationType: "Fixed, Flat Amount",
      epf: "No",
      esi: "Yes",
      status: "Active",
    },
    {
      template: "Fixed Allowance",
      earningType: "Fixed Allowance",
      calculationType: "Fixed, Flat Amount of 1600",
      epf: "No",
      esi: "Yes",
      status: "Active",
    },
    {
      template: "Transport Allowance",
      earningType: "Transport Allowance",
      calculationType: "Fixed, 50% of CTC",
      epf: "Yes",
      esi: "Yes",
      status: "Active",
    },
    {
      template: "Hold Salary",
      earningType: "Hold Salary (Not Taxable)",
      calculationType: "Variable, Flat Amount",
      epf: "No",
      esi: "Yes",
      status: "Active",
    },
    {
      template: "Statutory Bonus",
      earningType: "Statutory Bonus",
      calculationType: "Variable, Flat Amount",
      epf: "Yes",
      esi: "Yes",
      status: "Active",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12px] font-normal min-w-[700px]">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 font-medium text-gray-600 text-[11px] whitespace-nowrap">
              Template Name
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[11px] whitespace-nowrap">
              Earning Type
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[11px] whitespace-nowrap">
              Calculation Type
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[11px] whitespace-nowrap">
              Consider for EPF
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[11px] whitespace-nowrap">
              Consider for ESI
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 text-[11px] whitespace-nowrap">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 text-gray-800 text-[12px] whitespace-nowrap">
                {item.template}
              </td>
              <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">
                {item.earningType}
              </td>
              <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">
                {item.calculationType}
              </td>
              <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">
                {item.epf}
              </td>
              <td className="px-4 py-2 text-gray-700 text-[12px] whitespace-nowrap">
                {item.esi}
              </td>
              <td className="px-4 py-2 text-[12px] whitespace-nowrap">
                <span className="text-green-600 font-medium">{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer pagination (mocked UI) */}
      <div className="flex justify-between items-center mt-4 text-[11px] text-gray-500 font-medium">
        <div>Rows per page: 10</div>
        <div className="flex items-center gap-2">
          <span>1–7 of 7</span>
          <button className="text-gray-400 hover:text-gray-600">{`<`}</button>
          <button className="text-gray-400 hover:text-gray-600">{`>`}</button>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
