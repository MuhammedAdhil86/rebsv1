import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";
import CustomSelect from "../../../ui/customselect";
import {
  fetchEmployeePolicy,
  allocateLeavePolicy,
} from "../../../service/policiesService";
import { fetchAllLeavePolicy } from "../../../service/companyService";

export default function LeavesVacation({ uuid }) {
  const [policyInfo, setPolicyInfo] = useState({ count: 0, policy: null });
  const [allPolicies, setAllPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    if (!uuid) return;
    setLoading(true);
    try {
      const [empData, globalPoliciesResponse] = await Promise.all([
        fetchEmployeePolicy(uuid),
        fetchAllLeavePolicy(),
      ]);

      setPolicyInfo(empData);

      const policyList = Array.isArray(globalPoliciesResponse)
        ? globalPoliciesResponse
        : globalPoliciesResponse?.data || [];

      // Format options for CustomSelect: [{ label: "...", value: "..." }]
      const formattedOptions = policyList.map((p) => ({
        label: p.name || p.policy_name,
        value: p.id.toString(),
      }));
      setAllPolicies(formattedOptions);

      if (empData.policy?.id) {
        setSelectedPolicyId(empData.policy.id.toString());
      }
    } catch (error) {
      console.error("Error loading policies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [uuid]);

  const handleSave = async () => {
    if (!selectedPolicyId) return toast.error("Please select a policy");
    setIsSaving(true);
    try {
      await allocateLeavePolicy({
        leave_policy_id: Number(selectedPolicyId),
        staff_ids: [uuid],
      });
      toast.success("Policy allocated!");
      setIsEditing(false);
      const updated = await fetchEmployeePolicy(uuid);
      setPolicyInfo(updated);
    } catch (error) {
      toast.error("Failed to allocate policy");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return <div className="p-4 text-xs text-gray-400">Loading...</div>;

  const currentPolicy = policyInfo.policy;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border w-full space-y-4">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800 text-[14px]">
          {isEditing ? "Manage Leaves" : "Leaves and Vacation"}
        </h3>
        {isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="text-[12px] text-red-500 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-[12px] text-black font-bold hover:underline"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        ) : (
          <Icon
            icon="basil:edit-outline"
            className="w-5 h-5 text-gray-400 cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>

      <div className="text-sm space-y-1">
        {/* 1st: Current Policy Name (Using CustomSelect in Edit mode) */}
        <div className="flex justify-between items-center border-b border-gray-100 py-2 min-h-[45px]">
          <span className="text-gray-500 text-[12px]">Current Policy</span>
          {isEditing ? (
            <CustomSelect
              value={selectedPolicyId}
              options={allPolicies}
              onChange={setSelectedPolicyId}
              minWidth={200}
            />
          ) : (
            <span className="font-medium text-black text-[13px]">
              {currentPolicy?.name ||
                currentPolicy?.policy_name ||
                "Not Assigned"}
            </span>
          )}
        </div>

        {/* 2nd: Policy Count */}
        <Row label="Policy Count" value={policyInfo.count} />

        {/* Leave Limits */}
        <Row
          label="Annual Leave"
          value={`${currentPolicy?.annual_limit || 0} days`}
        />
        <Row
          label="Sick Leave"
          value={`${currentPolicy?.sick_limit || 0} days`}
        />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 py-2">
      <span className="text-gray-500 text-[12px]">{label}</span>
      <span className="font-medium text-gray-800 text-[13px]">{value}</span>
    </div>
  );
}
