import React from "react";
import { X, Search, Loader2, CheckCircle2, Users } from "lucide-react";

const AllocatePayrollModal = ({
  isOpen,
  onClose,
  step,
  setStep,
  loading,
  staffList,
  templates,
  filters,
  selectedStaff,
  setSelectedStaff,
  searchQuery,
  setSearchQuery,
  activeFilters,
  setActiveFilters,
  formData,
  setFormData,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm font-poppins text-[12px]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-lg text-black">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-[14px] font-normal text-gray-900 leading-tight">
                Bulk Payroll Allocation
              </h2>
              <p className="text-gray-400 text-[10px] font-normal">
                Step {step} of 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 1 ? (
            <div className="flex flex-col h-full">
              {/* Step 1: Filters & Search */}
              <div className="p-4 bg-zinc-50 border-b space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="p-2.5 bg-white rounded-xl border border-gray-200 outline-none focus:border-black transition-all font-normal"
                    value={activeFilters.dept}
                    onChange={(e) =>
                      setActiveFilters({
                        ...activeFilters,
                        dept: e.target.value,
                      })
                    }
                  >
                    <option value="">All Departments</option>
                    {filters.departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="p-2.5 bg-white rounded-xl border border-gray-200 outline-none focus:border-black transition-all font-normal"
                    value={activeFilters.branch}
                    onChange={(e) =>
                      setActiveFilters({
                        ...activeFilters,
                        branch: e.target.value,
                      })
                    }
                  >
                    <option value="">All Branches</option>
                    {filters.branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search staff by name..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-black font-normal"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Step 1: Staff Table */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Loader2 className="animate-spin mb-2" size={20} />
                    <span>Loading staff records...</span>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white border-b text-gray-500 uppercase text-[9px] tracking-widest font-normal">
                      <tr>
                        <th className="p-4 w-10">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setSelectedStaff(
                                e.target.checked
                                  ? staffList.map((s) => s.uuid)
                                  : [],
                              )
                            }
                            checked={
                              selectedStaff.length === staffList.length &&
                              staffList.length > 0
                            }
                          />
                        </th>
                        <th className="p-4">Staff Details</th>
                        <th className="p-4">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {staffList
                        .filter((s) =>
                          s.full_name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .map((staff) => (
                          <tr
                            key={staff.uuid}
                            className={`hover:bg-zinc-50 transition-colors font-normal ${
                              selectedStaff.includes(staff.uuid)
                                ? "bg-zinc-50"
                                : ""
                            }`}
                          >
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedStaff.includes(staff.uuid)}
                                onChange={() =>
                                  setSelectedStaff((prev) =>
                                    prev.includes(staff.uuid)
                                      ? prev.filter((id) => id !== staff.uuid)
                                      : [...prev, staff.uuid],
                                  )
                                }
                              />
                            </td>
                            <td className="p-4">
                              <div className="text-gray-900 font-normal">
                                {staff.full_name}
                              </div>
                              <div className="text-[10px] text-gray-400 font-normal">
                                {staff.employee_id}
                              </div>
                            </td>
                            <td className="p-4 text-gray-600 font-normal">
                              {staff.department_name}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            /* Step 2: Form Settings */
            <div className="p-8 space-y-8 h-full flex flex-col justify-center bg-white font-normal">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center gap-4 shadow-xl">
                <CheckCircle2 className="text-white" size={32} />
                <div>
                  <h4 className="text-white text-[15px] font-normal">
                    {selectedStaff.length} Staff Selected
                  </h4>
                  <p className="text-zinc-400 text-[11px] font-normal">
                    Select the salary structure and effective period.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-500 font-normal mb-2 uppercase tracking-wider text-[10px]">
                    Salary Template
                  </label>
                  <select
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black font-normal"
                    value={formData.template_id}
                    onChange={(e) =>
                      setFormData({ ...formData, template_id: e.target.value })
                    }
                  >
                    <option value="">Choose a Template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5 font-normal">
                  <div>
                    <label className="block text-gray-500 font-normal mb-2 uppercase tracking-wider text-[10px]">
                      Effective From
                    </label>
                    <input
                      type="date"
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black font-normal"
                      value={formData.from_date}
                      onChange={(e) =>
                        setFormData({ ...formData, from_date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-normal mb-2 uppercase tracking-wider text-[10px]">
                      Effective To
                    </label>
                    <input
                      type="date"
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black font-normal"
                      value={formData.to_date}
                      onChange={(e) =>
                        setFormData({ ...formData, to_date: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-zinc-50 flex justify-between items-center shrink-0">
          <div className="text-gray-400 font-normal italic">
            {selectedStaff.length} selected
          </div>
          <div className="flex gap-3 font-normal">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 transition-all"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                disabled={selectedStaff.length === 0}
                onClick={() => setStep(2)}
                className="px-10 py-2.5 bg-black text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all font-normal"
              >
                Next Step
              </button>
            ) : (
              <div className="flex gap-3 font-normal">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-zinc-50 text-gray-700 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={onSubmit}
                  className="px-10 py-2.5 bg-black text-white rounded-xl hover:bg-zinc-800 shadow-xl transition-all font-normal"
                >
                  Confirm & Allocate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocatePayrollModal;
