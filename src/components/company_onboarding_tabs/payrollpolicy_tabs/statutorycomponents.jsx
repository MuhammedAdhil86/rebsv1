import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../service/axiosinstance";

// Components
import EpfTab from "./statutory_component_tabs/Epf_tab";
import EnableEPF from "./statutory_component_tabs/epf_enable";
import EsiTab from "./statutory_component_tabs/Esi_tab";
import EnableESI from "./statutory_component_tabs/esi_enable";
import ProfessionalTaxTab from "./statutory_component_tabs/pt_tab";

const StatutoryComponents = () => {
  const tabs = ["EPF", "ESI", "PT"]; // All tabs
  const [activeTab, setActiveTab] = useState("EPF");

  // EPF state
  const [epfData, setEpfData] = useState(null);
  const [epfEnabled, setEpfEnabled] = useState(false);
  const [epfLoading, setEpfLoading] = useState(false);

  // ESI state
  const [esiData, setEsiData] = useState(null);
  const [esiEnabled, setEsiEnabled] = useState(false);
  const [esiLoading, setEsiLoading] = useState(false);

  // PT state
  const [ptData, setPtData] = useState(null);
  const [ptLoading, setPtLoading] = useState(false);

  // Global loading
  const [loading, setLoading] = useState(true);

  // Fetch EPF
  const fetchEPF = useCallback(async () => {
    setEpfLoading(true);
    try {
      const response = await axiosInstance.get(
        `${axiosInstance.baseURL2}api/payroll/statutory/epf`
      );
      const epfInfo = response.data?.data || {};
      setEpfData(epfInfo);
      setEpfEnabled(Boolean(epfInfo.enabled));
    } catch (err) {
      console.error("Error fetching EPF:", err);
    } finally {
      setEpfLoading(false);
    }
  }, []);

  // Fetch ESI
  const fetchESI = useCallback(async () => {
    setEsiLoading(true);
    try {
      const response = await axiosInstance.get(
        `${axiosInstance.baseURL2}api/payroll/statutory/esi`
      );
      const esiInfo = response.data?.data || {};
      setEsiData(esiInfo);
      setEsiEnabled(Boolean(esiInfo.enabled));
    } catch (err) {
      console.error("Error fetching ESI:", err);
    } finally {
      setEsiLoading(false);
    }
  }, []);

  // Fetch PT
  const fetchPT = useCallback(async () => {
    setPtLoading(true);
    try {
      const response = await axiosInstance.get(
        `${axiosInstance.baseURL2}api/payroll/statutory/professional-tax`
      );
      const ptInfo = response.data?.data || {};
      setPtData(ptInfo);
    } catch (err) {
      console.error("Error fetching PT:", err);
    } finally {
      setPtLoading(false);
    }
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchEPF(), fetchESI(), fetchPT()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchEPF, fetchESI, fetchPT]);

  // EPF Handlers
  const handleEnableEpf = async () => {
    setEpfLoading(true);
    try {
      await axiosInstance.post(
        `${axiosInstance.baseURL2}api/payroll/statutory/epf/enable`,
        { enabled: true }
      );
      fetchEPF();
    } catch (err) {
      console.error("Error enabling EPF:", err);
    } finally {
      setEpfLoading(false);
    }
  };

  const handleDisableEpf = async () => {
    setEpfLoading(true);
    try {
      await axiosInstance.post(
        `${axiosInstance.baseURL2}api/payroll/statutory/epf/disable`
      );
      fetchEPF();
    } catch (err) {
      console.error("Error disabling EPF:", err);
    } finally {
      setEpfLoading(false);
    }
  };

  // ESI Handlers
  const handleEnableEsi = async () => {
    setEsiLoading(true);
    try {
      await axiosInstance.post(
        `${axiosInstance.baseURL2}api/payroll/statutory/esi/enable`,
        { enabled: true }
      );
      fetchESI();
    } catch (err) {
      console.error("Error enabling ESI:", err);
    } finally {
      setEsiLoading(false);
    }
  };

  const handleDisableEsi = async () => {
    setEsiLoading(true);
    try {
      await axiosInstance.post(
        `${axiosInstance.baseURL2}api/payroll/statutory/esi/disable`
      );
      fetchESI();
    } catch (err) {
      console.error("Error disabling ESI:", err);
    } finally {
      setEsiLoading(false);
    }
  };

  // Tab content
  const tabComponents = {
    EPF: epfLoading ? (
      <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
    ) : epfEnabled ? (
      <EpfTab onDisable={handleDisableEpf} epfData={epfData} epfLoading={epfLoading} />
    ) : (
      <EnableEPF onEnable={handleEnableEpf} epfLoading={epfLoading} />
    ),

    ESI: esiLoading ? (
      <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
    ) : esiEnabled ? (
      <EsiTab onDisable={handleDisableEsi} esiData={esiData} />
    ) : (
      <EnableESI onEnable={handleEnableEsi} />
    ),

    PT: ptLoading ? (
      <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
    ) : (
      <ProfessionalTaxTab data={ptData} />
    ),
  };

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

      {/* Tab content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
      ) : (
        tabComponents[activeTab]
      )}
    </div>
  );
};

export default StatutoryComponents;
