import React, { useEffect, useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast"; // 👈 Import toast
import GlowButton from "../helpers/glowbutton";

/* ===== API SERVICES ===== */
import {
  updateCompanyDetails,
  OrganizationType,
  getCountryName,
  getCompanyPreview,
} from "../../service/companyService";
import { fetchTimeZone } from "../../service/eventservice";

/* ===== UTILS ===== */
import { getGeolocation } from "../../utils/geolocation";

const AddBasicInformation = () => {
  const [countries, setCountries] = useState([]);
  const [orgTypes, setOrgTypes] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const [logoFile, setLogoFile] = useState(null);
  const [horizontalLogoFile, setHorizontalLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [horizontalLogoPreview, setHorizontalLogoPreview] = useState("");

  const logoInputRef = useRef(null);
  const horizontalLogoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    country_id: "",
    website: "",
    description: "",
    organisation_type_id: "",
    location: "",
    address: "",
    time_zone_id: "",
    contact_person: "",
    phone_number: "",
    email: "",
    latitude: "",
    longitude: "",
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    branch_address: "",
    city: "",
    state_province: "",
    postal_code: "",
    swift_ifsc_code: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const previewRes = await getCompanyPreview();
        const [countryRes, orgRes, tzRes] = await Promise.all([
          getCountryName(),
          OrganizationType(),
          fetchTimeZone(),
        ]);

        const company = previewRes?.data?.data?.company || previewRes?.company;

        setCountries(countryRes || []);
        setOrgTypes(orgRes || []);
        setTimeZones(tzRes || []);

        if (company) {
          setFormData({
            name: company.name || "",
            country_id: String(company.country_id || ""),
            website: company.website || "",
            description: company.description || "",
            organisation_type_id: String(company.organisation_type_id || ""),
            location: company.location || "",
            address: company.address || "",
            time_zone_id: String(company.time_zone_id || ""),
            contact_person: company.contact_person || "",
            phone_number: company.phone_number || "",
            email: company.email || "",
            latitude: company.latitude || "",
            longitude: company.longitude || "",
            account_holder_name: company.account_holder_name || "",
            bank_name: company.bank_name || "",
            account_number: company.account_number || "",
            branch_address: company.branch_address_kyc || "",
            city: company.city || "",
            state_province: company.state_province || "",
            postal_code: company.postal_code || "",
            swift_ifsc_code: company.swift_ifsc_code || "",
          });

          if (company.logo) setLogoPreview(company.logo);
          if (company.horizontal_logo)
            setHorizontalLogoPreview(company.horizontal_logo);
        }
      } catch (err) {
        toast.error("Failed to load company profile");
      }
    };
    loadData();
  }, []);

  /* ================= HANDLERS ================= */
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    const loadId = toast.loading("Fetching location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
        const geoAddress = await getGeolocation(latitude, longitude);
        if (geoAddress) {
          setFormData((prev) => ({ ...prev, address: geoAddress }));
          toast.success("Location updated", { id: loadId });
        } else {
          toast.dismiss(loadId);
        }
      },
      () => toast.error("Location access denied", { id: loadId }),
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    if (type === "vertical") {
      setLogoFile(file);
      setLogoPreview(localUrl);
      toast.success("Vertical logo selected");
    } else {
      setHorizontalLogoFile(file);
      setHorizontalLogoPreview(localUrl);
      toast.success("Horizontal logo selected");
    }
    setShowUploadOptions(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.email) return toast.error("Email is mandatory");

    setLoading(true);
    const savingToast = toast.loading("Saving changes...");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key] ?? "");
    });

    if (logoFile) data.append("logo", logoFile);
    if (horizontalLogoFile) data.append("horizontal_logo", horizontalLogoFile);

    try {
      const response = await updateCompanyDetails(data);

      // ✅ SUCCESS TOAST
      toast.success(
        response?.message || "Company details updated successfully!",
        {
          id: savingToast,
        },
      );
    } catch (err) {
      // ✅ ERROR TOAST (Extracting backend message)
      const errorMsg =
        err.response?.data?.message || "Update failed. Please try again.";
      toast.error(errorMsg, {
        id: savingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* SESSION 1: BASIC INFORMATION */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        {/* LOGO UPLOAD SECTION */}
        <div className="border border-gray-200 rounded-lg p-4 mb-8 bg-[#fafafa]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">
                  Organization Logo
                </h3>
                <p className="text-[10px] text-gray-500 leading-none">
                  Upload horizontal and vertical versions.
                </p>
              </div>

              <div className="flex gap-4">
                {logoPreview && (
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={logoPreview}
                      alt="Vertical"
                      className="h-12 w-12 object-contain bg-white border rounded p-1 shadow-sm"
                    />
                    <span className="text-[8px] uppercase text-gray-400 font-bold">
                      Vertical
                    </span>
                  </div>
                )}
                {horizontalLogoPreview && (
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={horizontalLogoPreview}
                      alt="Horizontal"
                      className="h-12 w-28 object-contain bg-white border rounded p-1 shadow-sm"
                    />
                    <span className="text-[8px] uppercase text-gray-400 font-bold">
                      Horizontal
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className="flex items-center gap-2 bg-black text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
              >
                <FiUpload className="text-sm" /> Upload Image
              </button>
              {showUploadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current.click()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b"
                  >
                    Upload Logo (Vertical)
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
                ref={logoInputRef}
                onChange={(e) => handleFileChange(e, "vertical")}
                className="hidden"
                accept="image/*"
              />
              <input
                type="file"
                ref={horizontalLogoInputRef}
                onChange={(e) => handleFileChange(e, "horizontal")}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Field
              label="Name (Read-only)"
              name="name"
              value={formData.name}
              readOnly
              isLight
            />
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">
                Country<span className="text-red-500">*</span>
              </label>
              <select
                name="country_id"
                value={formData.country_id}
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
            <Field
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="row-span-2">
              <label className="block text-sm text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-[120px] border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none"
              />
            </div>
            <div className="flex flex-col justify-between h-[120px]">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Type of Organization
                </label>
                <select
                  name="organisation_type_id"
                  value={formData.organisation_type_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  {orgTypes.map((o) => (
                    <option key={o.id} value={String(o.id)}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Primary Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col justify-between h-[120px]">
              <Field
                label="Location Name"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              <div className="flex items-end pt-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    name="time_zone_id"
                    value={formData.time_zone_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select</option>
                    {timeZones.map((t) => (
                      <option key={t.id} value={String(t.id)}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  onClick={handleFetchLocation}
                  className="ml-2 flex items-center justify-center w-9 h-9 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition shadow-sm"
                >
                  <Icon
                    icon="mdi:location"
                    className="text-gray-600 text-[18px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Field
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
            />
            <Field
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
            />
            <Field
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Field
              label="Contact Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">
                Contact Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm border-blue-100"
              />
            </div>
          </div>
        </form>
      </div>

      {/* SESSION 2: BANK INFORMATION */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-3 text-emerald-600 font-semibold uppercase text-[12px] tracking-widest">
          <Icon icon="solar:bank-bold-duotone" className="text-2xl" /> Bank
          Information
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Field
            label="Account Holder Name"
            name="account_holder_name"
            value={formData.account_holder_name}
            onChange={handleChange}
          />
          <Field
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
          />
          <Field
            label="Account Number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
          />
          <Field
            label="Branch Address"
            name="branch_address"
            value={formData.branch_address}
            onChange={handleChange}
          />
          <Field
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <Field
            label="State / Province"
            name="state_province"
            value={formData.state_province}
            onChange={handleChange}
          />
          <Field
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
          <Field
            label="IFSC / SWIFT Code"
            name="swift_ifsc_code"
            value={formData.swift_ifsc_code}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-4 pt-8">
          <GlowButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save All Changes"}
          </GlowButton>
        </div>
      </div>
    </div>
  );
};

/* ===== REUSABLE FIELD ===== */
const Field = ({ label, isLight, ...props }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-black transition ${
        isLight
          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
          : "border-gray-300"
      }`}
    />
  </div>
);

export default AddBasicInformation;
