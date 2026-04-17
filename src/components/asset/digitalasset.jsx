import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FiSearch, FiPlus, FiGlobe, FiUser, FiCalendar } from "react-icons/fi";
import {
  fetchDigitalDashboard,
  fetchDigitalAssets,
} from "../../service/assetservice";
import AssetTable from "./assettable";
import DigitalAssetDetailDrawer from "./digitalaseestdetails";
import CreateDigitalAssetDrawer from "./createdigitalasset";

function DigitalAssetTab() {
  const [assets, setAssets] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const columns = useMemo(
    () => [
      {
        key: "asset_name",
        label: "Account Name",
        align: "left",
        render: (val, row) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <FiGlobe size={14} />
            </div>
            <span className="font-medium text-gray-900">
              {val || row.account_name || "Unnamed"}
            </span>
          </div>
        ),
      },
      {
        key: "asset_type",
        label: "Category",
        align: "center",
        render: (val, row) => val || row.account_type || "—",
      },
      {
        key: "username",
        label: "Username",
        align: "center",
        render: (val) => val || "—",
      },
      {
        key: "staff_name",
        label: "Assigned To",
        align: "center",
        render: (val) => (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <FiUser size={12} />
            <span>{val || "Unassigned"}</span>
          </div>
        ),
      },
      {
        key: "created_on",
        label: "Created Date",
        align: "center",
        render: (val) => {
          if (!val) return "—";
          return (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <FiCalendar size={12} />
              <span>
                {new Date(val).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          );
        },
      },
      {
        key: "asset_status",
        label: "Status",
        align: "center",
        render: (val, row) => {
          // Check both possible keys from your API
          const statusValue = val || row.account_status || "";
          const isAllocated = statusValue.toLowerCase() === "allocated";
          return (
            <span
              className={`px-3 py-1 rounded-full text-[11px] border uppercase font-bold ${
                isAllocated
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-sky-50 text-sky-700 border-sky-100"
              }`}
            >
              {statusValue || "Available"}
            </span>
          );
        },
      },
    ],
    [],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchDigitalAssets();
      const stats = await fetchDigitalDashboard();

      const dataArray = Array.isArray(response)
        ? response
        : response?.data || [];
      setAssets(dataArray);
      setDashboardData(stats);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ✅ UPDATED FILTERING LOGIC
  const processedAssets = useMemo(() => {
    return assets.filter((asset) => {
      // 1. Tab Status Filter
      // We check both 'asset_status' and 'account_status' to be safe
      const rawStatus = asset.asset_status || asset.account_status || "";
      const status = rawStatus.toLowerCase();

      let statusMatch = true;
      if (activeStatus === "Allocated") {
        statusMatch = status === "allocated";
      } else if (activeStatus === "available") {
        // Assume anything not 'allocated' is available/unallocated
        statusMatch = status !== "allocated";
      }

      if (!statusMatch) return false;

      // 2. Search Filter
      const term = searchQuery.toLowerCase().trim();
      if (!term) return true;
      return (
        asset.asset_name?.toLowerCase().includes(term) ||
        asset.account_name?.toLowerCase().includes(term) ||
        asset.username?.toLowerCase().includes(term) ||
        asset.staff_name?.toLowerCase().includes(term)
      );
    });
  }, [assets, activeStatus, searchQuery]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-poppins">
      {/* Header Section */}
      <div className="bg-white flex justify-between items-center p-4 mb-4 shadow-sm rounded-lg">
        <div>
          <h1 className="text-[16px] font-medium text-gray-800 uppercase tracking-tight">
            Digital Access Control
          </h1>
          <p className="text-[10px] text-gray-400 uppercase">
            Manage credentials & licenses
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-[12px] uppercase font-bold tracking-widest transition-transform active:scale-95 shadow-lg"
        >
          <FiPlus /> New Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: dashboardData?.total_accounts,
            color: "text-blue-600",
          },
          {
            label: "Allocated",
            value: dashboardData?.allocated_accounts,
            color: "text-emerald-600",
          },
          {
            label: "Available",
            value: dashboardData?.available_accounts,
            color: "text-sky-600",
          },
          {
            label: "Unallocated",
            value: dashboardData?.unallocated_accounts,
            color: "text-gray-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-gray-200"
          >
            <p className="text-[10px] uppercase text-gray-400 mb-2 tracking-widest font-bold">
              {stat.label}
            </p>
            <p className={`text-2xl font-black ${stat.color}`}>
              {isLoading ? "..." : stat.value || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-poppins">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <div className="flex gap-8 text-[12px]">
            {["all", "Allocated", "available"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`pb-4 capitalize relative transition-all ${
                  activeStatus === status
                    ? "text-black font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {status === "available" ? "Unallocated" : status}
              </button>
            ))}
          </div>

          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-[12px] outline-none w-72 transition-all focus:bg-white focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <AssetTable
          columns={columns}
          data={processedAssets}
          onRowClick={setSelectedAsset}
        />
      </div>

      <DigitalAssetDetailDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onRefresh={loadData}
      />
      <CreateDigitalAssetDrawer
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAssetCreated={loadData}
      />
    </div>
  );
}

export default DigitalAssetTab;
