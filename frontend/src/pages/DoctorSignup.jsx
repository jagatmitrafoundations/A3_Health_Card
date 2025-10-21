import axios from 'axios';

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Stethoscope,
  Award,
  Building,
  Upload,
  Check,
  Eye,
  EyeOff,
  Loader2, // Added for loading spinners
  AlertCircle, // Added for error messages
} from "lucide-react";

const DoctorSignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    specialization: "",
    experience: "",
    currentAffiliation: "",
    password: "",
    confirmPassword: "",
    licenseFile: null,
    profilePhoto: null,
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "General Surgery",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Urology",
    "Other",
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

  // --- OTP Logic ---
//   const handleSendOtp = async (type) => {
//     setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

//     if (type === "email") {
//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       setErrors((prev) => ({
//         ...prev,
//         email: "Please enter a valid email first.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, sendingEmailOtp: true }));
    
//     try {
//       const response = await axios.post('/api/auth/email/send-otp', {
//         email: formData.email,
//         type: 'DOCTOR_REGISTRATION'
//       });
      
//       setOtpState((prev) => ({
//         ...prev,
//         sendingEmailOtp: false,
//         isEmailOtpSent: true,
//         otpMessage: response.data.message || `OTP sent to ${formData.email}`
//       }));
//     } catch (error) {
//       setOtpState((prev) => ({
//         ...prev,
//         sendingEmailOtp: false,
//         otpError: error.response?.data?.message || 'Failed to send email OTP'
//       }));
//     }
//   }


//     if (type === "phone") {
//     if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
//       setErrors((prev) => ({
//         ...prev,
//         phoneNumber: "Please enter a valid phone number first.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
    
//     try {
//       const response = await axios.post('/api/auth/phone/send-otp', {
//         phone: formData.phoneNumber,
//         type: 'DOCTOR_REGISTRATION'
//       });
      
//       setOtpState((prev) => ({
//         ...prev,
//         sendingPhoneOtp: false,
//         isPhoneOtpSent: true,
//         otpMessage: response.data.message || `OTP sent to ${formData.phoneNumber}`
//       }));
//     }catch (error) {
//       setOtpState((prev) => ({
//         ...prev,
//         sendingPhoneOtp: false,
//         otpError: error.response?.data?.message || 'Failed to send phone OTP'
//       }));
//     }
//   }
// };
//   const handleVerifyOtp = async (type) => {
//     setOtpState((prev) => ({ ...prev, otpMessage: "", otpError: "" }));

//      if (type === "email") {
//     if (!otpState.emailOtp) {
//       setOtpState((prev) => ({
//         ...prev,
//         otpError: "Please enter the email OTP.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, verifyingEmailOtp: true }));
    
//     try {
//       const response = await axios.post('/api/auth/email/verify-otp', {
//         email: formData.email,
//         otp: otpState.emailOtp,
//         type: 'DOCTOR_REGISTRATION'
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
//         otpError: error.response?.data?.message || "Invalid email OTP"
//       }));
//     }
//   }

//    if (type === "phone") {
//     if (!otpState.phoneOtp) {
//       setOtpState((prev) => ({
//         ...prev,
//         otpError: "Please enter the phone OTP.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, verifyingPhoneOtp: true }));
    
//     try {
//       const response = await axios.post('/api/auth/phone/verify-otp', {
//         phone: formData.phoneNumber,
//         otp: otpState.phoneOtp,
//         type: 'DOCTOR_REGISTRATION'
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
//         otpError: error.response?.data?.message || "Invalid phone OTP"
//       }));
//     }
//   }
// };
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
    
//     try {
//       const response = await axios.post('/api/auth/send-otp', {
//         email: formData.email,
//         type: 'USER_REGISTRATION'
//       });
      
//       setOtpState((prev) => ({
//         ...prev,
//         sendingEmailOtp: false,
//         isEmailOtpSent: true,
//         otpMessage: response.data.message || `An OTP has been sent to ${formData.email}.`
//       }));
//     } catch (error) {
//       console.error('Email OTP error:', error);
//       setOtpState((prev) => ({
//         ...prev,
//         sendingEmailOtp: false,
//         otpError: error.response?.data?.message || 'Failed to send OTP to email'
//       }));
//     }
//   }

//   if (type === "phone") {
//     if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
//       setErrors((prev) => ({
//         ...prev,
//         phoneNumber: "Please enter a valid 10 to 15-digit phone number first.",
//       }));
//       return;
//     }
//     setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
    
//     try {
//       const response = await axios.post('/api/auth/send-otp', {
//         mobile: `+91${formData.phoneNumber}`,
//         type: 'USER_REGISTRATION'
//       });
      
//       setOtpState((prev) => ({
//         ...prev,
//         sendingPhoneOtp: false,
//         isPhoneOtpSent: true,
//         otpMessage: response.data.message || `An OTP has been sent to ${formData.phoneNumber}.`
//       }));
//     } catch (error) {
//       console.error('Phone OTP error:', error);
//       setOtpState((prev) => ({
//         ...prev,
//         sendingPhoneOtp: false,
//         otpError: error.response?.data?.message || 'Failed to send OTP to phone'
//       }));
//     }
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
        type: 'DOCTOR_REGISTRATION'
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
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required.";
    if (!/^\d{10,15}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "A valid phone number is required.";
    if (!formData.licenseNumber)
      newErrors.licenseNumber = "Medical license number is required.";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required.";
    if (
      !formData.experience ||
      isNaN(formData.experience) ||
      formData.experience < 0
    )
      newErrors.experience = "Valid years of experience are required.";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.licenseFile)
      newErrors.licenseFile = "A copy of your medical license is required.";
    if (!formData.consent)
      newErrors.consent = "You must agree to the terms and conditions.";

    // OTP validation
    if (!otpState.isEmailVerified)
      newErrors.email = "Please verify your email address.";
    if (!otpState.isPhoneVerified)
      newErrors.phoneNumber = "Please verify your phone number.";

    return newErrors;
  };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   const validationErrors = validateForm();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   setIsLoading(true);
  
//   try {
//     // Create FormData for file upload
//     const formDataToSend = new FormData();
    
//     // Append personal info
//     formDataToSend.append('fullName', formData.fullName);
//     formDataToSend.append('email', formData.email);
//     formDataToSend.append('phoneNumber', formData.phoneNumber);
    
//     // Append professional info
//     formDataToSend.append('licenseNumber', formData.licenseNumber);
//     formDataToSend.append('specialization', formData.specialization);
//     formDataToSend.append('experience', formData.experience);
//     formDataToSend.append('currentAffiliation', formData.currentAffiliation);
    
//     // Append authentication info
//     formDataToSend.append('password', formData.password);
    
//     // Append files
//     if (formData.licenseFile) {
//       formDataToSend.append('licenseFile', formData.licenseFile);
//     }
//     if (formData.profilePhoto) {
//       formDataToSend.append('profilePhoto', formData.profilePhoto);
//     }
    
//     // Append consent
//     formDataToSend.append('consent', formData.consent);

//     const response = await axios.post('/api/doctor/register', formDataToSend, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     });
//     const uniqueCode = response.data.uniqueCode;
//     setGeneratedCode(uniqueCode);
//     // Show success message
//     alert(` Hospital Registration Successful!\n\nYour unique hospital ID is: ${uniqueCode}\n\nThis code has been sent to your registered email address. Please save it for future reference.`);
//     setOtpState(prev => ({
//       ...prev,
//       otpMessage: 'Registration successful! Please check your email for your Unique ID.'
//     }));

//     // Navigate to login page after success
//     setTimeout(() => {
//       //navigate('/login/doctor');
//     }, 2000);

//   } catch (error) {
//     setErrors({
//       submit: error.response?.data?.message || 'Registration failed'
//     });
//     setOtpState(prev => ({
//       ...prev,
//       otpError: error.response?.data?.message || 'Registration failed'
//     }));
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
    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    // Structure data according to Doctor model schema
    const doctorData = {
      personalInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      },
      professionalInfo: {
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        currentAffiliation: formData.currentAffiliation || ''
      },
      credentials: {
        password: formData.password
      },
      verification: {
        isEmailVerified: otpState.isEmailVerified,
        isPhoneVerified: otpState.isPhoneVerified,
        documentsUploaded: {
          licenseFile: !!formData.licenseFile,
          profilePhoto: !!formData.profilePhoto
        }
      },
      settings: {
        termsAccepted: formData.consent
      }
    };
    
    // Append the structured data as JSON
    formDataToSend.append('doctorData', JSON.stringify(doctorData));
    
    // Append files separately with correct field names
    if (formData.licenseFile) {
      formDataToSend.append('licenseFile', formData.licenseFile);
    }
    if (formData.profilePhoto) {
      formDataToSend.append('profilePhoto', formData.profilePhoto);
    }
    
    console.log("Submitting Doctor Data...");

    const response = await axios.post('/api/auth/doctor/register', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Registration response:", response.data);
    
    // Extract doctor ID from response
    const uniqueCode = response.data.doctor.uniqueCode;
    setGeneratedCode(uniqueCode);
    
    // Show alert with unique code
    alert(`🎉 Doctor Registration Successful!\n\nYour unique doctor ID is: ${uniqueCode}\n\nThis code has been sent to your registered email address. Please save it for future reference.`);

    // Show success message
    setOtpState(prev => ({
      ...prev,
      otpMessage: `Doctor registration successful! Your doctor ID is: ${uniqueCode}. Check your email for confirmation.`,
      otpError: "",
    }));

  } catch (error) {
    console.error('Doctor registration error:', error);
    
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
              <Stethoscope size={48} />
            </div>
            <h1 className="text-4xl font-bold">Doctor Registration</h1>
            <p className="text-red-100 mt-2">
              Join our network of trusted medical professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section 1: Personal & Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="mr-3 text-red-600" /> Personal & Contact
                Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
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
                <div></div>

                {/* Email Verification */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={
                        otpState.isEmailVerified || otpState.isEmailOtpSent
                      }
                      placeholder="you@example.com"
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
                    Phone Number *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      readOnly={
                        otpState.isPhoneVerified || otpState.isPhoneOtpSent
                      }
                      placeholder="e.g., 9876543210"
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
              </div>
            </div>

            {/* Section 2: Professional Credentials (unchanged) */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Award className="mr-3 text-red-600" /> Professional Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License, Specialization, etc. */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Medical License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter your license number"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.licenseNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Specialization *
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select your specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  {errors.specialization && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.specialization}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.experience}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Current Hospital/Clinic Affiliation
                  </label>
                  <input
                    type="text"
                    name="currentAffiliation"
                    value={formData.currentAffiliation}
                    onChange={handleChange}
                    placeholder="e.g., City General Hospital"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Account Security (unchanged) */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Lock className="mr-3 text-red-600" /> Account Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="Minimum 8 characters"
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
                      placeholder="Re-enter your password"
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

            {/* Section 4: Document Upload (unchanged) */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Upload className="mr-3 text-red-600" /> Verification Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... file upload inputs ... */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Medical License / Certificate *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400">
                    <input
                      type="file"
                      name="licenseFile"
                      onChange={handleFileChange}
                      className="hidden"
                      id="licenseFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="licenseFile"
                      className="cursor-pointer text-sm"
                    >
                      <span className="text-red-600 hover:text-red-700">
                        Choose file
                      </span>
                      {formData.licenseFile ? (
                        <p className="text-green-600 mt-1">
                          {formData.licenseFile.name}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-xs mt-1">
                          PDF, JPG, PNG
                        </p>
                      )}
                    </label>
                  </div>
                  {errors.licenseFile && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.licenseFile}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Profile Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400">
                    <input
                      type="file"
                      name="profilePhoto"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profilePhoto"
                      accept=".jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="cursor-pointer text-sm"
                    >
                      <span className="text-red-600 hover:text-red-700">
                        Choose file
                      </span>
                      {formData.profilePhoto ? (
                        <p className="text-green-600 mt-1">
                          {formData.profilePhoto.name}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-xs mt-1">JPG, PNG</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent (unchanged) */}
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
                  I certify that I am a licensed medical practitioner and agree
                  to the{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="mr-3" size={24} /> Complete Registration
                  </>
                )}
              </button>
              {!isLoading && isSubmitDisabled && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Please verify your email and phone number to register.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignupPage;
