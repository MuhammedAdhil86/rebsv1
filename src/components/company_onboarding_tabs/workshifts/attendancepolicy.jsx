import React, { useEffect, useState } from "react";
import { Plus, Search, ChevronUp, ChevronDown } from "lucide-react";
import CreateAttendancePolicyModal from "../../../ui/createattendancepolicymodal";
import UniversalTable from "../../../ui/universal_table";
import { fetchPolicyData } from "../../../service/companyService";

const AttendancePolicy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [policyData, setPolicyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true);
        const res = await fetchPolicyData();
        setPolicyData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadPolicies();
  }, []);

  // Helpers
  const formatTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";

  const getStatus = (start, end) => {
    const now = new Date();
    if (now < new Date(start)) return "Inactive";
    if (now > new Date(end)) return "Expired";
    return "Active";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-500 border-green-100";
      case "Expired":
        return "bg-red-50 text-red-500 border-red-100";
      case "Inactive":
        return "bg-indigo-50 text-indigo-500 border-indigo-100";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  // 🔹 Sort Icon Component (kept exactly)
  const SortIcon = () => (
    <div className="flex flex-col opacity-30">
      <ChevronUp size={8} className="-mb-0.5" />
      <ChevronDown size={8} />
    </div>
  );

  // 🔹 Table Columns (IMPORTANT PART)
  const columns = [
    {
      key: "policy_name",
      label: (
        <div className="flex items-center gap-1.5 justify-center">
          Policy Name <SortIcon />
        </div>
      ),
    },
    {
      key: "working_hours",
      label: (
        <div className="flex items-center gap-1.5 justify-center">
          Duration <SortIcon />
        </div>
      ),
      render: (val) => `${val} Hrs`,
    },
    {
      key: "start_time",
      label: (
        <div className="flex items-center gap-1.5 justify-center">
          Start Time <SortIcon />
        </div>
      ),
      render: (val) => formatTime(val),
    },
    {
      key: "end_time",
      label: (
        <div className="flex items-center gap-1.5 justify-center">
          End Time <SortIcon />
        </div>
      ),
      render: (val) => formatTime(val),
    },
    {
      key: "lunch_break",
      label: "Lunch Break",
      render: (val) => formatTime(val),
    },
    {
      key: "break_time",
      label: "Short Break",
      render: (val) => formatTime(val),
    },
    {
      key: "regularisation_limit",
      label: "Regularization Count",
      render: (_, row) =>
        `${row.regularisation_limit} / ${row.regularisation_type}`,
    },
    {
      key: "work_from_home",
      label: "Has WFH",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => {
        const status = getStatus(row.start_date, row.end_date);
        return (
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] border ${getStatusStyle(
              status,
            )}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-[16px] font-medium text-gray-900">All Policy</h2>

        <div className="flex gap-3">
          <div className="relative">
            <input
              placeholder="Search"
              className="pl-4 pr-10 py-2 border rounded-lg text-sm w-64"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs"
          >
            <Plus size={14} strokeWidth={3} />
            Create Policy
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center  text-sm text-gray-500">
          Loading policies...
        </div>
      ) : (
        <UniversalTable columns={columns} data={policyData} rowsPerPage={6} />
      )}

      {/* Modal */}
      <CreateAttendancePolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AttendancePolicy;
