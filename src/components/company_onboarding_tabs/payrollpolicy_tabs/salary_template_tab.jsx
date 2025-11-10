import React from "react";

const SalaryTemplate = () => {
  const tableData = [
    {
      name: "Regular",
      description: "35k",
      annualCTC: "₹6,00,000",
      status: "Active",
    },
    {
      name: "Standard Employee Package",
      description:
        "This salary structure includes basic earnings, allowances, and benefits for full-time employees.",
      annualCTC: "₹6,00,000",
      status: "Active",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs font-normal">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
              Template Name
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
              Description
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
              Annual CTC
            </th>
            <th className="px-4 py-2 font-medium text-gray-600 whitespace-nowrap">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2 text-gray-800">{item.name}</td>
              <td className="px-4 py-2 text-gray-600">{item.description}</td>
              <td className="px-4 py-2 text-gray-800">{item.annualCTC}</td>
              <td className="px-4 py-2">
                <span className="text-green-600 font-medium">{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer pagination (mocked) */}
      <div className="flex justify-between items-center mt-4 text-[11px] text-gray-500 font-medium">
        <div>Rows per page: 10</div>
        <div className="flex items-center gap-2">
          <span>1–2 of 2</span>
          <button className="text-gray-400 hover:text-gray-600">{`<`}</button>
          <button className="text-gray-400 hover:text-gray-600">{`>`}</button>
        </div>
      </div>
    </div>
  );
};

export default SalaryTemplate;
