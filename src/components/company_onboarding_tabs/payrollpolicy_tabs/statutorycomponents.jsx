import React, { useState, useEffect } from "react";
import payrollService from "../../../service/payrollService";

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

  // EPF
  const [epfEnabled, setEpfEnabled] = useState(false);
  const [epfData, setEpfData] = useState(null);

  // ESI
  const [esiEnabled, setEsiEnabled] = useState(false);
  const [esiData, setEsiData] = useState(null);

  // PT
  const [ptData, setPtData] = useState(null);

  const [loading, setLoading] = useState(true);
  const tabs = ["EPF", "ESI", "Professional Tax", "Labour Welfare Fund"];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [epf, esi, pt] = await Promise.all([
        payrollService.getEPF(),
        payrollService.getESI(),
        payrollService.getProfessionalTax(),
      ]);

      setEpfData(epf);
      setEpfEnabled(epf?.enabled || false);

      setEsiData(esi);
      setEsiEnabled(esi?.enabled || false);

      setPtData(pt);
    } catch (err) {
      console.error("Error fetching statutory data:", err);
    } finally {
      setLoading(false);
    }
  };

  // EPF
  const handleEnableEpf = async () => {
    setLoading(true);
    try {
      const data = await payrollService.enableEPF();
      setEpfData(data);
      setEpfEnabled(data?.enabled || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableEpf = async () => {
    setLoading(true);
    try {
      const data = await payrollService.disableEPF();
      setEpfData(data);
      setEpfEnabled(data?.enabled || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ESI
  const handleEnableEsi = async () => {
    setLoading(true);
    try {
      const data = await payrollService.enableESI();
      setEsiData(data);
      setEsiEnabled(data?.enabled || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableEsi = async () => {
    setLoading(true);
    try {
      const data = await payrollService.disableESI();
      setEsiData(data);
      setEsiEnabled(data?.enabled || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

      {loading && (
        <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
      )}

      {/* EPF Tab */}
      {!loading && activeTab === "EPF" &&
        (epfEnabled ? (
          <EpfTab onDisable={handleDisableEpf} epfData={epfData} />
        ) : (
          <EnableEPF onEnable={handleEnableEpf} />
        ))}

      {/* ESI Tab */}
      {!loading && activeTab === "ESI" &&
        (esiEnabled ? (
          <EsiTab onDisable={handleDisableEsi} esiData={esiData} />
        ) : (
          <EnableEsi onEnable={handleEnableEsi} />
        ))}

      {/* PT Tab */}
      {!loading && activeTab === "Professional Tax" && ptData &&
        <ProfessionalTaxTab data={ptData} />
      }

      {/* LWF Tab */}
      {!loading && activeTab === "Labour Welfare Fund" &&
        <LabourWelfareFundTab />
      }
    </div>
  );
};

export default StatutoryComponents;
