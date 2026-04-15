import React, { useMemo } from "react";
import AssetTable from "./assettable";
import UniversalActionMenu from "../ui/universalactionmenu";
import { FiEye, FiTrash2, FiDownload } from "react-icons/fi";

const DigitalAssetsTab = ({
  data,
  onRowClick,
  onDeleteRequest,
  sortConfig,
}) => {
  // Define columns specific to Digital Assets
  const columns = useMemo(
    () => [
      {
        key: "asset_name",
        label: "Asset Name",
        align: "center",
        sortable: true,
      },
      {
        key: "asset_type",
        label: "Digital Type",
        align: "center",
      },
      {
        key: "created_on", // Digital assets often use creation date
        label: "Date Created",
        align: "center",
        render: (val) => (val ? new Date(val).toLocaleDateString() : "—"),
      },
      {
        key: "asset_status",
        label: "Status",
        align: "center",
        render: (val) => (
          <span
            className={`px-3 py-1 rounded-full text-[12px] border ${
              val === "Allocated"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-sky-50 text-sky-700 border-sky-100"
            }`}
          >
            {val || "Unallocated"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        align: "center",
        render: (_, row) => (
          <UniversalActionMenu
            row={row}
            actions={[
              {
                label: "View Details",
                icon: <FiEye size={16} />,
                onClick: (item) => onRowClick(item),
              },
              {
                label: "Download Asset",
                icon: <FiDownload size={16} />,
                onClick: (item) =>
                  console.log("Downloading...", item.asset_name),
              },
              {
                label: "Delete Permanent",
                icon: <FiTrash2 size={16} />,
                isDelete: true,
                divider: true,
                onClick: (item) => onDeleteRequest(item),
              },
            ]}
          />
        ),
      },
    ],
    [onRowClick, onDeleteRequest],
  );

  return (
    <AssetTable
      columns={columns}
      data={data}
      onRowClick={onRowClick}
      sortConfig={sortConfig}
    />
  );
};

export default DigitalAssetsTab;
