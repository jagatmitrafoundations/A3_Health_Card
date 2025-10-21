import React, { useState } from "react";
import axios from 'axios';
// Removed useNavigate as it can cause issues in some environments without a router context.
// import { useNavigate } from "react-router-dom";
import {
  Scale,
  Mail,
  ShieldCheck,
  User,
  Phone,
  Check,
  Eye,
  EyeOff,
  Upload,
  Globe,
  Loader2, // Added for loading spinners
  AlertCircle, // Added for error messages
} from "lucide-react";

const HealthAuthorityRegistrationPage = () => {
  // const navigate = useNavigate(); // Removed for compatibility
  const [formData, setFormData] = useState({
    authorityName: "",
    jurisdiction: "",
    authorityRegNumber: "",
    officialWebsite: "",
    repName: "",
    repTitle: "",
    repGovId: "",
    repEmail: "",
    repPhone: "", // Added representative's phone number
    password: "",
    authorizationLetter: null,
    dataUseAgreement: false,
    enable2FA: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, authorizationLetter: file }));
    if (errors.authorizationLetter) {
      setErrors((prev) => ({ ...prev, authorizationLetter: null }));
    }
  };

  // --- OTP Logic ---
  // const handleSendOtp = async (type) => {
  //   setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  //   if (type === "email") {
  //     if (!/\.gov(?:\.[a-z]{2})?$/.test(formData.repEmail)) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         repEmail: "Please enter a valid .gov email first.",
  //       }));
  //       return;
  //     }
  //     setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
  //     setOtpState((prev) => ({
  //       ...prev,
  //       sendingEmailOtp: false,
  //       isEmailOtpSent: true,
  //       otpMessage: `An OTP has been sent to ${formData.repEmail}.`,
  //     }));
  //   }

  //   if (type === "phone") {
  //     if (!/^\d{10,15}$/.test(formData.repPhone)) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         repPhone: "Please enter a valid 10 to 15-digit phone number first.",
  //       }));
  //       return;
  //     }
  //     setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
  //     setOtpState((prev) => ({
  //       ...prev,
  //       sendingPhoneOtp: false,
  //       isPhoneOtpSent: true,
  //       otpMessage: `An OTP has been sent to ${formData.repPhone}.`,
  //     }));
  //   }
  // };

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
  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     // Demo OTP: '123456'
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
  //     if (otpState.emailOtp === "123456") {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingEmailOtp: false,
  //         isEmailVerified: true,
  //         isEmailOtpSent: false,
  //         otpMessage: "Official email verified successfully!",
  //         otpError: "",
  //       }));
  //     } else {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingEmailOtp: false,
  //         otpError: "Invalid email OTP.",
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
  //     // **REPLACE WITH YOUR BACKEND API CALL**
  //     // Demo OTP: '654321'
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
  //     if (otpState.phoneOtp === "654321") {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingPhoneOtp: false,
  //         isPhoneVerified: true,
  //         isPhoneOtpSent: false,
  //         otpMessage: "Phone number verified successfully!",
  //         otpError: "",
  //       }));
  //     } else {
  //       setOtpState((prev) => ({
  //         ...prev,
  //         verifyingPhoneOtp: false,
  //         otpError: "Invalid phone OTP.",
  //       }));
  //     }
  //   }
  // };
const handleSendOtp = async (type) => {
  setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  if (type === "email") {
    if (!/\S+@\S+\.\S+/.test(formData.repEmail)) {
      setErrors((prev) => ({
        ...prev,
        repEmail: "Please enter a valid email first.",
      }));
      return;
    }
    setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
    
    try {
      const response = await axios.post('/api/auth/send-otp', {
        email: formData.repEmail,
        type: 'HEALTH_AUTHORITY_REGISTRATION'
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
    if (!/^\d{10,15}$/.test(formData.repPhone)) {
      setErrors((prev) => ({
        ...prev,
        repPhone: "Please enter a valid 10 to 15-digit phone number first.",
      }));
      return;
    }
    setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
    
    try {
      const response = await axios.post('/api/auth/send-otp', {
        mobile: `+91${formData.repPhone}`,
        type: 'HEALTH_AUTHORITY_REGISTRATION'
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
        email: formData.repEmail,
        otp: otpState.emailOtp,
        type: 'HEALTH_AUTHORITY_REGISTRATION'
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
        mobile: `+91${formData.repPhone}`,
        otp: otpState.phoneOtp,
        type: 'HEALTH_AUTHORITY_REGISTRATION'
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
    if (!formData.authorityName)
      newErrors.authorityName = "Authority name is required.";
    if (!formData.jurisdiction)
      newErrors.jurisdiction = "Jurisdiction is required.";
    if (!formData.authorityRegNumber)
      newErrors.authorityRegNumber =
        "Official registration number is required.";
    if (!formData.repName)
      newErrors.repName = "Representative's name is required.";
    if (!formData.repTitle)
      newErrors.repTitle = "Representative's title is required.";
    if (!formData.repGovId)
      newErrors.repGovId = "Government Employee ID is required.";
    if (!/\.gov(?:\.[a-z]{2})?$/.test(formData.repEmail))
      newErrors.repEmail = "A valid .gov email address is required.";
    if (!formData.repPhone)
      newErrors.repPhone = "Representative's phone is required.";
    if (!formData.password || formData.password.length < 12)
      newErrors.password = "Password must be at least 12 characters.";
    if (!formData.authorizationLetter)
      newErrors.authorizationLetter =
        "An official authorization letter is mandatory.";
    if (!formData.dataUseAgreement)
      newErrors.dataUseAgreement = "You must agree to the data use policy.";

    // OTP validation
    if (!otpState.isEmailVerified)
      newErrors.repEmail = "Please verify your official email address.";
    if (!otpState.isPhoneVerified)
      newErrors.repPhone = "Please verify your phone number.";

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
  //   console.log("Health Authority Registration Data:", {
  //     ...formData,
  //     authorizationLetterName: formData.authorizationLetter?.name,
  //   });
  //   setTimeout(() => {
  //     setOtpState((prev) => ({
  //       ...prev,
  //       otpMessage:
  //         "Registration submitted! Your account will be activated upon successful verification.",
  //       otpError: "",
  //     }));
  //     setIsLoading(false);
  //     //   navigate("/login/healthauthority"); // Removed for compatibility
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
    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    // Structure health authority data
    const authorityData = {
      authorityInfo: {
        authorityName: formData.authorityName,
        jurisdiction: formData.jurisdiction,
        authorityRegNumber: formData.authorityRegNumber,
        officialWebsite: formData.officialWebsite
      },
      representative: {
        fullName: formData.repName,
        title: formData.repTitle,
        govEmployeeId: formData.repGovId,
        email: formData.repEmail,
        phone: formData.repPhone,
        password: formData.password
      },
      compliance: {
        dataUseAgreementAccepted: formData.dataUseAgreement,
        twoFactorEnabled: formData.enable2FA
      },
      verification: {
        isEmailVerified: otpState.isEmailVerified,
        isPhoneVerified: otpState.isPhoneVerified
      }
    };
    
    // Append the structured data as JSON
    formDataToSend.append('authorityData', JSON.stringify(authorityData));
    
    // Append the authorization letter file
    if (formData.authorizationLetter) {
      formDataToSend.append('authorizationLetter', formData.authorizationLetter);
    }
    
    console.log("Submitting Health Authority Data...");
    
    const response = await axios.post('/api/auth/healthauthority/register', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("Registration response:", response.data);
    
    // Extract authority unique code from response
    const uniqueCode = response.data.authority.uniqueCode;
    setGeneratedCode(uniqueCode);
    
    // Show success message
    alert(`🎉 Health Authority Registration Successful!\n\nYour unique authority ID is: ${uniqueCode}\n\nThis code has been sent to your registered email address. Your application is under compliance review and will be activated upon successful verification.`);
    
    setOtpState((prev) => ({
      ...prev,
      otpMessage: `Application submitted! Your account will be activated after compliance review. Your authority ID is: ${uniqueCode}`,
      otpError: "",
    }));
    
  } catch (error) {
    console.error('Health Authority registration error:', error);
    
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-8 text-center">
            <Scale className="mx-auto h-12 w-12" />
            <h1 className="text-4xl font-bold mt-4">
              Health Authority Onboarding
            </h1>
            <p className="text-red-100 mt-2">
              Secure portal for government health and regulatory bodies.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section 1: Authority Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <Scale className="mr-3 text-red-600" /> Authority Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs for authority name, jurisdiction, etc. */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name of Authority *
                  </label>
                  <input
                    type="text"
                    name="authorityName"
                    placeholder="e.g., Ministry of Health"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.authorityName
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.authorityName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.authorityName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Jurisdiction (National/State/Local) *
                  </label>
                  <input
                    type="text"
                    name="jurisdiction"
                    placeholder="e.g., National"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.jurisdiction ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.jurisdiction && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jurisdiction}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Registration Number *
                  </label>
                  <input
                    type="text"
                    name="authorityRegNumber"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.authorityRegNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.authorityRegNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.authorityRegNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Website
                  </label>
                  <input
                    type="text"
                    name="officialWebsite"
                    placeholder="e.g., https://health.gov"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Authorized Representative Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="mr-3 text-red-600" /> Authorized Representative
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... rep name, title, id ... */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="repName"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.repName ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.repName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Title *
                  </label>
                  <input
                    type="text"
                    name="repTitle"
                    placeholder="e.g., Public Health Director"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.repTitle ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.repTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repTitle}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Government Employee ID *
                  </label>
                  <input
                    type="text"
                    name="repGovId"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.repGovId ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.repGovId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repGovId}
                    </p>
                  )}
                </div>

                {/* Email Verification */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Email Address (.gov) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      name="repEmail"
                      placeholder="name@domain.gov"
                      onChange={handleChange}
                      readOnly={
                        otpState.isEmailVerified || otpState.isEmailOtpSent
                      }
                      className={`flex-grow px-4 py-3 rounded-lg border-2 ${
                        errors.repEmail ? "border-red-500" : "border-gray-300"
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
                  {errors.repEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repEmail}
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

                {/* Phone Verification */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Phone Number *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      name="repPhone"
                      onChange={handleChange}
                      readOnly={
                        otpState.isPhoneVerified || otpState.isPhoneOtpSent
                      }
                      className={`flex-grow px-4 py-3 rounded-lg border-2 ${
                        errors.repPhone ? "border-red-500" : "border-gray-300"
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
                  {errors.repPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repPhone}
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

                {/* OTP Status Messages */}
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

                {/* Password */}
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

            {/* Section 3: Verification & Agreement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <ShieldCheck className="mr-3 text-red-600" /> Verification &
                Agreement
              </h2>
              {/* ... file upload and agreements ... */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Upload Official Authorization Letter *
                </label>
                <div
                  className={`border-2 border-dashed ${
                    errors.authorizationLetter
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg p-6 text-center hover:border-red-400`}
                >
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <input
                    type="file"
                    accept=".pdf,.jpeg,.jpg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="authorizationLetter"
                  />
                  <label
                    htmlFor="authorizationLetter"
                    className="cursor-pointer text-sm"
                  >
                    <span className="text-red-600 hover:text-red-700 font-medium">
                      Choose file
                    </span>
                    <span className="text-gray-500"> or drag & drop</span>
                  </label>
                  {formData.authorizationLetter && (
                    <p className="text-green-600 text-sm mt-2">
                      {formData.authorizationLetter.name}
                    </p>
                  )}
                  {errors.authorizationLetter && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.authorizationLetter}
                    </p>
                  )}
                </div>
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
                      Multi-Factor Authentication is Mandatory for Government
                      Accounts
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="dataUseAgreement"
                    checked={formData.dataUseAgreement}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span
                    className={`ml-3 text-gray-600 text-sm ${
                      errors.dataUseAgreement ? "text-red-600" : ""
                    }`}
                  >
                    I confirm that I am an authorized representative of the
                    specified government body and agree to the{" "}
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 underline font-medium"
                    >
                      Public Sector Data Use Policy
                    </a>
                    .
                  </span>
                </label>
                {errors.dataUseAgreement && (
                  <p className="text-red-500 text-sm mt-1 ml-6">
                    {errors.dataUseAgreement}
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
                    for Verification...
                  </>
                ) : (
                  <>
                    Submit Application <Check className="ml-2" />
                  </>
                )}
              </button>
              {!isLoading && isSubmitDisabled && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please verify the representative's email and phone to submit.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthAuthorityRegistrationPage;
