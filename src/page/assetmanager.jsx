import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../ui/pagelayout";
import { FiBell, FiSearch, FiPlus } from "react-icons/fi";
import { fetchDashboard, fetchAssets } from "../service/assetservice";
import AssetTable from "../components/asset/assettable";
import AssetDetailDrawer from "../components/asset/assetdrawer";
import CreateAssetDrawer from "../components/asset/createasset";
function AssetManager() {
  const [activeTab, setActiveTab] = useState("all");
  const [assets, setAssets] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Column Configuration for the Table UI
  const columns = [
    { key: "asset_name", label: "Asset Name", align: "center" },
    { key: "asset_type", label: "Type", align: "center" },
    { key: "condition", label: "Condition", align: "center" },
    {
      key: "purchase_date",
      label: "Purchase Date",
      align: "center",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "—"),
    },
    {
      key: "staff_id",
      label: "Staff ID",
      align: "center",
      render: (val) => val || "—",
    },
    {
      key: "asset_status",
      label: "Status",
      align: "center",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
            val === "Allocated"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-sky-50 text-sky-700 border-sky-100"
          }`}
        >
          {val}
        </span>
      ),
    },
  ];

  const loadData = async () => {
    try {
      const [assetData, stats] = await Promise.all([
        fetchAssets(),
        fetchDashboard(),
      ]);
      setAssets(Array.isArray(assetData) ? assetData : []);
      setDashboardData(stats);
    } catch (e) {
      // Modern Error Handling: Preserve context
      const err = e instanceof Error ? e : new Error(String(e), { cause: e });
      console.error("AssetManager Load Error:", err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "Allocated" && asset.asset_status === "Allocated") ||
        (activeTab === "available" && asset.asset_status === "available");

      const term = searchQuery.toLowerCase();
      const matchesSearch =
        asset.asset_name?.toLowerCase().includes(term) ||
        asset.asset_type?.toLowerCase().includes(term) ||
        asset.staff_id?.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [assets, activeTab, searchQuery]);

  return (
    <DashboardLayout userName="Admin" onLogout={() => {}}>
      <div className="bg-white flex justify-between items-center p-4 mb-4 shadow-sm rounded-lg">
        <h1 className="text-lg font-medium text-gray-800">Asset Manager</h1>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer hover:bg-gray-50">
            <FiBell className="text-gray-600" />
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-all shadow-sm"
          >
            <FiPlus /> Add Asset
          </button>
        </div>
      </div>

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
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.value || 0}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <div className="flex gap-6 text-sm">
            {["all", "Allocated", "available"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 capitalize transition-all relative ${activeTab === tab ? "text-black font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black" : "text-gray-400"}`}
              >
                {tab === "available" ? "Unallocated" : tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black w-64 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <AssetTable
          columns={columns}
          data={filteredAssets}
          onRowClick={setSelectedAsset}
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
    </DashboardLayout>
  );
}

export default AssetManager;
