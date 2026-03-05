import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { addHoliday, modifyHoliday } from "../service/holidayservices"; // Import both
import { getBranchData } from "../service/companyService";

const HolidayModal = ({ isOpen, onClose, onRefresh, editData = null }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    branch: "0",
    image: null,
  });

  // 1. Determine if we are in Edit Mode
  const isEditMode = !!editData;

  // 2. Fetch branches and Pre-fill data if editing
  useEffect(() => {
    if (isOpen) {
      const loadBranches = async () => {
        try {
          const data = await getBranchData();
          if (data) setBranches(data);
        } catch (error) {
          console.error("Failed to fetch branches", error);
        }
      };
      loadBranches();

      if (editData) {
        // Format date to YYYY-MM-DD for the input field
        const formattedDate = editData.date
          ? new Date(editData.date).toISOString().split("T")[0]
          : "";
        setFormData({
          title: editData.Reason || editData.title || "",
          date: formattedDate,
          branch: editData.branch?.toString() || "0",
          image: null, // Keep null unless user chooses a NEW image
        });
      } else {
        // Reset for Add Mode
        setFormData({ title: "", date: "", branch: "0", image: null });
      }
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("branch", formData.branch);
    if (formData.image) data.append("image", formData.image);

    // 3. Logic for Add vs Update
    const actionPromise = isEditMode
      ? modifyHoliday(editData.id, data)
      : addHoliday(data);

    toast.promise(actionPromise, {
      loading: isEditMode ? "Updating holiday..." : "Adding holiday...",
      success: (res) => {
        onRefresh();
        onClose();
        return (
          res?.message ||
          (isEditMode ? "Updated successfully!" : "Added successfully!")
        );
      },
      error: (err) => err?.response?.data?.message || "Something went wrong.",
    });

    try {
      await actionPromise;
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-black/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">
            {isEditMode ? "Edit Holiday" : "Add New Holiday"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} className="text-black/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">
              Holiday Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="e.g. Independence Day"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">
                Branch
              </label>
              <select
                required
                value={formData.branch}
                className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
              >
                <option value="0">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block mb-1.5">
              {isEditMode ? "Replace Image (Optional)" : "Holiday Image"}
            </label>
            <div className="relative border-2 border-dashed border-black/5 rounded-xl p-6 text-center hover:bg-black/[0.02] transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />
              <Upload size={24} className="mx-auto text-black/20 mb-2" />
              <p className="text-xs text-black/40 font-light truncate px-2">
                {formData.image ? formData.image.name : "Choose a file..."}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-medium border border-black/10 rounded-xl hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-sm font-bold bg-black text-white rounded-xl hover:bg-black/90 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Changes"
                  : "Save Holiday"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayModal;
