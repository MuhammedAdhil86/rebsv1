// src/components/company_onboarding_tabs/workshifts/attendancepolicy.jsx
import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import UniversalTable from "../../../ui/universal_table";
import { fetchPolicyData } from "../../../service/companyService";
import CreateAttendancePolicyTab from "../../../ui/createattendancepolicy";

const AttendancePolicy = () => {
  const [showCreateTab, setShowCreateTab] = useState(false); // toggle top-to-bottom create form
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    loadPolicies();
  }, []);

  // Re-fetch after creation
  const handleCloseCreate = async () => {
    setShowCreateTab(false);
    const updated = await fetchPolicyData();
    setPolicyData(updated);
  };

  return (
    <div className="w-full">
      {/* Header */}
      {!showCreateTab && (
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-[16px] font-medium text-gray-900">All Policy</h2>

          <div className="flex gap-3">
            <div className="relative">
              <input
                placeholder="Search"
                className="pl-4 pr-10 py-2 border rounded-lg text-sm w-64"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              onClick={() => setShowCreateTab(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs"
            >
              <Plus size={14} strokeWidth={3} />
              Create Policy
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {showCreateTab ? (
        // Render the existing component inline as a top-to-bottom tab
        <CreateAttendancePolicyTab
          isOpen={true} // always visible
          onClose={handleCloseCreate} // hide tab and refresh table
        />
      ) : loading ? (
        <div className="text-center text-sm text-gray-500">
          Loading policies...
        </div>
      ) : (
        <UniversalTable
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
            { key: "status", label: "Status" },
          ]}
          data={policyData}
          rowsPerPage={6}
        />
      )}
    </div>
  );
};

export default AttendancePolicy;
