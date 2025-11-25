import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import useWebSocket from "../../../Hooks/useWebsocket";
import MapModal from "../../../utils/mapmodel";
import { getLogEntriesForDate } from "../../../service/logService";
import UniversalTable from "../../../ui/universal_table";

const getPlaceName = async (latitude, longitude) => {
  if (!latitude || !longitude) return "-";
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
      { headers: { "User-Agent": "LogDetailsApp" } }
    );
    const data = await response.json();
    return data.display_name || "-";
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "-";
  }
};

const LogDetails = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [locations, setLocations] = useState({});
  const [revealed, setRevealed] = useState({});
  const [loadingLocations, setLoadingLocations] = useState({});
  const [mapModal, setMapModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { log: websocketLogs } = useWebSocket();

  const mergeLogs = useCallback((historical, websocket) => {
    const map = new Map();
    historical.forEach((entry) => map.set(entry.id, entry));
    (websocket || []).forEach((entry) => {
      const existing = map.get(entry.id);
      if (existing) {
        const combinedAttendance = new Map();
        [...(existing.attendance || []), ...(entry.attendance || [])].forEach(
          (att) => combinedAttendance.set(att.id, att)
        );
        map.set(entry.id, {
          ...existing,
          attendance: Array.from(combinedAttendance.values()),
        });
      } else {
        map.set(entry.id, entry);
      }
    });
    return Array.from(map.values());
  }, []);

  const fetchLogs = useCallback(
    async (date) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLogEntriesForDate(date);
        setLogs(
          mergeLogs(Array.isArray(data) ? data : [], websocketLogs || [])
        );
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError(err.response?.data || err.message || "Unknown error");
        setLogs([]);
      } finally {
        setLoading(false);
      }
    },
    [mergeLogs, websocketLogs]
  );

  useEffect(() => {
    if ((websocketLogs || []).length > 0) {
      setLogs((prev) => mergeLogs(prev, websocketLogs || []));
    }
  }, [websocketLogs, mergeLogs]);

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate, fetchLogs]);

  const handleSeeLocation = async (attId, latitude, longitude) => {
    if (!locations[attId]) {
      setLoadingLocations((prev) => ({ ...prev, [attId]: true }));
      const placeName = await getPlaceName(latitude, longitude);
      setLocations((prev) => ({ ...prev, [attId]: placeName }));
      setLoadingLocations((prev) => ({ ...prev, [attId]: false }));
    }
    setRevealed((prev) => ({ ...prev, [attId]: true }));
  };

  const handleViewMap = (latitude, longitude, name, image) => {
    setMapModal({
      latitude,
      longitude,
      employeeName: name,
      employeeImage: image,
    });
  };

  const tableData = logs
    .flatMap((log) =>
      log.attendance?.map((att) => {
        const combinedDateTime =
          log.date && att.time
            ? `${log.date.split("T")[0]}T${att.time.split("T")[1]}`
            : null;

        const { latitude, longitude } = att.location_info || {};

        return {
          id: att.id,
          name: att.name,
          device: att.location_info?.device || "Unknown",
          time: combinedDateTime
            ? dayjs(combinedDateTime).format("h:mm A, MMM D, YYYY")
            : "-",
          distance: att.distance ? `${att.distance} Km` : "Calculating...",
          location: {
            latitude,
            longitude,
            revealed: revealed[att.id],
            loading: loadingLocations[att.id],
            text: locations[att.id],
            att,
          },
          status: att.status,
        };
      })
    )
    .filter(Boolean)
    .filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusColor = (status) =>
    status === "IN" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";

  const columns = [
    {
      label: "Name",
      key: "name",
      width: 180,
      render: (val) => {
        const shortVal = val.length > 13 ? val.substring(0, 13) + "…" : val;
        return (
          <div className="flex items-center gap-2">
            <img
              src={`https://i.pravatar.cc/40?u=${val}`}
              alt={val}
              className="w-8 h-8 rounded-full object-cover border"
            />
            {val.length > 13 ? (
              <div className="overflow-hidden max-w-[140px]">
                <div className="whitespace-nowrap hover:animate-marquee">{val}</div>
              </div>
            ) : (
              <span className="truncate max-w-[140px]">{val}</span>
            )}
          </div>
        );
      },
    },
    { label: "Device", key: "device", width: 120 },
    { label: "Time", key: "time", width: 180 },
    { label: "Distance", key: "distance", width: 120 },
    {
      label: "Location",
      key: "location",
      width: 200,
      render: (val) => {
        if (!val.latitude || !val.longitude) return "-";
        if (val.revealed) {
          if (val.loading)
            return <span className="text-gray-400 animate-pulse">Loading...</span>;
          const locText = val.text || "-";
          return (
            <div className="flex flex-col">
              <div className="overflow-hidden max-w-[180px]">
                <div className="whitespace-nowrap hover:animate-marquee">{locText}</div>
              </div>
              <button
                className="text-blue-600 underline mt-1"
                onClick={() =>
                  handleViewMap(val.latitude, val.longitude, val.att.name, val.att.image)
                }
              >
                View Map
              </button>
            </div>
          );
        }
        return (
          <button
            className="text-blue-600 underline"
            onClick={() => handleSeeLocation(val.att.id, val.latitude, val.longitude)}
          >
            See Location
          </button>
        );
      },
    },
    {
      label: "Status",
      key: "status",
      width: 100,
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-[12.5px] font-normal ${getStatusColor(val)}`}
        >
          {val === "IN" ? "Login" : "Logout"}
        </span>
      ),
    },
  ];

  return (
    <>
      <section className="bg-[#f9fafb] px-4 w-full max-w-[1280px] mx-auto rounded-xl font-[Poppins]">
        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <h3 className="text-base font-medium text-gray-800">Log Info</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-gray-600 w-full focus:outline-none text-sm"
              />
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
          </div>
        ) : (
          <UniversalTable
            columns={columns}
            data={tableData}
            rowsPerPage={8}
            className="rounded-lg shadow-sm"
          />
        )}
      </section>

      {mapModal && (
        <MapModal
          latitude={mapModal.latitude}
          longitude={mapModal.longitude}
          employeeName={mapModal.employeeName}
          employeeImage={mapModal.employeeImage}
          onClose={() => setMapModal(null)}
        />
      )}

      {/* Add marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .hover\\:animate-marquee:hover {
          animation: marquee 5s linear infinite;
        }
      `}</style>
    </>
  );
};

export default LogDetails;
