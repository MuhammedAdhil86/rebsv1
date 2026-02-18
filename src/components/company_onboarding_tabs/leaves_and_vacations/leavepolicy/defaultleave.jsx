import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Copy } from "lucide-react";
import UniversalTable from "../../../../ui/universal_table";

const DefaultTemplatesTable = ({
  data = [], // Default to empty array to prevent .length error
  loading,
  onUseTemplate,
  selectedIds = [],
  setSelectedIds,
}) => {
  const [hoverData, setHoverData] = useState(null);

  // Safely handle toggle select all
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data?.map((item) => item.id) || [];
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleMouseEnter = (event, text) => {
    if (!text || text.length <= 20) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverData({
      text,
      top: rect.top + window.scrollY - 10,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  };

  const handleMouseLeave = () => setHoverData(null);

  const columns = [
    {
      key: "name",
      label: (
        <div className="flex items-center gap-2 pl-4 text-left font-['Poppins'] font-medium">
          <input
            type="checkbox"
            className="w-4 h-4 accent-black cursor-pointer rounded border-gray-300"
            onChange={toggleSelectAll}
            // Added safe check for data length
            checked={data?.length > 0 && selectedIds?.length === data?.length}
          />
          <span>Template Name</span>
        </div>
      ),
      render: (value, row) => (
        <div className="flex items-center gap-2 pl-4 text-left font-['Poppins'] text-black text-[12px] font-normal">
          <input
            type="checkbox"
            className="w-4 h-4 accent-black cursor-pointer rounded border-gray-300"
            checked={selectedIds?.includes(row.id)}
            onChange={() => toggleSelectRow(row.id)}
          />
          <span className="truncate">{value}</span>
        </div>
      ),
    },
    {
      key: "code",
      label: (
        <div className="text-center font-medium font-['Poppins']">Code</div>
      ),
      render: (value) => (
        <div className="w-full text-center font-['Poppins'] text-black text-[12px] font-normal">
          {value || "—"}
        </div>
      ),
    },
    {
      key: "leave_type",
      label: (
        <div className="text-center font-medium font-['Poppins']">Type</div>
      ),
      render: (value) => (
        <div className="w-full flex justify-center">
          <span className="bg-[#F1F1F8] text-black px-2 py-0.5 rounded text-[10px] uppercase font-bold font-['Poppins']">
            {value?.replace("_", " ")}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: (
        <div className="text-center font-medium font-['Poppins']">
          Created Date
        </div>
      ),
      render: (value) => {
        if (!value)
          return (
            <div className="text-center font-['Poppins'] text-[12px]">—</div>
          );
        const date = new Date(value);
        return (
          <div className="w-full text-center font-['Poppins'] text-black text-[12px] font-normal">
            {String(date.getDate()).padStart(2, "0")}/
            {String(date.getMonth() + 1).padStart(2, "0")}/
            {String(date.getFullYear()).slice(-2)}
          </div>
        );
      },
    },
    {
      key: "description",
      label: (
        <div className="text-center font-medium font-['Poppins']">
          Description
        </div>
      ),
      render: (value) => {
        const text = value || "Standard system template";
        return (
          <div className="w-full flex justify-center">
            <div
              className="relative cursor-help"
              onMouseEnter={(e) => handleMouseEnter(e, text)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="font-['Poppins'] text-black text-[12px] whitespace-nowrap font-normal">
                {text.length > 20 ? `${text.substring(0, 20)}...` : text}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: (
        <div className="text-center font-medium font-['Poppins']">Status</div>
      ),
      render: (value) => (
        <div className="w-full flex justify-center">
          <span
            className={`px-4 py-1 rounded-full text-[11px] font-medium font-['Poppins'] ${
              value === "active"
                ? "bg-[#E7F7EF] text-[#00B050]"
                : "bg-[#F1F1F8] text-[#8C8CB1]"
            }`}
          >
            {value === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div className="py-20 text-center">
        <p className="text-gray-400 animate-pulse text-[12px] font-['Poppins']">
          Loading system templates...
        </p>
      </div>
    );

  return (
    <div className="w-full">
      <UniversalTable columns={columns} data={data || []} rowsPerPage={8} />

      {hoverData &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: hoverData.top,
              left: hoverData.left,
              transform: "translate(-50%, -100%)",
              zIndex: 1000000,
              pointerEvents: "none",
            }}
            className="px-4 py-2 bg-zinc-900 text-white text-[11px] rounded-lg shadow-2xl w-max max-w-[280px] text-center font-['Poppins'] leading-relaxed"
          >
            {hoverData.text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900"></div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default DefaultTemplatesTable;
