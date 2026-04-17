import React, { useState, useEffect, useRef } from "react";
import { Drawer } from "@mui/material";
import { FiX, FiCamera, FiPlus, FiTag } from "react-icons/fi";
import toast from "react-hot-toast";
import { createAsset, assetType } from "../../service/assetservice";

const CreateAssetDrawer = ({ open, onClose, onAssetCreated }) => {
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetTypes, setAssetTypes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({}); // ✅ field errors

  const [formData, setFormData] = useState({
    asset_name: "",
    asset_type: "",
    condition: "New",
    purchase_date: "",
    last_maintenance: "",
    asset_status: "Available",
    image: null,
  });

  // ✅ Load asset types
  useEffect(() => {
    if (open) {
      loadTypes();
    }
  }, [open]);

  const loadTypes = async () => {
    try {
      const res = await assetType();
      setAssetTypes(res || []);
    } catch (err) {
      toast.error("Failed to load asset types");
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear field error
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ✅ Handle image
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Format date
  const formatToISO = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString();
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);
    setErrors({}); // reset errors

    const payload = new FormData();
    payload.append("asset_name", formData.asset_name);
    payload.append("asset_type", formData.asset_type);
    payload.append("asset_status", formData.asset_status);
    payload.append("purchase_date", formatToISO(formData.purchase_date));
    payload.append("condition", formData.condition);
    payload.append("last_maintenance", formatToISO(formData.last_maintenance));

    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      const res = await createAsset(payload);

      toast.success(res?.data?.message || "Asset created successfully");

      onAssetCreated();
      handleClose();
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong";

      const fieldErrors = err.response?.data?.errors;

      // ✅ Handle validation errors
      if (fieldErrors && typeof fieldErrors === "object") {
        setErrors(fieldErrors);

        Object.values(fieldErrors).forEach((errorArr) => {
          if (Array.isArray(errorArr)) {
            errorArr.forEach((msg) => toast.error(msg));
          } else {
            toast.error(errorArr);
          }
        });
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Reset form
  const handleClose = () => {
    setFormData({
      asset_name: "",
      asset_type: "",
      condition: "New",
      purchase_date: "",
      last_maintenance: "",
      asset_status: "Available",
      image: null,
    });

    setErrors({});
    setImagePreview(null);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ className: "w-full max-w-[500px] shadow-2xl" }}
    >
      <div className="h-full flex flex-col bg-white text-[12px]">
        {/* HEADER */}
        <div className="px-8 py-6 flex justify-between border-b">
          <div>
            <h2 className="text-[16px] font-medium uppercase">
              New Physical Asset
            </h2>
            <p className="text-[10px] text-gray-400 uppercase">
              Register hardware
            </p>
          </div>

          <button onClick={handleClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* FORM */}
        <form className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* IMAGE */}
          <div className="h-44 border-dashed border-2 flex items-center justify-center relative rounded-2xl">
            {imagePreview ? (
              <img
                src={imagePreview}
                className="absolute w-full h-full object-cover"
              />
            ) : (
              <FiCamera size={30} className="text-gray-400" />
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0"
            />
          </div>

          {/* NAME */}
          <div>
            <input
              name="asset_name"
              value={formData.asset_name}
              onChange={handleChange}
              placeholder="Asset Name"
              className={`w-full border px-4 py-3 rounded-xl ${
                errors.asset_name ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* TYPE */}
          <select
            name="asset_type"
            value={formData.asset_type}
            onChange={handleChange}
            className={`w-full border px-4 py-3 rounded-xl ${
              errors.asset_type ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Type</option>
            {assetTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name || t.asset_type}
              </option>
            ))}
          </select>

          {/* DATES */}
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className={`w-full border px-4 py-3 rounded-xl ${
              errors.purchase_date ? "border-red-500" : "border-gray-300"
            }`}
          />

          <input
            type="date"
            name="last_maintenance"
            value={formData.last_maintenance}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl border-gray-300"
          />
        </form>

        {/* FOOTER */}
        <div className="p-6 border-t flex gap-4">
          <button
            onClick={handleClose}
            className="w-full border py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {isSubmitting ? "Adding..." : "Add Asset"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default CreateAssetDrawer;
