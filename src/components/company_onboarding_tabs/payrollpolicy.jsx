import React from "react";

/* Main Component */
import SalaryTemplate from "./payrollpolicy_tabs/salary_template_tab";

const ManagePayrollPolicy = () => {
  return (
    <div className="min-h-screen font-[Poppins] text-sm">
      <div className="border rounded-2xl shadow-sm p-3">
        <SalaryTemplate />
      </div>
    </div>
  );
};

export default ManagePayrollPolicy;
