// src/components/ShiftRatioCard.jsx
import React from "react";

const ShiftRatioCard = ({ attendance }) => {
  const { total, online, delay, late, absent } = attendance;

  const onlinePerc = (online / total) * 100;
  const delayPerc = (delay / total) * 100;
  const latePerc = (late / total) * 100;
  const absentPerc = (absent / total) * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="text-sm font-medium text-gray-800 mb-3">Shift Ratio</div>
      <div className="text-lg font-medium text-gray-900 mb-3">
        {total} <span className="text-sm text-gray-500">Attendance</span>
      </div>

      <div className="h-2 w-full flex rounded-full overflow-hidden">
        <div className="h-full bg-green-400" style={{ width: `${onlinePerc}%` }} />
        <div className="h-full bg-cyan-400" style={{ width: `${delayPerc}%` }} />
        <div className="h-full bg-blue-600" style={{ width: `${latePerc}%` }} />
        <div className="h-full bg-pink-500" style={{ width: `${absentPerc}%` }} />
      </div>

      <div className="flex items-center justify-between gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Online</span>
            <span className="text-gray-800 font-medium">{online}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-cyan-400 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Delay</span>
            <span className="text-gray-800 font-medium">{delay}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Late</span>
            <span className="text-gray-800 font-medium">
              {String(late).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-pink-500 rounded-full" />
          <div className="flex flex-col items-center">
            <span>Absent</span>
            <span className="text-gray-800 font-medium">{absent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftRatioCard;





// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../service/axiosinstance";

// const ShiftRatioCard = () => {
//   const [attendance, setAttendance] = useState({
//     total: 0,
//     online: 0,
//     delay: 0,
//     late: 0,
//     absent: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadShiftRatio();
//   }, []);

//   const loadShiftRatio = async () => {
//     try {
//       const res = await axiosInstance.get(
//         axiosInstance.baseURL2 + "/admin/staff/shiftwise-attendance-status"
//       );

//       console.log("Shift Ratio API Response:", res.data);

//       const data = res.data?.data || {};
//       const splits = data.splits || [];

//       // Map splits array to individual counts
//       let online = 0,
//         delay = 0,
//         late = 0,
//         absent = 0;

//       splits.forEach((item) => {
//         switch (item.status) {
//           case "Online":
//             online = item.count;
//             break;
//           case "Absent":
//             absent = item.count;
//             break;
//           case "Late":
//             late = item.count;
//             break;
//           case "On time":
//             delay = item.count; // assuming "On time" is counted as delay-free
//             break;
//           default:
//             break;
//         }
//       });

//       setAttendance({
//         total: data.total_employees || 0,
//         online,
//         delay,
//         late,
//         absent,
//       });
//     } catch (error) {
//       console.error("Shift Ratio Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const { total, online, delay, late, absent } = attendance;
//   const safeTotal = total || 1;

//   const onlinePerc = (online / safeTotal) * 100;
//   const delayPerc = (delay / safeTotal) * 100;
//   const latePerc = (late / safeTotal) * 100;
//   const absentPerc = (absent / safeTotal) * 100;

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl p-4 shadow-sm">
//         <div className="animate-pulse h-4 w-24 bg-gray-200 rounded mb-3" />
//         <div className="animate-pulse h-6 w-20 bg-gray-200 rounded mb-4" />
//         <div className="animate-pulse h-2 w-full bg-gray-200 rounded" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl p-4 shadow-sm">
//       <div className="text-sm font-medium text-gray-800 mb-3">Shift Ratio</div>

//       <div className="text-lg font-medium text-gray-900 mb-3">
//         {total} <span className="text-sm text-gray-500">Attendance</span>
//       </div>

//       {/* Ratio Bar */}
//       <div className="h-2 w-full flex rounded-full overflow-hidden">
//         <div className="h-full bg-green-400" style={{ width: `${onlinePerc}%` }} />
//         <div className="h-full bg-cyan-400" style={{ width: `${delayPerc}%` }} />
//         <div className="h-full bg-blue-600" style={{ width: `${latePerc}%` }} />
//         <div className="h-full bg-pink-500" style={{ width: `${absentPerc}%` }} />
//       </div>

//       {/* Labels */}
//       <div className="flex items-center justify-between gap-4 mt-3 text-xs text-gray-500">
//         <div className="flex items-center gap-1">
//           <span className="w-2 h-2 bg-green-400 rounded-full" />
//           <div className="flex flex-col items-center">
//             <span>Online</span>
//             <span className="text-gray-800 font-medium">{online}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-1">
//           <span className="w-2 h-2 bg-cyan-400 rounded-full" />
//           <div className="flex flex-col items-center">
//             <span>Delay</span>
//             <span className="text-gray-800 font-medium">{delay}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-1">
//           <span className="w-2 h-2 bg-blue-600 rounded-full" />
//           <div className="flex flex-col items-center">
//             <span>Late</span>
//             <span className="text-gray-800 font-medium">{late}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-1">
//           <span className="w-2 h-2 bg-pink-500 rounded-full" />
//           <div className="flex flex-col items-center">
//             <span>Absent</span>
//             <span className="text-gray-800 font-medium">{absent}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShiftRatioCard;
