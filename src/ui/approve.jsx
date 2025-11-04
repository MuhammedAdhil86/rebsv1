import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AiOutlinePlus } from "react-icons/ai";
import AddNote from "../ui/AddNote";
import useLeaveStore from "../store/useleaveStore";

// Format a date to dd-mm-yyyy
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// Calculate difference in days (inclusive)
const getDateRangeArray = (startDate, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Get all dates of the month for a given date
const getAllMonthDates = (date) => {
  if (!date) return [];
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return getDateRangeArray(firstDay, lastDay);
};

const LeaveRequestApprove = ({ user, onClose }) => {
  const { updateLeaveStatus } = useLeaveStore();
  const [status, setStatus] = useState(null);
  const [note, setNote] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const localStorageUser = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(localStorageUser);
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
    }
  }, []);

  const leaveDates = user.leave_date || [];
  const firstLeaveDate =
    leaveDates.length > 0
      ? new Date(Math.min(...leaveDates.map((l) => new Date(l.date))))
      : null;
  const endLeaveDate =
    leaveDates.length > 0
      ? new Date(Math.max(...leaveDates.map((l) => new Date(l.date))))
      : firstLeaveDate;

  const totalDays = leaveDates.length;

  const isLeaveDay = (date) => {
    const leave = leaveDates.find((l) => dayjs(l.date).isSame(dayjs(date), "day"));
    return leave ? true : false;
  };

  const isHalfDay = (date) => {
    const leave = leaveDates.find((l) => dayjs(l.date).isSame(dayjs(date), "day"));
    return leave && (leave.half_day === "true" || leave.half_day === true);
  };

  const handleApprove = async () => {
    setStatus("Approved");
    try {
      await updateLeaveStatus(user.leave_ref_no, "Approved", note);
      if (onClose) onClose();
    } catch (err) {
      console.error("Error approving leave:", err);
    }
  };

  const handleReject = async () => {
    setStatus("Rejected");
    try {
      await updateLeaveStatus(user.leave_ref_no, "Rejected", note);
      if (onClose) onClose();
    } catch (err) {
      console.error("Error rejecting leave:", err);
    }
  };

  const toggleDrawer = (open) => setDrawerOpen(open);

  const isSuperAdmin = currentUser && currentUser.user_type === "Super admin";
  const shouldShowApprovalButtons =
    isSuperAdmin || user.manager_approval_status === "Approved";

  // Generate calendar dates for the full month
  const calendarDates = firstLeaveDate ? getAllMonthDates(firstLeaveDate) : [];

  return (
    <div className="max-w-md font-poppins mx-auto mt-4">
      {/* Header */}
      <div className="pb-3 text-black font-medium text-lg">
        Leave Request Approval
      </div>

      {/* User Info */}
      <div className="p-3 bg-white border border-gray-300 rounded-lg mb-6">
        <div className="mb-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-medium text-gray-600">
            {user.name && user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-base text-black font-semibold">{user.name}</h3>
            <p className="text-xs text-gray-600">
              {user.type} | {totalDays} day(s)
            </p>
          </div>
        </div>

        {/* Dates & Type */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Date</p>
            <p className="text-sm text-black">
              {firstLeaveDate ? formatDate(firstLeaveDate) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Leave type</p>
            <p className="text-sm text-black">{user.type}</p>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">Reason</p>
          <p className="text-sm text-black">{user.reason}</p>
        </div>

        {/* Manager Approval */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">
            Manager Approval Status
          </p>
          <p
            className={`text-sm font-medium ${
              user.manager_approval_status === "Approved"
                ? "text-green-600"
                : user.manager_approval_status === "Rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {user.manager_approval_status}
          </p>
          {user.manager_remarks && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-600">Manager Remarks</p>
              <p className="text-sm text-black">{user.manager_remarks}</p>
            </div>
          )}
        </div>

        {/* Approval Buttons */}
        {shouldShowApprovalButtons && (
          <>
            <div className="mb-4">
              <button
                onClick={() => toggleDrawer(true)}
                className="w-full py-2 px-4 font-semibold bg-gray-100 text-black rounded-xl flex items-center justify-center"
              >
                <AiOutlinePlus className="mr-2" /> Add a Note
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleReject}
                className="flex-1 py-2 px-4 border font-semibold border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition duration-200"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 py-2 px-4 font-semibold bg-green-500 text-white rounded-xl hover:bg-green-600 transition duration-200"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2 px-4 border font-semibold border-yellow-400 text-yellow-400 rounded-xl hover:bg-yellow-50 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Drawer for Notes */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
          <div className="bg-white w-96 p-6 h-full shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-black font-bold"
              onClick={() => toggleDrawer(false)}
            >
              X
            </button>
            <AddNote
              onSubmit={(noteText) => {
                setNote(noteText);
                toggleDrawer(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Calendar visualization */}
      <div className="p-3 border border-gray-300 rounded-lg flex">
        <div className="w-3/4 grid grid-cols-7 gap-1">
          {calendarDates.map((date, idx) => {
            const isLeave = isLeaveDay(date);
            const isHalf = isHalfDay(date);
            return (
              <div
                key={idx}
                className={`h-8 w-8 flex items-center justify-center rounded-full ${
                  isHalf
                    ? "bg-lime-500 text-white"
                    : isLeave
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>

        <div className="w-1/4 flex flex-col space-y-4 ml-4">
          <div className="bg-gray-100 p-2 text-xs font-semibold rounded-lg">
            Start Date:{" "}
            <span className="text-black">
              {firstLeaveDate ? formatDate(firstLeaveDate) : "N/A"}
            </span>
          </div>
          <div className="bg-gray-100 p-2 text-xs font-semibold rounded-lg">
            End Date:{" "}
            <span className="text-black">
              {endLeaveDate ? formatDate(endLeaveDate) : "N/A"}
            </span>
          </div>
          <div className="bg-black text-center text-xs font-semibold p-2 rounded-lg text-white">
            Total Days: {totalDays}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestApprove;
