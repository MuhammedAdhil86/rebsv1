import React, { useState } from "react";
// Import shared styles and components from your local utils
import {
  cardClass,
  sectionTitle,
  CheckboxRow,
  RadioRow,
} from "../../../helpers/leavepolicyutils";

const RequestPreferencesCard = ({ formData, handleChange }) => {
  // Local state for radio button toggles (matches original logic)
  const [pastLimitType, setPastLimitType] = useState("set");
  const [futureLimitType, setFutureLimitType] = useState("set");

  return (
    <div className={cardClass}>
      <h3 className={sectionTitle}>Employee Leave Request Preferences</h3>
      <div className="space-y-6">
        {/* 1. Negative Leave Balance */}
        <div>
          <CheckboxRow
            label="Allow negative leave balance"
            checked={formData.allow_negative_balance}
            onChange={(e) =>
              handleChange("allow_negative_balance", e.target.checked)
            }
          />
          <div className="ml-6 mt-2 flex items-center bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-2 h-10">
            <span className="text-[11px] text-gray-500 flex-1">
              Consider as
            </span>
            <select
              className="bg-transparent text-[11px] focus:outline-none"
              value={formData.consider_negative_balance}
              onChange={(e) =>
                handleChange("consider_negative_balance", e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="">Select Option</option>
              <option value="no limit">Unpaid Leave (No Limit)</option>
              <option value="till year end">
                Unpaid Leave (Till Year End)
              </option>
              <option value="unlimited and mark as lop">
                Unpaid Leave (Unlimited & Mark as LOP)
              </option>
            </select>
          </div>
        </div>

        {/* 2. Past Date Leave */}
        <div>
          <CheckboxRow
            label="Allow applying for leave on past dates"
            checked={formData.allow_past_leave}
            onChange={(e) => handleChange("allow_past_leave", e.target.checked)}
          />
          <div className="ml-6 space-y-3 mt-2">
            <RadioRow
              label="No limit on past dates"
              checked={pastLimitType === "none"}
              onClick={() => {
                setPastLimitType("none");
                handleChange("past_leave_limit", null);
              }}
            />
            <div className="flex items-center gap-4">
              <RadioRow
                label="Set Limit"
                checked={pastLimitType === "set"}
                onClick={() => setPastLimitType("set")}
              />
              <input
                type="text"
                className="flex-1 bg-[#F4F6F8] border border-gray-200 rounded-xl px-3 py-1 text-[11px] focus:outline-none"
                placeholder="days before today"
                value={formData.past_leave_limit || ""}
                onChange={(e) =>
                  handleChange("past_leave_limit", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* 3. Future Date Leave */}
        <div>
          <CheckboxRow
            label="Allow applying for leave on future dates"
            checked={formData.allow_future_leave}
            onChange={(e) =>
              handleChange("allow_future_leave", e.target.checked)
            }
          />
          <div className="ml-6 space-y-3 mt-2">
            <RadioRow
              label="No limit on future dates"
              checked={futureLimitType === "none"}
              onClick={() => {
                setFutureLimitType("none");
                handleChange("future_leave_limit", null);
              }}
            />
            <div className="flex items-center gap-4">
              <RadioRow
                label="Set Limit"
                checked={futureLimitType === "set"}
                onClick={() => setFutureLimitType("set")}
              />
              <input
                type="text"
                className="flex-1 bg-[#F4F6F8] border border-gray-200 rounded-xl px-3 py-1 text-[11px] focus:outline-none"
                placeholder="days after today"
                value={formData.future_leave_limit || ""}
                onChange={(e) =>
                  handleChange("future_leave_limit", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPreferencesCard;
