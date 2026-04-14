import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { FiX, FiUpload } from "react-icons/fi";
import axiosInstance from "../../service/axiosinstance";
import { assetType, addAsset } from "../../service/assetservice";

const CreateAssetDrawer = ({ open, onClose, onAssetCreated }) => {
  const [formData, setFormData] = useState({
    assetName: "",
    condition: "",
    purchaseDate: "",
    lastMaintenance: "",
    assetTypeSelected: "",
    assetStatus: "",
  });

  const [assetTypes, setAssetTypes] = useState([]);
  const [assetImage, setAssetImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  // Fetch Asset Types when drawer opens
  useEffect(() => {
    if (open) fetchTypes();
  }, [open]);

  const fetchTypes = async () => {
    try {
      const data = await assetType();
      setAssetTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching types", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAssetImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddNewType = async () => {
    if (!newTypeName.trim()) return;
    try {
      // Assuming addAsset logic creates a new category/type
      const added = await addAsset({ name: newTypeName });
      setAssetTypes([...assetTypes, { id: added.id, name: added.name }]);
      setFormData({ ...formData, assetTypeSelected: added.id });
      setNewTypeName("");
      setShowTypeInput(false);
    } catch (err) {
      alert("Failed to add new type");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Matching the keys exactly with your Postman screenshot
    data.append("asset_name", formData.assetName);
    data.append("condition", formData.condition);
    data.append(
      "purchase_date",
      formData.purchaseDate ? `${formData.purchaseDate}T00:00:00Z` : "",
    );
    data.append(
      "last_maintenance",
      formData.lastMaintenance
        ? `${formData.lastMaintenance}T00:00:00Z`
        : "1970-01-01T00:00:00Z",
    );
    data.append("asset_type", formData.assetTypeSelected);
    data.append("asset_status", formData.assetStatus);

    if (assetImage) {
      data.append("image", assetImage);
    }

    try {
      const res = await axiosInstance.post("/admin/asset/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        onAssetCreated(); // Refresh list in parent
        handleClose(); // Reset and close
      }
    } catch (err) {
      console.error(err);
      alert("Error creating asset. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      assetName: "",
      condition: "",
      purchaseDate: "",
      lastMaintenance: "",
      assetTypeSelected: "",
      assetStatus: "",
    });
    setAssetImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ className: "w-full max-w-[500px]" }}
    >
      <div className="h-full flex flex-col bg-white font-sans">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Asset
            </h2>
            <p className="text-sm text-gray-500">
              Add asset details and upload an image
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          id="asset-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">
              Asset Image
            </label>
            <label className="relative group cursor-pointer block h-40 w-full border-2 border-dashed border-gray-200 rounded-xl hover:border-black transition-all overflow-hidden">
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <FiUpload size={24} className="mb-2" />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
            </label>
          </div>

          {/* Asset Name */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Asset Name</label>
            <input
              required
              name="assetName"
              value={formData.assetName}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
              placeholder="Ex: Dell Laptop"
            />
          </div>

          {/* Condition & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg text-sm outline-none"
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Status</label>
              <select
                name="assetStatus"
                value={formData.assetStatus}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg text-sm outline-none"
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Allocated">Allocated</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Asset Type */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Asset Type</label>
            {showTypeInput ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  className="flex-1 border p-2 rounded-lg text-sm outline-none"
                  placeholder="New type name..."
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddNewType}
                  className="bg-black text-white px-3 rounded-lg text-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowTypeInput(false)}
                  className="border px-3 rounded-lg text-sm text-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                name="assetTypeSelected"
                value={formData.assetTypeSelected}
                onChange={(e) =>
                  e.target.value === "add_new"
                    ? setShowTypeInput(true)
                    : handleInputChange(e)
                }
                className="w-full border p-2 rounded-lg text-sm outline-none"
              >
                <option value="">Select Type</option>
                {assetTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
                <option value="add_new" className="font-bold">
                  + Add New Type
                </option>
              </select>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg text-sm outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Last Maintenance</label>
              <input
                type="date"
                name="lastMaintenance"
                value={formData.lastMaintenance}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg text-sm outline-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            form="asset-form"
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all flex items-center justify-center"
          >
            {loading ? "Creating..." : "Save Asset"}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default CreateAssetDrawer;
