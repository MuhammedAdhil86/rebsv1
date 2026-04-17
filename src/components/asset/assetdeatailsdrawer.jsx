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
import toast from "react-hot-toast";

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

  const [isActionLoading, setIsActionLoading] = useState(false); // ✅ for buttons

  const getPlaceholderImage = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=f3f4f6&color=a1a1aa&size=512&bold=true`;

  // ✅ FETCH ALLOCATIONS
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
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to load asset history",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (asset?.id) fetchAllocations();
  }, [asset?.id]);

  // ✅ RETURN ASSET
  const handleReturn = async () => {
    const active = [...allocations]
      .reverse()
      .find((a) => a.status === "Allocated");

    if (!active) {
      toast.error("No active allocation found");
      return;
    }

    setIsActionLoading(true);

    try {
      const res = await returnAsset(asset.id, active.staff_id);

      toast.success(res?.data?.message || "Asset returned successfully");

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to return asset";

      toast.error(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // ✅ ALLOCATE ASSET
  const handleAllocate = async () => {
    if (!selectedEmployee) {
      toast.error("Please select a staff member");
      return;
    }

    setIsActionLoading(true);

    try {
      const res = await axiosInstance.post("/admin/assetallocation/add", {
        asset_id: asset.id,
        staff_id: selectedEmployee.uuid,
      });

      toast.success(res?.data?.message || "Asset allocated successfully");

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Allocation failed";

      const fieldErrors = err.response?.data?.errors;

      if (fieldErrors && typeof fieldErrors === "object") {
        Object.values(fieldErrors).forEach((errorArr) => {
          if (Array.isArray(errorArr)) {
            errorArr.forEach((msg) => toast.error(msg));
          } else {
            toast.error(errorArr);
          }
        });
      } else {
        toast.error(message);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!asset) return null;

  return (
    <Drawer
      anchor="right"
      open={!!asset}
      onClose={onClose}
      PaperProps={{ className: "w-full max-w-[500px] shadow-2xl" }}
    >
      <div className="h-full flex flex-col bg-white">
        {/* HEADER */}
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

        {/* TABS */}
        <div className="flex px-6 pt-4 gap-6 border-b">
          <button
            onClick={() => setActiveSubTab("details")}
            className={`pb-3 text-sm flex items-center gap-2 ${
              activeSubTab === "details"
                ? "border-b-2 border-black font-bold"
                : "text-gray-400"
            }`}
          >
            <FiInfo /> Info
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`pb-3 text-sm flex items-center gap-2 ${
              activeSubTab === "history"
                ? "border-b-2 border-black font-bold"
                : "text-gray-400"
            }`}
          >
            <FiClock /> History
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubTab === "details" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border overflow-hidden aspect-video bg-gray-50">
                <img
                  src={asset.image || getPlaceholderImage(asset.asset_name)}
                  className="w-full h-full object-cover"
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
                    <label className="text-[10px] uppercase text-gray-400">
                      {x.l}
                    </label>
                    <p className="text-sm font-semibold mt-1">{x.v}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {isLoading ? (
                <p className="text-gray-400 animate-pulse">Loading...</p>
              ) : allocations.length > 0 ? (
                <Timeline position="right">
                  {[...allocations].reverse().map((item, idx) => (
                    <TimelineItem key={idx}>
                      <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: "black" }} />
                        {idx !== allocations.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>

                      <TimelineContent>
                        <div className="bg-gray-50 p-4 rounded-xl border">
                          <div className="flex justify-between">
                            <p className="font-bold">{item.staff_name}</p>
                            <span className="text-xs">{item.status}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <p className="text-gray-400 text-center">No History Found</p>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50">
          {currentStatus === "Allocated" ? (
            <button
              onClick={handleReturn}
              disabled={isActionLoading}
              className="w-full border border-black py-3 rounded-xl font-bold"
            >
              {isActionLoading ? "Processing..." : "Return Asset"}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEmployeeDrawerOpen(true)}
                className="flex-[1.5] border py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <FiUser />
                {selectedEmployee ? selectedEmployee.name : "Select Staff"}
              </button>

              <button
                disabled={!selectedEmployee || isActionLoading}
                onClick={handleAllocate}
                className="flex-1 bg-black text-white py-3 rounded-xl disabled:opacity-30"
              >
                {isActionLoading ? "Allocating..." : "Allocate"}
              </button>
            </div>
          )}
        </div>

        {/* EMPLOYEE DRAWER */}
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
