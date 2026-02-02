import React, { useEffect, useState } from "react";
import payrollService from "../../../service/payrollService";
import PayrollTable from "../../../ui/payrolltable";

export default function SalaryTemplate() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // new search term state

  useEffect(() => {
    let isMounted = true;

    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await payrollService.getSalaryTemplates();
        const rawItems =
          response?.data?.items ||
          response?.data?.data?.items ||
          response?.items ||
          response ||
          [];

        const formatted = rawItems
          .map((item, index) => ({
            id: item.id ?? index,
            name: item.name || "-",
            description: item.description || "-",
            annualCTC: `₹${Number(item.annual_ctc || 0).toLocaleString()}`,
            status:
              String(item.status).toLowerCase() === "active" ||
              item.status === true ||
              item.status === 1
                ? "Active"
                : "Inactive",
          }))
          .filter((item) => {
            if (filterStatus === "all") return true;
            return item.status.toLowerCase() === filterStatus;
          });

        if (isMounted) setTableData(formatted);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setTableData([]);
          setError("Failed to load salary templates. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTemplates();

    return () => {
      isMounted = false;
    };
  }, [filterStatus]);

  const columns = [
    { key: "name", label: "Template Name", align: "left" },
    {
      key: "description",
      label: "Description",
      align: "left",
      render: (value) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: "400px",
          }}
        >
          {value}
        </div>
      ),
    },
    { key: "annualCTC", label: "Annual CTC", align: "right" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => (
        <span
          className={`font-medium ${
            value === "Active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto ">
      {/* FILTER + SEARCH (same line) */}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-2 justify-between">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Status Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border text-sm px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm w-64"
          />
        </div>
      </div>

      {/* PAYROLL TABLE */}
      <PayrollTable
        columns={columns}
        data={tableData}
        rowsPerPage={6}
        searchTerm={searchTerm} // pass search term from filter
        rowClickHandler={(row) => console.log("Row clicked:", row)}
      />

      {/* LOADING / ERROR */}
      {loading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}
      {error && <div className="text-center py-4 text-red-600">{error}</div>}
      {!loading && !error && tableData.length === 0 && (
        <div className="text-center py-4 text-gray-500">No templates found</div>
      )}
    </div>
  );
}
