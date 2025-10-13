import React, { useState, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useWebSocket from "../../../Hooks/useWebsocket";
import MapModal from "../../../utils/mapmodel";
import { getLogEntriesForDate } from "../../../service/logService";

// Function to get place name from latitude & longitude
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
  const scrollRef = useRef(null);

  const { log: websocketLogs } = useWebSocket();

  const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => {
    const dateObj = dayjs().add(i, "day");
    return {
      day: dateObj.format("ddd"),
      date: dateObj.format("DD"),
      fullDate: dateObj.toDate(),
    };
  });

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
        map.set(entry.id, { ...existing, attendance: Array.from(combinedAttendance.values()) });
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
        setLogs(mergeLogs(Array.isArray(data) ? data : [], websocketLogs || []));
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

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 90;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
    setMapModal({ latitude, longitude, employeeName: name, employeeImage: image });
  };

  return (
   <div className="flex-1 grid grid-cols-1 gap-4 p-2 sm:p-4 bg-gray-100 rounded-b-2xl w-full max-w-[1020px] mx-auto">
  {/* Left Section - Logs */}
  <div className="flex flex-col gap-2">
    <h2 className="font-semibold text-lg sm:text-xl mb-2">Log Details</h2>

    {/* Calendar */}
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-2 py-1 overflow-hidden">
      <button onClick={() => scroll("left")} className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 shrink-0">
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="flex-shrink-0 text-gray-400">
        <Icon icon="solar:calendar-date-bold" className="w-4 h-4" />
      </div>

      <div ref={scrollRef} className="flex gap-1 overflow-x-auto scrollbar-hide flex-1">
        {CALENDAR_DAYS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDate(item.fullDate)}
            className={`flex flex-col items-center justify-center w-[55px] sm:w-[70px] h-[45px] sm:h-[50px] rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 flex-shrink-0 ${
              dayjs(selectedDate).format("YYYY-MM-DD") === dayjs(item.fullDate).format("YYYY-MM-DD")
                ? "bg-black text-white"
                : "bg-white text-gray-800 border border-gray-200 hover:border-gray-300"
            }`}
          >
            <span>{item.day}</span>
            <span className="font-bold mt-1">{item.date}</span>
          </button>
        ))}
      </div>

      <button onClick={() => scroll("right")} className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 shrink-0">
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Log Table */}
    <div className="overflow-x-auto mt-2">
      {loading ? (
        <p className="p-2 text-sm">Loading logs...</p>
      ) : error ? (
        <p className="p-2 text-sm text-red-600">Error: {JSON.stringify(error)}</p>
      ) : (
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-white text-gray-500 text-left text-xs uppercase">
            <tr>
              {["Name", "Device", "Time", "Distance", "Location", "Status"].map((col) => (
                <th key={col} className="px-2 sm:px-3 py-1 sm:py-2 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {logs.length > 0 ? (
              logs.map((log) =>
                log.attendance?.map((att) => {
                  const combinedDateTime =
                    log.date && att.time
                      ? `${log.date.split("T")[0]}T${att.time.split("T")[1]}`
                      : null;

                  const { latitude, longitude } = att.location_info || {};
                  const isRevealed = revealed[att.id];
                  const isLoadingLocation = loadingLocations[att.id];

                  return (
                    <tr key={att.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-3 py-1 sm:py-2">{att.name}</td>
                      <td className="px-2 sm:px-3 py-1 sm:py-2">{att.location_info?.device || "Unknown"}</td>
                      <td className="px-2 sm:px-3 py-1 sm:py-2">
                        {combinedDateTime ? dayjs(combinedDateTime).format("h:mm A, MMM D, YYYY") : "-"}
                      </td>
                      <td className="px-2 sm:px-3 py-1 sm:py-2">{att.distance || "Calculating..."} Km</td>
                      <td className="px-2 sm:px-3 py-1 sm:py-2">
                        {!latitude || !longitude ? (
                          "-"
                        ) : isRevealed ? (
                          <div>
                            {isLoadingLocation ? (
                              <span className="text-gray-400 animate-pulse">Loading location...</span>
                            ) : (
                              <>
                                <span>{locations[att.id]}</span>
                                <br />
                                <button
                                  className="text-blue-600 underline mt-1"
                                  onClick={() => handleViewMap(latitude, longitude, att.name, att.image)}
                                >
                                  View Map
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <button
                            className="text-blue-600 underline"
                            onClick={() => handleSeeLocation(att.id, latitude, longitude)}
                          >
                            See Location
                          </button>
                        )}
                      </td>
                      <td className="px-2 sm:px-3 py-1 sm:py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            att.status === "IN"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {att.status === "IN" ? "Login" : "Logout"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500 text-sm">
                  No logs found for selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>

  {/* Map Modal */}
  {mapModal && (
    <MapModal
      latitude={mapModal.latitude}
      longitude={mapModal.longitude}
      employeeName={mapModal.employeeName}
      employeeImage={mapModal.employeeImage}
      onClose={() => setMapModal(null)}
    />
  )}
</div>

  );
};

export default LogDetails;
