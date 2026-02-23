import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import UniversalTable from "../../ui/universal_table";
import CustomSelect from "../../ui/customselect";
import * as XLSX from "xlsx-js-style";

// Import the service
import { fetchFullAttendanceReport } from "../../service/reportsService";

import {
  titleStyle,
  headerStyle,
  textCellStyle,
  numberCellStyle,
  totalRowStyle,
} from "../helpers/exelsheet";

const columns = [
  { key: "user_id", label: "User ID" },
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "department", label: "Department" },
  { key: "working_days", label: "Working Days" },
  { key: "present_days", label: "Days Present" },
  { key: "absent_days", label: "Days Absent" },
  { key: "net_salary", label: "Net Salary" },
  { key: "lop", label: "LOP" },
];

const TruncatedCell = ({ text }) => {
  if (!text) return "N/A";
  return (
    <span title={text} className="cursor-pointer">
      {text.length > 10 ? text.slice(0, 10) + "..." : text}
    </span>
  );
};

export default function AttendanceReports() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState([]);

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString(
    "default",
    { month: "long" },
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFullAttendanceReport(
          selectedMonth,
          selectedYear,
        );

        if (!data || data.length === 0) {
          setApiData([]);
          return;
        }

        // 1. Calculate the Global Total Net Salary
        const totalNetSalary = data.reduce(
          (sum, row) => sum + (Number(row.net_salary) || 0),
          0,
        );

        // 2. Map actual employee rows with truncation
        const tableRows = data.map((item) => ({
          ...item,
          name: <TruncatedCell text={item.name} />,
          designation: <TruncatedCell text={item.designation} />,
          department: <TruncatedCell text={item.department} />,
          raw_name: item.name,
          raw_designation: item.designation,
          raw_department: item.department,
        }));

        // 3. Create the Total Row Template
        const totalRowTemplate = {
          user_id: "",
          name: "",
          designation: "",
          department: <span className=" text-black">TOTAL</span>,
          working_days: "",
          present_days: "",
          absent_days: "",
          net_salary: (
            <span className=" text-black">
              {totalNetSalary.toLocaleString()}
            </span>
          ),
          lop: "",
          isTotal: true,
          raw_net_salary: totalNetSalary,
        };

        // 4. Inject Total Row every 10 items for persistent pagination view
        const itemsPerPage = 10;
        const finalDisplayData = [];

        for (let i = 0; i < tableRows.length; i += itemsPerPage) {
          const chunk = tableRows.slice(i, i + itemsPerPage);
          finalDisplayData.push(...chunk);
          // Add the total row as the 11th item for this "page"
          finalDisplayData.push({ ...totalRowTemplate, id: `total-${i}` });
        }

        setApiData(finalDisplayData);
      } catch (err) {
        console.error("Error loading report:", err);
        setApiData([]);
      }
    };

    loadData();
  }, [selectedMonth, selectedYear]);

  const handleDownload = () => {
    // Filter out the injected UI total rows for a clean Excel export
    const actualData = apiData.filter((row) => !row.isTotal);
    if (!actualData.length) return;

    const headerRow = columns.map((c) => c.label);
    const dataRows = actualData.map((row, i) => [
      i + 1,
      row.raw_name || "N/A",
      row.raw_designation || "N/A",
      row.raw_department || "N/A",
      row.working_days,
      row.present_days,
      row.absent_days,
      row.net_salary,
      row.lop,
    ]);

    // Use the first available total value
    const totalSalary = apiData.find((row) => row.isTotal)?.raw_net_salary || 0;

    const sheetData = [
      [`MONTH OF ${monthName.toUpperCase()} ${selectedYear}`],
      headerRow,
      ...dataRows,
      ["", "", "", "", "", "", "TOTAL", totalSalary, ""],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headerRow.length - 1 } },
    ];
    ws["!cols"] = [
      { wch: 6 },
      { wch: 28 },
      { wch: 28 },
      { wch: 28 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 13 },
    ];

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        if (R === 0) ws[cellRef].s = titleStyle;
        else if (R === 1) ws[cellRef].s = headerStyle;
        else if (R === range.e.r) ws[cellRef].s = totalRowStyle;
        else if (typeof ws[cellRef].v === "number")
          ws[cellRef].s = numberCellStyle;
        else ws[cellRef].s = textCellStyle;
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${monthName}_${selectedYear}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-4 text-[13px]">
      <div className="flex justify-between items-center mb-4 px-2">
        {/* LEFT SIDE: Title + Month Select + Year Select */}
        <div className="flex items-center gap-4">
          <div className="text-[16px] font-medium min-w-fit">
            {monthName} {selectedYear}
          </div>
          <CustomSelect
            value={selectedYear}
            onChange={(val) => setSelectedYear(Number(val))}
            options={Array.from({ length: 5 }, (_, i) => {
              const yr = today.getFullYear() - 2 + i;
              return { value: yr, label: yr };
            })}
          />{" "}
          <CustomSelect
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(Number(val))}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: i + 1,
              label: new Date(0, i).toLocaleString("default", {
                month: "long",
              }),
            }))}
          />
        </div>

        {/* RIGHT SIDE: Download + Search */}
        <div className="flex items-center gap-3">
          <button
            className="flex items-center px-4 py-1 bg-black text-white rounded whitespace-nowrap"
            onClick={handleDownload}
          >
            <FiDownload className="mr-2" /> Download
          </button>

          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-1 rounded w-full outline-none"
            />
            <Icon
              icon="mynaui:search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      <UniversalTable
        columns={columns}
        data={apiData}
        rowsPerPage={11} // This triggers pagination at the 11th row (the total row)
        searchTerm={searchTerm}
      />
    </div>
  );
}
