// AddBranchForm.jsx
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../../../service/axiosinstance";

const AddBranchForm = () => {
  const [formData, setFormData] = useState({
    branchName: "",
    branchCode: "",
    location: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    timeZone: "",
  });

  const [timeZones, setTimeZones] = useState([]);

  // Fetch time zones from API
  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const res = await axiosInstance.get("/admin/timezone/get");
        if (res.data?.data) {
          setTimeZones(res.data.data);
          if (res.data.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              timeZone: res.data.data[0].id.toString(),
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching time zones:", error);
      }
    };
    fetchTimeZones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.branchName,
        code: formData.branchCode,
        description: formData.description,
        time_zone: formData.timeZone, // API expects time_zone
        longitude: formData.longitude,
        latitude: formData.latitude,
        address: formData.address,
        location: formData.location,
      };

      const res = await axiosInstance.post("/branch/add", payload);
      if (res.data?.status_code === 200) {
        alert(res.data.message);
        // Optionally reset form
        setFormData({
          branchName: "",
          branchCode: "",
          location: "",
          description: "",
          address: "",
          latitude: "",
          longitude: "",
          timeZone: timeZones.length > 0 ? timeZones[0].id.toString() : "",
        });
      }
    } catch (error) {
      console.error("Error adding branch:", error);
      alert("Failed to add branch");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Branch Name</label>
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Branch Code</label>
          <input
            type="text"
            name="branchCode"
            value={formData.branchCode}
            onChange={handleChange}
            placeholder="Enter code"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Description */}
        <div className="row-span-2">
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full h-[120px] border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-black"
          ></textarea>
        </div>

        {/* Address + Time Zone */}
        <div className="flex flex-col justify-between h-[120px]">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Branch Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="pt-4">
            <label className="block text-sm text-gray-700 mb-1">Time Zone</label>
            <div className="relative">
              <select
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="w-full appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-black"
              >
                {timeZones.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.name}
                  </option>
                ))}
              </select>
              <Icon
                icon="material-symbols:arrow-left-rounded"
                className="absolute right-3 top-3 text-gray-500 rotate-[-90deg] text-lg pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Latitude + Longitude */}
        <div className="flex flex-col justify-between h-[120px]">
          <div className="flex items-end gap-3">
            <div className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition">
              <Icon icon="mdi:location" className="text-gray-600 text-[18px]" />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Enter latitude"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Enter longitude"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
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

export default AddBranchForm;
