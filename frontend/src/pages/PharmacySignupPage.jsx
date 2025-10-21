import React, { useState } from "react";
import axios from 'axios';
// import { useNavigate } from "react-router-dom"; // Removed for compatibility
import {
  Building2,
  Mail,
  ShieldCheck,
  User,
  Phone,
  Check,
  Eye,
  EyeOff,
  FileText,
  MapPin,
  Upload,
  Loader2, // Added for loading spinners
  AlertCircle, // Added for error messages
} from "lucide-react";

const PharmacyRegistrationPage = () => {
  // const navigate = useNavigate(); // Removed for compatibility
  const [formData, setFormData] = useState({
    pharmacyName: "",
    licenseNumber: "",
    gstin: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    drugLicenseFile: null,
    agreedToTerms: false,
    enable2FA: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 const [generatedCode, setGeneratedCode] = useState(null);
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
    setFormData((prev) => ({ ...prev, drugLicenseFile: file }));
    if (errors.drugLicenseFile) {
      setErrors((prev) => ({ ...prev, drugLicenseFile: null }));
    }
  };

  // --- OTP Logic ---
  // const handleSendOtp = async (type) => {
  //   setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  //   if (type === "email") {
  //     if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         adminEmail: "Please enter a valid administrator email first.",
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
  //       otpMessage: `An OTP has been sent to ${formData.adminEmail}.`,
  //     }));
  //   }

  //   if (type === "phone") {
  //     if (!/^\d{10,15}$/.test(formData.adminPhone)) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         adminPhone: "Please enter a valid 10 to 15-digit phone number first.",
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
  //       otpMessage: `An OTP has been sent to ${formData.adminPhone}.`,
  //     }));
  //   }
  // };
  const handleSendOtp = async (type) => {
  setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  if (type === "email") {
    if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email first.",
      }));
      return;
    }
    setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
    
    try {
      const response = await axios.post('/api/auth/send-otp', {
        email: formData.adminEmail,
        type: 'USER_REGISTRATION'
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
        type: 'USER_REGISTRATION'
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
  //         otpMessage: "Administrator email verified successfully!",
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
  //         otpMessage: "Administrator phone verified successfully!",
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
        type: 'USER_REGISTRATION'
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
        type: 'USER_REGISTRATION'
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
    if (!formData.pharmacyName)
      newErrors.pharmacyName = "Pharmacy name is required.";
    if (!formData.licenseNumber)
      newErrors.licenseNumber = "Drug license number is required.";
    if (!formData.gstin) {
      newErrors.gstin = "GSTIN is required for verification.";
    } else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gstin
      )
    ) {
      newErrors.gstin = "Please enter a valid GSTIN.";
    }
    if (!formData.adminName)
      newErrors.adminName = "Administrator name is required.";
    if (!/\S+@\S+\.\S+/.test(formData.adminEmail))
      newErrors.adminEmail = "A valid administrator email is required.";
    if (!formData.adminPhone)
      newErrors.adminPhone = "A contact phone is required.";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    if (!formData.fullAddress)
      newErrors.fullAddress = "Full address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.pincode) newErrors.pincode = "Pincode is required.";
    if (!formData.drugLicenseFile)
      newErrors.drugLicenseFile =
        "A scanned copy of the drug license is mandatory.";
    if (!formData.agreedToTerms)
      newErrors.agreedToTerms = "You must agree to the terms to proceed.";

    // OTP validation
    if (!otpState.isEmailVerified)
      newErrors.adminEmail = "Please verify the administrator's email address.";
    if (!otpState.isPhoneVerified)
      newErrors.adminPhone = "Please verify the administrator's phone number.";

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
  //   console.log("Pharmacy Onboarding Data:", {
  //     ...formData,
  //     drugLicenseFileName: formData.drugLicenseFile?.name,
  //   });
  //   setTimeout(() => {
  //     setOtpState((prev) => ({
  //       ...prev,
  //       otpMessage:
  //         "Pharmacy registration submitted. Your account will be activated upon successful verification.",
  //       otpError: "",
  //     }));
  //     setIsLoading(false);
  //     // navigate("/login/pharmacy"); // Removed for compatibility
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
    
    // Structure pharmacy data according to backend model
    const pharmacyData = {
      pharmacyInfo: {
        pharmacyName: formData.pharmacyName,
        drugLicenseNumber: formData.licenseNumber,
        gstin: formData.gstin
      },
      officialAddress: {
        fullAddress: formData.fullAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      administrator: {
        fullName: formData.adminName,
        workEmail: formData.adminEmail,
        contactPhone: formData.adminPhone,
        password: formData.password
      },
      compliance: {
        twoFactorEnabled: formData.enable2FA,
        termsAccepted: formData.agreedToTerms
      },
      verification: {
        isEmailVerified: otpState.isEmailVerified,
        isPhoneVerified: otpState.isPhoneVerified
      }
    };
    
    // Append the structured data as JSON
    formDataToSend.append('pharmacyData', JSON.stringify(pharmacyData));
    
    // Append the drug license file
    if (formData.drugLicenseFile) {
      formDataToSend.append('drugLicenseFile', formData.drugLicenseFile);
    }
    
    console.log("Submitting Pharmacy Data...");
    
    const response = await axios.post('/api/auth/pharmacy/register', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("Registration response:", response.data);
    
    // Extract pharmacy unique code from response
    const uniqueCode = response.data.pharmacy.uniqueCode;
    setGeneratedCode(uniqueCode);
    
    // Show success message
    alert(`🎉 Pharmacy Registration Successful!\n\nYour unique pharmacy ID is: ${uniqueCode}\n\nThis code has been sent to your registered email address. Please save it for future reference.`);
    
    setOtpState((prev) => ({
      ...prev,
      otpMessage: `Pharmacy registration successful! Your pharmacy ID is: ${uniqueCode}`,
      otpError: "",
    }));
    
    // Optional: Redirect after successful registration
    // setTimeout(() => {
    //   navigate('/login/pharmacy');
    // }, 2000);
    
  } catch (error) {
    console.error('Pharmacy registration error:', error);
    
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
            <Building2 className="mx-auto h-12 w-12" />
            <h1 className="text-4xl font-bold mt-4">
              Pharmacy Partner Registration
            </h1>
            <p className="text-red-100 mt-2">
              Securely join our network to serve patients better.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section 1: Pharmacy Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <Building2 className="mr-3 text-red-600" /> Pharmacy & License
                Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... pharmacy name, license, gstin ... */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Pharmacy Name *
                  </label>
                  <input
                    type="text"
                    name="pharmacyName"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.pharmacyName ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.pharmacyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pharmacyName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Drug License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.licenseNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.licenseNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    GSTIN *
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    placeholder="e.g., 29ABCDE1234F1Z5"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.gstin ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.gstin && (
                    <p className="text-red-500 text-sm mt-1">{errors.gstin}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: Address Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <MapPin className="mr-3 text-red-600" /> Official Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... address fields ... */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    name="fullAddress"
                    placeholder="Shop No, Building, Street, Area"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.fullAddress ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.fullAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullAddress}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.pincode ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Administrator Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="mr-3 text-red-600" /> Administrator Account
                Setup
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... admin name ... */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Administrator's Full Name *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.adminName ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.adminName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminName}
                    </p>
                  )}
                </div>

                {/* Email Verification */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Administrator's Work Email *
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

                {/* Phone Verification */}
                <div className="md:col-span-2">
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
                    Create Portal Password *
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

            {/* Section 4: Security & Compliance */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <ShieldCheck className="mr-3 text-red-600" /> Security &
                Compliance
              </h2>
              {/* ... file upload and agreements ... */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Upload Drug License (PDF, JPG, PNG) *
                </label>
                <div
                  className={`border-2 border-dashed ${
                    errors.drugLicenseFile
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
                    id="drugLicenseFile"
                  />
                  <label
                    htmlFor="drugLicenseFile"
                    className="cursor-pointer text-sm"
                  >
                    <span className="text-red-600 hover:text-red-700 font-medium">
                      Choose file
                    </span>
                    <span className="text-gray-500"> or drag & drop</span>
                  </label>
                  {formData.drugLicenseFile && (
                    <p className="text-green-600 text-sm mt-2">
                      {formData.drugLicenseFile.name}
                    </p>
                  )}
                  {errors.drugLicenseFile && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.drugLicenseFile}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  name="enable2FA"
                  checked={formData.enable2FA}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Enable Two-Factor Authentication (Recommended)
                </label>
              </div>
              <div className="mt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span
                    className={`ml-3 text-gray-600 text-sm ${
                      errors.agreedToTerms ? "text-red-600" : ""
                    }`}
                  >
                    I confirm that this pharmacy will adhere to all data privacy
                    and protection regulations regarding patient health
                    information. I agree to the{" "}
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 underline"
                    >
                      Partner Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="text-red-500 text-sm mt-1 ml-6">
                    {errors.agreedToTerms}
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
                    Register Pharmacy <Check className="ml-2" />
                  </>
                )}
              </button>
              {!isLoading && isSubmitDisabled && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please verify the administrator's email and phone to register.
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-gray-600">
                Already a partner?{" "}
                <button
                  type="button" // Change to button to prevent form submission
                  onClick={() => alert("Navigate to login page")} // Replace with actual navigation
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

export default PharmacyRegistrationPage;
