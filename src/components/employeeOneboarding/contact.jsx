import React, { useState, useEffect } from "react";
import CommonUploadActions from "../../ui/commonupload";
import { addContactInfo } from "../../service/employeeService";
import toast, { Toaster } from "react-hot-toast";

const ContactInformation = ({ goNextStep, goPrevStep, onStepComplete }) => {
  const [formData, setFormData] = useState({
    work_phone: "",
    personal_email: "",
    personal_phone: "",
    seating_location: "",
    additional_phone: "",
    tags: "",
    present_address: "",
    permanent_address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(() => {
    return Number(localStorage.getItem("contactProgress")) || 0;
  });

  // 🧩 Auto-save progress to localStorage
  useEffect(() => {
    localStorage.setItem("contactProgress", progress);
  }, [progress]);

  // 🧩 Auto-save form data
  useEffect(() => {
    localStorage.setItem("contactForm", JSON.stringify(formData));
  }, [formData]);

  // 🧠 Load saved form data on mount
  useEffect(() => {
    const savedForm = localStorage.getItem("contactForm");
    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch {
        console.error("Failed to parse saved contact form");
      }
    }
  }, []);

  // 🧠 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit form to backend
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await addContactInfo(formData);
      console.log("✅ Contact info saved:", response);
      toast.success("Contact information saved successfully!");

      // 💾 Save progress locally
      setProgress(100);
      localStorage.setItem("contactCompleted", "true");

      // ✅ Notify parent for next step
      if (onStepComplete) onStepComplete();
      else if (goNextStep) goNextStep();

      // 🧹 Reset form and remove local cache
      setFormData({
        work_phone: "",
        personal_email: "",
        personal_phone: "",
        seating_location: "",
        additional_phone: "",
        tags: "",
        present_address: "",
        permanent_address: "",
      });
      localStorage.removeItem("contactForm");
    } catch (error) {
      console.error("❌ Error saving contact information:", error);
      toast.error("Failed to save contact information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔙 Handle Previous step
  const handlePrev = () => {
    setProgress((prev) => Math.max(prev - 10, 0));
    if (goPrevStep) goPrevStep();
  };

  return (
    <div className="flex-1 p-3 bg-[#f9fafb]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-gray-900">Contact Information</h2>
          <span className="text-sm text-gray-500">Step 07</span>
        </div>
        <CommonUploadActions />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm px-6 py-8 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          {/* Form Fields */}
          {[
            { name: "work_phone", label: "Work Phone (Optional)" },
            { name: "personal_email", label: "Personal Email", required: true },
            { name: "personal_phone", label: "Personal Phone", required: true },
            { name: "seating_location", label: "Seating Location" },
            { name: "additional_phone", label: "Additional Phone (Optional)" },
            { name: "tags", label: "Tags" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                type="text"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required={field.required}
              />
            </div>
          ))}

          {/* Addresses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Present Address
            </label>
            <textarea
              name="present_address"
              value={formData.present_address}
              onChange={handleChange}
              placeholder="Enter present address"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permanent Address
            </label>
            <textarea
              name="permanent_address"
              value={formData.permanent_address}
              onChange={handleChange}
              placeholder="Enter permanent address"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-gray-700 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons + Progress */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="border border-gray-300 text-gray-700 text-sm px-5 py-2 rounded-md hover:bg-gray-100"
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#111827] hover:bg-black text-white text-sm px-5 py-2 rounded-md shadow disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save & Complete"}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col items-end">
          <div className="w-40 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-black h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default ContactInformation;
