import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function UniversalTable({ columns, data, rowsPerPage = 6 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  const filteredData = data.filter((row) => {
    const term = searchTerm.toLowerCase();
    return columns.some((col) =>
      row[col.key]?.toString().toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentData = filteredData.slice(startIdx, endIdx);

  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.querySelectorAll("th")).map(
        (th) => th.offsetWidth
      );
      setColWidths(widths);
    }
  }, [data, searchTerm, columns]);

  return (
    <section className="p-2 rounded-2xl overflow-x-auto relative z-[1] w-full">

      {/* Header */}
      <table
        className="w-full min-w-[600px] text-[12px] bg-white border-separate border-spacing-0 rounded-2xl overflow-hidden"
        ref={headerRef}
      >
        <thead className="bg-white text-gray-600 text-[12.5px]">
          <tr className="rounded-lg overflow-hidden">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-gray-700 text-center whitespace-nowrap align-middle 
                ${
                  idx === 0
                    ? "rounded-tl-2xl"
                    : idx === columns.length - 1
                    ? "rounded-tr-2xl"
                    : ""
                }`}
                style={{
                  width: colWidths[idx]
                    ? `${colWidths[idx]}px`
                    : col.width
                    ? `${col.width}px`
                    : "auto",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div className="h-2" />

      {/* Body table (YOUR REQUESTED CHANGE: fully rounded) */}
      <table className="w-full min-w-[600px] text-[11px] bg-white border-separate border-spacing-0 rounded-2xl overflow-hidden">
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {currentData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-gray-50 text-center relative z-[0]"
              >
                {columns.map((col, colIdx) => {
                  const value = row[col.key];
                  return (
                    <td
                      key={col.key}
                      data-label={col.label}
                      className="px-4 py-3 truncate text-center align-middle relative"
                      style={{
                        width: colWidths[colIdx]
                          ? `${colWidths[colIdx]}px`
                          : col.width
                          ? `${col.width}px`
                          : "auto",
                      }}
                    >
                      {col.render ? col.render(value, row, rowIdx) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}

          {/* Pagination */}
          {filteredData.length > 0 && (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-3 text-[12.5px]">
                  <span className="text-gray-500">
                    Showing {startIdx + 1}-{Math.min(endIdx, filteredData.length)} of{" "}
                    {filteredData.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        currentPage < totalPages && setCurrentPage(currentPage + 1)
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      <ChevronRight className="w-4 h-4" />
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

export default UniversalTable;
