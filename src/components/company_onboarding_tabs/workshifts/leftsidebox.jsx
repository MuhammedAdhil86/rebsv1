import { ChevronDown } from "lucide-react";
import ShiftPolicyDetails from "./shiftpolicydetails";

const LeftSidebar = ({
  shifts,
  selectedShift,
  handleShiftChange,
  filterType,
  handleFilterTypeChange,
  filterOptions,
  selectedFilterId,
  handleFilterSelect,
  users,
  handleClearAll,
  selectedPolicy,
  selectedUsersCount,
  handleAllocate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => {
  return (
    <div className="w-[240px] space-y-6 font-poppins font-normal">
      <div className="bg-[#F4981833] border border-[#FFD9A7] rounded-2xl p-3">
        <div className="space-y-4">
          <div className="relative">
            <label className="text-[11px] text-gray-800 block mb-2 font-normal">
              Select a Shift
            </label>
            <select
              value={selectedShift}
              onChange={handleShiftChange}
              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm appearance-none text-gray-700 focus:outline-none font-normal"
            >
              <option value="">Select Shift</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.shift_name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-[38px] text-gray-400"
              size={16}
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-800 block mb-2 font-normal">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none font-normal"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-800 block mb-2 font-normal">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none font-normal"
            />
          </div>

          <div className="relative">
            <label className="text-[11px] text-gray-800 block mb-2 font-normal">
              Select User Category
            </label>
            <select
              value={filterType}
              onChange={(e) => handleFilterTypeChange(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm appearance-none text-gray-700 focus:outline-none font-normal"
            >
              <option value="all">All Users</option>
              <option value="department">Department</option>
              <option value="designation">Designation</option>
              <option value="branch">Branch</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-[38px] text-gray-400"
              size={16}
            />
          </div>

          {filterType !== "all" && (
            <div className="relative">
              <label className="text-[11px] text-gray-800 block mb-2 font-normal">
                Select {filterType}
              </label>
              <select
                value={selectedFilterId}
                onChange={(e) => handleFilterSelect(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm appearance-none text-gray-700 focus:outline-none font-normal"
              >
                <option value="">Select</option>
                {filterOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-[38px] text-gray-400"
                size={16}
              />
            </div>
          )}

          <div className="pt-2 border-t border-[#FFD9A7]">
            <p className="text-[10px] text-orange-700 font-normal">
              {selectedUsersCount} selection active
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClearAll}
              className="flex-1 py-1.5 border border-gray-300 rounded-lg text-[11px] text-gray-700 bg-white/50 hover:bg-white transition-colors font-normal"
            >
              Clear
            </button>
            <button
              onClick={handleAllocate}
              className="flex-1 py-1.5 bg-black text-white rounded-lg text-[11px] hover:bg-neutral-800 transition-all font-normal"
            >
              Allocate
            </button>
          </div>
        </div>
      </div>

      <ShiftPolicyDetails policy={selectedPolicy} />
    </div>
  );
};

export default LeftSidebar;
