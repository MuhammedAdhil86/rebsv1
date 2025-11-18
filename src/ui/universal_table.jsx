import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function UniversalTable({ columns, data, rowsPerPage = 6 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [colWidths, setColWidths] = useState([]);
  const headerRef = useRef(null);

  // Detect if text is truncated
  const isTruncated = (el) => el ? el.scrollWidth > el.clientWidth : false;

  // Filtered data based on search term
  const filteredData = data.filter((row) => {
    const term = searchTerm.toLowerCase();
    return columns.some(col => {
      const value = col.accessor ? row[col.accessor] : "";
      if (!value) return false;
      return String(value).toLowerCase().includes(term);
    });
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const currentRows = filteredData.slice(startIdx, endIdx);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };

  // Sync header & body column widths
  useEffect(() => {
    if (headerRef.current) {
      const widths = Array.from(headerRef.current.querySelectorAll("th")).map(th => th.offsetWidth);
      setColWidths(widths);
    }
  }, [data, searchTerm]);

  return (
    <section className="p-2 rounded-2xl overflow-x-auto relative w-full">

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <h3 className="text-base font-medium text-gray-800">Table</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm shadow-sm mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent text-gray-600 w-full focus:outline-none text-sm"
            />
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Header Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px] text-[12px] bg-white border-separate border-spacing-0 rounded-2xl" ref={headerRef}>
          <thead className="bg-white text-gray-600 text-[12.5px] rounded-xl">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.header}
                  className="px-8 py-3 font-medium text-gray-700 whitespace-nowrap text-left align-middle rounded-xl"
                  style={{ width: colWidths[idx] ? `${colWidths[idx]}px` : "auto" }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <div className="h-2" />

      {/* Body Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px] text-[11px] bg-white border-separate border-spacing-0 rounded-2xl">
          <tbody className="divide-y divide-gray-100 text-gray-800 font-poppins text-[11px]">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">No data available</td>
              </tr>
            ) : (
              currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 align-middle">
                  {columns.map((col, colIndex) => {
                    const cellValue = col.accessor ? row[col.accessor] : "";
                    const renderCell = col.cell ? col.cell(cellValue, row) : cellValue;
                    return (
                      <td
                        key={colIndex}
                        data-label={col.header}
                        className="px-4 py-3 relative group"
                        style={{
                          width: colWidths[colIndex] ? `${colWidths[colIndex]}px` : "auto",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span
                          className="block truncate max-w-[120px]"
                          ref={(el) => row[`_ref_${colIndex}`] = el}
                        >
                          {renderCell}
                        </span>
                        {isTruncated(row[`_ref_${colIndex}`]) && (
                          <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-50 top-0 left-0 whitespace-nowrap -translate-y-full">
                            {renderCell}
                          </span>
                        )}
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
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-3 text-[12.5px] rounded-b-2xl">
                    <span className="text-gray-500">
                      Showing {startIdx + 1}-{Math.min(endIdx, filteredData.length)} of {filteredData.length}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="p-2 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded disabled:opacity-50 hover:bg-gray-300 transition"
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
      </div>

      {/* Mobile View */}
      <style jsx>{`
        @media (max-width: 640px) {
          table, thead, tbody, th, td, tr { display: block; }
          thead tr { display: none; }
          tbody tr { margin-bottom: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.5rem; }
          tbody td { display: flex; justify-content: space-between; padding: 0.25rem 0.5rem; }
          tbody td::before { content: attr(data-label); font-weight: 500; color: #6b7280; }
        }
      `}</style>
    </section>
  );
}
