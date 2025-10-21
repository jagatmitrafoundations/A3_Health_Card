import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // MODIFIED: Imported useNavigate
import {
  ShieldAlert,
  Mail,
  Crown,
  User,
  Phone,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

const SuperAdminRegistrationPage = () => {
  const navigate = useNavigate(); // MODIFIED: Initialized useNavigate
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    officialTitle: "",
    workLocation: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    masterKey: "",
    fiduciaryAcknowledgment: false,
    enable2FA: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [otpState, setOtpState] = useState({
    emailOtp: "",
    phoneOtp: "",
    isEmailOtpSent: false,
    isPhoneOtpSent: false,
    isEmailVerified: false,
    isPhoneVerified: false,
    sendingEmailOtp: false,
    sendingPhoneOtp: false,
    verifyingEmailOtp: false,
    verifyingPhoneOtp: false,
    otpMessage: "",
    otpError: "",
  });

  const isSubmitDisabled =
    isLoading || !otpState.isEmailVerified || !otpState.isPhoneVerified;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpState((prev) => ({ ...prev, [name]: value, otpError: "" }));
  };

  const handleSendOtp = async (type) => {
    setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

    if (type === "email") {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.adminEmail)
      ) {
        setErrors((prev) => ({
          ...prev,
          adminEmail: "Please enter a valid corporate email first.",
        }));
        return;
      }
      setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOtpState((prev) => ({
        ...prev,
        sendingEmailOtp: false,
        isEmailOtpSent: true,
        otpMessage: `An OTP has been sent to ${formData.adminEmail}.`,
      }));
    }

    if (type === "phone") {
      if (!/^\d{10,15}$/.test(formData.adminPhone)) {
        setErrors((prev) => ({
          ...prev,
          adminPhone: "Please enter a valid 10 to 15-digit phone number first.",
        }));
        return;
      }
      setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOtpState((prev) => ({
        ...prev,
        sendingPhoneOtp: false,
        isPhoneOtpSent: true,
        otpMessage: `An OTP has been sent to ${formData.adminPhone}.`,
      }));
    }
  };

  const handleVerifyOtp = async (type) => {
    setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

    if (type === "email") {
      if (!otpState.emailOtp) {
        setOtpState((prev) => ({
          ...prev,
          otpError: "Please enter the email OTP.",
        }));
        return;
      }
      setOtpState((prev) => ({ ...prev, verifyingEmailOtp: true }));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (otpState.emailOtp === "123456") {
        setOtpState((prev) => ({
          ...prev,
          verifyingEmailOtp: false,
          isEmailVerified: true,
          isEmailOtpSent: false,
          otpMessage: "Super Admin email verified successfully!",
          otpError: "",
        }));
      } else {
        setOtpState((prev) => ({
          ...prev,
          verifyingEmailOtp: false,
          otpError: "Invalid email OTP.",
        }));
      }
    }

    if (type === "phone") {
      if (!otpState.phoneOtp) {
        setOtpState((prev) => ({
          ...prev,
          otpError: "Please enter the phone OTP.",
        }));
        return;
      }
      setOtpState((prev) => ({ ...prev, verifyingPhoneOtp: true }));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (otpState.phoneOtp === "654321") {
        setOtpState((prev) => ({
          ...prev,
          verifyingPhoneOtp: false,
          isPhoneVerified: true,
          isPhoneOtpSent: false,
          otpMessage: "Super Admin phone verified successfully!",
          otpError: "",
        }));
      } else {
        setOtpState((prev) => ({
          ...prev,
          verifyingPhoneOtp: false,
          otpError: "Invalid phone OTP.",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required.";
    if (!formData.officialTitle)
      newErrors.officialTitle = "Official title/designation is required.";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.adminEmail))
      newErrors.adminEmail = "A valid, secure corporate email is required.";
    if (!formData.adminPhone)
      newErrors.adminPhone = "A secure contact number is required.";
    if (!formData.password || formData.password.length < 14)
      newErrors.password =
        "Password must be at least 14 characters for Super Admin accounts.";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{14,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character.";
    }
    if (!formData.masterKey) {
      newErrors.masterKey =
        "A Master Authorization Key is required to create a Super Admin account.";
    } else if (formData.masterKey.length < 16) {
      newErrors.masterKey = "Please enter a valid Master Authorization Key.";
    }
    if (!formData.fiduciaryAcknowledgment)
      newErrors.fiduciaryAcknowledgment =
        "You must acknowledge your fiduciary duty.";

    if (!otpState.isEmailVerified)
      newErrors.adminEmail = "Please verify the administrator's email address.";
    if (!otpState.isPhoneVerified)
      newErrors.adminPhone = "Please verify the administrator's phone number.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsLoading(true);
    console.log("Super Admin Registration Data:", formData);
    setTimeout(() => {
      setOtpState((prev) => ({
        ...prev,
        otpMessage:
          "Super Admin account request submitted for audit and verification.",
        otpError: "",
      }));
      setIsLoading(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-8 text-center">
            <Crown className="mx-auto h-12 w-12" />
            <h1 className="text-4xl font-bold mt-4">
              Super Admin Registration
            </h1>
            <p className="text-red-100 mt-2">
              Highest level of system access. For authorized personnel only.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="mr-3 text-red-600" /> Super Admin Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.employeeId ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.employeeId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.employeeId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Title / Designation *
                  </label>
                  <input
                    type="text"
                    name="officialTitle"
                    value={formData.officialTitle}
                    placeholder="e.g., Chief Technology Officer"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.officialTitle
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.officialTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.officialTitle}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Work Location / Branch
                  </label>
                  <input
                    type="text"
                    name="workLocation"
                    value={formData.workLocation}
                    placeholder="e.g., Head Office"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <ShieldAlert className="mr-3 text-red-600" /> System Access
                Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Corporate Email *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      readOnly={
                        otpState.isEmailVerified || otpState.isEmailOtpSent
                      }
                      className={`flex-grow px-4 py-3 rounded-lg border-2 ${
                        errors.adminEmail ? "border-red-500" : "border-gray-300"
                      } focus:border-red-500 focus:outline-none disabled:bg-gray-100`}
                      disabled={
                        otpState.isEmailVerified || otpState.isEmailOtpSent
                      }
                    />
                    {!otpState.isEmailVerified ? (
                      <button
                        type="button"
                        onClick={() => handleSendOtp("email")}
                        disabled={
                          otpState.sendingEmailOtp || otpState.isEmailOtpSent
                        }
                        className="px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center w-32"
                      >
                        {otpState.sendingEmailOtp ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center text-green-600 font-semibold">
                        <Check className="h-5 w-5 mr-1" /> Verified
                      </div>
                    )}
                  </div>
                  {errors.adminEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminEmail}
                    </p>
                  )}
                </div>

                {otpState.isEmailOtpSent && !otpState.isEmailVerified && (
                  <div className="md:col-span-2 bg-red-50 p-4 rounded-lg">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Enter Email OTP
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="emailOtp"
                        value={otpState.emailOtp}
                        onChange={handleOtpChange}
                        maxLength="6"
                        className="flex-grow px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleVerifyOtp("email")}
                        disabled={otpState.verifyingEmailOtp}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center w-32"
                      >
                        {otpState.verifyingEmailOtp ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Secure Contact Phone *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      readOnly={
                        otpState.isPhoneVerified || otpState.isPhoneOtpSent
                      }
                      className={`flex-grow px-4 py-3 rounded-lg border-2 ${
                        errors.adminPhone ? "border-red-500" : "border-gray-300"
                      } focus:border-red-500 focus:outline-none disabled:bg-gray-100`}
                      disabled={
                        otpState.isPhoneVerified || otpState.isPhoneOtpSent
                      }
                    />
                    {!otpState.isPhoneVerified ? (
                      <button
                        type="button"
                        onClick={() => handleSendOtp("phone")}
                        disabled={
                          otpState.sendingPhoneOtp || otpState.isPhoneOtpSent
                        }
                        className="px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center w-32"
                      >
                        {otpState.sendingPhoneOtp ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center text-green-600 font-semibold">
                        <Check className="h-5 w-5 mr-1" /> Verified
                      </div>
                    )}
                  </div>
                  {errors.adminPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminPhone}
                    </p>
                  )}
                </div>

                {otpState.isPhoneOtpSent && !otpState.isPhoneVerified && (
                  <div className="md:col-span-2 bg-red-50 p-4 rounded-lg">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Enter Phone OTP
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="phoneOtp"
                        value={otpState.phoneOtp}
                        onChange={handleOtpChange}
                        maxLength="6"
                        className="flex-grow px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleVerifyOtp("phone")}
                        disabled={otpState.verifyingPhoneOtp}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center w-32"
                      >
                        {otpState.verifyingPhoneOtp ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {otpState.otpMessage && (
                  <p className="md:col-span-2 text-center text-green-600 font-medium">
                    {otpState.otpMessage}
                  </p>
                )}
                {otpState.otpError && (
                  <p className="md:col-span-2 text-center text-red-600 font-medium flex items-center justify-center gap-2">
                    <AlertCircle size={18} /> {otpState.otpError}
                  </p>
                )}

                <div className="md:col-span-2 relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Create High-Security Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <KeyRound className="mr-3 text-red-600" /> Authorization &
                Fiduciary Agreement
              </h2>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Master Authorization Key *
                </label>
                <input
                  type="text"
                  name="masterKey"
                  value={formData.masterKey}
                  placeholder="Enter the single-use key from the C-suite"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.masterKey ? "border-red-500" : "border-gray-300"
                  } focus:border-red-500 focus:outline-none`}
                />
                {errors.masterKey && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.masterKey}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="enable2FA"
                      checked={formData.enable2FA}
                      readOnly
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-not-allowed"
                    />
                    <label className="ml-2 block text-sm text-gray-900 font-medium">
                      Multi-Factor Authentication is Mandatory & Enforced
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="fiduciaryAcknowledgment"
                    checked={formData.fiduciaryAcknowledgment}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span
                    className={`ml-3 text-gray-600 text-sm ${
                      errors.fiduciaryAcknowledgment ? "text-red-600" : ""
                    }`}
                  >
                    I hereby acknowledge my legal and ethical fiduciary duty to
                    protect all user data with the highest degree of care. I
                    agree to the{" "}
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 underline font-medium"
                    >
                      Data Governance Policy
                    </a>{" "}
                    and accept personal liability for any willful misuse of
                    data.
                  </span>
                </label>
                {errors.fiduciaryAcknowledgment && (
                  <p className="text-red-500 text-sm mt-1 ml-6">
                    {errors.fiduciaryAcknowledgment}
                  </p>
                )}
              </div>
            </section>

            <div className="flex flex-col items-center pt-4">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3" /> Submitting
                    for Final Audit...
                  </>
                ) : (
                  <>
                    Request Super Admin Access <ShieldCheck className="ml-2" />
                  </>
                )}
              </button>
              {!isLoading && isSubmitDisabled && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please verify your email and phone to submit this
                  high-privilege request.
                </p>
              )}
            </div>

            {/* MODIFIED: Added this new section for navigation */}
            <div className="bg-gray-50 px-8 py-4 text-center border-t -mx-8 -mb-8 mt-8">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-red-600 hover:text-red-700 font-medium underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegistrationPage;
