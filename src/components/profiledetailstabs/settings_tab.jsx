import React, { lazy, Suspense } from "react";

// Lightweight components
import ManagePreferences from "../company_onboarding_tabs/settings_tabs/managepreferences";
import ActionCenter from "../company_onboarding_tabs/settings_tabs/actionCenter";
import ManagePrivileges from "../company_onboarding_tabs/settings_tabs/manageprivilage";
import CompliancesDeductions from "../company_onboarding_tabs/settings_tabs/compliancesdeductions";
import Salary from "../company_onboarding_tabs/settings_tabs/salary";

// Lazy-loaded heavy components
const LeavesVacation = lazy(() =>
  import("../company_onboarding_tabs/settings_tabs/leavesandvacation")
);
const PayrollTemplates = lazy(() =>
  import("../company_onboarding_tabs/settings_tabs/payrolltemplate")
);

export default function SettingsTab({ employee }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-1">
      {/* Lightweight components */}
      <ManagePreferences
        uuid={employee?.uuid}
        initialPreferences={employee}
      />
      <ActionCenter employee={employee} />
      <ManagePrivileges uuid={employee?.uuid} />
      <CompliancesDeductions employee={employee} />
      <Salary employee={employee} />

      {/* Lazy-loaded components with fallback */}
      <Suspense fallback={<div className="text-gray-500">Loading Leaves...</div>}>
        <LeavesVacation employee={employee} />
      </Suspense>

    </div>
  );
}
