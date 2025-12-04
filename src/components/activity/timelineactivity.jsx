import React, { useState, useEffect } from "react";
import { fetchTimeline } from "../../service/companyService";
import moment from "moment";

const TimelineActivity = ({ month, year, employeeId }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTimelineData = async () => {
      if (!month || !year || !employeeId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const timelineData = await fetchTimeline(month, year, employeeId);
        setActivities(timelineData || []);
      } catch (err) {
        console.error("Failed to fetch timeline data:", err);
        setError("Failed to load activity timeline. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getTimelineData();
  }, [month, year, employeeId]);

  const getDotColor = (activityType) => {
    const colors = {
      attendance: "bg-green-500",
      leave: "bg-purple-500",
      wfh: "bg-orange-500",
      "weekly off": "bg-gray-400",
      absent: "bg-red-500",
      default: "bg-black",
    };
    return colors[activityType?.toLowerCase()] || colors.default;
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === "0000-01-01T00:00:00Z") return "N/A";
    try {
      const [hours, minutes] = timeString.split("T")[1].split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      let displayHours = hours % 12;
      if (displayHours === 0) displayHours = 12;
      return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )} ${period}`;
    } catch {
      return "Invalid Time";
    }
  };

  const formatDate = (dateTimeString) =>
    dateTimeString ? moment(dateTimeString).format("MMM D, YYYY") : "";

  const formatDateTime = (dateTimeString) =>
    dateTimeString ? `${moment(dateTimeString).format("MMM D, YYYY")} ${formatTime(dateTimeString)}` : "";

  return (
    <div className="p-4 h-96 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-lg font-semibold text-black mb-4 text-center">
        Employee Activity {month && year ? `(${moment().month(month - 1).format('MMMM')} ${year})` : ''}
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading activities...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No activities found for this period
        </div>
      ) : (
        <div className="relative border-l border-gray-300">
          {activities.map((activity, index) => (
            <div key={index} className="mb-8 ml-6">
              {/* Dot */}
              <span
                className={`absolute -left-3 w-6 h-6 rounded-full ${getDotColor(activity.record_type)} ${
                  activity.approval_status === "Rejected" ? "border-2 border-red-500" : ""
                }`}
              ></span>

              {/* Left / Right content */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                {/* Left - Activity */}
                <div className="mb-2 md:mb-0">
                  <div className="text-sm font-medium">{activity.record_type || "Activity"}</div>
                  <div className="text-xs text-gray-600">Requested: {formatDateTime(activity.requested_date)}</div>
                  <div className="text-xs text-gray-600">For: {formatDate(activity.date)}</div>
                  {activity.status && (
                    <div className="text-xs mt-1 max-w-xs overflow-hidden text-ellipsis">
                      {activity.status.length > 60 ? `${activity.status.substring(0, 60)}...` : activity.status}
                    </div>
                  )}
                  {activity.in && activity.in !== "0000-01-01T00:00:00Z" && (
                    <div className="text-xs text-gray-600">In: {formatTime(activity.in)}</div>
                  )}
                  {activity.out && activity.out !== "0000-01-01T00:00:00Z" && (
                    <div className="text-xs text-gray-600">Out: {formatTime(activity.out)}</div>
                  )}
                </div>

                {/* Right - Approval */}
                <div className="text-right">
                  <div className={`text-sm font-medium ${activity.approval_status === "Rejected" ? "text-red-600" : "text-green-600"}`}>
                    {activity.approval_status || "Pending"}
                  </div>
                  {activity.approval_date && activity.approval_date.Valid && (
                    <div className="text-xs text-gray-600">
                      {activity.approval_status === "Rejected" ? "Rejected" : "Approved"}: {formatDateTime(activity.approval_date.Time)}
                    </div>
                  )}
                  {activity.manager_approver && <div className="text-xs text-gray-600">By: {activity.manager_approver}</div>}
                  {activity.duration && <div className="text-xs text-gray-600">Duration: {activity.duration}</div>}
                  {activity.approver_name && !activity.manager_approver && <div className="text-xs text-gray-600">By: {activity.approver_name}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelineActivity;
