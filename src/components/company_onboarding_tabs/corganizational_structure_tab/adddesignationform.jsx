import React from "react";
import { Icon } from "@iconify/react";

const AddDesignationForm = () => {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Designation Name */}
        <div className="flex flex-col relative">
          <label className="text-sm text-gray-600 mb-1">Designation Name</label>
          <select className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none">
            <option value="">Enter name</option>
          </select>

          {/* Dropdown Icon */}
          <Icon
            icon="material-symbols:arrow-left-rounded"
            className="absolute right-3 top-8 text-gray-500 rotate-[-90deg] text-lg pointer-events-none"
          />
        </div>

        {/* Designation Code */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Designation Code</label>
          <input
            type="text"
            placeholder="Enter code"
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Designation Email */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Designation Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddDesignationForm;
