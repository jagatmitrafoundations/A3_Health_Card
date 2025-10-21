import axios from 'axios';
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Removed for compatibility
import {
  Building,
  Mail,
  Lock,
  User,
  Phone,
  Check,
  Eye,
  EyeOff,
  Loader2, // Added for loading spinners
  AlertCircle, // Added for error messages
} from "lucide-react";

const MNCRegistrationPage = () => {
  // const navigate = useNavigate(); // Removed for compatibility
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    industry: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpState((prev) => ({ ...prev, [name]: value, otpError: "" }));
  };

  // --- OTP Logic ---
//   const handleSendOtp = async (type) => {
//     setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));
//     if (type === "email") {
//     if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
//       setErrors((prev) => ({
//         ...prev,
//         adminEmail: "Please enter a valid work email first.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
    
//     try {
//       const response = await axios.post('/api/mnc/send-otp', {
//         email: formData.adminEmail,
//         type: 'email'
//       });
//       //await new Promise((resolve) => setTimeout(resolve, 1500));
//       setOtpState((prev) => ({
//         ...prev,
//         sendingEmailOtp: false,
//         isEmailOtpSent: true,
//         otpMessage: response.data.message || `OTP sent to ${formData.adminEmail}`
//       }));
//     } catch (error) {
//       setOtpState((prev) => ({
//         ...prev,
//         sendingEmailOtp: false,
//         otpError: error.response?.data?.message || 'Failed to send email OTP'
//       }));
//     }
//   }
//    if (type === "phone") {
//     if (!/^\d{10,15}$/.test(formData.adminPhone)) {
//       setErrors((prev) => ({
//         ...prev,
//         adminPhone: "Please enter a valid 10 to 15-digit phone number first.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
    
//     try {
//       const response = await axios.post('/api/mnc/send-otp', {
//         phone: formData.adminPhone,
//         type: 'phone'
//       });
      
//       setOtpState((prev) => ({
//         ...prev,
//         sendingPhoneOtp: false,
//         isPhoneOtpSent: true,
//         otpMessage: response.data.message || `OTP sent to ${formData.adminPhone}`
//       }));
//     } catch (error) {
//       setOtpState((prev) => ({
//         ...prev,
//         sendingPhoneOtp: false,
//         otpError: error.response?.data?.message || 'Failed to send phone OTP'
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

//   const handleVerifyOtp = async (type) => {
//     setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

//     if (type === "email") {
//     if (!otpState.emailOtp) {
//       setOtpState((prev) => ({
//         ...prev,
//         otpError: "Please enter the email OTP.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, verifyingEmailOtp: true }));
    
//     try {
//       const response = await axios.post('/api/mnc/verify-otp', {
//         email: formData.adminEmail,
//         otp: otpState.emailOtp,
//         type: 'email'
//       });
      
//       setOtpState((prev) => ({
//         ...prev,
//         verifyingEmailOtp: false,
//         isEmailVerified: true,
//         isEmailOtpSent: false,
//         otpMessage: response.data.message || "Email verified successfully!",
//         otpError: "",
//       }));
//     } catch (error) {
//       setOtpState((prev) => ({
//         ...prev,
//         verifyingEmailOtp: false,
//         otpError: error.response?.data?.message || "Invalid email OTP",
//       }));
//     }
//   }
// if (type === "phone") {
//     if (!otpState.phoneOtp) {
//       setOtpState((prev) => ({
//         ...prev,
//         otpError: "Please enter the phone OTP.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, verifyingPhoneOtp: true }));
    
//     try {
//       const response = await axios.post('/api/mnc/verify-otp', {
//         phone: formData.adminPhone,
//         otp: otpState.phoneOtp,
//         type: 'phone'
//       });
      
//       setOtpState((prev) => ({
//         ...prev,
//         verifyingPhoneOtp: false,
//         isPhoneVerified: true,
//         isPhoneOtpSent: false,
//         otpMessage: response.data.message || "Phone verified successfully!",
//         otpError: "",
//       }));
//     }catch (error) {
//       setOtpState((prev) => ({
//         ...prev,
//         verifyingPhoneOtp: false,
//         otpError: error.response?.data?.message || "Invalid phone OTP",
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
        email:  formData.adminEmail,
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
    if (!formData.companyName)
      newErrors.companyName = "Company name is required.";
    if (!formData.registrationNumber)
      newErrors.registrationNumber =
        "Corporate registration number is required.";
    if (!formData.adminName)
      newErrors.adminName = "Administrator name is required.";
    if (!/\S+@\S+\.\S+/.test(formData.adminEmail))
      newErrors.adminEmail = "A valid work email is required.";
    if (!formData.adminPhone)
      newErrors.adminPhone = "A contact phone number is required.";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

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
    
  //   console.log("MNC Onboarding Data:", formData);
  //   setTimeout(() => {
  //     setOtpState((prev) => ({
  //       ...prev,
  //       otpMessage:
  //         "Corporate account registration submitted for verification!",
  //       otpError: "",
  //     }));
  //     setIsLoading(false);
  //     // navigate("/login/mnc"); // Removed for compatibility
  //   }, 1500);
  // };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const formErrors = validateForm();
//   if (Object.keys(formErrors).length > 0) {
//     setErrors(formErrors);
//     return;
//   }

//   setIsLoading(true);
//   try {
//     const response = await axios.post('/api/mnc/register', {
//       companyInfo: {
//         companyName: formData.companyName,
//         registrationNumber: formData.registrationNumber,
//         industry: formData.industry
//       },
//       administrator: {
//         adminName: formData.adminName,
//         adminEmail: formData.adminEmail,
//         adminPhone: formData.adminPhone,
//         password: formData.password
//       }
//     });

//     setOtpState(prev => ({
//       ...prev,
//       otpMessage: 'Registration successful! Please check your email for your Unique ID.'
//     }));
    
//     // Navigate to login page after success
//     setTimeout(() => {
//       navigate('/login/mnc');
//     }, 2000);

//   } catch (error) {
//     setErrors({
//       submit: error.response?.data?.message || 'Registration failed'
//     });
//   } finally {
//     setIsLoading(false);
//   }
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
    // Structure MNC data according to MNC model
    const mncData = {
      companyInfo: {
        companyName: formData.companyName,
        registrationNumber: formData.registrationNumber,
        industry: formData.industry || ''
      },
      administrator: {
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
        password: formData.password
      },
      verification: {
        isEmailVerified: otpState.isEmailVerified,
        isPhoneVerified: otpState.isPhoneVerified
      }
    };
    
    console.log("Submitting MNC Data...", mncData);
    
    const response = await axios.post('/api/auth/mnc/register', mncData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Registration response:", response.data);
    
    // Extract MNC unique code from response
    const uniqueCode = response.data.uniqueCode;
    setGeneratedCode(uniqueCode);
    
    // Show success message
    alert(`🎉 Corporate Registration Successful!\n\nYour unique company ID is: ${uniqueCode}\n\nThis code has been sent to your registered email address. Please save it for future reference.`);
    
    setOtpState((prev) => ({
      ...prev,
      otpMessage: `Corporate registration successful! Your company ID is: ${uniqueCode}`,
      otpError: "",
    }));
    
    // Optional: Redirect after successful registration
    // setTimeout(() => {
    //   navigate('/login/mnc');
    // }, 2000);
    
  } catch (error) {
    console.error('MNC registration error:', error);
    
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
            <Building className="mx-auto h-12 w-12" />
            <h1 className="text-4xl font-bold mt-4">
              Corporate Health Partnership
            </h1>
            <p className="text-red-100 mt-2">
              Onboard your organization for employee wellness programs.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <Building className="mr-3 text-red-600" /> Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... company name, reg number, industry ... */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.companyName ? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Corporate Registration No. *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.registrationNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Industry (Optional)
                  </label>
                  <input
                    type="text"
                    name="industry"
                    placeholder="e.g., Technology, Manufacturing"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                <User className="mr-3 text-red-600" /> Administrator's Details
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
                    Work Phone Number *
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
            <div className="flex flex-col items-center pt-4">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-3" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    Register Company <Check className="ml-2" />
                  </>
                )}
              </button>
              {!isLoading && isSubmitDisabled && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please verify the administrator's email and phone to register.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MNCRegistrationPage;
