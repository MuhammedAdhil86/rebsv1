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
// NEW: Import the separate Update component
import UpdateSalaryTemplate from "./salary_component_tabs/updatesalarytemplate.jsx";

export default function SalaryTemplate() {
  // ---------------- STATE ----------------
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showCreateComponent, setShowCreateComponent] = useState(false);

  // --- NEW STATES FOR UPDATING ---
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

  const toggleFilterOption = (option) => {
    setFilterOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  // --- NEW HANDLER FOR TABLE ROW CLICK ---
  const handleEditClick = (rowData) => {
    console.log("Template Row Clicked! Data:", rowData);
    setSelectedTemplate(rowData); // rowData now contains the full fetched object
    setIsEditingTemplate(true);
  };

  // ---------------- FETCH DATA (UNTOUCHED LOGIC) ----------------
  useEffect(() => {
    if (activeTab !== "salary-template") return;

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
          ...item, // KEY: Keep original item data (id, mappings, etc.) for editing
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
        setTableData(formatted);
      } catch (err) {
        setError("Failed to load salary templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [activeTab, showCreateTemplate, isEditingTemplate]);

  // ---------------- FILTERED DATA ----------------
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
          className={`font-medium ${value === "Active" ? "text-green-600" : "text-red-600"}`}
        >
          {value}
        </span>
      ),
    },
  ];

  // ---------------- RENDER TAB CONTENT ----------------
  const renderTabContent = (tab) => {
    switch (tab) {
      case "salary-template":
        return (
          <>
            <PayrollTable
              columns={columns}
              data={filteredData}
              rowsPerPage={6}
              rowClickHandler={handleEditClick} // TRIGGER UPDATE ON CLICK
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
      default:
        return null;
    }
  };

  const extraButtons = (tab) => {
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
    return null;
  };

  // ---------------- RENDER ----------------
  return (
    <div className="rounded-2xl shadow-sm min-h-screen font-[Poppins] text-sm">
      {showCreateTemplate ? (
        <CreateSalaryTemplate onCancel={() => setShowCreateTemplate(false)} />
      ) : isEditingTemplate && selectedTemplate ? (
        /* SEPARATE UPDATE COMPONENT */
        <UpdateSalaryTemplate
          data={selectedTemplate}
          onCancel={() => {
            setIsEditingTemplate(false);
            setSelectedTemplate(null);
          }}
        />
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
