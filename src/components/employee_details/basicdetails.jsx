import React, { useState, useMemo } from "react";
import {
  FaUserEdit,
  FaEdit,
  FaRegUser,
  FaEnvelope,
  FaPhoneAlt,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { FiSettings, FiBell } from "react-icons/fi";
import avatarPlaceholder from "../../assets/img/Picture1.png"

// ----------------------
// Helper: sample data (fallback)
// ----------------------
const sampleEmployee = {
  id: 1001,
  first_name: "Riyas",
  last_name: "Muhammad",
  email: "riyas@gmail.com",
  ph_no: "+91 920 720 8965",
  basic_salary: "2,50,000",
  uuid: "1000443",
  is_active: true,
  image: null,
  work_info: {
    employee_ref: "Not specified",
    branch: "Head Office",
    department: "Design",
    location: "Not specified",
    role: "CEO & Founder",
    employment_type: "Full Time",
    date_of_joining: "May 10, 2025",
    total_experience: "1 year",
  },
  bank_info: {
    account_holder: "Riyas Muhammad",
    ifsc: "KKB4564",
    branch: "Panampilly Nagar",
    account_number: "2926 7264568",
    bank: "Kotak Mahindra",
  },
  personal: {
    dob: "22 December 1995",
    age: 28,
    gender: "Male",
    marital_status: "Not specified",
  },
  contact: {
    work_phone: "+91 93848 48484",
    emergency_phone: "+91 98765 43210",
  },
};

// ----------------------
// Small UI components
// ----------------------
const IconCircle = ({ children }) => (
  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
    {children}
  </div>
);

const EditButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="ml-2 text-gray-500 hover:text-gray-800 p-1 rounded"
    aria-label="edit"
  >
    <FaEdit />
  </button>
);

const InfoRow = ({ label, value, isEditing, onChange, type = "text" }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-right w-2/3">
      {isEditing ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm font-medium text-right border border-gray-200 rounded px-2 py-1"
        />
      ) : (
        <div className="text-sm font-medium text-gray-800">{value || "—"}</div>
      )}
    </div>
  </div>
);

// Card with header and content
const Card = ({ title, children, onEdit, showEdit }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <div className="flex items-center">
        {showEdit && <EditButton onClick={onEdit} />}
      </div>
    </div>
    <div>{children}</div>
  </div>
);

// ----------------------
// Main Page
// ----------------------
export default function EmployeeProfileFull({ employee: incomingEmployee }) {
  const employee = useMemo(
    () => (incomingEmployee && { ...sampleEmployee, ...incomingEmployee }) || sampleEmployee,
    [incomingEmployee]
  );

  // editable state per section
  const [editing, setEditing] = useState({
    basic: false,
    work: false,
    bank: false,
    contact: false,
    personal: false,
  });

  // local editable values
  const [local, setLocal] = useState({
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    ph_no: employee.ph_no,
    basic_salary: employee.basic_salary,
    employeeId: employee.uuid,
    work_info: { ...employee.work_info },
    bank_info: { ...employee.bank_info },
    contact: { ...employee.contact },
    personal: { ...employee.personal },
  });

  // toggle
  const toggleEdit = (key) => {
    setEditing((s) => ({ ...s, [key]: !s[key] }));
  };

  // local change
  const changeLocal = (path, value) => {
    // path like "basic.first_name" or "work_info.branch"
    if (!path.includes(".")) {
      setLocal((s) => ({ ...s, [path]: value }));
      return;
    }
    const [root, child] = path.split(".");
    setLocal((s) => ({ ...s, [root]: { ...s[root], [child]: value } }));
  };

  // Save handler (currently local only)
  const handleSave = (sectionKey) => {
    // TODO: Hook this to API / Zustand update
    // console.log("Save section", sectionKey, local);
    toggleEdit(sectionKey);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-72">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={employee.image || avatarPlaceholder}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                  />
                  <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full text-white">
                    <FaUserEdit className="w-3 h-3" />
                  </div>
                </div>
                <h2 className="mt-3 font-semibold text-sm text-gray-900">
                  {local.first_name} {local.last_name}
                </h2>
                <p className="text-xs text-gray-500">{local.email}</p>

                <div className="mt-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      employee.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    ● {employee.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-5 w-full">
                  <button className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-3 text-sm font-medium">
                    <IconCircle>
                      <FaRegUser />
                    </IconCircle>
                    Personal Info
                  </button>

                  <button className="w-full text-left mt-2 bg-transparent rounded px-3 py-2 flex items-center gap-3 text-sm font-medium hover:bg-gray-50">
                    <IconCircle>
                      <FaEnvelope />
                    </IconCircle>
                    Activities
                  </button>

                  <button className="w-full text-left mt-2 bg-transparent rounded px-3 py-2 flex items-center gap-3 text-sm font-medium hover:bg-gray-50">
                    <IconCircle>
                      <FaPhoneAlt />
                    </IconCircle>
                    Attachments
                  </button>

                  <button className="w-full text-left mt-2 bg-transparent rounded px-3 py-2 flex items-center gap-3 text-sm font-medium hover:bg-gray-50">
                    <IconCircle>
                      <FiSettings />
                    </IconCircle>
                    Manage Shift
                  </button>

                  <button className="w-full text-left mt-2 text-red-600 bg-transparent rounded px-3 py-2 flex items-center gap-3 text-sm font-medium hover:bg-red-50">
                    <IconCircle>
                      <FaRegCalendarAlt />
                    </IconCircle>
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right content */}
          <main className="flex-1">
           

            {/* Cards grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left column - Basic Information (spans 2 rows visually) */}
              <div className="lg:col-span-2 space-y-4">
                <Card
                  title="Basic Information"
                  onEdit={() => toggleEdit("basic")}
                  showEdit={true}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow
                      label="First Name"
                      value={local.first_name}
                      isEditing={editing.basic}
                      onChange={(v) => changeLocal("first_name", v)}
                    />
                    <InfoRow
                      label="Last Name"
                      value={local.last_name}
                      isEditing={editing.basic}
                      onChange={(v) => changeLocal("last_name", v)}
                    />
                    <InfoRow
                      label="Email Address"
                      value={local.email}
                      isEditing={editing.basic}
                      onChange={(v) => changeLocal("email", v)}
                      type="email"
                    />
                    <InfoRow
                      label="Contact Number"
                      value={local.ph_no}
                      isEditing={editing.basic}
                      onChange={(v) => changeLocal("ph_no", v)}
                    />
                    <InfoRow
                      label="Salary"
                      value={local.basic_salary}
                      isEditing={editing.basic}
                      onChange={(v) => changeLocal("basic_salary", v)}
                    />
                    <InfoRow
                      label="Employee ID"
                      value={local.employeeId}
                      isEditing={false}
                      onChange={() => {}}
                    />
                  </div>

                  {editing.basic && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleSave("basic")}
                        className="bg-black text-white px-4 py-2 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEdit("basic")}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Card>

                <Card
                  title="Bank Information"
                  onEdit={() => toggleEdit("bank")}
                  showEdit={true}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow
                      label="Account Holder Name"
                      value={local.bank_info.account_holder}
                      isEditing={editing.bank}
                      onChange={(v) => changeLocal("bank_info.account_holder", v)}
                    />
                    <InfoRow
                      label="IFSC Code"
                      value={local.bank_info.ifsc}
                      isEditing={editing.bank}
                      onChange={(v) => changeLocal("bank_info.ifsc", v)}
                    />
                    <InfoRow
                      label="Branch"
                      value={local.bank_info.branch}
                      isEditing={editing.bank}
                      onChange={(v) => changeLocal("bank_info.branch", v)}
                    />
                    <InfoRow
                      label="Account Number"
                      value={local.bank_info.account_number}
                      isEditing={editing.bank}
                      onChange={(v) => changeLocal("bank_info.account_number", v)}
                    />
                    <InfoRow
                      label="Bank"
                      value={local.bank_info.bank}
                      isEditing={editing.bank}
                      onChange={(v) => changeLocal("bank_info.bank", v)}
                    />
                  </div>

                  {editing.bank && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleSave("bank")}
                        className="bg-black text-white px-4 py-2 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEdit("bank")}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Card>

                <Card
                  title="Contact Details"
                  onEdit={() => toggleEdit("contact")}
                  showEdit={true}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoRow
                      label="Work Phone"
                      value={local.contact.work_phone}
                      isEditing={editing.contact}
                      onChange={(v) => changeLocal("contact.work_phone", v)}
                    />
                    <InfoRow
                      label="Emergency Contact"
                      value={local.contact.emergency_phone}
                      isEditing={editing.contact}
                      onChange={(v) => changeLocal("contact.emergency_phone", v)}
                    />
                  </div>

                  {editing.contact && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleSave("contact")}
                        className="bg-black text-white px-4 py-2 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEdit("contact")}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <Card
                  title="Work Information"
                  onEdit={() => toggleEdit("work")}
                  showEdit={true}
                >
                  <div className="space-y-2">
                    <InfoRow
                      label="Employee Reference Number"
                      value={local.work_info.employee_ref}
                      isEditing={editing.work}
                      onChange={(v) => changeLocal("work_info.employee_ref", v)}
                    />
                    <InfoRow
                      label="Branch"
                      value={local.work_info.branch}
                      isEditing={editing.work}
                      onChange={(v) => changeLocal("work_info.branch", v)}
                    />
                    <InfoRow
                      label="Department"
                      value={local.work_info.department}
                      isEditing={editing.work}
                      onChange={(v) => changeLocal("work_info.department", v)}
                    />
                    <InfoRow
                      label="Role"
                      value={local.work_info.role}
                      isEditing={editing.work}
                      onChange={(v) => changeLocal("work_info.role", v)}
                    />
                    <InfoRow
                      label="Employment Type"
                      value={local.work_info.employment_type}
                      isEditing={editing.work}
                      onChange={(v) => changeLocal("work_info.employment_type", v)}
                    />
                    <InfoRow
                      label="Date of Joining"
                      value={local.work_info.date_of_joining}
                      isEditing={editing.work}
                      onChange={(v) => changeLocal("work_info.date_of_joining", v)}
                    />
                  </div>

                  {editing.work && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleSave("work")}
                        className="bg-black text-white px-4 py-2 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEdit("work")}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Card>

                <Card
                  title="Personal Details"
                  onEdit={() => toggleEdit("personal")}
                  showEdit={true}
                >
                  <div className="space-y-2">
                    <InfoRow
                      label="Date of Birth"
                      value={local.personal.dob}
                      isEditing={editing.personal}
                      onChange={(v) => changeLocal("personal.dob", v)}
                    />
                    <InfoRow
                      label="Age"
                      value={local.personal.age}
                      isEditing={editing.personal}
                      onChange={(v) => changeLocal("personal.age", v)}
                      type="number"
                    />
                    <InfoRow
                      label="Gender"
                      value={local.personal.gender}
                      isEditing={editing.personal}
                      onChange={(v) => changeLocal("personal.gender", v)}
                    />
                    <InfoRow
                      label="Marital Status"
                      value={local.personal.marital_status}
                      isEditing={editing.personal}
                      onChange={(v) => changeLocal("personal.marital_status", v)}
                    />
                  </div>

                  {editing.personal && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleSave("personal")}
                        className="bg-black text-white px-4 py-2 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEdit("personal")}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
