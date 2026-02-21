import React, { useState } from "react";
import { ChevronLeft, Palmtree } from "lucide-react";
// Import the service where you added updateLeavePolicy
import attendancePolicyService from "../../../service/attendancepolicyService";
import toast from "react-hot-toast";

import BasicInfoCard from "./leavepolicy/basicinfocard";
import AccrualPolicyCard from "./leavepolicy/accrualpolicycard";
import RequestPreferencesCard from "./leavepolicy/requestpreferencecard";
import ApplicabilityCard from "./leavepolicy/applicabiltycard";

export const globalFont = "font-['Poppins'] font-normal text-[12px]";

const UpdateLeavePolicyTab = ({ onClose, policyData, refreshData }) => {
  const [loading, setLoading] = useState(false);

  // Initialize state with the existing policyData
  const [formData, setFormData] = useState({
    id: policyData?.id || null,
    name: policyData?.name || "",
    code: policyData?.code || "",
    leave_type: policyData?.leave_type || "Paid",
    color: policyData?.color || "#00AEEF",
    description: policyData?.description || "",
    accrual_method: policyData?.accrual_method || "monthly",
    employee_accrues: policyData?.employee_accrues || 0,
    prorate_for_new_joiners: policyData?.prorate_for_new_joiners ?? true,
    postpone_accrual: policyData?.postpone_accrual ?? false,
    postpone_accrual_value: policyData?.postpone_accrual_value || 0,
    postpone_accrual_period: policyData?.postpone_accrual_period || "days",
    reset_leave_balance: policyData?.reset_leave_balance ?? true,
    reset_leave_period: policyData?.reset_leave_period || "yearly",
    carry_forward: policyData?.carry_forward ?? false,
    carry_forward_limit: policyData?.carry_forward_limit || 0,
    encash_leave: policyData?.encash_leave ?? false,
    encash_limit: policyData?.encash_limit || 0,
    allow_negative_balance: policyData?.allow_negative_balance ?? false,
    consider_negative_balance: policyData?.consider_negative_balance || "",
    allow_past_leave: policyData?.allow_past_leave ?? false,
    past_leave_limit: policyData?.past_leave_limit || null,
    allow_future_leave: policyData?.allow_future_leave ?? false,
    future_leave_limit: policyData?.future_leave_limit || null,
    is_active: policyData?.is_active ?? true,
    Criteria: policyData?.Criteria || { allocate_all: true },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCriteriaChange = (newCriteria) => {
    setFormData((prev) => ({ ...prev, Criteria: newCriteria }));
  };

  const handleUpdate = async () => {
    // Ensure we have an ID before trying to update
    if (!formData.id) {
      toast.error("Policy ID is missing. Cannot update.");
      return;
    }

    try {
      setLoading(true);
      const requestBody = {
        ...formData,
        employee_accrues: Number(formData.employee_accrues || 0),
        postpone_accrual_value: Number(formData.postpone_accrual_value || 0),
        carry_forward_limit: Number(formData.carry_forward_limit || 0),
        encash_limit: Number(formData.encash_limit || 0),
        past_leave_limit: formData.allow_past_leave
          ? Number(formData.past_leave_limit)
          : null,
        future_leave_limit: formData.allow_future_leave
          ? Number(formData.future_leave_limit)
          : null,
      };

      // Call the new service method you just added
      await attendancePolicyService.updateLeavePolicy(formData.id, requestBody);

      toast.success("Leave policy updated successfully");
      if (refreshData) refreshData();
      onClose();
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to update leave policy",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full bg-[#F9FAFB] rounded-2xl shadow-inner ${globalFont}`}
    >
      <div className="bg-[#F9FAFB] w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center p-5 bg-white border-b border-gray-200 gap-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Palmtree className="text-gray-800" size={20} />
            <h2 className={`${globalFont} text-gray-800 font-semibold`}>
              Update leave policy:{" "}
              <span className="text-blue-600">{formData.name}</span>
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 overflow-y-auto grid grid-cols-2 gap-3 custom-scrollbar">
          <BasicInfoCard formData={formData} handleChange={handleChange} />
          <AccrualPolicyCard formData={formData} handleChange={handleChange} />
          <RequestPreferencesCard
            formData={formData}
            handleChange={handleChange}
          />
          <ApplicabilityCard
            criteria={formData.Criteria}
            setCriteria={handleCriteriaChange}
            onClose={onClose}
            handleSubmit={handleUpdate}
            isUpdate={true}
            loading={loading} // Pass loading state to disable buttons
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateLeavePolicyTab;
