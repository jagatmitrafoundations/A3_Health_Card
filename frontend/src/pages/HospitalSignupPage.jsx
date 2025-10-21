import React, { useState } from "react";
import axios from 'axios';
import {
  Hospital,
  Mail,
  Phone,
  MapPin,
  Shield,
  User,
  Lock,
  Upload,
  FileText,
  Check,
  Eye, // Added missing icon
  EyeOff, // Added missing icon
  Loader2, // Added for loading spinners
  AlertCircle, // Added for error messages
} from "lucide-react";

const HospitalSignupPage = () => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    hospitalType: "",
    registrationNumber: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    registrationCertificate: null,
    otherLicense: null,
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Add this to your state variables
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

  const hospitalTypes = ["Private", "Government", "Trust", "Charitable"];
  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpState((prev) => ({ ...prev, [name]: value, otpError: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // // --- OTP Logic ---
  // const handleSendOtp = async (type) => {
  //   setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  //   if (type === "email") {
  //     if (!/\S+@\S+\.\S+/.test(formData.email)) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         email: "Please enter a valid email first.",
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
  //       otpMessage: `An OTP has been sent to ${formData.email}.`,
  //     }));
  //   }

  //   if (type === "phone") {
  //     if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
  //       setErrors((prev) => ({
  //         ...prev,
  //         phoneNumber:
  //           "Please enter a valid 10 to 15-digit phone number first.",
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
  //       otpMessage: `An OTP has been sent to ${formData.phoneNumber}.`,
  //     }));
  //   }
  // };
  const handleSendOtp = async (type) => {
  setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

  if (type === "email") {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email first.",
      }));
      return;
    }
    setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
    
    try {
      const response = await axios.post('/api/auth/send-otp', {
        email: formData.email,
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
    if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Please enter a valid 10 to 15-digit phone number first.",
      }));
      return;
    }
    setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
    
    try {
      const response = await axios.post('/api/auth/send-otp', {
        mobile: `+91${formData.phoneNumber}`,
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
  //         otpMessage: "Hospital email verified successfully!",
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
  //         otpMessage: "Hospital phone number verified successfully!",
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
        email: formData.email,
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
        mobile: `+91${formData.phoneNumber}`,
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
    if (!formData.hospitalName)
      newErrors.hospitalName = "Hospital name is required.";
    if (!formData.hospitalType)
      newErrors.hospitalType = "Please select a hospital type.";
    if (!formData.registrationNumber)
      newErrors.registrationNumber = "Registration number is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required.";
    if (!/^\d{10,15}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "A valid phone number is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.pincode) newErrors.pincode = "Pincode is required.";
    if (!formData.adminName)
      newErrors.adminName = "Administrator's name is required.";
    if (!/\S+@\S+\.\S+/.test(formData.adminEmail))
      newErrors.adminEmail = "A valid administrator email is required.";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.registrationCertificate)
      newErrors.registrationCertificate =
        "Registration certificate is required.";
    if (!formData.consent) newErrors.consent = "You must agree to the terms.";

    // OTP validation
    if (!otpState.isEmailVerified)
      newErrors.email = "Please verify the hospital's email address.";
    if (!otpState.isPhoneVerified)
      newErrors.phoneNumber = "Please verify the hospital's phone number.";

    return newErrors;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const validationErrors = validateForm();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }
  //   // setIsLoading(true);
  //   // console.log("Submitting Hospital Data:", formData);
  //   // setTimeout(() => {
  //   //   setOtpState((prev) => ({
  //   //     ...prev,
  //   //     otpMessage: "Hospital registration submitted successfully!",
  //   //     otpError: "",
  //   //   }));
  //   //   setIsLoading(false);
  //   //}, 2000);
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setIsLoading(true);
  
  try {
    // Create FormData for file uploads
    const formDataToSend = new FormData();
    const hospitalData = {
      hospitalInfo: {
        hospitalName: formData.hospitalName,
        hospitalType: formData.hospitalType,
        registrationNumber: formData.registrationNumber
      },
    contactInfo: {
        email: formData.email,
        phoneNumber: formData.phoneNumber
      },
      location: {
        fullAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country
      },
      administrator: {
         fullName: formData.adminName,
        email: formData.adminEmail,
        password: formData.password
      },
      documents: {}, // Will be populated with file info
      settings: {
        termsAccepted: formData.consent,
        isEmailVerified: otpState.isEmailVerified,
        isPhoneVerified: otpState.isPhoneVerified
      }
      
    };
    
     // Append the structured data as JSON
    formDataToSend.append('hospitalData', JSON.stringify(hospitalData));
    
    // Append files separately
    if (formData.registrationCertificate) {
      formDataToSend.append('registrationCertificate', formData.registrationCertificate);
    }
    
    if (formData.otherLicense) {
      formDataToSend.append('otherLicense', formData.otherLicense);
    }
    
    console.log("Submitting Hospital Data...");
    
    const response = await axios.post('/api/auth/hospital/signup', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("Registration response:", response.data);
    
    // Extract hospital ID from response
    const uniqueCode = response.data.uniqueCode;
    setGeneratedCode(uniqueCode);
    // Show success message
    alert(` Hospital Registration Successful!\n\nYour unique hospital ID is: ${uniqueCode}\n\nThis code has been sent to your registered email address. Please save it for future reference.`);
    setOtpState((prev) => ({
      ...prev,
      otpMessage: `Hospital registration successful! Your hospital ID is: ${uniqueCode}`,
      otpError: "",
    }));
    
    // You might want to redirect or perform other actions after successful registration
    // For example: navigate("/hospital/dashboard");
    
  } catch (error) {
    console.error('Hospital registration error:', error);
    
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <Hospital size={48} />
            </div>
            <h1 className="text-4xl font-bold">Hospital Registration</h1>
            <p className="text-red-100 mt-2">Join our network to save lives</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section 1: Hospital Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Hospital className="mr-3 text-red-600" /> Hospital Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... hospital name, type, reg number ... */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    placeholder="Enter official hospital name"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.hospitalName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hospitalName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Hospital Type *
                  </label>
                  <select
                    name="hospitalType"
                    value={formData.hospitalType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select type</option>
                    {hospitalTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.hospitalType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.hospitalType}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Enter government-issued registration number"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Address */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MapPin className="mr-3 text-red-600" /> Contact & Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Verification */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Official Email Address *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="official@hospital.com"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={
                        otpState.isEmailVerified || otpState.isEmailOtpSent
                      }
                      className={`flex-grow px-4 py-3 rounded-lg border-2 ${
                        errors.email ? "border-red-500" : "border-gray-300"
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
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                      name="phoneNumber"
                      placeholder="e.g., 9876543210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      readOnly={
                        otpState.isPhoneVerified || otpState.isPhoneOtpSent
                      }
                      className={`flex-grow px-4 py-3 rounded-lg border-2 ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-300"
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
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
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

                {/* ... address fields ... */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street name, Area"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
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
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
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
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pincode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Administrator Credentials */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="mr-3 text-red-600" /> Administrator
                Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... admin name, email, password ... */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Administrator Full Name *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="Enter name of admin"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.adminName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Administrator Email *
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="admin@hospital.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.adminEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adminEmail}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Document Upload */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-red-600" /> Official Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... file uploads ... */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Registration Certificate *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400">
                    <Upload className="mx-auto mb-2 text-gray-400" size={28} />
                    <input
                      type="file"
                      name="registrationCertificate"
                      onChange={handleFileChange}
                      className="hidden"
                      id="regCert"
                    />
                    <label htmlFor="regCert" className="cursor-pointer text-sm">
                      <span className="text-red-600 hover:text-red-700">
                        Choose file
                      </span>
                    </label>
                    {formData.registrationCertificate && (
                      <p className="text-green-600 text-sm mt-2">
                        {formData.registrationCertificate.name}
                      </p>
                    )}
                  </div>
                  {errors.registrationCertificate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.registrationCertificate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Other License / Permit (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400">
                    <Upload className="mx-auto mb-2 text-gray-400" size={28} />
                    <input
                      type="file"
                      name="otherLicense"
                      onChange={handleFileChange}
                      className="hidden"
                      id="otherLicense"
                    />
                    <label
                      htmlFor="otherLicense"
                      className="cursor-pointer text-sm"
                    >
                      <span className="text-red-600 hover:text-red-700">
                        Choose file
                      </span>
                    </label>
                    {formData.otherLicense && (
                      <p className="text-green-600 text-sm mt-2">
                        {formData.otherLicense.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pt-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                />
                <span className="ml-3 text-gray-600 text-sm">
                  I agree, on behalf of the hospital, to the{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    Privacy Policy
                  </a>
                  . All information provided is accurate and verifiable.
                </span>
              </label>
              {errors.consent && (
                <p className="text-red-500 text-sm mt-1">{errors.consent}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6 mr-3" />{" "}
                    Registering...
                  </>
                ) : (
                  <>
                    <Check className="mr-3" size={24} /> Complete Registration
                  </>
                )}
              </button>
              {!isLoading && isSubmitDisabled && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please verify the hospital's email and phone to register.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalSignupPage;
