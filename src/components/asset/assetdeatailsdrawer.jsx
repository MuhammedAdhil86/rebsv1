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
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployeeDrawerOpen, setIsEmployeeDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const getPlaceholderImage = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f3f4f6&color=a1a1aa&size=512&bold=true`;

  const fetchAllocations = async () => {
    if (!asset?.id) return;
    setIsLoading(true);
    try {
      const response = await fetchAssetAllocationById(asset.id);
      if (response?.status_code === 200) {
        setAllocations(response.data || []);
        setCurrentStatus(
          response.data?.length > 0
            ? response.data[response.data.length - 1].status
            : asset.asset_status,
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (asset?.id) fetchAllocations();
  }, [asset?.id]);

  const handleReturn = async () => {
    const active = [...allocations]
      .reverse()
      .find((a) => a.status === "Allocated");
    if (!active) return;
    await returnAsset(asset.id, active.staff_id);
    onRefresh();
    onClose();
  };

  const handleAllocate = async () => {
    if (!selectedEmployee) return;
    await axiosInstance.post("/admin/assetallocation/add", {
      asset_id: asset.id,
      staff_id: selectedEmployee.uuid,
    });
    onRefresh();
    onClose();
  };

  if (!asset) return null;

  return (
    <Drawer
      anchor="right"
      open={!!asset}
      onClose={onClose}
      PaperProps={{ className: "w-full max-w-[500px] border-none shadow-2xl" }}
    >
      <div className="h-full flex flex-col bg-white">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{asset.asset_name}</h2>
            <p className="text-sm text-gray-500">{asset.asset_type}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex px-6 pt-4 gap-6 border-b">
          <button
            onClick={() => setActiveSubTab("details")}
            className={`pb-3 text-sm flex items-center gap-2 transition-all ${activeSubTab === "details" ? "border-b-2 border-black font-bold text-black" : "text-gray-400"}`}
          >
            <FiInfo /> Info
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`pb-3 text-sm flex items-center gap-2 transition-all ${activeSubTab === "history" ? "border-b-2 border-black font-bold text-black" : "text-gray-400"}`}
          >
            <FiClock /> History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeSubTab === "details" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
                <img
                  src={asset.image || getPlaceholderImage(asset.asset_name)}
                  className="w-full h-full object-cover"
                  alt={asset.asset_name}
                  onError={(e) =>
                    (e.target.src = getPlaceholderImage(asset.asset_name))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-y-6">
                {[
                  { l: "Condition", v: asset.condition },
                  { l: "Status", v: asset.asset_status },
                  { l: "Staff ID", v: asset.staff_id || "Unassigned" },
                ].map((x, i) => (
                  <div key={i}>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                      {x.l}
                    </label>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {x.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <p className="animate-pulse text-gray-400">Loading...</p>
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
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.status === "Returned" ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
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
                <div className="text-center text-gray-400 italic">
                  No History Found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          {currentStatus === "Allocated" ? (
            <button
              onClick={handleReturn}
              className="w-full bg-white border border-black py-3 rounded-xl text-sm font-bold shadow-sm"
            >
              Return Asset
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEmployeeDrawerOpen(true)}
                className="flex-[1.5] bg-white border border-gray-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                <FiUser />{" "}
                {selectedEmployee ? selectedEmployee.name : "Select Staff"}
              </button>
              <button
                disabled={!selectedEmployee}
                onClick={handleAllocate}
                className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold disabled:opacity-30 shadow-lg"
              >
                Allocate
              </button>
            </div>
          )}
        </div>

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
