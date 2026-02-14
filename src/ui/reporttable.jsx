import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ReportTable Component
 * @param {Array} columns - Array of objects { label: string, key: string, width?: number, render?: function }
 * @param {Array} data - Array of objects containing the row data
 * @param {number} rowsPerPage - Number of rows to show per page
 * @param {function} onRowClick - Function triggered when a row is clicked
 */
function ReportTable({ columns, data, rowsPerPage = 8, onRowClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  // Reset to page 1 whenever the data source changes (e.g., changing month/year)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentData = data.slice(startIdx, endIdx);

  // Sync column widths between the fixed header and the body
  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.querySelectorAll("th")).map(
        (th) => th.offsetWidth,
      );
      setColWidths(widths);
    }
  }, [data, columns]);

  return (
    <section className="p-1 rounded-2xl overflow-x-auto relative z-[1] w-full">
      {/* --- HEADER TABLE --- */}
      <table
        className="w-full min-w-[800px] text-[12px] bg-white border-separate border-spacing-0 rounded-t-2xl overflow-hidden"
        ref={headerRef}
      >
        <thead className="bg-white text-gray-600 text-[12.5px]">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-4 font-semibold text-gray-700 text-center whitespace-nowrap align-middle border-b border-gray-100
                ${idx === 0 ? "rounded-tl-2xl" : ""}
                ${idx === columns.length - 1 ? "rounded-tr-2xl" : ""}`}
                style={{
                  width: col.width ? `${col.width}px` : "auto",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* --- BODY TABLE --- */}
      <table className="w-full min-w-[800px] bg-white border-separate border-spacing-0 rounded-b-2xl overflow-hidden shadow-sm">
        <tbody className="text-gray-800">
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-20 text-gray-400 bg-gray-50/30"
              >
                No records found for the selected period.
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`group transition-all duration-200 border-b border-gray-50 last:border-none
                ${onRowClick ? "cursor-pointer hover:bg-blue-50/50" : ""}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIdx) => {
                  const value = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className="px-4 py-4 truncate text-center align-middle text-[12px] text-gray-600 group-hover:text-blue-700"
                      style={{
                        // Match width from calculated header widths
                        width: colWidths[colIdx]
                          ? `${colWidths[colIdx]}px`
                          : "auto",
                      }}
                    >
                      {col.render
                        ? col.render(value, row, rowIdx)
                        : (value ?? "—")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}

          {/* --- FOOTER / PAGINATION --- */}
          {data.length > 0 && (
            <tr>
              <td colSpan={columns.length} className="bg-white rounded-b-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100">
                  <span className="text-gray-500 text-[12px]">
                    Showing{" "}
                    <span className="font-medium text-gray-700">
                      {startIdx + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-700">
                      {Math.min(endIdx, data.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                      {data.length}
                    </span>{" "}
                    employees
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>

                    <div className="px-4 text-[12px] font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages),
                        );
                      }}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default ReportTable;
