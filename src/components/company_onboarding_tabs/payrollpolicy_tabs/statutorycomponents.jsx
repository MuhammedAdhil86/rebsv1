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
  const [esiData, setEsiData] = useState(null);

  const [loading, setLoading] = useState(true);

  const tabs = ["EPF", "ESI", "Professional Tax", "Labour Welfare Fund"];

  useEffect(() => {
    fetchEPFStatus();
    fetchESIStatus();
  }, []);

  // =========================================================
  //                     EPF GET API
  // =========================================================
  const fetchEPFStatus = async () => {
    try {
      setLoading(true);
      const url = axiosInstance.baseURL2 + "api/payroll/statutory/epf?company_id=8";
      const response = await axiosInstance.get(url);

      const data = response.data?.data;
      setEpfEnabled(data?.enabled || false);
      setEpfData(data || null);

      console.log("Fetched EPF Data:", data);
    } catch (error) {
      console.error("Error fetching EPF:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  //                     ESI GET API
  // =========================================================
  const fetchESIStatus = async () => {
    try {
      const url = axiosInstance.baseURL2 + "api/payroll/statutory/esi?company_id=8";
      const response = await axiosInstance.get(url);

      const data = response.data?.data;
      setEsiEnabled(data?.enabled || false);
      setEsiData(data || null);

      console.log("Fetched ESI Data:", data);
    } catch (error) {
      console.error("Error fetching ESI:", error);
    }
  };

  // =========================================================
  //                     ENABLE EPF
  // =========================================================
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

  // =========================================================
  //                     DISABLE EPF
  // =========================================================
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

  // =========================================================
  //                     ENABLE ESI
  // =========================================================
  const handleEnableEsi = async () => {
    try {
      setLoading(true);
      const url = axiosInstance.baseURL2 + "api/payroll/statutory/esi/8/enable";
      const response = await axiosInstance.post(url, { enabled: true });

      if (response.data?.data?.enabled) {
        setEsiEnabled(true);
        setEsiData(response.data?.data);
        console.log("ESI Enabled:", response.data?.data);
      }
    } catch (error) {
      console.error("Enable ESI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  //                     DISABLE ESI (UPDATED with API)
  // =========================================================
  const handleDisableEsi = async () => {
    try {
      setLoading(true);
      const url = axiosInstance.baseURL2 + "api/payroll/statutory/esi/8/disable";

      const response = await axiosInstance.post(url, { enabled: false });

      if (response.data?.data?.enabled === false) {
        setEsiEnabled(false);
        setEsiData(response.data?.data);
        console.log("ESI Disabled:", response.data?.data);
      }
    } catch (error) {
      console.error("Disable ESI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  //                     RENDER UI
  // =========================================================
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

      {loading && (
        <div className="text-center py-10 text-gray-500 text-sm">
          Loading...
        </div>
      )}

      {/* EPF Tab */}
      {!loading && activeTab === "EPF" &&
        (epfEnabled ? (
          <EpfTab onDisable={handleDisableEpf} epfData={epfData} />
        ) : (
          <EnableEPF onEnable={handleEnableEpf} />
        ))
      }

      {/* ESI Tab */}
      {!loading && activeTab === "ESI" &&
        (esiEnabled ? (
          <EsiTab onDisable={handleDisableEsi} esiData={esiData} />
        ) : (
          <EnableEsi onEnable={handleEnableEsi} />
        ))
      }

      {/* PT */}
      {activeTab === "Professional Tax" && <ProfessionalTaxTab />}

      {/* LWF */}
      {activeTab === "Labour Welfare Fund" && <LabourWelfareFundTab />}

    </div>
  );
};

export default StatutoryComponents;
