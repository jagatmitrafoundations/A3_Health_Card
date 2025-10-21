import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

const CommonVerificationPage = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userData } = location.state || {};

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (!userData) {
      console.log(
        "No user data found in location state, redirecting to login."
      );
      navigate("/login");
    } else {
      setInfoMessage("Verification codes sent to your email and phone.");
    }
  }, [userData, navigate]);

  const handleOtpChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setter(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !emailOtp ||
      emailOtp.length !== 6 ||
      !phoneOtp ||
      phoneOtp.length !== 6
    ) {
      setError("Please enter both 6-digit verification codes.");
      return;
    }

    setIsLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await axios.post("/api/auth/verify-login", {
        uniqueCode: userData.uniqueCode,
        userType: userData.userType,
        emailOtp,
        phoneOtp,
      });

      if (response.data.success) {
        const loggedInUser = response.data.user;
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));

        alert(
          `Welcome back, ${
            loggedInUser.name || loggedInUser?.personalInfo?.fullName || "User"
          }!`
        );

        // Navigate to a generic /profile URL, which will handle the specific user type
        navigate(`/profile`);
      }
    } catch (err) {
      console.error("OTP Verification failed:", err);
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    alert("To get new codes, please go back and sign in again.");
    navigate("/login");
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-8 text-center">
            <ShieldCheck className="mx-auto h-12 w-12" />
            <h1 className="text-4xl font-bold mt-4">Two-Step Verification</h1>
            <p className="text-red-100 mt-2">
              For your security, please enter the verification codes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {infoMessage && (
              <div className="text-center text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm">
                {infoMessage}
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Code sent to your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={emailOtp}
                  onChange={handleOtpChange(setEmailOtp)}
                  placeholder="______"
                  maxLength="6"
                  className={`w-full text-center tracking-[1em] font-bold text-2xl pl-12 pr-4 py-3 rounded-lg border-2 ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:border-red-500 focus:outline-none`}
                />
              </div>
              {userData.email && (
                <p className="text-xs text-gray-500 mt-1">
                  Sent to:{" "}
                  {userData.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Code sent to your Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={phoneOtp}
                  onChange={handleOtpChange(setPhoneOtp)}
                  placeholder="______"
                  maxLength="6"
                  className={`w-full text-center tracking-[1em] font-bold text-2xl pl-12 pr-4 py-3 rounded-lg border-2 ${
                    error ? "border-red-500" : "border-gray-300"
                  } focus:border-red-500 focus:outline-none`}
                />
              </div>
              {userData.phone && (
                <p className="text-xs text-gray-500 mt-1">
                  Sent to: ***{userData.phone.slice(-4)}
                </p>
              )}
            </div>

            {error && (
              <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    Completing Login...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2" size={22} />
                    Complete Login
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>
                Entered wrong credentials?
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-red-600 hover:text-red-700 hover:underline ml-1 font-medium"
                >
                  Go Back
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommonVerificationPage;
