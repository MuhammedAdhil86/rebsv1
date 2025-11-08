import React, { useState } from "react";
import { Icon } from "@iconify/react";

const AddDepartmentForm = () => {
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    email: "",
    description: "",
    hasParent: false,
    parentBranch: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Department Form Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Department Name
          </label>
          <input
            type="text"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Department Code
          </label>
          <input
            type="text"
            name="departmentCode"
            value={formData.departmentCode}
            onChange={handleChange}
            placeholder="Enter code"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Description */}
        <div className="col-span-1">
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full h-[120px] border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-black"
          ></textarea>
        </div>

        {/* Has Parent Department */}
        <div className="flex flex-col justify-start mt-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="hasParent"
              checked={formData.hasParent}
              onChange={handleChange}
              className="w-4 h-4 accent-black"
            />
            Has Parent Department? Check if this department is a sub-department of a parent department.
          </label>
        </div>

        {/* Parent Branch */}
        <div className="flex flex-col justify-between mt-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Parent Branch
            </label>
            <div className="relative">
              <select
                name="parentBranch"
                value={formData.parentBranch}
                onChange={handleChange}
                className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
              >
                <option value="">Select</option>
                <option value="Branch1">Branch 1</option>
                <option value="Branch2">Branch 2</option>
              </select>
              <Icon
                icon="material-symbols:arrow-left-rounded"
                className="absolute right-3 top-3 text-gray-500 rotate-[-90deg] text-lg pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-md text-sm hover:bg-gray-800 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddDepartmentForm;
