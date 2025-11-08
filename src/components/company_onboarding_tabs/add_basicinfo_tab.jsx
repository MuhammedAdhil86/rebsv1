import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { Icon } from "@iconify/react";

const AddBasicInformation = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "Asia/Kolkata",
    website: "https://google.com",
    description: "",
    organizationType: "Software Company",
    locationName: "",
    address: "",
    timeZone: "Asia/Kolkata",
    contactPerson: "",
    contactNumber: "",
    contactEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="px-3">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Upload Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-8 bg-[#fafafa]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                Upload Organization Logo
              </h3>
              <p className="font-[Poppins] font-normal text-[10px] text-gray-500 leading-none whitespace-nowrap">
                Please upload both horizontal and vertical versions of your
                organization’s logo to ensure optimal display across different
                layouts and screen sizes.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-black text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-800 transition">
              <FiUpload className="text-sm" />
              Upload Image
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">
                Country<span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
              >
                <option>Asia/Kolkata</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
              </select>
              <Icon
                icon="material-symbols:arrow-left-rounded"
                className="absolute right-3 top-9 text-gray-500 rotate-[-90deg] text-lg pointer-events-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-6">
            <div className="row-span-2">
              <label className="block text-sm text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full h-[120px] border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-black"
              ></textarea>
            </div>

            <div className="flex flex-col justify-between h-[120px]">
              <div className="relative">
                <label className="block text-sm text-gray-700 mb-1">
                  Type of Organization
                </label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                >
                  <option>Software Company</option>
                  <option>Education</option>
                  <option>Finance</option>
                </select>
                <Icon
                  icon="material-symbols:arrow-left-rounded"
                  className="absolute right-3 top-9 text-gray-500 rotate-[-90deg] text-lg pointer-events-none"
                />
              </div>

              <div className="pt-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Primary Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between h-[120px]">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-end pt-4">
                <div className="flex-1 relative">
                  <label className="block text-sm text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <div className="flex items-center">
                    <select
                      name="timeZone"
                      value={formData.timeZone}
                      onChange={handleChange}
                      className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
                    >
                      <option>Asia/Kolkata</option>
                      <option>Europe/London</option>
                      <option>America/New_York</option>
                    </select>
                    <Icon
                      icon="material-symbols:arrow-left-rounded"
                      className="absolute right-3 top-9 text-gray-500 rotate-[-90deg] text-lg pointer-events-none"
                    />
                  </div>
                </div>

                <div className="ml-2 flex items-center justify-center w-9 h-9 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
                  <Icon
                    icon="mdi:location"
                    className="text-gray-600 text-[18px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-2 rounded-md text-sm hover:bg-gray-800 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBasicInformation;
