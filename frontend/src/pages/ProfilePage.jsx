import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AlertTriangle, Loader2 } from "lucide-react";

import UserProfile from "./profile/UserProfile";
import DoctorProfile from "./profile/DoctorProfile";
import GenericProfile from "./profile/GenericProfile";

const ProfilePage = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userType: urlUserType } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      const loggedInUser = user || JSON.parse(localStorage.getItem("user"));

      if (!loggedInUser) {
        navigate("/login");
        return;
      }

      const currentUserType = loggedInUser.userType.toLowerCase();
      const uniqueCode = loggedInUser.uniqueCode || loggedInUser.uniquecode;

      if (!uniqueCode) {
        setError("Unique code is missing. Please log in again.");
        setLoading(false);
        return;
      }

      if (urlUserType && currentUserType !== urlUserType.toLowerCase()) {
        navigate(`/profile/${currentUserType}`, { replace: true });
        return;
      }

      try {
        const response = await axios.get(
          `/api/profile?uniqueCode=${uniqueCode}&userType=${currentUserType}`
        );
        if (response.data.success) {
          setProfileData({ ...response.data.user, userType: currentUserType });
        } else {
          setError("Failed to fetch profile data.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, urlUserType]);

  const renderProfileComponent = () => {
    if (!profileData) return null;

    const type = profileData.userType.toLowerCase();

    switch (type) {
      case "user":
        return <UserProfile profileData={profileData} />;
      case "doctor":
        return <DoctorProfile profileData={profileData} />;
      default:
        return <GenericProfile profileData={profileData} />;
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center">
          <Loader2 className="animate-spin h-12 w-12 text-red-600" />
          <span className="ml-4 text-xl text-gray-700 font-semibold">
            Loading Profile...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center text-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Failed to Load Profile
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gradient-to-br from-red-50 via-gray-50 to-white min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100">
          {renderProfileComponent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
