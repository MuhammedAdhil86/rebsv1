import React, { useEffect, useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
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

  // Raw File Objects for API
  const [logoFile, setLogoFile] = useState(null);
  const [horizontalLogoFile, setHorizontalLogoFile] = useState(null);

  // Preview URLs for UI
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [previewRes, countryRes, orgRes, tzRes] = await Promise.all([
          getCompanyPreview(),
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    if (type === "vertical") {
      setLogoFile(file); // This is the actual file for the API
      setLogoPreview(localUrl);
    } else {
      setHorizontalLogoFile(file); // This is the actual file for the API
      setHorizontalLogoPreview(localUrl);
    }
    toast.success("Image selected");
    setShowUploadOptions(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.email) return toast.error("Email is mandatory");

    setLoading(true);
    const savingToast = toast.loading("Saving updates...");

    const data = new FormData();

    // 1. Append Text Fields exactly as per your working Postman -F
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key] ?? "");
    });

    // 2. Append Image Files (Strictly using 'image' and 'horizontal_image' keys)
    if (logoFile instanceof File) {
      data.append("image", logoFile);
    }
    if (horizontalLogoFile instanceof File) {
      data.append("horizontal_image", horizontalLogoFile);
    }

    try {
      // Logic Check: updateCompanyDetails must call axios.post(url, data)
      const response = await updateCompanyDetails(data);
      toast.success(response?.message || "All details updated!", {
        id: savingToast,
      });

      // Clear file state so they don't re-upload on next text change
      setLogoFile(null);
      setHorizontalLogoFile(null);
    } catch (err) {
      console.error("API Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed", {
        id: savingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        {/* LOGO SECTION */}
        <div className="border border-gray-200 rounded-lg p-4 mb-8 bg-[#fafafa]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Company Logos
                </h3>
                <p className="text-[10px] text-gray-500">
                  Update your brand visibility.
                </p>
              </div>
              <div className="flex gap-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    className="h-12 w-12 object-contain bg-white border rounded p-1 shadow-sm"
                    alt="V"
                  />
                )}
                {horizontalLogoPreview && (
                  <img
                    src={horizontalLogoPreview}
                    className="h-12 w-28 object-contain bg-white border rounded p-1 shadow-sm"
                    alt="H"
                  />
                )}
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className="flex items-center gap-2 bg-black text-white text-sm px-3 py-1.5 rounded-md"
              >
                <FiUpload /> Upload Image
              </button>
              {showUploadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current.click()}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 border-b"
                  >
                    Vertical Logo
                  </button>
                  <button
                    type="button"
                    onClick={() => horizontalLogoInputRef.current.click()}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                  >
                    Horizontal Logo
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
              label="Name"
              name="name"
              value={formData.name}
              readOnly
              isLight
            />
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">
                Country*
              </label>
              <select
                name="country_id"
                value={formData.country_id}
                onChange={(e) =>
                  setFormData({ ...formData, country_id: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white outline-none"
              >
                <option value="">Select</option>
                {countries.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Website"
              name="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="h-[125px]">
              <label className="block text-sm text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full h-[95px] border border-gray-300 rounded-md px-3 py-2 text-sm resize-none outline-none"
              />
            </div>

            {/* Gap Matching Column 2 */}
            <div className="flex flex-col justify-between h-[125px]">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Organization Type
                </label>
                <select
                  name="organisation_type_id"
                  value={formData.organisation_type_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organisation_type_id: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white outline-none"
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
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            {/* Gap Matching Column 3 */}
            <div className="flex flex-col justify-between h-[125px]">
              <Field
                label="Location Name"
                name="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <div className="flex items-end">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    name="time_zone_id"
                    value={formData.time_zone_id}
                    onChange={(e) =>
                      setFormData({ ...formData, time_zone_id: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white outline-none"
                  >
                    <option value="">Select</option>
                    {timeZones.map((t) => (
                      <option key={t.id} value={String(t.id)}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="ml-2 w-9 h-9 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  <Icon icon="solar:gps-bold" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Field
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
            />
            <Field
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
            />
            <Field
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={(e) =>
                setFormData({ ...formData, contact_person: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Field
              label="Contact Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
            />
            <Field
              label="Contact Email*"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
            />
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-3 text-emerald-600 font-bold uppercase text-[11px] tracking-widest">
          <Icon icon="solar:bank-bold-duotone" className="text-xl" /> Bank
          Information
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Field
            label="Account Holder"
            name="account_holder_name"
            value={formData.account_holder_name}
            onChange={(e) =>
              setFormData({ ...formData, account_holder_name: e.target.value })
            }
          />
          <Field
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={(e) =>
              setFormData({ ...formData, bank_name: e.target.value })
            }
          />
          <Field
            label="Account Number"
            name="account_number"
            value={formData.account_number}
            onChange={(e) =>
              setFormData({ ...formData, account_number: e.target.value })
            }
          />
          <Field
            label="Branch Address"
            name="branch_address"
            value={formData.branch_address}
            onChange={(e) =>
              setFormData({ ...formData, branch_address: e.target.value })
            }
          />
          <Field
            label="City"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <Field
            label="State / Province"
            name="state_province"
            value={formData.state_province}
            onChange={(e) =>
              setFormData({ ...formData, state_province: e.target.value })
            }
          />
          <Field
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={(e) =>
              setFormData({ ...formData, postal_code: e.target.value })
            }
          />
          <Field
            label="IFSC / SWIFT Code"
            name="swift_ifsc_code"
            value={formData.swift_ifsc_code}
            onChange={(e) =>
              setFormData({ ...formData, swift_ifsc_code: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end pt-10">
          <GlowButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save All Changes"}
          </GlowButton>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, isLight, ...props }) => (
  <div className="w-full">
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className={`w-full border rounded-md px-3 py-2 text-sm outline-none transition focus:ring-1 focus:ring-black ${
        isLight
          ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white border-gray-300"
      }`}
    />
  </div>
);

export default AddBasicInformation;
