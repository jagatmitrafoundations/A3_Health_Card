import React, { useState, useEffect } from "react";
import axios from 'axios';

// import { useNavigate } from "react-router-dom"; // Removed to fix crash
import {
  Shield,
  Mail,
  UserCog,
  User,
  Phone,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  AlertCircle,
} from "lucide-react";

const AdminRegistrationPage = () => {
  // const navigate = useNavigate(); // Removed to fix crash
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    adminRole: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    authorizationCode: "",
    agreedToPolicy: false,
    enable2FA: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- OTP State Management ---
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
    otpMessage: "", // For general OTP-related messages
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

  // --- OTP Logic ---

  // Mock API call to send OTP
  // const handleSendOtp = async (type) => {
  //   setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  //   if (type === "email") {
  //     if (
  //       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.adminEmail)
  //     ) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         adminEmail: "Please enter a valid email first.",
  //       }));
  //       return;
  //     }
  //     setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
  //     console.log(`Sending OTP to email: ${formData.adminEmail}`);

  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     setOtpState((prev) => ({
  //       ...prev,
  //       sendingEmailOtp: false,
  //       isEmailOtpSent: true,
  //       otpMessage: `An OTP has been sent to ${formData.adminEmail}.`,
  //     }));
  //   }

  //   if (type === "phone") {
  //     if (!formData.adminPhone || formData.adminPhone.length < 10) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         adminPhone: "Please enter a valid phone number first.",
  //       }));
  //       return;
  //     }
  //     setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
  //     console.log(`Sending OTP to phone: ${formData.adminPhone}`);

  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     setOtpState((prev) => ({
  //       ...prev,
  //       sendingPhoneOtp: false,
  //       isPhoneOtpSent: true,
  //       otpMessage: `An OTP has been sent to ${formData.adminPhone}.`,
  //     }));
  //   }
  // };

  // // Mock API call to verify OTP
  // const handleVerifyOtp = async (type) => {
  //   setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  //   if (type === "email") {
  //     if (!otpState.emailOtp) {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         otpError: "Please enter the email OTP.",
  //       }));
  //       return;
  //     }
  //     setOtpState((prev) => ({ ...prev, verifyingEmailOtp: true }));
  //     console.log(`Verifying email OTP: ${otpState.emailOtp}`);

  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     // The backend should check if the OTP is correct for the given email.
  //     // For this demo, we'll assume '123456' is the correct OTP.
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     if (otpState.emailOtp === "123456") {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingEmailOtp: false,
  //         isEmailVerified: true,
  //         isEmailOtpSent: false, // Hide OTP input on success
  //         otpMessage: "Email verified successfully!",
  //         otpError: "",
  //       }));
  //     } else {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingEmailOtp: false,
  //         otpError: "Invalid email OTP. Please try again.",
  //       }));
  //     }
  //   }

  //   if (type === "phone") {
  //     if (!otpState.phoneOtp) {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         otpError: "Please enter the phone OTP.",
  //       }));
  //       return;
  //     }
  //     setOtpState((prev) => ({ ...prev, verifyingPhoneOtp: true }));
  //     console.log(`Verifying phone OTP: ${otpState.phoneOtp}`);

  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     // For this demo, we'll assume '654321' is the correct OTP.
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     if (otpState.phoneOtp === "654321") {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingPhoneOtp: false,
  //         isPhoneVerified: true,
  //         isPhoneOtpSent: false, // Hide OTP input on success
  //         otpMessage: "Phone number verified successfully!",
  //         otpError: "",
  //       }));
  //     } else {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingPhoneOtp: false,
  //         otpError: "Invalid phone OTP. Please try again.",
  //       }));
  //     }
  //   }
  // };
const handleSendOtp = async (type) => {
  setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  if (type === "email") {
    if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      setErrors((prev) => ({
        ...prev,
        adminEmail: "Please enter a valid email first.",
      }));
      return;
    }
    setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
    
    try {
      const response = await axios.post('/api/auth/send-otp', {
        email: formData.adminEmail,
        type: 'ADMIN_REGISTRATION'
      });
      
      setOtpState((prev) => ({
        ...prev,
        sendingEmailOtp: false,
        isEmailOtpSent: true,
        otpMessage: response.data.message || `An OTP has been sent to ${formData.email}.`
      }));
    } catch (error) {
      console.error('Email OTP error:', error);
      setOtpState((prev) => ({
        ...prev,
        sendingEmailOtp: false,
        otpError: error.response?.data?.message || 'Failed to send OTP to email'
      }));
    }
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
    
    try {
      const response = await axios.post('/api/auth/send-otp', {
        mobile: `+91${formData.adminPhone}`,
        type: 'ADMIN_REGISTRATION'
      });
      
      setOtpState((prev) => ({
        ...prev,
        sendingPhoneOtp: false,
        isPhoneOtpSent: true,
        otpMessage: response.data.message || `An OTP has been sent to ${formData.phoneNumber}.`
      }));
    } catch (error) {
      console.error('Phone OTP error:', error);
      setOtpState((prev) => ({
        ...prev,
        sendingPhoneOtp: false,
        otpError: error.response?.data?.message || 'Failed to send OTP to phone'
      }));
    }
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
    
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: formData.adminEmail,
        otp: otpState.emailOtp,
        type: 'ADMIN_REGISTRATION'
      });
      
      setOtpState((prev) => ({
        ...prev,
        verifyingEmailOtp: false,
        isEmailVerified: true,
        isEmailOtpSent: false,
        otpMessage: response.data.message || "Hospital email verified successfully!",
        otpError: "",
      }));
    } catch (error) {
      console.error('Email OTP verification error:', error);
      setOtpState((prev) => ({
        ...prev,
        verifyingEmailOtp: false,
        otpError: error.response?.data?.message || "Invalid email OTP."
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
    
    try {
      const response = await axios.post('/api/auth/verify-otp', {
        mobile: `+91${formData.adminPhone}`,
        otp: otpState.phoneOtp,
        type: 'ADMIN_REGISTRATION'
      });
      
      setOtpState((prev) => ({
        ...prev,
        verifyingPhoneOtp: false,
        isPhoneVerified: true,
        isPhoneOtpSent: false,
        otpMessage: response.data.message || "Hospital phone number verified successfully!",
        otpError: "",
      }));
    } catch (error) {
      console.error('Phone OTP verification error:', error);
      setOtpState((prev) => ({
        ...prev,
        verifyingPhoneOtp: false,
        otpError: error.response?.data?.message || "Invalid phone OTP."
      }));
    }
  }
};
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required.";
    if (!formData.adminRole)
      newErrors.adminRole = "Admin role/designation is required.";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.adminEmail))
      newErrors.adminEmail = "A valid official email is required.";
    if (!formData.adminPhone)
      newErrors.adminPhone = "A contact phone number is required.";
    if (!formData.password || formData.password.length < 12)
      newErrors.password =
        "Password must be at least 12 characters long for security.";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character.";
    }
    if (!formData.authorizationCode) {
      newErrors.authorizationCode =
        "An authorization code is required to create an admin account.";
    } else if (formData.authorizationCode.length < 10) {
      newErrors.authorizationCode = "Please enter a valid authorization code.";
    }
    if (!formData.agreedToPolicy)
      newErrors.agreedToPolicy = "You must agree to the Data Handling Policy.";

    // Add validation for OTP verification
    if (!otpState.isEmailVerified)
      newErrors.adminEmail = "Please verify your email address.";
    if (!otpState.isPhoneVerified)
      newErrors.adminPhone = "Please verify your phone number.";

    return newErrors;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formErrors = validateForm();
  //   if (Object.keys(formErrors).length > 0) {
  //     setErrors(formErrors);
  //     return;
  //   }
  //   setIsLoading(true);
  //   console.log("Admin Registration Data:", { ...formData, ...otpState });
  //   setTimeout(() => {
  //     // Custom modal/toast is better than alert()
  //     setOtpState((prev) => ({
  //       ...prev,
  //       otpMessage:
  //         "Admin registration successful. Your account has been created.",
  //     }));
  //     setIsLoading(false);
  //     // navigate("/login/admin"); // Removed to fix crash. Add routing logic in the parent component.
  //     console.log("Would navigate to /login/admin");
  //   }, 2000);
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }
  
  setIsLoading(true);
  
  try {
    // Structure admin data
    const adminData = {
      identity: {
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        adminRole: formData.adminRole
      },
      credentials: {
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
        password: formData.password
      },
      authorization: {
        authorizationCode: formData.authorizationCode,
        agreedToPolicy: formData.agreedToPolicy,
        twoFactorEnabled: formData.enable2FA
      },
      verification: {
        isEmailVerified: otpState.isEmailVerified,
        isPhoneVerified: otpState.isPhoneVerified
      }
    };
    
    console.log("Submitting Admin Data...");
    
    const response = await axios.post('/api/auth/admin/register', adminData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Registration response:", response.data);
    
    // Extract admin unique code from response
    const uniqueCode = response.data.admin.uniqueCode;
    setGeneratedCode(uniqueCode);
    
    // Show success message
    alert(`🎉 Admin Registration Successful!\n\nYour unique admin ID is: ${uniqueCode}\nEmployee ID: ${response.data.admin.employeeId}\n\nThis code has been sent to your registered email address. Your account is pending approval.`);
    
    setOtpState((prev) => ({
      ...prev,
      otpMessage: `Admin account created! Your admin ID is: ${uniqueCode}. Awaiting approval.`,
      otpError: "",
    }));
    
  } catch (error) {
    console.error('Admin registration error:', error);
    
    if (error.response && error.response.data) {
      console.log('Error details:', error.response.data);
      setOtpState((prev) => ({
        ...prev,
        otpError: error.response.data.message || 'Registration failed. Please try again.'
      }));
    } else {
      setOtpState((prev) => ({
        ...prev,
        otpError: 'Registration failed. Please try again.'
      }));
    }
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-8 text-center">
            <UserCog className="mx-auto h-12 w-12" />
            <h1 className="text-4xl font-bold mt-4">
              Administrator Registration
            </h1>
            <p className="text-red-100 mt-2">
              Create a secure administrative account for system management.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section 1: Admin Identity & Role */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="mr-3 text-red-600" /> Identity & Role
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name, Employee ID, Role... (unchanged) */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
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
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    name="adminRole"
                    placeholder="e.g., System Administrator, Compliance Officer"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.adminRole ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.adminRole && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminRole}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Secure Credentials & Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <Shield className="mr-3 text-red-600" /> Secure Credentials &
                Contact Verification
              </h2>
              <div className="space-y-6">
                {/* Email Verification */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Email Address *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      name="adminEmail"
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
                        className="px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-32"
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
                  <div className="bg-red-50 p-4 rounded-lg">
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

                {/* Phone Verification */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Contact Phone Number *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      name="adminPhone"
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
                  <div className="bg-red-50 p-4 rounded-lg">
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

                {/* OTP Status Messages */}
                {otpState.otpMessage && (
                  <p className="text-center text-green-600 font-medium">
                    {otpState.otpMessage}
                  </p>
                )}
                {otpState.otpError && (
                  <p className="text-center text-red-600 font-medium flex items-center justify-center gap-2">
                    <AlertCircle size={18} /> {otpState.otpError}
                  </p>
                )}

                {/* Password Input (unchanged) */}
                <div className="md:col-span-2 relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Create Secure Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
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

            {/* Section 3: Authorization & Agreement (unchanged) */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <KeyRound className="mr-3 text-red-600" /> Authorization &
                Agreement
              </h2>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Authorization Code *
                </label>
                <input
                  type="text"
                  name="authorizationCode"
                  placeholder="Enter the code provided by your supervisor"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    errors.authorizationCode
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:border-red-500 focus:outline-none`}
                />
                {errors.authorizationCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.authorizationCode}
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
                      Two-Factor Authentication is Mandatory for Admin Accounts
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreedToPolicy"
                    checked={formData.agreedToPolicy}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span
                    className={`ml-3 text-gray-600 text-sm ${
                      errors.agreedToPolicy ? "text-red-600" : ""
                    }`}
                  >
                    I acknowledge my responsibility to protect user data and
                    agree to the{" "}
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 underline font-medium"
                    >
                      Internal Data Handling Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 underline font-medium"
                    >
                      Non-Disclosure Agreement
                    </a>
                    .
                  </span>
                </label>
                {errors.agreedToPolicy && (
                  <p className="text-red-500 text-sm mt-1 ml-6">
                    {errors.agreedToPolicy}
                  </p>
                )}
              </div>
            </section>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                    Creating Secure Account...
                  </>
                ) : (
                  <>
                    Create Admin Account <Check className="ml-2" />
                  </>
                )}
              </button>
            </div>
            {!isLoading && isSubmitDisabled && (
              <p className="text-center text-sm text-gray-500 -mt-4">
                Please verify your email and phone number to enable
                registration.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationPage;
