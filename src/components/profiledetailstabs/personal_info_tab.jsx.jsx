import React from "react";
import BasicInfoSection from "../employee_details/basicdetails";
import BankInfoSection from "../employee_details/bankInfopage";
import PersonalInfoSection from "../employee_details/idInformationsection";
import ContactInfoSection from "../employee_details/Contactdetailssection";
import WorkInfoSection from "../employee_details/workInfosection";
import HierarchyInfoSection from "../employee_details/hierarchyInfosection";
import EducationalDetailsSection from "../employee_details/educationaldetailssection";
import DependantDetailsSection from "../employee_details/dependantdetailssection";
import IdInformationSection from "../employee_details/idInformationsection";

export default function PersonalInfoTab({ employee }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <BasicInfoSection employee={employee} />
      <WorkInfoSection employee={employee} />
      <BankInfoSection employee={employee} />
      <PersonalInfoSection employee={employee} />
      <ContactInfoSection employee={employee} />
      <HierarchyInfoSection employee={employee} />
      <IdInformationSection employee={employee} />
      <EducationalDetailsSection employee={employee} />
      <DependantDetailsSection employee={employee} />
    </div>
  );
}
