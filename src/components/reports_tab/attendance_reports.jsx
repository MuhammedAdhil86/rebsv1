import React, { useState, useEffect, useRef } from "react";
import { FiDownload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import UniversalTable from "../../ui/universal_table";
import axiosInstance from "../../service/axiosinstance";

// StatusCell component for Status column
function StatusCell({ value, row }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Accepted: "bg-green-100 text-green-800",
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleView = () => console.log("View row data:", row);

  return (
    <div
      className="flex items-center justify-center gap-2 w-full text-[13px]"
      ref={ref}
    >
      <span
        className={`flex items-center gap-2 px-2 py-1 rounded-full text-[11px] ${
          statusStyles[value] || ""
        }`}
      >
        <span className="w-4 h-4 rounded-full flex items-center justify-center">
          {value === "Accepted" && (
            <span className="text-green-600 text-sm">✔</span>
          )}
          {value === "Rejected" && (
            <span className="text-red-600 text-sm">✖</span>
          )}
        </span>
        {value || "N/A"}
      </span>

      <div className="relative">
        <span
          className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          ⋮
        </span>
        {open && (
          <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 shadow-lg rounded z-10">
            <button
              className="px-3 py-1 w-full hover:bg-gray-100 text-left text-[13px]"
              onClick={handleView}
            >
              View
            </button>
            <button className="px-3 py-1 w-full hover:bg-gray-100 text-left text-[13px]">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Columns definition
const columns = [
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "user_id", label: "User ID" },
  { key: "department", label: "Department" },
  { key: "doj", label: "DOJ" },
  { key: "net_salary", label: "Net Salary" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => <StatusCell value={value} row={row} />,
  },
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
          res.data?.data?.map((item) => {
            let dojFormatted = "N/A";
            if (item.doj) {
              const d = new Date(item.doj);
              if (!isNaN(d.getTime()))
                dojFormatted = d.toISOString().split("T")[0];
            }

            return {
              name: item.name || "N/A",
              designation: item.designation || "N/A",
              user_id: item.user_id || "N/A",
              department: item.department || "N/A",
              doj: dojFormatted,
              net_salary: item.net_salary != null ? item.net_salary : "N/A",
              status: item.net_salary > 0 ? "Accepted" : "Pending",
            };
          }) || [];

        setApiData(mapped);

        // Log mapped table data
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
          <select
            className="border border-gray-300 rounded px-3 py-1 w-[110px]"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select
            className="border border-gray-300 rounded px-3 py-1 w-[90px]"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from(
              { length: 5 },
              (_, i) => today.getFullYear() - 2 + i,
            ).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

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
        {/* Log before table render */}
        {console.log(
          "%cRendering table with data:",
          "color: teal; font-weight: bold;",
          apiData,
        )}

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
