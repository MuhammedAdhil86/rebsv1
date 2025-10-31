import React from "react";
import { Icon } from "@iconify/react";

const EducationalDetailsSection = ({ employee }) => {
  const educationData = employee?.education_details || [];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Educational Details</h3>
        <Icon
          icon="basil:edit-outline"
          className="w-5 h-5 text-gray-400 cursor-pointer"
        />
      </div>

      <div className="space-y-6">
        {educationData.length === 0 ? (
          <div className="text-gray-500 text-sm">No educational details available</div>
        ) : (
          educationData.map((edu, index) => (
            <div key={index} className="bg-white rounded-lg">
              {educationData.length > 1 && (
                <div className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                  Education {index + 1}
                </div>
              )}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[13px] font-medium text-gray-700">Institution</span>
                <span className="text-[13px] text-gray-900 font-medium">{edu.institution_name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[13px] font-medium text-gray-700">Degree/Diploma</span>
                <span className="text-[13px] text-gray-900 font-medium">{edu.degree}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[13px] font-medium text-gray-700">Specialization</span>
                <span className="text-[13px] text-gray-900 font-medium">{edu.specialisation}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-[13px] font-medium text-gray-700">Date of Completion</span>
                <span className="text-[13px] text-gray-900 font-medium">{edu.date_of_completion}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EducationalDetailsSection;
