import React, { useEffect, useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import GlowButton from "../helpers/glowbutton.jsx";
/* ===== API SERVICES ===== */
import {
  getOrganisationDetails,
  updateCompanyDetails,
  OrganizationType,
  getCountryName,
  getCompanyPreview, // ✅ added preview api
} from "../../service/companyService";
import { fetchTimeZone } from "../../service/eventservice";

const AddBasicInformation = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const companyId = userData?.company?.id;

  const [countries, setCountries] = useState([]);
  const [orgTypes, setOrgTypes] = useState([]);
  const [timeZones, setTimeZones] = useState([]);

  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [horizontalLogoFile, setHorizontalLogoFile] = useState(null);

  const logoInputRef = useRef(null);
  const horizontalLogoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    website: "",
    description: "",
    organizationType: "",
    locationName: "",
    address: "",
    timeZone: "",
    contactPerson: "",
    contactNumber: "",
    contactEmail: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Calling APIs...");

        const [previewRes, countryRes, orgRes, tzRes] = await Promise.all([
          getCompanyPreview(), // ✅ preview api
          getCountryName(),
          OrganizationType(),
          fetchTimeZone(),
        ]);

        console.log("FULL COMPANY PREVIEW DATA:", previewRes);

        const company = previewRes.company; // ✅ map company object

        setCountries(countryRes || []);
        setOrgTypes(orgRes || []);
        setTimeZones(tzRes || []);

        setFormData({
          name: company?.name || "",
          country: String(company?.country_id || ""),
          website: company?.website || "",
          description: company?.description || "",
          organizationType: String(company?.organisation_type_id || ""),
          locationName: company?.location || "",
          address: company?.address || "",
          timeZone: String(company?.time_zone_id || ""),
          contactPerson: company?.contact_person || "",
          contactNumber: company?.phone_number || "",
          contactEmail: company?.email || "",
        });
      } catch (err) {
        console.error("Failed to fetch company preview data", err);
      }
    };

    loadData(); // ✅ no companyId condition
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setShowUploadOptions(false);
    }
  };

  const handleHorizontalLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHorizontalLogoFile(file);
      setShowUploadOptions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      website: formData.website,
      description: formData.description,
      address: formData.address,
      location: formData.locationName,
      contact_person: formData.contactPerson,
      phone_number: formData.contactNumber,
      email: formData.contactEmail,
      country_id: formData.country,
      organisation_type_id: formData.organizationType,
      time_zone_id: formData.timeZone,
    };

    console.log("UPDATE PAYLOAD:", payload);

    try {
      await updateCompanyDetails(payload);
      alert("Company updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  return (
    <div className="">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
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
              {logoFile && (
                <p className="text-sm text-gray-700 mt-1">
                  Logo: {logoFile.name}
                </p>
              )}
              {horizontalLogoFile && (
                <p className="text-sm text-gray-700 mt-1">
                  Horizontal Logo: {horizontalLogoFile.name}
                </p>
              )}
            </div>

            {/* Upload Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUploadOptions((prev) => !prev)}
                className="flex items-center gap-2 bg-black text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
              >
                <FiUpload className="text-sm" />
                Upload Image
              </button>

              {showUploadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current.click()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Upload Logo
                  </button>
                  <button
                    type="button"
                    onClick={() => horizontalLogoInputRef.current.click()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Upload Horizontal Logo
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                className="hidden"
              />
              <input
                type="file"
                accept="image/*"
                ref={horizontalLogoInputRef}
                onChange={handleHorizontalLogoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* ===== FORM ===== */}
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
                <option value="">Select</option>
                {countries.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
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
                  <option value="">Select</option>
                  {orgTypes.map((o) => (
                    <option key={o.id} value={String(o.id)}>
                      {o.name}
                    </option>
                  ))}
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
                      <option value="">Select</option>
                      {timeZones.map((t) => (
                        <option key={t.id} value={String(t.id)}>
                          {t.name}
                        </option>
                      ))}
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
            {/* Cancel Button stays the same */}
            <button
              type="button"
              className="border border-gray-300 text-gray-700 px-6 rounded-md text-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            {/* Save Button uses GlowButton */}
            <GlowButton onClick={handleSubmit}>Save</GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBasicInformation;
