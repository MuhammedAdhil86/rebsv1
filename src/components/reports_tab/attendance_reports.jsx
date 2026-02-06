import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import UniversalTable from "../../ui/universal_table";
import axiosInstance from "../../service/axiosinstance";
import CustomSelect from "../../ui/customselect";
import * as XLSX from "xlsx-js-style";

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

// helper for truncate + hover
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
    axiosInstance
      .get(`admin/staff/fullreport/${selectedMonth}/${selectedYear}`)
      .then((res) => {
        // ✅ console logs for full data
        console.log("Full API Response:", res);
        console.log("Full Data Array:", res.data?.data);

        const mapped =
          res.data?.data?.map((item, index) => {
            console.log("Row Data:", index + 1, {
              user_id: item.user_id,
              total_working_days: item.total_working_days,
              present: item.present,
              absent: item.absent,
              net_salary: item.net_salary,
              lop: item.absent_cut,
            });

            return {
              user_id: item.user_id || "N/A",

              name: <TruncatedCell text={item.name || "N/A"} />,
              designation: <TruncatedCell text={item.designation || "N/A"} />,
              department: <TruncatedCell text={item.department || "N/A"} />,

              working_days: Number(item.total_working_days || 0),
              present_days: Number(item.present || 0),
              absent_days: Number(item.absent || 0),
              net_salary: Number(item.net_salary || 0),
              lop: Number(item.absent_cut || 0),
            };
          }) || [];

        console.log("Mapped Data:", mapped);

        setApiData(mapped);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setApiData([]);
      });
  }, [selectedMonth, selectedYear]);

  const handleDownload = () => {
    if (!apiData.length) return;

    const headerRow = columns.map((c) => c.label);

    const dataRows = apiData.map((row, i) => [
      i + 1,
      row.name?.props?.text || row.name,
      row.designation?.props?.text || row.designation,
      row.department?.props?.text || row.department,
      row.working_days,
      row.present_days,
      row.absent_days,
      row.net_salary,
      row.lop,
    ]);

    const totalSalary = apiData.reduce(
      (sum, row) => sum + Number(row.net_salary || 0),
      0,
    );

    const sheetData = [
      [`MONTH OF ${monthName.toUpperCase()}`],
      headerRow,
      ...dataRows,
      ["", "", "", "", "", "", "TOTAL", totalSalary, ""],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    ws["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: headerRow.length - 1 },
      },
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
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="text-[16px] font-medium">
          {monthName} {selectedYear}
        </div>

        <div className="flex gap-3 items-center">
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

          <CustomSelect
            value={selectedYear}
            onChange={(val) => setSelectedYear(Number(val))}
            options={Array.from({ length: 5 }, (_, i) => {
              const yr = today.getFullYear() - 2 + i;
              return { value: yr, label: yr };
            })}
          />

          <button
            className="flex items-center px-4 py-1 bg-black text-white rounded"
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
              className="border px-3 py-1 rounded w-full"
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
        rowsPerPage={5}
        searchTerm={searchTerm}
      />
    </div>
  );
}
