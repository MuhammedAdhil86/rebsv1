import React, { useState, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useWebSocket from "../../../Hooks/useWebsocket";
import MapModal from "../../../utils/mapmodel";
import { getLogEntriesForDate } from "../../../service/logService";

// Function to get place name from latitude & longitude using OpenStreetMap Nominatim
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

  const { connectionStatus, log: websocketLogs } = useWebSocket();

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
    <div className="p-4 sm:p-6 bg-gray-100 rounded-b-2xl w-full lg:w-[1020px]">
      <h2 className="font-semibold text-lg sm:text-xl">Log Details</h2>

      {/* Calendar */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 sm:px-4 py-2 sm:py-3 overflow-hidden">
        <button
          onClick={() => scroll("left")}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-200 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-shrink-0 text-gray-400">
          <Icon icon="solar:calendar-date-bold" className="w-5 h-5" />
        </div>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
        >
          {CALENDAR_DAYS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(item.fullDate)}
              className={`flex flex-col items-center justify-center w-[60px] sm:w-[75px] h-[50px] sm:h-[55px] rounded-xl text-xs font-medium transition-all duration-200 flex-shrink-0 ${
                dayjs(selectedDate).format("YYYY-MM-DD") ===
                dayjs(item.fullDate).format("YYYY-MM-DD")
                  ? "bg-black text-white"
                  : "bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-300"
              }`}
            >
              <span className="text-[9px] sm:text-[10px]">{item.day}</span>
              <span className="text-[12px] sm:text-[14px] font-bold mt-1">{item.date}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-200 shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Log Table */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <p className="p-4">Loading logs...</p>
        ) : error ? (
          <p className="p-4 text-red-600">Error: {JSON.stringify(error)}</p>
        ) : (
          <table className=" text-sm rounded-lg overflow-hidden min-w-[600px] sm:min-w-full w-[900px]">
            <thead className="bg-white text-gray-500 text-left text-xs uppercase">
              <tr>
                {["Name", "Device", "Time", "Distance", "Location", "Status"].map(
                  (col) => (
                    <th key={col} className="px-3 sm:px-4 py-2 sm:py-3 font-medium">
                      {col}
                    </th>
                  )
                )}
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
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{att.name}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {att.location_info?.device || "Unknown"}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {combinedDateTime
                            ? dayjs(combinedDateTime).format(
                                "h:mm A, MMMM D, YYYY"
                              )
                            : "-"}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {att.distance || "Calculating..."} Km
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {!latitude || !longitude ? (
                            "-"
                          ) : isRevealed ? (
                            <div>
                              {isLoadingLocation ? (
                                <span className="text-gray-400 animate-pulse">
                                  Loading location...
                                </span>
                              ) : (
                                <>
                                  <span>{locations[att.id]}</span>
                                  <br />
                                  <button
                                    className="text-blue-600 underline mt-1"
                                    onClick={() =>
                                      handleViewMap(latitude, longitude, att.name, att.image)
                                    }
                                  >
                                    View Map
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <button
                              className="text-blue-600 underline"
                              onClick={() =>
                                handleSeeLocation(att.id, latitude, longitude)
                              }
                            >
                              See Location
                            </button>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
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
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No logs found for selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
