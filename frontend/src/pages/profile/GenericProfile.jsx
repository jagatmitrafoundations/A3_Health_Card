import React from "react";
import {
  User,
  Hospital,
  Building,
  Shield,
  Crown,
  Scale,
  Droplets,
} from "lucide-react";

// Helper to get an icon based on user type
const getIcon = (userType, size = 40) => {
  const type = userType?.toLowerCase();
  switch (type) {
    case "hospital":
      return <Hospital size={size} />;
    case "mnc":
      return <Building size={size} />;
    case "pharmacy":
      return <Droplets size={size} />;
    case "insurance":
      return <Shield size={size} />;
    case "admin":
      return <ShieldCheck size={size} />;
    case "superadmin":
      return <Crown size={size} />;
    case "healthauthority":
      return <Scale size={size} />;
    default:
      return <User size={size} />;
  }
};

// Helper to format keys into readable labels
const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

// Item component for displaying a single piece of data
const DetailItem = ({ label, value }) => {
  if (value === null || value === undefined || value === "") return null;

  let displayValue = String(value);
  if (typeof value === "boolean") {
    displayValue = value ? "Yes" : "No";
  } else if (
    label.toLowerCase().includes("date") ||
    label.toLowerCase().includes("at")
  ) {
    const date = new Date(value);
    if (!isNaN(date)) {
      displayValue = date.toLocaleString();
    }
  }

  return (
    <div className="py-2 border-b border-gray-100 last:border-b-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {formatKey(label)}
      </p>
      <p className="text-md text-gray-800">{displayValue}</p>
    </div>
  );
};

// Card component for rendering objects
const DataCard = ({ title, data, level = 0 }) => {
  // Filter out sensitive keys and internal props
  const sensitiveKeys = [
    "password",
    "masterkey",
    "_id",
    "__v",
    "uniquecode",
    "userType",
  ];
  const filteredKeys = Object.keys(data).filter(
    (key) => !sensitiveKeys.includes(key.toLowerCase())
  );

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
        level > 0 ? "ml-4 mt-4" : ""
      }`}
    >
      <h3 className="font-bold text-lg text-gray-800 px-6 py-4 bg-gray-50/80 border-b flex items-center">
        {formatKey(title)}
      </h3>
      <div className="p-6 space-y-2">
        {filteredKeys.map((key) => {
          const value = data[key];
          if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            // Recursively render nested objects
            return (
              <DataCard key={key} title={key} data={value} level={level + 1} />
            );
          } else if (key.toLowerCase().includes("data")) {
            // Skip rendering binary data buffers
            return null;
          }
          return <DetailItem key={key} label={key} value={value} />;
        })}
      </div>
    </div>
  );
};

const GenericProfile = ({ profileData }) => {
  const { userType } = profileData;
  const profileName =
    profileData?.name ||
    profileData?.hospitalInfo?.hospitalName ||
    profileData?.companyInfo?.companyName ||
    profileData?.pharmacyInfo?.pharmacyName ||
    profileData?.authorityInfo?.authorityName ||
    "Profile";

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-red-600 text-white p-8">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-red-600 p-3 rounded-full">
            {getIcon(userType)}
          </div>
          <div>
            <h2 className="text-4xl font-bold">{profileName}</h2>
            <p className="text-red-100 text-lg capitalize">
              {formatKey(userType)} Profile
            </p>
          </div>
        </div>
      </div>

      {/* Profile Body */}
      <div className="p-8 bg-gray-50">
        <DataCard title={`${formatKey(userType)} Details`} data={profileData} />
      </div>
    </div>
  );
};

export default GenericProfile;
