import React from "react";

const EducationalDetailsSection = ({ employee, SectionHeader, EditableInput }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <SectionHeader title="Educational Details" sectionKey="educationalDetails" />
      {(employee?.education_details || []).map((edu, index) => (
        <div key={index} className="mt-2 grid grid-cols-2 gap-4 bg-gray-50 p-2 rounded">
          <EditableInput label="Institution" value={edu.institution_name || ""} isEditable />
          <EditableInput label="Degree" value={edu.degree || ""} isEditable />
          <EditableInput label="Specialization" value={edu.specialisation || ""} isEditable />
          <EditableInput label="Completion Date" value={edu.date_of_completion || ""} isEditable type="date" />
        </div>
      ))}
    </div>
  );
};

export default EducationalDetailsSection;
