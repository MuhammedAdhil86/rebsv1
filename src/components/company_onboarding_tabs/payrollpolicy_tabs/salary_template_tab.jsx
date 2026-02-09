import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

// Services
import payrollService from "../../../service/payrollService";

// UI Components
import PayrollTable from "../../../ui/payrolltable.jsx";
import CommonButton from "../../../ui/bottom.jsx";
import TabsSwitch from "../../../ui/tabswitch.jsx";

// Tabs
import SalaryComponents from "./salary_components_tab.jsx";
import StatutoryComponents from "./statutorycomponents.jsx";
import CreateSalaryTemplate from "./statutory_component_tabs/createsalarytemplate.jsx";
import CreateSalaryComponent from "./statutory_component_tabs/createsalarycomponents.jsx";

export default function SalaryTemplate() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showCreateComponent, setShowCreateComponent] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [activeTab, setActiveTab] = useState("salary-template");

  const [filterOptions, setFilterOptions] = useState({
    active: true,
    inactive: true,
  });

  const tabs = [
    { id: "salary-template", label: "Salary Template" },
    { id: "salary-components", label: "Salary Components" },
    { id: "statutory-components", label: "Statutory Components" },
    { id: "payment-schedules", label: "Payment Schedules" },
    { id: "tax", label: "Tax" },
    { id: "approvals", label: "Approvals" },
  ];

  const toggleFilterOption = (option) => {
    setFilterOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  // Fetch Salary Templates
  useEffect(() => {
    let isMounted = true;

    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await payrollService.getSalaryTemplates();
        const rawItems =
          response?.data?.items ||
          response?.data?.data?.items ||
          response?.items ||
          response ||
          [];
        const formatted = rawItems.map((item, index) => ({
          id: item.id ?? index,
          name: item.name || "-",
          description: item.description || "-",
          annualCTC: `₹${Number(item.annual_ctc || 0).toLocaleString()}`,
          status:
            String(item.status).toLowerCase() === "active" ||
            item.status === true ||
            item.status === 1
              ? "Active"
              : "Inactive",
        }));
        if (isMounted) setTableData(formatted);
      } catch (err) {
        if (isMounted) setError("Failed to load salary templates.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = tableData.filter((item) => {
    if (item.status === "Active" && filterOptions.active) return true;
    if (item.status === "Inactive" && filterOptions.inactive) return true;
    return false;
  });

  const columns = [
    { key: "name", label: "Template Name", align: "left" },
    { key: "description", label: "Description", align: "left" },
    { key: "annualCTC", label: "Annual CTC", align: "right" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => (
        <span
          className={`font-medium ${
            value === "Active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const renderTabContent = (tab) => {
    switch (tab) {
      case "salary-template":
        return (
          <>
            <PayrollTable
              columns={columns}
              data={filteredData}
              rowsPerPage={6}
            />
            {loading && (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            )}
            {error && (
              <div className="text-center py-4 text-red-600">{error}</div>
            )}
          </>
        );
      case "salary-components":
        return <SalaryComponents />;
      case "statutory-components":
        return <StatutoryComponents />;
      case "payment-schedules":
        return (
          <div className="text-gray-500 py-4">
            Payment Schedules Tab Content
          </div>
        );
      case "tax":
        return <div className="text-gray-500 py-4">Tax Tab Content</div>;
      case "approvals":
        return <div className="text-gray-500 py-4">Approvals Tab Content</div>;
      default:
        return null;
    }
  };

  const extraButtons = (tab) => {
    if (tab === "salary-template") {
      return (
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Icon icon="mdi:filter-variant" width={20} height={20} />
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md p-2 z-50">
                {["active", "inactive"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 text-sm mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={filterOptions[option]}
                      onChange={() => toggleFilterOption(option)}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>

          <CommonButton
            onClick={() => setShowCreateTemplate(true)}
            text="Create Template"
            icon="mdi:plus"
          />
        </div>
      );
    }

    if (tab === "salary-components") {
      return (
        <CommonButton
          onClick={() => setShowCreateComponent(true)}
          text="Create Component"
          icon="mdi:plus"
        />
      );
    }

    return null;
  };

  return (
    <div className=" rounded-2xl shadow-sm  min-h-screen font-[Poppins] text-sm">
      {showCreateTemplate ? (
        <CreateSalaryTemplate setShowCreate={setShowCreateTemplate} />
      ) : showCreateComponent ? (
        <CreateSalaryComponent
          componentId={null}
          onCancel={() => setShowCreateComponent(false)}
        />
      ) : (
        <TabsSwitch
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          renderTabContent={renderTabContent}
          extraButtons={extraButtons}
        />
      )}
    </div>
  );
}
