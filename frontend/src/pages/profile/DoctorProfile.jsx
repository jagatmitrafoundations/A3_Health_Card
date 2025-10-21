import React from "react";
import {
  Stethoscope,
  Mail,
  Phone,
  Building,
  Award,
  User,
  Clock,
} from "lucide-react";

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start text-sm">
    <div className="flex-shrink-0 w-5 h-5 text-gray-400">{icon}</div>
    <div className="ml-3">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <h3 className="font-bold text-lg text-gray-800 px-6 py-4 bg-gray-50 border-b flex items-center">
      {icon} <span className="ml-3">{title}</span>
    </h3>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const DoctorProfile = ({ profileData }) => {
  const { personalInfo, professionalInfo } = profileData;

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-red-600 text-white p-8">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-red-600 p-3 rounded-full">
            <Stethoscope size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-bold">{personalInfo?.fullName}</h2>
            <p className="text-red-100 text-lg">
              {professionalInfo?.specialization}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Body */}
      <div className="p-8 bg-gray-50 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InfoCard
          title="Professional Information"
          icon={<Award size={20} className="text-red-600" />}
        >
          <DetailItem
            icon={<Award size={16} />}
            label="License Number"
            value={professionalInfo?.licenseNumber}
          />
          <DetailItem
            icon={<Stethoscope size={16} />}
            label="Specialization"
            value={professionalInfo?.specialization}
          />
          <DetailItem
            icon={<Clock size={16} />}
            label="Years of Experience"
            value={`${professionalInfo?.experience} years`}
          />
          {professionalInfo?.currentAffiliation && (
            <DetailItem
              icon={<Building size={16} />}
              label="Current Affiliation"
              value={professionalInfo.currentAffiliation}
            />
          )}
        </InfoCard>

        <InfoCard
          title="Contact Information"
          icon={<User size={20} className="text-red-600" />}
        >
          <DetailItem
            icon={<Mail size={16} />}
            label="Email Address"
            value={personalInfo?.email}
          />
          <DetailItem
            icon={<Phone size={16} />}
            label="Phone Number"
            value={personalInfo?.phoneNumber}
          />
        </InfoCard>
      </div>
    </div>
  );
};

export default DoctorProfile;
