// import React from "react";
// import SideBar from "../components/sidebar";
// import { FaSearch, FaThLarge, FaList } from "react-icons/fa";

// function Employees({ userId, userName, onLogout }) {
//   const employees = [
//     { name: "Riyas Muhammad", designation: "CEO & Founder", date: "May 10, 2025", mobile: "9207093845", status: "Active" },
//     { name: "Rohith R R", designation: "Golang Developer", date: "May 10, 2025", mobile: "9207093845", status: "Deactivated" },
//     { name: "Greeshma", designation: "React Developer", date: "May 10, 2025", mobile: "9207093845", status: "Active" },
//     { name: "Hriday S B", designation: "Web Developer", date: "May 10, 2025", mobile: "9207093845", status: "Active" },
//     { name: "Gokul S", designation: "Golang Developer", date: "May 10, 2025", mobile: "9207093845", status: "Deactivated" },
//     { name: "Atwin Lal", designation: "UI/UX Designer", date: "May 10, 2025", mobile: "9207093845", status: "Deactivated" },
//     { name: "Manu", designation: "React Developer", date: "May 10, 2025", mobile: "9207093845", status: "Deactivated" },
//     { name: "Adithryu", designation: "React Developer", date: "May 10, 2025", mobile: "9207093845", status: "Active" },
//     { name: "Atwin Gigi", designation: "Golang Developer", date: "May 10, 2025", mobile: "9207093845", status: "Active" },
//     { name: "Manu Gopi", designation: "React Developer", date: "May 10, 2025", mobile: "9207093845", status: "Active" },
//   ];

//   return (
//     <div className="flex h-screen bg-black p-3 overflow-hidden">
//       {/* Sidebar */}
//       <SideBar
//         userId={userId}
//         userName={userName}
//         isCollapsed={false}
//         toggleSidebar={() => {}}
//         onLogout={onLogout}
//       />

//       {/* Main Content */}
//       <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-y-auto ml-3 p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-gray-700 font-semibold text-sm">Manage Employees</h1>
//             <div className="flex mt-2 border-b border-gray-200">
//               <button className="px-4 pb-2 border-b-2 border-black text-black font-medium text-sm">
//                 All Employees
//               </button>
//               <button className="px-4 pb-2 text-gray-500 text-sm">Active Employees</button>
//               <button className="px-4 pb-2 text-gray-500 text-sm">Deleted Employees</button>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <button className="border rounded-full p-2 hover:bg-gray-100">
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/1827/1827429.png"
//                 alt="settings"
//                 className="w-4 h-4"
//               />
//             </button>
//             <div className="w-10 h-10 rounded-full overflow-hidden border">
//               <img
//                 src="https://via.placeholder.com/40"
//                 alt="profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Top Actions */}
//         <div className="bg-white rounded-2xl shadow p-6">
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex items-center gap-2">
//               <span className="text-red-500 text-lg font-semibold">8</span>
//               <span className="text-gray-700 text-sm font-medium">Total Employee</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
//                 + Bulk Action
//               </button>
//               <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm">
//                 + Add Employee
//               </button>

//               <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 ml-2">
//                 <FaSearch className="text-gray-400 text-sm" />
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="bg-transparent outline-none text-sm text-gray-600 ml-2"
//                 />
//               </div>

//               <div className="flex gap-2 ml-2">
//                 <button className="border rounded-lg p-2 hover:bg-gray-100">
//                   <FaThLarge className="text-gray-600" />
//                 </button>
//                 <button className="border rounded-lg p-2 hover:bg-gray-100">
//                   <FaList className="text-gray-600" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Employee Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left">
//               <thead>
//                 <tr className="text-gray-500 border-b">
//                   <th className="py-3 px-4">
//                     <input type="checkbox" />
//                   </th>
//                   <th className="py-3 px-4">Name</th>
//                   <th className="py-3 px-4">Designation</th>
//                   <th className="py-3 px-4">Date of Joining</th>
//                   <th className="py-3 px-4">Department</th>
//                   <th className="py-3 px-4">Branch</th>
//                   <th className="py-3 px-4">Mobile</th>
//                   <th className="py-3 px-4">Status</th>
//                   <th className="py-3 px-4"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.map((emp, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-50 transition">
//                     <td className="py-3 px-4">
//                       <input type="checkbox" />
//                     </td>
//                     <td className="py-3 px-4 text-gray-700">{emp.name}</td>
//                     <td className="py-3 px-4 text-gray-500">{emp.designation}</td>
//                     <td className="py-3 px-4 text-gray-500">{emp.date}</td>
//                     <td className="py-3 px-4 text-gray-400">N/A</td>
//                     <td className="py-3 px-4 text-gray-400">N/A</td>
//                     <td className="py-3 px-4 text-gray-500">{emp.mobile}</td>
//                     <td className="py-3 px-4">
//                       {emp.status === "Active" ? (
//                         <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-medium">
//                           Active
//                         </span>
//                       ) : (
//                         <span className="bg-red-100 text-red-500 px-3 py-1 rounded-lg text-xs font-medium">
//                           Deactivated
//                         </span>
//                       )}
//                     </td>
//                     <td className="py-3 px-4 text-right text-gray-500 cursor-pointer">⋮</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
//             <span>
//               Rows per page: <b>10</b>
//             </span>
//             <span>1–10 of 11</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageEmployees;
