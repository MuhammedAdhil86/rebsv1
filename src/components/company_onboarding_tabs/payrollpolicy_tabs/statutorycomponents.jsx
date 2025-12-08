import React, { useState, useEffect } from "react";
import axiosInstance from "../../../service/axiosinstance";

// EPF
import EpfTab from "./statutory_component_tabs/Epf_tab";
import EnableEPF from "./statutory_component_tabs/epf_enable";

// ESI
import EsiTab from "./statutory_component_tabs/Esi_tab";
import EnableEsi from "./statutory_component_tabs/esi_enable";

// Professional Tax
import ProfessionalTaxTab from "./statutory_component_tabs/pt_tab";

// Labour Welfare Fund
import LabourWelfareFundTab from "./statutory_component_tabs/lw_fund_tab";

const StatutoryComponents = () => {
  const [activeTab, setActiveTab] = useState("EPF");
  const [epfEnabled, setEpfEnabled] = useState(false);
  const [epfData, setEpfData] = useState(null);
  const [esiEnabled, setEsiEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const tabs = ["EPF", "ESI", "Professional Tax", "Labour Welfare Fund"];

  // Fetch EPF status on mount
  useEffect(() => {
    fetchEPFStatus();
  }, []);

  const fetchEPFStatus = async () => {
    try {
      setLoading(true);
      const url = axiosInstance.baseURL2 + "api/payroll/statutory/epf?company_id=8";
      const response = await axiosInstance.get(url);
      const data = response.data?.data;

      setEpfEnabled(data?.enabled || false);
      setEpfData(data || null);

      // Log EPF data to console
      console.log("Fetched EPF Data:", data);
    } catch (error) {
      console.error("Error fetching EPF:", error);
    } finally {
      setLoading(false);
    }
  };

  // ENABLE EPF
  const handleEnableEpf = async () => {
    try {
      setLoading(true);
      const url = axiosInstance.baseURL2 + "api/payroll/statutory/epf/8/enable";
      const response = await axiosInstance.post(url, { enabled: true });

      if (response.data?.data?.enabled) {
        setEpfEnabled(true);
        setEpfData(response.data?.data);

        console.log("EPF Enabled:", response.data?.data);
      }
    } catch (error) {
      console.error("Enable EPF Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // DISABLE EPF
  const handleDisableEpf = async () => {
    try {
      setLoading(true);
      const url = axiosInstance.baseURL2 + "api/payroll/statutory/epf/8/disable";
      const response = await axiosInstance.post(url, { enabled: false });

      if (response.data?.data?.enabled === false) {
        setEpfEnabled(false);
        setEpfData(response.data?.data);

        console.log("EPF Disabled:", response.data?.data);
      }
    } catch (error) {
      console.error("Disable EPF Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ESI toggle (local state)
  const handleEnableEsi = () => setEsiEnabled(true);
  const handleDisableEsi = () => setEsiEnabled(false);

  return (
    <div className="font-[Poppins] text-[13px] text-gray-700 bg-white rounded-lg p-6 shadow-sm">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 transition-all ${
              activeTab === tab
                ? "text-black border-b-2 border-black font-medium"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
      )}

      {/* EPF Tab */}
      {!loading && activeTab === "EPF" && (
        epfEnabled && epfData ? (
          <EpfTab onDisable={handleDisableEpf} epfData={epfData} />
        ) : (
          <EnableEPF onEnable={handleEnableEpf} />
        )
      )}

      {/* ESI Tab */}
      {activeTab === "ESI" &&
        (esiEnabled ? (
          <EsiTab onDisable={handleDisableEsi} />
        ) : (
          <EnableEsi onEnable={handleEnableEsi} />
        ))}

      {/* Professional Tax Tab */}
      {activeTab === "Professional Tax" && <ProfessionalTaxTab />}

      {/* Labour Welfare Fund Tab */}
      {activeTab === "Labour Welfare Fund" && <LabourWelfareFundTab />}
    </div>
  );
};

export default StatutoryComponents;
