import React, { useState, useEffect, useCallback } from "react";
import payrollService from "../../../service/payrollService";

// Components
import EpfTab from "./statutory_component_tabs/Epf_tab";
import EnableEPF from "./statutory_component_tabs/epf_enable";
import EsiTab from "./statutory_component_tabs/Esi_tab";
import EnableESI from "./statutory_component_tabs/esi_enable";
import ProfessionalTaxTab from "./statutory_component_tabs/pt_tab";
import LabourWelfareFundTab from "./statutory_component_tabs/lw_fund_tab";

const StatutoryComponents = () => {
  const tabs = ["EPF", "ESI", "PT", "LWF"];
  const [activeTab, setActiveTab] = useState("EPF");

  // ------------------- EPF state -------------------
  const [epfData, setEpfData] = useState(null);
  const [epfEnabled, setEpfEnabled] = useState(false);
  const [epfLoading, setEpfLoading] = useState(false);

  // ------------------- ESI state -------------------
  const [esiData, setEsiData] = useState(null);
  const [esiEnabled, setEsiEnabled] = useState(false);
  const [esiLoading, setEsiLoading] = useState(false);

  // ------------------- PT state -------------------
  const [ptData, setPtData] = useState(null);
  const [ptLoading, setPtLoading] = useState(false);

  // ------------------- LWF state -------------------
  const [lwfData, setLwfData] = useState(null);
  const [lwfEnabled, setLwfEnabled] = useState(false);
  const [lwfLoading, setLwfLoading] = useState(false);

  // ------------------- Global loading -------------------
  const [loading, setLoading] = useState(true);

  // ------------------- Fetchers -------------------
  const fetchEPF = useCallback(async () => {
    setEpfLoading(true);
    try {
      const data = await payrollService.getEPF();
      setEpfData(data);
      setEpfEnabled(Boolean(data.enabled));
    } catch (err) {
      console.error("Error fetching EPF:", err);
    } finally {
      setEpfLoading(false);
    }
  }, []);

  const fetchESI = useCallback(async () => {
    setEsiLoading(true);
    try {
      const data = await payrollService.getESI();
      setEsiData(data);
      setEsiEnabled(Boolean(data.enabled));
    } catch (err) {
      console.error("Error fetching ESI:", err);
    } finally {
      setEsiLoading(false);
    }
  }, []);

  const fetchPT = useCallback(async () => {
    setPtLoading(true);
    try {
      const data = await payrollService.getPT();
      setPtData(data);
    } catch (err) {
      console.error("Error fetching PT:", err);
    } finally {
      setPtLoading(false);
    }
  }, []);

  const fetchLWF = useCallback(async () => {
    setLwfLoading(true);
    try {
      const data = await payrollService.getLWF();
      setLwfData(data);
      setLwfEnabled(Boolean(data.enabled));
    } catch (err) {
      console.error("Error fetching LWF:", err);
    } finally {
      setLwfLoading(false);
    }
  }, []);

  // ------------------- Fetch all statutory data -------------------
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchEPF(), fetchESI(), fetchPT(), fetchLWF()]);
      setLoading(false);
    };
    fetchAll();
  }, [fetchEPF, fetchESI, fetchPT, fetchLWF]);

  // ------------------- Handlers -------------------
  const handleEnableEpf = async () => {
    setEpfLoading(true);
    try {
      await payrollService.enableEPF();
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
      await payrollService.disableEPF();
      fetchEPF();
    } catch (err) {
      console.error("Error disabling EPF:", err);
    } finally {
      setEpfLoading(false);
    }
  };

  const handleEnableEsi = async () => {
    setEsiLoading(true);
    try {
      await payrollService.enableESI();
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
      await payrollService.disableESI();
      fetchESI();
    } catch (err) {
      console.error("Error disabling ESI:", err);
    } finally {
      setEsiLoading(false);
    }
  };

  // ------------------- LWF Handlers -------------------
  const handleEnableLWF = async ({ state, deduction_cycle }) => {
    setLwfLoading(true);
    try {
      await payrollService.enableLWF({ state, deduction_cycle });
      fetchLWF();
    } catch (err) {
      console.error("Error enabling LWF:", err);
    } finally {
      setLwfLoading(false);
    }
  };

  const handleDisableLWF = async () => {
    setLwfLoading(true);
    try {
      await payrollService.disableLWF(); // updated API call
      fetchLWF(); // refresh LWF data
      setLwfEnabled(false); // update UI immediately
    } catch (err) {
      console.error("Error disabling LWF:", err);
    } finally {
      setLwfLoading(false);
    }
  };

  // ------------------- Tab Components -------------------
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

    LWF: lwfLoading ? (
      <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
    ) : (
      <LabourWelfareFundTab
        lwfData={lwfData}
        enabled={lwfEnabled}
        onEnable={handleEnableLWF}
        onDisable={handleDisableLWF}
        loading={lwfLoading}
      />
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
