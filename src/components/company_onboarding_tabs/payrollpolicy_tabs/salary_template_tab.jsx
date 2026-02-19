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
import UpdateSalaryTemplate from "./salary_component_tabs/updatesalarytemplate.jsx";

export default function SalaryTemplate() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showCreateComponent, setShowCreateComponent] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (activeTab !== "salary-template") return;

    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await payrollService.getSalaryTemplates();
        const rawItems = response?.data?.items || response || [];
        const formatted = rawItems.map((item, index) => ({
          ...item,
          id: item.id ?? index,
          name: item.name || "-",
          annualCTC: `₹${Number(item.annual_ctc || 0).toLocaleString()}`,
          status:
            item.status === "active" || item.status === true
              ? "Active"
              : "Inactive",
        }));
        setTableData(formatted);
      } catch (err) {
        setError("Failed to load salary templates.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [activeTab, showCreateTemplate, isEditingTemplate]);

  // ---------------- HANDLERS ----------------
  const handleEditClick = (rowData) => {
    setSelectedTemplate(rowData);
    setIsEditingTemplate(true);
  };

  // ---------------- EXTRA BUTTONS (The Fix) ----------------
  const extraButtons = (tab) => {
    // Buttons for Salary Template Tab
    if (tab === "salary-template") {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Icon icon="mdi:filter-variant" width={20} height={20} />
          </button>
          <CommonButton
            onClick={() => setShowCreateTemplate(true)}
            text="Create Template"
            icon="mdi:plus"
          />
        </div>
      );
    }

    // NEW: Buttons for Salary Components Tab
    if (tab === "salary-components") {
      return (
        <div className="flex items-center gap-2">
          <CommonButton
            onClick={() => setShowCreateComponent(true)}
            text="Create Component"
          />
        </div>
      );
    }

    return null;
  };

  const renderTabContent = (tab) => {
    switch (tab) {
      case "salary-template":
        return (
          <>
            <PayrollTable
              columns={[
                { key: "name", label: "Template Name", align: "left" },
                { key: "description", label: "Description", align: "left" },
                { key: "annualCTC", label: "Annual CTC", align: "right" },
                { key: "status", label: "Status", align: "center" },
              ]}
              data={tableData}
              rowClickHandler={handleEditClick}
            />
            {loading && <div className="text-center py-4">Loading...</div>}
          </>
        );
      case "salary-components":
        return <SalaryComponents />;
      case "statutory-components":
        return <StatutoryComponents />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl shadow-sm min-h-screen font-[Poppins] text-sm">
      {showCreateTemplate ? (
        <CreateSalaryTemplate onCancel={() => setShowCreateTemplate(false)} />
      ) : isEditingTemplate && selectedTemplate ? (
        <UpdateSalaryTemplate
          data={selectedTemplate}
          onCancel={() => {
            setIsEditingTemplate(false);
            setSelectedTemplate(null);
          }}
        />
      ) : showCreateComponent ? (
        /* This renders the child component you showed me earlier */
        <CreateSalaryComponent onCancel={() => setShowCreateComponent(false)} />
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
