import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { FiX, FiClock, FiInfo, FiUser } from "react-icons/fi";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import EmployeeAsset from "./employeeasset";
import {
  fetchAssetAllocationById,
  returnAsset,
} from "../../service/assetservice";
import axiosInstance from "../../service/axiosinstance";

const AssetDetailDrawer = ({ asset, onRefresh, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState("details");
  const [allocations, setAllocations] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentStaffName, setCurrentStaffName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployeeDrawerOpen, setIsEmployeeDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // New Way Dynamic Placeholder Generator
  const getPlaceholderImage = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=f3f4f6&color=a1a1aa&size=512&bold=true`;
  };

  // Fetch History and Sync Status/Staff Name
  const fetchAllocations = async () => {
    if (!asset?.id) return;
    setIsLoading(true);
    try {
      const response = await fetchAssetAllocationById(asset.id);
      if (response?.status_code === 200 && Array.isArray(response.data)) {
        const data = response.data;
        setAllocations(data);

        // Logic: Extract status and staff name from the most recent record
        if (data.length > 0) {
          const latestRecord = data[data.length - 1];
          setCurrentStatus(latestRecord.status);
          // Only show staff name in the 'Info' tab if the asset is currently Allocated
          setCurrentStaffName(
            latestRecord.status === "Allocated" ? latestRecord.staff_name : "",
          );
        } else {
          setCurrentStatus(asset.asset_status);
          setCurrentStaffName("");
        }
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (asset?.id) fetchAllocations();
  }, [asset?.id]);

  const handleReturn = async () => {
    try {
      const active = [...allocations]
        .reverse()
        .find((a) => a.status === "Allocated");

      if (!active) return alert("No active allocation found.");

      await returnAsset(asset.id, active.staff_id);
      alert("Asset returned successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      alert("Error returning asset.");
    }
  };

  const handleAllocate = async () => {
    if (!selectedEmployee) return alert("Select a staff member first.");
    try {
      await axiosInstance.post("/admin/assetallocation/add", {
        asset_id: asset.id,
        staff_id: selectedEmployee.uuid,
      });
      alert("Asset allocated successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to allocate.");
    }
  };

  if (!asset) return null;

  return (
    <Drawer
      anchor="right"
      open={!!asset}
      onClose={onClose}
      PaperProps={{ className: "w-full max-w-[500px] border-none" }}
    >
      <div className="h-full flex flex-col bg-white font-sans">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {asset.asset_name}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {asset.asset_type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-4 gap-6 border-b">
          <button
            onClick={() => setActiveSubTab("details")}
            className={`pb-3 text-sm flex items-center gap-2 transition-all ${
              activeSubTab === "details"
                ? "border-b-2 border-black font-bold text-black"
                : "text-gray-400"
            }`}
          >
            <FiInfo /> Info
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`pb-3 text-sm flex items-center gap-2 transition-all ${
              activeSubTab === "history"
                ? "border-b-2 border-black font-bold text-black"
                : "text-gray-400"
            }`}
          >
            <FiClock /> History
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubTab === "details" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
                <img
                  src={asset.image || getPlaceholderImage(asset.asset_name)}
                  className="w-full h-full object-cover"
                  alt={asset.asset_name}
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(asset.asset_name);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-y-6">
                {[
                  { label: "Condition", val: asset.condition },
                  { label: "Status", val: currentStatus || asset.asset_status },
                  { label: "Staff ID", val: asset.staff_id || "Unassigned" },
                  { label: "Staff Name", val: currentStaffName || "N/A" },
                  {
                    label: "Purchase Date",
                    val: asset.purchase_date
                      ? new Date(asset.purchase_date).toLocaleDateString()
                      : "N/A",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                      {item.label}
                    </label>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* HISTORY TAB */
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-gray-400 animate-pulse text-center py-10">
                  Loading history...
                </p>
              ) : allocations.length > 0 ? (
                <Timeline position="right" sx={{ p: 0 }}>
                  {[...allocations].reverse().map((item, idx) => (
                    <TimelineItem
                      key={idx}
                      sx={{ "&::before": { display: "none" } }}
                    >
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{ bgcolor: "black", boxShadow: "none" }}
                        />
                        {idx !== allocations.length - 1 && (
                          <TimelineConnector sx={{ bgcolor: "#E5E7EB" }} />
                        )}
                      </TimelineSeparator>
                      <TimelineContent sx={{ pb: 4, pr: 0 }}>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition-hover hover:bg-gray-100">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-gray-900">
                              {item.staff_name}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                item.status === "Returned"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-blue-50 text-blue-600 border-blue-100"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-2 font-medium">
                            <span className="font-bold text-gray-400 mr-1">
                              DATE:
                            </span>
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-center">
                  <FiClock size={40} className="mb-2 opacity-20" />
                  <p className="text-sm italic font-medium">
                    No allocation history available.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 space-y-4">
          {currentStatus === "Allocated" ? (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                Action Required
              </p>
              <button
                onClick={handleReturn}
                className="w-full bg-white border border-black py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
              >
                Return Asset
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                Ready for Allocation
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEmployeeDrawerOpen(true)}
                  className="flex-[1.5] bg-white border border-gray-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 truncate px-2 hover:border-black transition-colors"
                >
                  <FiUser />{" "}
                  {selectedEmployee ? selectedEmployee.name : "Select Staff"}
                </button>
                <button
                  disabled={!selectedEmployee}
                  onClick={handleAllocate}
                  className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold disabled:opacity-30 transition-all shadow-lg active:scale-95"
                >
                  Allocate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Employee Selection Drawer */}
        <Drawer
          anchor="right"
          open={isEmployeeDrawerOpen}
          onClose={() => setIsEmployeeDrawerOpen(false)}
          PaperProps={{ style: { width: "500px" } }}
        >
          <EmployeeAsset
            onBack={() => setIsEmployeeDrawerOpen(false)}
            onEmployeeSelect={(emp) => {
              setSelectedEmployee(emp);
              setIsEmployeeDrawerOpen(false);
            }}
          />
        </Drawer>
      </div>
    </Drawer>
  );
};

export default AssetDetailDrawer;
