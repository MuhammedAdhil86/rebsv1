import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AssetTable({
  columns = [],
  data = [],
  rowsPerPage = 6,
  onRowClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  // ✅ 1. Define Pagination Variables correctly
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIdx, startIdx + rowsPerPage);

  // ✅ 2. Calculate Widths with Infinite Loop protection
  useEffect(() => {
    if (headerRef.current) {
      const newWidths = Array.from(
        headerRef.current.querySelectorAll("th"),
      ).map((th) => th.offsetWidth);

      // Only set state if the values actually changed
      if (JSON.stringify(newWidths) !== JSON.stringify(colWidths)) {
        setColWidths(newWidths);
      }
    }
    // We only want to recalculate when data or columns change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns]);

  // ✅ 3. Reset to first page when data changes (e.g., search/filter results)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <section className="rounded-lg overflow-x-auto relative w-full bg-gray-50 p-1">
      {/* ===== HEADER TABLE ===== */}
      <table
        ref={headerRef}
        className="w-full min-w-[800px] text-[12px] bg-white border-separate border-spacing-0 overflow-hidden"
      >
        <thead className="bg-white text-black text-[12.5px]">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-black text-center whitespace-nowrap align-middle
                ${idx === 0 ? "rounded-tl-2xl" : idx === columns.length - 1 ? "rounded-tr-2xl" : ""}`}
                style={{
                  width: col.width ? `${col.width}px` : "auto",
                  textAlign: col.align || "center",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div className="h-2" />

      {/* ===== BODY TABLE ===== */}
      <table className="w-full min-w-[800px] bg-white border-separate border-spacing-0 rounded-lg overflow-hidden">
        <tbody className="text-gray-800">
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400 border-b border-gray-300"
              >
                No Data Found
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-gray-50 text-center border-b border-gray-300 cursor-pointer transition-colors"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className="px-4 py-4 truncate text-center align-middle text-[12px] border-b border-[#f9fafb]"
                    style={{
                      width: colWidths[colIdx]
                        ? `${colWidths[colIdx]}px`
                        : "auto",
                      textAlign: col.align || "center",
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}

          {/* ===== PAGINATION ===== */}
          {data.length > 0 && (
            <tr>
              <td colSpan={columns.length}>
                <div className="flex justify-between items-center px-4 py-3 text-[12.5px]">
                  <span className="text-gray-500 font-medium">
                    {/* Now startIdx is defined! */}
                    Showing {startIdx + 1}-
                    {Math.min(startIdx + rowsPerPage, data.length)} of{" "}
                    {data.length}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage((p) => Math.max(p - 1, 1));
                      }}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-100 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage((p) => Math.min(p + 1, totalPages));
                      }}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-100 transition-all"
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
