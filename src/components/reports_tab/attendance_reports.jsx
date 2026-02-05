import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import UniversalTable from "../../ui/universal_table";
import axiosInstance from "../../service/axiosinstance";
import CustomSelect from "../../ui/customselect";

// Columns definition with truncated name and designation
const columns = [
  { key: "user_id", label: "User ID" },
  {
    key: "name",
    label: "Name",
    render: (value) => (
      <span
        className="block max-w-[10ch] truncate"
        title={value} // Hover shows full text
      >
        {value}
      </span>
    ),
  },
  {
    key: "designation",
    label: "Designation",
    render: (value) => (
      <span className="block max-w-[21ch] truncate" title={value}>
        {value}
      </span>
    ),
  },
  { key: "department", label: "Department" },
  { key: "working_days", label: "Working Days" },
  { key: "present_days", label: "Days Present" },
  { key: "absent_days", label: "Days Absent" },
  { key: "net_salary", label: "Net Salary" },
  { key: "lop", label: "LOP" },
];

export default function AttendanceReports() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState([]);

  // Fetch API data whenever month/year changes
  useEffect(() => {
    console.log(
      `%cFetching data for month: ${selectedMonth}, year: ${selectedYear}`,
      "color: blue; font-weight: bold;",
    );

    axiosInstance
      .get(`admin/staff/fullreport/${selectedMonth}/${selectedYear}`)
      .then((res) => {
        console.log(
          "%cRaw API response:",
          "color: orange; font-weight: bold;",
          res.data,
        );

        const mapped =
          res.data?.data?.map((item) => ({
            user_id: item.user_id || "N/A",
            name: item.name || "N/A",
            designation: item.designation || "N/A",
            department: item.department || "N/A",
            working_days: item.total_working_days || "0",
            present_days: item.present || "0.0",
            absent_days: item.absent || "0.0",
            net_salary: item.net_salary != null ? item.net_salary : "N/A",
            lop: item.absent_cut != null ? item.absent_cut : 0,
          })) || [];

        setApiData(mapped);
        console.log(
          "%cMapped table data:",
          "color: green; font-weight: bold;",
          mapped,
        );
      })
      .catch((err) => {
        console.error(err);
        setApiData([]);
      });
  }, [selectedMonth, selectedYear]);

  // Log current apiData whenever it updates
  useEffect(() => {
    console.log(
      "%cCurrent table data (apiData state):",
      "color: purple; font-weight: bold;",
      apiData,
    );
  }, [apiData]);

  return (
    <div className="flex flex-col gap-4 text-[13px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 flex-wrap gap-3 w-full px-2">
        <div className="text-[16px] font-medium">
          {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
            month: "short",
          })}{" "}
          {selectedYear}
        </div>

        <div className="flex gap-3 flex-wrap items-center justify-end flex-1">
          {/* Month selector */}
          <CustomSelect
            label=""
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(Number(val))}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: i + 1,
              label: new Date(0, i).toLocaleString("default", {
                month: "long",
              }),
            }))}
            minWidth={110}
          />

          {/* Year selector */}
          <CustomSelect
            label=""
            value={selectedYear}
            onChange={(val) => setSelectedYear(Number(val))}
            options={Array.from({ length: 5 }, (_, i) => {
              const yr = today.getFullYear() - 2 + i;
              return { value: yr, label: yr };
            })}
            minWidth={90}
          />

          {/* Download button */}
          <button
            className="flex items-center px-4 py-1 bg-black text-white rounded"
            onClick={() =>
              console.log(
                "%cDownload clicked. Data:",
                "color: red; font-weight: bold;",
                apiData,
              )
            }
          >
            <FiDownload className="mr-2" /> Download
          </button>

          {/* Search input */}
          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 w-full pr-8"
            />
            <Icon
              icon="mynaui:search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto scrollbar-hide">
        <UniversalTable
          columns={columns}
          data={apiData}
          rowsPerPage={5}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
