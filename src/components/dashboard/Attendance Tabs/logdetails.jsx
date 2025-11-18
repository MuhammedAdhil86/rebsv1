import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { Search } from "lucide-react";
import useWebSocket from "../../../Hooks/useWebsocket";
import MapModal from "../../../utils/mapmodel";
import { getLogEntriesForDate } from "../../../service/logService";

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

  const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => {
    const dateObj = dayjs().subtract(i, "day");
    return {
      day: dateObj.format("dddd"),
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLogs = logs.filter((log) =>
    log.attendance?.some((att) =>
      att.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 sm:px-4  bg-[#f9fafb] rounded-b-2xl w-full mx-auto">
      {/* Calendar */}
      <div className="flex items-center bg-[#f9fafb] rounded-xl overflow-hidden w-full">
        <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0">
          <Icon icon="solar:calendar-date-bold" className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex gap-[5px] overflow-x-auto px-[4px] scrollbar-hide">
          {CALENDAR_DAYS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(item.fullDate)}
              className={`flex flex-col items-center justify-center text-center rounded-lg transition-colors duration-200 flex-shrink-0
                ${dayjs(selectedDate).isSame(item.fullDate, "day")
                  ? "bg-black text-white"
                  : "bg-white text-gray-800 border border-gray-200 hover:border-gray-300"
                }
                w-[60px] h-[55px] sm:w-[65px] sm:h-[60px] md:w-[90px] md:h-[65px]
              `}
            >
              <span className="font-poppins font-normal text-[10px] sm:text-[11px] md:text-[12px] leading-none">{item.day}</span>
              <span className="font-bold text-[16px] sm:text-[18px] md:text-[20px] leading-none mt-[3px]">{item.date}</span>
            </button>
          ))}
        </div>
      </div>
{/* Title & Search */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ">
  <h3 className="text-base font-medium text-gray-800">
    Log Info
  </h3>

  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
    {/* Search */}
    <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white text-sm mt-2 sm:mt-0 w-full sm:w-auto">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        className="bg-transparent text-gray-600 w-full focus:outline-none text-sm bg-white"
      />
      <Search className="w-4 h-4 text-gray-400" />
    </div>
  </div>
</div>

      {/* Table Section */}
      <div className="rounded-xl bg-white overflow-y-auto max-h-[65vh] shadow-sm border border-gray-100">
        <table className="w-full text-sm text-gray-700 table-auto border-collapse">
          <thead className="text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-5 text-left font-medium">Name</th>
              <th className="px-4 py-5 text-left font-medium">Device</th>
              <th className="px-4 py-5 text-left font-medium">Time</th>
              <th className="px-4 py-5 text-left font-medium">Distance</th>
              <th className="px-4 py-5 text-left font-medium">Location</th>
              <th className="px-4 py-5 text-left font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 text-sm">
                  Loading logs...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-red-600 text-sm">
                  Error: {JSON.stringify(error)}
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 text-sm">
                  No logs found for selected date.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) =>
                log.attendance?.map((att) => {
                  const combinedDateTime =
                    log.date && att.time
                      ? `${log.date.split("T")[0]}T${att.time.split("T")[1]}`
                      : null;

                  const { latitude, longitude } = att.location_info || {};
                  const isRevealed = revealed[att.id];
                  const isLoadingLocation = loadingLocations[att.id];

                  return (
                    <tr key={att.id} className="hover:bg-gray-50 border-t text-[13px] align-middle">
                      {/* Name + Image */}
                      <td className="px-4 py-7 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJFYyBlkZfPY6Jb_BDM0gAW2jdMCFsYWxgeQ&s"
                            alt={att.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{att.name}</span>
                        </div>
                      </td>

                      {/* Device */}
                      <td className="px-4 py-5 whitespace-nowrap">
                        {att.location_info?.device || "Unknown"}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-5 whitespace-nowrap">
                        {combinedDateTime
                          ? dayjs(combinedDateTime).format("h:mm A, MMM D, YYYY")
                          : "-"}
                      </td>

                      {/* Distance */}
                      <td className="px-4 py-5 whitespace-nowrap">
                        {att.distance || "Calculating..."} Km
                      </td>

                      {/* Location */}
                      <td className="px-4 py-5 whitespace-nowrap">
                        {!latitude || !longitude ? (
                          "-"
                        ) : isRevealed ? (
                          isLoadingLocation ? (
                            <span className="text-gray-400 animate-pulse">
                              Loading location...
                            </span>
                          ) : (
                            <div className="flex flex-col">
                              <span className="truncate max-w-[180px]">
                                {locations[att.id]}
                              </span>
                              <button
                                className="text-blue-600 underline mt-1"
                                onClick={() =>
                                  handleViewMap(
                                    latitude,
                                    longitude,
                                    att.name,
                                    att.image
                                  )
                                }
                              >
                                View Map
                              </button>
                            </div>
                          )
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

                      {/* Status */}
                      <td className="px-4 py-5 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-[12.5px] font-medium ${
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
            )}
          </tbody>
        </table>
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
