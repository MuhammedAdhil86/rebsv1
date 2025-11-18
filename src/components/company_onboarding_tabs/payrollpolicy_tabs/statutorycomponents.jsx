import React, { useState } from "react";
import EpfTab from "./statutory_component_tabs/Epf_tab";
import EnableEpf from "./statutory_component_tabs/epf_enable";

// ⭐ ESI imports
import EsiTab from "./statutory_component_tabs/Esi_tab";
import EnableEsi from "./statutory_component_tabs/esi_enable";

// ⭐ Professional Tax import
import ProfessionalTaxTab from "./statutory_component_tabs/pt_tab";

// ⭐ Labour Welfare Fund import
import LabourWelfareFundTab from "./statutory_component_tabs/lw_fund_tab";

const StatutoryComponents = () => {
  const [activeTab, setActiveTab] = useState("EPF");
  const [epfEnabled, setEpfEnabled] = useState(false);
  const [esiEnabled, setEsiEnabled] = useState(false);

  const tabs = ["EPF", "ESI", "Professional Tax", "Labour Welfare Fund"];

  const handleEnableEpf = () => setEpfEnabled(true);
  const handleDisableEpf = () => setEpfEnabled(false);

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

      {/* EPF Tab */}
      {activeTab === "EPF" &&
        (epfEnabled ? (
          <EpfTab onDisable={handleDisableEpf} />
        ) : (
          <EnableEpf onEnable={handleEnableEpf} />
        ))}

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
