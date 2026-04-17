import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FiBell, FiSearch, FiPlus } from "react-icons/fi";
import { fetchDashboard, fetchAssets } from "../../service/assetservice";
import AssetTable from "./assettable";
import AssetDetailDrawer from "./assetdeatailsdrawer";
import CreateAssetDrawer from "./createasset";

function PhysicalAssetTab() {
  const [assets, setAssets] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // 1. Define the handleRequestSort function
  const handleRequestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // 2. Define the columns (This was missing!)
  const columns = useMemo(
    () => [
      {
        key: "asset_name",
        label: "Asset Name",
        align: "center",
        sortable: true,
        onSort: () => handleRequestSort("asset_name"),
      },
      {
        key: "asset_type",
        label: "Type",
        align: "center",
        sortable: true,
        onSort: () => handleRequestSort("asset_type"),
      },
      { key: "condition", label: "Condition", align: "center" },
      {
        key: "purchase_date",
        label: "Purchase Date",
        align: "center",
        sortable: true,
        onSort: () => handleRequestSort("purchase_date"),
        render: (val) => (val ? new Date(val).toLocaleDateString() : "—"),
      },
      {
        key: "staff_name",
        label: "Staff Name",
        align: "center",
        render: (val) => val || "—",
      },
      {
        key: "asset_status",
        label: "Status",
        align: "center",
        render: (val) => {
          const isAllocated = val === "Allocated";
          return (
            <span
              className={`px-3 py-1 rounded-full text-[12px] border ${
                isAllocated
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-sky-50 text-sky-700 border-sky-100"
              }`}
            >
              {isAllocated ? "Allocated" : "Unallocated"}
            </span>
          );
        },
      },
    ],
    [sortConfig],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [assetData, stats] = await Promise.all([
        fetchAssets(),
        fetchDashboard(),
      ]);
      const physicalOnly = Array.isArray(assetData)
        ? assetData.filter((a) => !a.isDigital)
        : [];
      setAssets(physicalOnly);
      setDashboardData(stats);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 3. Define the processedAssets logic (This was also missing!)
  const processedAssets = useMemo(() => {
    let filtered = assets.filter((asset) => {
      const isAllocated = asset.asset_status === "Allocated";
      const statusMatch =
        activeStatus === "all" ||
        (activeStatus === "Allocated" && isAllocated) ||
        (activeStatus === "available" && !isAllocated);
      if (!statusMatch) return false;

      const term = searchQuery.toLowerCase().trim();
      if (!term) return true;

      return Object.values(asset).some(
        (val) => val && val.toString().toLowerCase().includes(term),
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";
        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [assets, activeStatus, searchQuery, sortConfig]);

  return (
    <>
      <div className="bg-white flex justify-between items-center p-4 mb-4 shadow-sm rounded-lg">
        <h1 className="text-lg text-gray-800">Physical Asset Inventory</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full"
          >
            <FiPlus /> Add Physical Asset
          </button>
        </div>
      </div>

      {/* Physical Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: dashboardData?.total_assets,
            color: "text-blue-600",
          },
          {
            label: "Allocated",
            value: dashboardData?.allocated_assets,
            color: "text-emerald-600",
          },
          {
            label: "Available",
            value: dashboardData?.unallocated_assets,
            color: "text-sky-600",
          },
          {
            label: "Maintenance",
            value: dashboardData?.assets_under_maintanance,
            color: "text-red-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
          >
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>
              {isLoading ? "..." : stat.value || 0}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <div className="flex gap-6 text-sm">
            {["all", "Allocated", "available"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`pb-2 capitalize transition-all relative ${
                  activeStatus === status
                    ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black "
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {status === "available" ? "Unallocated" : status}
              </button>
            ))}
          </div>

          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black w-64"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <AssetTable
          columns={columns}
          data={processedAssets}
          onRowClick={setSelectedAsset}
          sortConfig={sortConfig}
        />
      </div>

      <CreateAssetDrawer
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAssetCreated={loadData}
      />
      <AssetDetailDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onRefresh={loadData}
      />
    </>
  );
}

export default PhysicalAssetTab;
