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
  selectedUsersCount, // Count of selected users
  handleAllocate, // Allocate button callback
}) => {
  return (
    <div className="w-[240px] space-y-6">
      {/* Allocation Controls */}
      <div className="bg-[#F4981833] border border-[#FFD9A7] rounded-2xl p-3">
        <div className="space-y-4">
          {/* Select Shift */}
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
              className="absolute right-3 inset-y-0 my-auto text-gray-400 mt-10"
              size={16}
            />
          </div>

          {/* Select User Category */}
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
              className="absolute right-3 inset-y-0 my-auto text-gray-400 mt-10"
              size={16}
            />
          </div>

          {/* Secondary Filter */}
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
                className="absolute right-3 inset-y-0 my-auto text-gray-400 mt-10"
                size={16}
              />
            </div>
          )}

          {/* Users Selected */}
          <p className="text-[10px] text-[#D97706] font-normal">
            {selectedUsersCount} Users Selected
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClearAll}
              className="flex-1 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white/50 hover:bg-white transition-colors font-normal"
            >
              Clear All
            </button>
            <button
              onClick={handleAllocate} // Trigger allocation API
              className="flex-1 py-1 bg-black text-white rounded-lg text-sm hover:bg-neutral-800 transition-all font-normal"
            >
              Allocate
            </button>
          </div>
        </div>
      </div>

      {/* Shift Policy Details */}
      <ShiftPolicyDetails policy={selectedPolicy} />
    </div>
  );
};

export default LeftSidebar;
