import React from "react";
import ManagePreferences from "../company_onboarding_tabs/settings_tabs/managepreferences";
import ActionCenter from "../company_onboarding_tabs/settings_tabs/actionCenter";
import ManagePrivileges from "../company_onboarding_tabs/settings_tabs/manageprivilage";
import CompliancesDeductions from "../company_onboarding_tabs/settings_tabs/compliancesdeductions";
import Salary from "../company_onboarding_tabs/settings_tabs/salary";

export default function SettingsTab({ employee }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-1">
      <ManagePreferences
        uuid={employee?.uuid}
        initialPreferences={employee}
      />

      <ActionCenter employee={employee} />

      <ManagePrivileges uuid={employee?.uuid} />

      <CompliancesDeductions employee={employee} />
      <Salary employee={employee} />
    </div>
  );
}
