import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import CommonUploadActions from "../../ui/commonupload";
import {
  fetchEmployeeStatus,
  fetchEmployeeType,
  addWorkInformation,
} from "../../service/employeeService";
import {
  getDepartmentData,
  getDesignationData,
  getBranchData,
  getOrganisationDetails,
} from "../../service/companyService";

const WorkInformation = ({ goNextStep, goPrevStep, onStepComplete }) => {
  const [formData, setFormData] = useState({
    company: "",
    location: "",
    employment_status_id: "",
    branch: "",
    employee_type_id: "",
    date_of_join: "",
    department: "",
    designation: "",
    total_experience: "",
    source_of_hiring: "",
  });

  const [dropdowns, setDropdowns] = useState({
    employeeStatus: [],
    employeeType: [],
    departments: [],
    designations: [],
    branches: [],
    organisations: [],
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** ✅ Load all dropdown data */
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [
          branchData,
          orgData,
          employeeType,
          employeeStatus,
          departmentData,
          designationData,
        ] = await Promise.all([
          getBranchData(),
          getOrganisationDetails(),
          fetchEmployeeType(),
          fetchEmployeeStatus(),
          getDepartmentData(),
          getDesignationData(),
        ]);

        setDropdowns({
          employeeStatus: employeeStatus || [],
          employeeType: employeeType || [],
          departments: departmentData || [],
          designations: designationData || [],
          branches: branchData || [],
          organisations: orgData || [],
        });
      } catch (err) {
        console.error("Dropdown fetch error:", err);
        toast.error("Failed to load dropdown data.");
      } finally {
        setLoading(false);
      }
    };

    loadDropdowns();
  }, []);

  /** ✅ Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Handle form submission */
  const handleSubmit = async () => {
    const employeeId = localStorage.getItem("employeeId");
    const branchId = localStorage.getItem("branchId") || formData.branch || "1";

    if (!employeeId) {
      toast.error("Employee ID missing. Please restart onboarding.");
      return;
    }

    // Build payload (exactly like old dev’s)
    const payload = {
      ...formData,
      branch_id: Number(branchId),
      employee_id: Number(employeeId),
      employment_status_id: Number(formData.employment_status_id),
      employee_type_id: Number(formData.employee_type_id),
      department_id: Number(formData.department),
      designation_id: Number(formData.designation),
    };

    // Convert date_of_join → ISO string like old code
    if (payload.date_of_join && !payload.date_of_join.includes("T")) {
      const isoDate = new Date(payload.date_of_join + "T12:00:00Z").toISOString();
      payload.date_of_join = isoDate;
    }

    // Remove old field names
    delete payload.branch;
    delete payload.department;
    delete payload.designation;

    try {
      setIsSubmitting(true);
      console.log("🚀 Sending payload:", payload);

      await addWorkInformation(payload);

      toast.success("Work information saved successfully!");
      localStorage.setItem("workInfoCompleted", "true");

      if (onStepComplete) onStepComplete();
      else if (goNextStep) goNextStep();
    } catch (error) {
      console.error("❌ Error updating work info:", error.response?.data || error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error updating work information.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { employeeStatus, employeeType, departments, designations } = dropdowns;

  return (
    <div className="flex-1 p-4 bg-gray-50">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Work Information
          </h2>
          <p className="text-sm text-gray-500">Step 03</p>
        </div>
        <CommonUploadActions />
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Location */}
            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            {/* Employment Status */}
            <SelectField
              label="Employment Status"
              name="employment_status_id"
              value={formData.employment_status_id}
              onChange={handleChange}
              options={employeeStatus}
            />

            {/* Employment Type */}
            <SelectField
              label="Employment Type"
              name="employee_type_id"
              value={formData.employee_type_id}
              onChange={handleChange}
              options={employeeType}
            />

            {/* Date of Joining */}
            <InputField
              label="Date of Joining"
              type="date"
              name="date_of_join"
              value={formData.date_of_join}
              onChange={handleChange}
            />

            {/* Department */}
            <SelectField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              options={departments}
            />

            {/* Designation */}
            <SelectField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              options={designations}
            />

            {/* Total Experience */}
            <InputField
              label="Total Experience"
              name="total_experience"
              value={formData.total_experience}
              onChange={handleChange}
              placeholder="e.g. 3 years"
            />

            {/* Source of Hiring */}
            <InputField
              label="Source of Hiring"
              name="source_of_hiring"
              value={formData.source_of_hiring}
              onChange={handleChange}
              placeholder="e.g. LinkedIn"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={goPrevStep}
          type="button"
          className="border border-gray-300 text-gray-700 text-sm px-5 py-2 rounded-lg hover:bg-gray-100"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          type="button"
          className="bg-gray-900 hover:bg-black text-white text-sm px-5 py-2 rounded-lg shadow disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save & Complete"}
        </button>
      </div>
    </div>
  );
};

/** 🔹 Input Component */
const InputField = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:ring-2 focus:ring-gray-900 focus:outline-none"
    />
  </div>
);

/** 🔹 Select Component */
const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 focus:ring-2 focus:ring-gray-900 focus:outline-none"
    >
      <option value="">Select {label}</option>
      {options?.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

export default WorkInformation;
