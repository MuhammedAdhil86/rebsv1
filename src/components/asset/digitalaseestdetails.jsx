import React, { useState, useEffect, useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import {
  FiX,
  FiClock,
  FiInfo,
  FiUser,
  FiGlobe,
  FiLock,
  FiExternalLink,
  FiCopy,
  FiShield,
  FiCalendar,
  FiKey,
} from "react-icons/fi";
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
  fetchDigitalTimelineById,
  returnDigitalAsset,
  allocateDigitalAsset,
} from "../../service/assetservice";

const DigitalAssetDetailDrawer = ({ asset, onRefresh, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState("details");
  const [history, setHistory] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployeeDrawerOpen, setIsEmployeeDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const getPlaceholderImage = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Asset")}&background=f3f4f6&color=a1a1aa&size=512&bold=true`;

  const fetchHistory = useCallback(async () => {
    if (!asset?.id) return;
    setIsLoading(true);
    try {
      const response = await fetchDigitalTimelineById(asset.id);
      const data = response?.data || response || [];
      setHistory(data);

      // Sync status: History takes precedence, otherwise fallback to asset object
      setCurrentStatus(
        data.length > 0 ? data[data.length - 1].status : asset.account_status,
      );
    } catch (e) {
      console.error("Digital History sync failed", e);
    } finally {
      setIsLoading(false);
    }
  }, [asset?.id, asset?.account_status]);

  useEffect(() => {
    if (asset?.id) {
      fetchHistory();
      setSelectedEmployee(null);
      setActiveSubTab("details");
    }
  }, [asset?.id, fetchHistory]);

  const handleAction = async (type) => {
    const toastId = toast.loading(
      type === "return" ? "Revoking access..." : "Granting access...",
    );

    try {
      if (type === "return") {
        const activeAllocation = [...history]
          .reverse()
          .find((a) => a.status === "Allocated");

        const staffId = activeAllocation?.staff_id || asset.staff_id;

        if (!staffId)
          throw new Error("No active staff found for this account.");

        await returnDigitalAsset({
          asset_id: asset.id,
          staff_id: staffId,
        });
        toast.success("Access revoked successfully", { id: toastId });
      } else {
        if (!selectedEmployee) {
          toast.error("Please select an employee", { id: toastId });
          return;
        }

        await allocateDigitalAsset({
          asset_id: asset.id,
          staff_id: selectedEmployee.uuid,
        });
        toast.success(`Access granted to ${selectedEmployee.name}`, {
          id: toastId,
        });
      }

      onRefresh();
      setTimeout(() => onClose(), 600);
    } catch (e) {
      const errorMsg =
        e.response?.data?.message || e.message || "Action failed";
      toast.error(errorMsg, { id: toastId });
    }
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      style: { fontSize: "11px", fontWeight: "600" },
      icon: "📋",
    });
  };

  if (!asset) return null;

  return (
    <Drawer
      anchor="right"
      open={!!asset}
      onClose={onClose}
      PaperProps={{ className: "w-full max-w-[500px] border-none shadow-2xl" }}
    >
      <div className="h-full flex flex-col bg-white font-poppins text-[12px]">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2
              className="text-[17px] 
             text-gray-900 leading-tight uppercase tracking-tight"
            >
              {asset.account_name}
            </h2>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest">
              {asset.account_type || "Digital Account"} • ID: {asset.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-6 pt-2 gap-8 border-b bg-gray-50/30">
          {[
            { id: "details", label: "Credentials", icon: <FiLock /> },
            { id: "history", label: "Access Log", icon: <FiClock /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 text-[12px] flex items-center gap-2 transition-all relative ${
                activeSubTab === tab.id
                  ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeSubTab === "details" ? (
            <div className="space-y-8">
              {/* Visual Preview */}
              <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden aspect-video bg-gray-50 flex items-center justify-center relative group">
                <img
                  src={asset.image || getPlaceholderImage(asset.account_name)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={asset.account_name}
                  onError={(e) =>
                    (e.target.src = getPlaceholderImage(asset.account_name))
                  }
                />
                {asset.account_url && (
                  <a
                    href={
                      asset.account_url.startsWith("http")
                        ? asset.account_url
                        : `https://${asset.account_url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 right-4 p-2.5 bg-white/95 backdrop-blur rounded-xl shadow-lg hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"
                  >
                    <FiExternalLink size={16} />
                  </a>
                )}
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    label: "Login URL",
                    val: asset.account_url,
                    icon: <FiGlobe />,
                    copy: true,
                  },
                  {
                    label: "Username / Email",
                    val: asset.username,
                    icon: <FiUser />,
                    copy: true,
                  },
                  {
                    label: "Password",
                    val: asset.password,
                    icon: <FiKey />,
                    copy: true,
                  },
                  {
                    label: "Passkey / Code",
                    val: asset.passkey,
                    icon: <FiShield />,
                    copy: true,
                  },
                  {
                    label: "Assigned Staff",
                    val: asset.staff_name,
                    icon: <FiUser />,
                    copy: false,
                  },
                  {
                    label: "Created On",
                    val: asset.created_on
                      ? new Date(asset.created_on).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : null,
                    icon: <FiCalendar />,
                    copy: false,
                  },
                  {
                    label: "Current Status",
                    val: currentStatus,
                    icon: <FiInfo />,
                    copy: false,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group border-b border-gray-50 pb-5 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-300 group-hover:text-black transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <label className="text-[10px] uppercase  text-gray-400 tracking-widest block">
                          {item.label}
                        </label>
                        <p className="text-[13px] font-medium text-gray-800 mt-1 truncate max-w-[260px]">
                          {item.val || "—"}
                        </p>
                      </div>
                    </div>
                    {item.copy && item.val && (
                      <button
                        onClick={() => copyToClipboard(item.val, item.label)}
                        className="p-2.5 text-gray-300 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                      >
                        <FiCopy size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* History Timeline */
            <div className="pt-2">
              {isLoading ? (
                <div className="py-24 text-center text-gray-400 italic">
                  Syncing access logs...
                </div>
              ) : history.length > 0 ? (
                <Timeline sx={{ p: 0 }}>
                  {[...history].reverse().map((item, idx) => (
                    <TimelineItem
                      key={idx}
                      sx={{ "&::before": { display: "none" } }}
                    >
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: "black",
                            width: "7px",
                            height: "7px",
                            boxShadow: "none",
                          }}
                        />
                        {idx !== history.length - 1 && (
                          <TimelineConnector sx={{ bgcolor: "#f3f4f6" }} />
                        )}
                      </TimelineSeparator>
                      <TimelineContent sx={{ pb: 5, pt: 0 }}>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 transition-all hover:border-gray-200">
                          <div className="flex justify-between items-center">
                            <p className="text-[13px]  text-gray-900">
                              {item.staff_name || "Unknown User"}
                            </p>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase ${
                                item.status === "Allocated"
                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium">
                            {new Date(item.date).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <div className="py-24 text-center text-gray-300 italic">
                  No access records found for this asset.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-6 border-t bg-white sticky bottom-0">
          {currentStatus === "Allocated" ? (
            <button
              onClick={() => handleAction("return")}
              className="w-full bg-white border-2 border-black py-4 rounded-2xl text-[12px]  hover:bg-black hover:text-white transition-all shadow-md active:scale-[0.98]"
            >
              Revoke Employee Access
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => setIsEmployeeDrawerOpen(true)}
                className="flex-[1.5] bg-gray-50 border border-gray-200 py-4 rounded-2xl text-[12px] flex items-center justify-center gap-2 hover:border-black transition-all font-medium"
              >
                <FiUser />{" "}
                {selectedEmployee ? selectedEmployee.name : "Select Staff"}
              </button>
              <button
                disabled={!selectedEmployee}
                onClick={() => handleAction("allocate")}
                className="flex-1 bg-black text-white py-4 rounded-2xl text-[12px] disabled:opacity-30 transition-all shadow-xl active:scale-[0.98]"
              >
                Grant Access
              </button>
            </div>
          )}
        </div>

        {/* Staff Selection Sub-Drawer */}
        <Drawer
          anchor="right"
          open={isEmployeeDrawerOpen}
          onClose={() => setIsEmployeeDrawerOpen(false)}
          PaperProps={{ className: "w-full max-w-[480px] shadow-2xl" }}
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

export default DigitalAssetDetailDrawer;
