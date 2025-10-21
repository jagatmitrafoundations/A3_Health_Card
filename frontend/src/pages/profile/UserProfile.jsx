import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Users,
  Calendar,
  Home,
  Building,
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

const UserProfile = ({ profileData }) => {
  const {
    name,
    email,
    mobile,
    presentAddress,
    permanentAddress,
    dob,
    sex,
    maritalStatus,
    emergencyContacts,
  } = profileData;

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-red-600 text-white p-8">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-red-600 p-3 rounded-full">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-bold">{name}</h2>
            <p className="text-red-100 text-lg capitalize">
              {profileData.userType} Profile
            </p>
          </div>
        </div>
      </div>

      {/* Profile Body */}
      <div className="p-8 bg-gray-50 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <InfoCard
            title="Personal Details"
            icon={<User size={20} className="text-red-600" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem
                icon={<Calendar size={16} />}
                label="Date of Birth"
                value={new Date(dob).toLocaleDateString()}
              />
              <DetailItem icon={<Users size={16} />} label="Sex" value={sex} />
              <DetailItem
                icon={<Heart size={16} />}
                label="Marital Status"
                value={maritalStatus}
              />
            </div>
          </InfoCard>

          <InfoCard
            title="Address Information"
            icon={<MapPin size={20} className="text-red-600" />}
          >
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <Home size={16} className="mr-2 text-gray-500" />
                Present Address
              </h4>
              <p className="text-gray-600 text-sm pl-8">{`${
                presentAddress?.houseNo
              }, ${presentAddress?.block || ""}, ${presentAddress?.district}, ${
                presentAddress?.state
              } - ${presentAddress?.pincode}`}</p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <Building size={16} className="mr-2 text-gray-500" />
                Permanent Address
              </h4>
              <p className="text-gray-600 text-sm pl-8">{`${
                permanentAddress?.houseNo
              }, ${permanentAddress?.block || ""}, ${
                permanentAddress?.district
              }, ${permanentAddress?.state} - ${permanentAddress?.pincode}`}</p>
            </div>
          </InfoCard>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <InfoCard
            title="Contact Information"
            icon={<Phone size={20} className="text-red-600" />}
          >
            <DetailItem icon={<Mail size={16} />} label="Email" value={email} />
            <DetailItem
              icon={<Phone size={16} />}
              label="Mobile"
              value={mobile}
            />
          </InfoCard>

          <InfoCard
            title="Emergency Contacts"
            icon={<Users size={20} className="text-red-600" />}
          >
            {emergencyContacts?.map((contact, index) => (
              <div
                key={index}
                className="pt-4 first:pt-0 border-t border-gray-100 first:border-0"
              >
                <p className="font-semibold text-gray-800">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.relation}</p>
                <p className="text-sm text-gray-600 font-medium">
                  {contact.contactNumber}
                </p>
              </div>
            ))}
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
