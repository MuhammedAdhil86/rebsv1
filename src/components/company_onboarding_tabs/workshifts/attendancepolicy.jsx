// src/components/company_onboarding_tabs/workshifts/attendancepolicy.jsx
import React, { useEffect, useState } from "react";
import { Plus, Search, Pencil } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
import { fetchPolicyData } from "../../../service/companyService";
import CreateAttendancePolicyTab from "../../../ui/createattendancepolicy";
import UpdateAttendancePolicyTab from "../../../ui/updateattendancepolicy";

const AttendancePolicy = () => {
  const [showCreateTab, setShowCreateTab] = useState(false);
  const [showUpdateTab, setShowUpdateTab] = useState(false); // New state for Update
  const [editData, setEditData] = useState(null); // State to hold row data
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const res = await fetchPolicyData();
      setPolicyData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTabs = async () => {
    setShowCreateTab(false);
    setShowUpdateTab(false);
    setEditData(null);
    await loadPolicies();
  };

  const handleEditClick = (row) => {
    setEditData(row);
    setShowUpdateTab(true);
  };

  const getPolicyStatus = (startDateStr, endDateStr) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (now >= start && now <= end) {
      return (
        <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-600">
                    Active        {" "}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-red-100 text-red-600">
                Inactive      {" "}
      </span>
    );
  };

  return (
    <div className="w-full">
            {/* Header - Hidden if any form is open */}     {" "}
      {!showCreateTab && !showUpdateTab && (
        <div className="flex justify-between items-center mb-6 px-1">
                   {" "}
          <h2 className="text-[16px] font-medium text-gray-900">All Policy</h2> 
                 {" "}
          <div className="flex gap-3">
                       {" "}
            <div className="relative">
                           {" "}
              <input
                placeholder="Search"
                className="pl-4 pr-10 py-2 border rounded-lg text-sm w-64"
              />
                           {" "}
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
                         {" "}
            </div>
                       {" "}
            <button
              onClick={() => setShowCreateTab(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs"
            >
                            <Plus size={14} strokeWidth={3} />             
              Create Policy            {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
            {/* Logic to switch between Create, Update, and List */}     {" "}
      {showCreateTab ? (
        <CreateAttendancePolicyTab isOpen={true} onClose={handleCloseTabs} />
      ) : showUpdateTab ? (
        <UpdateAttendancePolicyTab
          initialData={editData}
          onClose={handleCloseTabs}
        />
      ) : loading ? (
        <div className="text-center text-sm text-gray-500">
                    Loading policies...        {" "}
        </div>
      ) : (
        <UniversalTable
          onRowClick={(row) => handleEditClick(row)} // Enable row clicking to edit
          columns={[
            { key: "policy_name", label: "Policy Name" },
            {
              key: "working_hours",
              label: "Duration",
              render: (val) => `${val} Hrs`,
            },
            { key: "start_time", label: "Start Time" },
            { key: "end_time", label: "End Time" },
            {
              key: "work_from_home",
              label: "Has WFH",
              render: (val) => (val ? "Yes" : "No"),
            },
            {
              key: "status",
              label: "Status",
              render: (_, row) => getPolicyStatus(row.start_date, row.end_date),
            },
            {
              key: "action",
              label: "Action",
              render: (_, row) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(row);
                  }}
                  className="text-blue-600"
                >
                                    <Pencil size={14} />               {" "}
                </button>
              ),
            },
          ]}
          data={policyData}
          rowsPerPage={6}
        />
      )}
         {" "}
    </div>
  );
};

export default AttendancePolicy;
