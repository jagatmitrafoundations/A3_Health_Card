import React, { useState } from "react";
import axios from 'axios';
import { registerUser } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Heart,
  Check,
  FileText,
  Camera,
  Shield,
  Users,
  Briefcase,
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";

const RegistrationPage = ({ setCurrentPage, setUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    dob: "",
    sex: "",
    maritalStatus: "",
    guardianName: "",
    guardianRelation: "",
    presentAddress: {
      houseNo: "",
      vpo: "",
      block: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
    permanentAddress: {
      houseNo: "",
      vpo: "",
      block: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
    },
    occupation: "",
    educationLevel: "",
    emergencyContacts: [
      { name: "", relation: "", contactNumber: "" },
      { name: "", relation: "", contactNumber: "" },
      { name: "", relation: "", contactNumber: "" },
    ],
    uniqueId: {
      country: "",
      type: "",
      number: "",
    },
    documentType: "",
    profileImage: null,
    documentFile: null,
    useBiometric: false,
  });
  // Add this after your other state declarations
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
  otpError: ""
});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Country list with their unique ID types
  const countries = {
    Afghanistan: { code: "AFG", idType: "Tazkira (e-Tazkira)", format: "N/A" },
    Albania: {
      code: "ALB",
      idType: "Letërnjoftim (ID Card)",
      format: "XXXXXXXXXX",
    },
    Algeria: {
      code: "DZA",
      idType: "Carte Nationale d'Identité Biométrique Électronique",
      format: "XXXXXXXXXXXXXXXXXX",
    },
    Andorra: { code: "AND", idType: "Targeta d'identitat", format: "N/A" },
    Angola: {
      code: "AGO",
      idType: "Bilhete de Identidade",
      format: "XXXXXXXXXXXXX",
    },
    Argentina: {
      code: "ARG",
      idType: "Documento Nacional de Identidad (DNI)",
      format: "XX.XXX.XXX",
    },
    Australia: {
      code: "AUS",
      idType: "Tax File Number (TFN)",
      format: "XXXXXXXXX",
    },
    Austria: { code: "AUT", idType: "Personalausweis", format: "XXXXXXXX" },
    Bangladesh: {
      code: "BGD",
      idType: "National Identity Card (NID)",
      format: "XXXXXXXXXXXXXXXXX",
    },
    Belarus: {
      code: "BLR",
      idType: "Identification card",
      format: "XXXXXXXXXXXXX",
    },
    Belgium: {
      code: "BEL",
      idType: "Carte d'identité (Identiteitskaart)",
      format: "XXX-XXXXXXX-XX",
    },
    Bolivia: { code: "BOL", idType: "Cédula de Identidad", format: "XXXXXXX" },
    Brazil: {
      code: "BRA",
      idType: "Cadastro de Pessoas Físicas (CPF)",
      format: "XXX.XXX.XXX-XX",
    },
    Bulgaria: {
      code: "BGR",
      idType: "Лична карта (Lichna karta)",
      format: "XXXXXXXXXX",
    },
    Canada: {
      code: "CAN",
      idType: "Social Insurance Number (SIN)",
      format: "XXX-XXX-XXX",
    },
    Chile: {
      code: "CHL",
      idType: "Rol Único Nacional (RUN)",
      format: "XX.XXX.XXX-X",
    },
    China: {
      code: "CHN",
      idType: "Resident Identity Card Number",
      format: "XXXXXXXXXXXXXXXXXX",
    },
    Colombia: {
      code: "COL",
      idType: "Cédula de Ciudadanía",
      format: "X.XXX.XXX.XXX",
    },
    "Costa Rica": {
      code: "CRI",
      idType: "Cédula de Identidad",
      format: "X-XXXX-XXXX",
    },
    Croatia: {
      code: "HRV",
      idType: "Osobna iskaznica (ID card)",
      format: "XXXXXXXXX",
    },
    Cuba: { code: "CUB", idType: "Carné de identidad", format: "XXXXXXXXXXX" },
    Cyprus: {
      code: "CYP",
      idType: "Δελτίο Ταυτότητας (Identity Card)",
      format: "XXXXXX",
    },
    "Czech Republic": {
      code: "CZE",
      idType: "Občanský průkaz",
      format: "XXXXXXXXX",
    },
    Denmark: {
      code: "DNK",
      idType: "Personnummer (CPR)",
      format: "DDMMYY-XXXX",
    },
    Ecuador: {
      code: "ECU",
      idType: "Cédula de Ciudadanía",
      format: "XXXXXXXXXX",
    },
    Egypt: {
      code: "EGY",
      idType: "National ID Card",
      format: "XXXXXXXXXXXXXX",
    },
    Estonia: {
      code: "EST",
      idType: "ID-kaart (ID Card)",
      format: "XXXXXXXXXXX",
    },
    Finland: {
      code: "FIN",
      idType: "Henkilökortti (Identitetskort)",
      format: "DDMMYY-XXXS",
    },
    France: {
      code: "FRA",
      idType: "Carte Nationale d'Identité",
      format: "XXXXXXXXXXXX",
    },
    Germany: {
      code: "DEU",
      idType: "Personalausweis (Identity Card)",
      format: "LXXXXXXXX",
    },
    Greece: {
      code: "GRC",
      idType: "Δελτίο Αστυνομικής Ταυτότητας (Police Identity Card)",
      format: "ABXXXXXX",
    },
    "Hong Kong": {
      code: "HKG",
      idType: "Hong Kong Identity Card (HKID)",
      format: "AXXXXXX(X)",
    },
    Hungary: {
      code: "HUN",
      idType: "Személyazonosító igazolvány",
      format: "XXXXXXAA",
    },
    Iceland: { code: "ISL", idType: "Kennitala", format: "DDMMYY-XXXX" },
    India: { code: "IND", idType: "Aadhaar", format: "XXXX XXXX XXXX" },
    Indonesia: {
      code: "IDN",
      idType: "Nomor Induk Kependudukan (NIK)",
      format: "XXXXXXXXXXXXXXXX",
    },
    Iran: {
      code: "IRN",
      idType: "National Identity Card",
      format: "XXXXXXXXXX",
    },
    Ireland: {
      code: "IRL",
      idType: "Personal Public Service (PPS) Number",
      format: "XXXXXXXA",
    },
    Israel: { code: "ISR", idType: "Teudat Zehut", format: "XXXXXXXXX" },
    Italy: {
      code: "ITA",
      idType: "Carta d'Identità Elettronica (CIE)",
      format: "CAXXXXXXX",
    },
    Japan: { code: "JPN", idType: "My Number Card", format: "XXXXXXXXXXXX" },
    Latvia: {
      code: "LVA",
      idType: "Personas apliecība (Personal certificate)",
      format: "XXXXXX-XXXXX",
    },
    Lithuania: {
      code: "LTU",
      idType: "Asmens tapatybės kortelė (Identity card)",
      format: "XXXXXXXXXXX",
    },
    Luxembourg: {
      code: "LUX",
      idType: "Carte d'identité",
      format: "XXXXXXXXXXX",
    },
    Malaysia: { code: "MYS", idType: "MyKad", format: "YYMMDD-XX-XXXX" },
    Malta: { code: "MLT", idType: "Identity Card", format: "XXXXXXXL" },
    Mexico: {
      code: "MEX",
      idType: "Clave Única de Registro de Población (CURP)",
      format: "XXXXYYYYMMDDHXXXXXX",
    },
    Moldova: {
      code: "MDA",
      idType: "Buletin de identitate",
      format: "XXXXXXXXXXXXX",
    },
    Netherlands: {
      code: "NLD",
      idType: "Nederlandse identiteitskaart",
      format: "XXXXXXXXX",
    },
    "New Zealand": { code: "NZL", idType: "IRD number", format: "XXX-XXX-XXX" },
    Nigeria: {
      code: "NGA",
      idType: "National Identification Number (NIN)",
      format: "XXXXXXXXXXX",
    },
    Norway: { code: "NOR", idType: "Fødselsnummer", format: "DDMMYYXXXXX" },
    Pakistan: {
      code: "PAK",
      idType: "Computerized National Identity Card (CNIC)",
      format: "XXXXX-XXXXXXX-X",
    },
    Peru: {
      code: "PER",
      idType: "Documento Nacional de Identidad (DNI)",
      format: "XXXXXXXX",
    },
    Philippines: {
      code: "PHL",
      idType: "Philippine Identification System (PhilSys) Number",
      format: "XXXXXXXXXXXXXXXX",
    },
    Poland: { code: "POL", idType: "Dowód osobisty", format: "AXX XXXXX" },
    Portugal: {
      code: "PRT",
      idType: "Cartão de Cidadão",
      format: "XXXXXXXXX XX X",
    },
    Romania: {
      code: "ROU",
      idType: "Carte de identitate",
      format: "XX XX XX XXXXXX",
    },
    Russia: {
      code: "RUS",
      idType: "Internal Passport",
      format: "XX XX XXXXXX",
    },
    "Saudi Arabia": {
      code: "SAU",
      idType: "National ID Card",
      format: "XXXXXXXXXX",
    },
    Singapore: {
      code: "SGP",
      idType: "National Registration Identity Card (NRIC)",
      format: "AXXXXXXXB",
    },
    Slovakia: {
      code: "SVK",
      idType: "Občiansky preukaz (Identity card)",
      format: "XX XXX XXX",
    },
    Slovenia: {
      code: "SVN",
      idType: "Osebna izkaznica (Identity card)",
      format: "XXXXXXXX",
    },
    "South Africa": {
      code: "ZAF",
      idType: "Identity Document",
      format: "YYMMDDXXXXSXX",
    },
    "South Korea": {
      code: "KOR",
      idType: "Resident Registration Number",
      format: "YYMMDD-XXXXXXX",
    },
    Spain: {
      code: "ESP",
      idType: "Documento Nacional de Identidad (DNI)",
      format: "XXXXXXXX-A",
    },
    Sweden: { code: "SWE", idType: "Personnummer", format: "YYYYMMDD-XXXX" },
    Switzerland: {
      code: "CHE",
      idType: "Identitätskarte (Carte d'identité / Carta d'identità)",
      format: "AXXXXXXX",
    },
    Taiwan: {
      code: "TWN",
      idType: "National Identification Card",
      format: "AXXXXXXXXX",
    },
    Thailand: {
      code: "THA",
      idType: "บัตรประจำตัวประชาชน (National Identity Card)",
      format: "X-XXXX-XXXXX-XX-X",
    },
    Turkey: {
      code: "TUR",
      idType: "Kimlik Kartı (Identity Card)",
      format: "XXXXXXXXXXX",
    },
    Ukraine: {
      code: "UKR",
      idType: "Passport Card (ID-card)",
      format: "XXXXXXXXX",
    },
    "United Arab Emirates": {
      code: "ARE",
      idType: "Emirates ID",
      format: "XXX-XXXX-XXXXXXX-X",
    },
    "United Kingdom": {
      code: "GBR",
      idType: "National Insurance Number",
      format: "AA XXXXXX A",
    },
    "United States": {
      code: "USA",
      idType: "Social Security Number (SSN)",
      format: "XXX-XX-XXXX",
    },
    Uruguay: {
      code: "URY",
      idType: "Cédula de Identidad",
      format: "X.XXX.XXX-X",
    },
    Venezuela: {
      code: "VEN",
      idType: "Cédula de Identidad",
      format: "V-XX.XXX.XXX",
    },
    Vietnam: {
      code: "VNM",
      idType: "Căn cước công dân (Citizen Identity Card)",
      format: "XXXXXXXXXXXX",
    },
  };

  const sexOptions = ["Male", "Female", "Other"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const educationLevels = [
    "High School",
    "Graduate",
    "Postgraduate",
    "PhD",
    "Others",
  ];
  const documentTypes = ["Passport", "Driving License", "National ID", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: updatedContacts,
    }));
  };

  const handleUniqueIdChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      uniqueId: {
        ...prev.uniqueId,
        [field]: value,
        ...(field === "country" && { type: countries[value]?.idType || "" }),
      },
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const copyPresentToPermanent = () => {
    if (sameAsPermanent) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: { ...prev.presentAddress },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: {
          houseNo: "",
          vpo: "",
          block: "",
          district: "",
          state: "",
          country: "",
          pincode: "",
        },
      }));
    }
  };

  const generateUniqueCode = () => {
    const countryCode = countries[formData.uniqueId.country]?.code || "XXX";
    const hashedID = btoa(formData.uniqueId.number)
      .substring(0, 8)
      .toUpperCase();
    const randomNum = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${countryCode}-${hashedID}-${randomNum}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.sex) newErrors.sex = "Sex is required";
    if (!formData.maritalStatus)
      newErrors.maritalStatus = "Marital status is required";
    if (!formData.guardianName)
      newErrors.guardianName = "Guardian name is required";
    if (!formData.guardianRelation)
      newErrors.guardianRelation = "Guardian relation is required";
    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    if (!formData.educationLevel)
      newErrors.educationLevel = "Education level is required";
    if (!formData.documentType)
      newErrors.documentType = "Document type is required";

    const addressFields = [
      "houseNo",
      "district",
      "state",
      "country",
      "pincode",
    ];
    addressFields.forEach((field) => {
      if (!formData.presentAddress[field]) {
        newErrors[`presentAddress.${field}`] = `${field} is required`;
      }
      if (!formData.permanentAddress[field]) {
        newErrors[`permanentAddress.${field}`] = `${field} is required`;
      }
    });

    formData.emergencyContacts.forEach((contact, index) => {
      if (!contact.name)
        newErrors[`emergencyContact${index}Name`] = "Name is required";
      if (!contact.relation)
        newErrors[`emergencyContact${index}Relation`] = "Relation is required";
      if (!contact.contactNumber)
        newErrors[`emergencyContact${index}ContactNumber`] =
          "Contact number is required";
    });

    if (!formData.uniqueId.country)
      newErrors.uniqueIdCountry = "Country is required";
    if (!formData.uniqueId.number)
      newErrors.uniqueIdNumber = "ID number is required";

    return newErrors;
  };
const handleSendOtp = async (type) => {
  if (type === 'email' && !formData.email) {
    setErrors(prev => ({ ...prev, email: 'Please enter email first' }));
    return;
  }
  if (type === 'phone' && !formData.phoneNumber) {
    setErrors(prev => ({ ...prev, phoneNumber: 'Please enter phone number first' }));
    return;
  }

  try {
    setOtpState(prev => ({
      ...prev,
      [`sending${type.charAt(0).toUpperCase() + type.slice(1)}Otp`]: true
    }));

    const response = await api.post('/api/auth/send-otp', {
      type: type,
      ...(type === 'email' ? { email: formData.email } : { phone: formData.phoneNumber })
    });

    setOtpState(prev => ({
      ...prev,
      [`is${type.charAt(0).toUpperCase() + type.slice(1)}OtpSent`]: true,
      [`sending${type.charAt(0).toUpperCase() + type.slice(1)}Otp`]: false,
      otpMessage: response.data.message || `OTP sent to your ${type}`
    }));

  } catch (error) {
    console.error('OTP Error:', error);
    setOtpState(prev => ({
      ...prev,
      [`sending${type.charAt(0).toUpperCase() + type.slice(1)}Otp`]: false,
      otpError: error.response?.data?.message || `Failed to send ${type} OTP`
    }));
  }
};
const handleVerifyOtp = async (type) => {
  const otpValue = type === 'email' ? otpState.emailOtp : otpState.phoneOtp;
  
  if (!otpValue) {
    setOtpState(prev => ({
      ...prev,
      otpError: `Please enter ${type} OTP`
    }));
    return;
  }

  try {
    const endpoint = type === 'email' ? '/api/auth/email/verify-otp' : '/api/auth/phone/verify-otp';
    const data = type === 'email'
      ? { email: formData.email, otp: otpValue }
      : { phone: formData.phoneNumber, otp: otpValue };

    setOtpState(prev => ({
      ...prev,
      [`verifying${type.charAt(0).toUpperCase() + type.slice(1)}Otp`]: true
    }));

    await axios.post(endpoint, data);

    setOtpState(prev => ({
      ...prev,
      [`is${type.charAt(0).toUpperCase() + type.slice(1)}Verified`]: true,
      [`is${type.charAt(0).toUpperCase() + type.slice(1)}OtpSent`]: false,
      [`verifying${type.charAt(0).toUpperCase() + type.slice(1)}Otp`]: false,
      otpMessage: `${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully`
    }));

  } catch (error) {
    setOtpState(prev => ({
      ...prev,
      [`verifying${type.charAt(0).toUpperCase() + type.slice(1)}Otp`]: false,
      otpError: error.response?.data?.message || `Invalid ${type} OTP`
    }));
  }
};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const newErrors = validateForm();

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setIsLoading(true);

  //   //const uniqueCode = generateUniqueCode();
  //   //setGeneratedCode(uniqueCode);
  //   try {
  //     // Create FormData to handle file uploads
  //     const response = await registerUser(formData);
      
  //     // Append all form fields
  //     Object.keys(formData).forEach(key => {
  //       if (key === 'profileImage' || key === 'documentFile') {
  //         if (formData[key]) {
  //           formData.append(key, formData[key]);
  //         }
  //       } else if (typeof formData[key] === 'object') {
  //         formData.append(key, JSON.stringify(formData[key]));
  //       } else {
  //         formData.append(key, formData[key]);
  //       }
  //     });

  //     const { data } = await auth.signup(formData);
      
  //     setUser(data.user);
  //     setCurrentPage('home');
  //   } catch (err) {
  //     setErrors({
  //       submit: err.response?.data?.message || 'Registration failed'
  //     });
  //   } finally {
  //     setIsLoading(false); 
  //   }
  //   setTimeout(() => {
  //     const userData = {
  //       ...formData,
  //       uniqueCode,
  //       profileImageUrl: formData.profileImage
  //         ? `/uploads/${formData.profileImage.name}`
  //         : null,
  //       documentFileUrl: formData.documentFile
  //         ? `/uploads/${formData.documentFile.name}`
  //         : null,
  //     };

  //     console.log("Registration data:", userData);
  //     setUser({ name: formData.fullName, email: formData.email });
  //     setIsLoading(false);
  //     alert(`Registration successful! Your unique code is: ${uniqueCode}`);
  //     setCurrentPage("home");
  //   }, 2000);
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // Check if OTP verification is complete
  if (!otpState.isEmailVerified || !otpState.isPhoneVerified) {
    setErrors({
      submit: 'Please verify both email and phone number before proceeding'
    });
    return;
  }

  setIsLoading(true);

  try {
    // Create FormData for file uploads
    const formDataToSend = new FormData();

    // Append basic info
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('dob', formData.dob);
    formDataToSend.append('sex', formData.sex);
    formDataToSend.append('maritalStatus', formData.maritalStatus);

    // Append addresses as JSON strings
    formDataToSend.append('presentAddress', JSON.stringify(formData.presentAddress));
    formDataToSend.append('permanentAddress', JSON.stringify(formData.permanentAddress));

    // Append other object data
    formDataToSend.append('guardianInfo', JSON.stringify({
      name: formData.guardianName,
      relation: formData.guardianRelation
    }));
    formDataToSend.append('uniqueId', JSON.stringify(formData.uniqueId));
    formDataToSend.append('emergencyContacts', JSON.stringify(formData.emergencyContacts));

    // Append other fields
    formDataToSend.append('occupation', formData.occupation);
    formDataToSend.append('educationLevel', formData.educationLevel);
    formDataToSend.append('documentType', formData.documentType);

    // Append files if they exist
    if (formData.profileImage) {
      formDataToSend.append('profileImage', formData.profileImage);
    }
    if (formData.documentFile) {
      formDataToSend.append('documentFile', formData.documentFile);
    }

    // Register user
    const response = await registerUser(formDataToSend);

    // Extract unique ID from response
    const { uniqueId, message } = response.data;

    // Show success message with unique ID
    alert(`Registration successful! Your unique ID is: ${uniqueId}`);
    setGeneratedCode(uniqueId);

    // Set user data and navigate
    setUser({ 
      name: formData.fullName, 
      email: formData.email,
      uniqueId: uniqueId 
    });

    // Navigate to home page after delay
    setTimeout(() => {
      setCurrentPage("home");
    }, 2000);

  } catch (err) {
    setErrors({
      submit: err.response?.data?.message || 'Registration failed'
    });
    console.error('Registration error:', err);
  } finally {
    setIsLoading(false);
  }
};
  React.useEffect(() => {
    copyPresentToPermanent();
  }, [sameAsPermanent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-600 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart size={48} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold">Jagmitra Care Registration</h1>
            <p className="text-red-100 mt-2">
              Complete your comprehensive profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Section 1: Account Credentials */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="mr-3 text-red-600" />
                Account Credentials
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
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password *
                  </label>
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
                    className="absolute top-10 right-0 px-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="useBiometric"
                    checked={formData.useBiometric}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        useBiometric: e.target.checked,
                      }))
                    }
                    className="mr-2 h-4 w-4 text-red-600"
                  />
                  <label className="text-gray-700 text-sm">
                    Enable Biometric Authentication (Fingerprint)
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Personal Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="mr-3 text-red-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Sex *
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select sex</option>
                    {sexOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.sex && (
                    <p className="text-red-500 text-sm mt-1">{errors.sex}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Marital Status *
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select status</option>
                    {maritalStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.maritalStatus && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.maritalStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Guardian & Professional Details */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Users className="mr-3 text-red-600" />
                    Guardian Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Guardian Name *
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        placeholder="Enter guardian's name"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      {errors.guardianName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guardianName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Guardian Relation *
                      </label>
                      <input
                        type="text"
                        name="guardianRelation"
                        value={formData.guardianRelation}
                        onChange={handleChange}
                        placeholder="e.g., Father, Mother"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      {errors.guardianRelation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guardianRelation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Briefcase className="mr-3 text-red-600" />
                    Professional & Education
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Occupation *
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="Enter your occupation"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      {errors.occupation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.occupation}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Highest Education Level *
                      </label>
                      <select
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      >
                        <option value="">Select education level</option>
                        {educationLevels.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.educationLevel && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.educationLevel}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Address Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MapPin className="mr-3 text-red-600" />
                Address Details
              </h2>
              {/* Present Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Present Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      House No *
                    </label>
                    <input
                      type="text"
                      name="presentAddress.houseNo"
                      value={formData.presentAddress.houseNo}
                      onChange={handleChange}
                      placeholder="House number"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      VPO
                    </label>
                    <input
                      type="text"
                      name="presentAddress.vpo"
                      value={formData.presentAddress.vpo}
                      onChange={handleChange}
                      placeholder="Village/Post Office"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Block
                    </label>
                    <input
                      type="text"
                      name="presentAddress.block"
                      value={formData.presentAddress.block}
                      onChange={handleChange}
                      placeholder="Block"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="presentAddress.district"
                      value={formData.presentAddress.district}
                      onChange={handleChange}
                      placeholder="District"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="presentAddress.state"
                      value={formData.presentAddress.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Country *
                    </label>
                    <select
                      name="presentAddress.country"
                      value={formData.presentAddress.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    >
                      <option value="">Select country</option>
                      {Object.keys(countries).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="presentAddress.pincode"
                      value={formData.presentAddress.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              {/* Permanent Address */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Permanent Address
                  </h3>
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={sameAsPermanent}
                      onChange={(e) => setSameAsPermanent(e.target.checked)}
                      className="mr-2 h-4 w-4 text-red-600"
                    />
                    Same as present address
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      House No *
                    </label>
                    <input
                      type="text"
                      name="permanentAddress.houseNo"
                      value={formData.permanentAddress.houseNo}
                      onChange={handleChange}
                      placeholder="House number"
                      disabled={sameAsPermanent}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      VPO
                    </label>
                    <input
                      type="text"
                      name="permanentAddress.vpo"
                      value={formData.permanentAddress.vpo}
                      onChange={handleChange}
                      placeholder="Village/Post Office"
                      disabled={sameAsPermanent}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Block
                    </label>
                    <input
                      type="text"
                      name="permanentAddress.block"
                      value={formData.permanentAddress.block}
                      onChange={handleChange}
                      placeholder="Block"
                      disabled={sameAsPermanent}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="permanentAddress.district"
                      value={formData.permanentAddress.district}
                      onChange={handleChange}
                      placeholder="District"
                      disabled={sameAsPermanent}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="permanentAddress.state"
                      value={formData.permanentAddress.state}
                      onChange={handleChange}
                      placeholder="State"
                      disabled={sameAsPermanent}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Country *
                    </label>
                    <select
                      name="permanentAddress.country"
                      value={formData.permanentAddress.country}
                      onChange={handleChange}
                      disabled={sameAsPermanent}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:bg-gray-100"
                    >
                      <option value="">Select country</option>
                      {Object.keys(countries).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="permanentAddress.pincode"
                      value={formData.permanentAddress.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      disabled={sameAsPermanent}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Identification & Documents */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-red-600" />
                Identification & Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    ID Country *
                  </label>
                  <select
                    value={formData.uniqueId.country}
                    onChange={(e) =>
                      handleUniqueIdChange("country", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select country</option>
                    {Object.keys(countries).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.uniqueIdCountry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.uniqueIdCountry}
                    </p>
                  )}
                </div>
                {formData.uniqueId.country && (
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      {countries[formData.uniqueId.country]?.idType} *
                    </label>
                    <input
                      type="text"
                      value={formData.uniqueId.number}
                      onChange={(e) =>
                        handleUniqueIdChange("number", e.target.value)
                      }
                      placeholder={`Enter ${
                        countries[formData.uniqueId.country]?.idType
                      }`}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Format: {countries[formData.uniqueId.country]?.format}
                    </p>
                    {errors.uniqueIdNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.uniqueIdNumber}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Type of Document to Add *
                  </label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.documentType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.documentType}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Upload Document File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400">
                    <FileText
                      className="mx-auto mb-2 text-gray-400"
                      size={28}
                    />
                    <input
                      type="file"
                      accept=".pdf,.jpeg,.jpg,.png"
                      onChange={(e) => handleFileChange(e, "documentFile")}
                      className="hidden"
                      id="documentFile"
                    />
                    <label
                      htmlFor="documentFile"
                      className="cursor-pointer text-sm"
                    >
                      <span className="text-red-600 hover:text-red-700">
                        Choose file
                      </span>
                      <span className="text-gray-500"> or drag & drop</span>
                    </label>
                    {formData.documentFile && (
                      <p className="text-green-600 text-sm mt-2">
                        {formData.documentFile.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Profile Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-400">
                    <Camera className="mx-auto mb-2 text-gray-400" size={28} />
                    <input
                      type="file"
                      accept=".jpeg,.jpg,.png"
                      onChange={(e) => handleFileChange(e, "profileImage")}
                      className="hidden"
                      id="profileImage"
                    />
                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer text-sm"
                    >
                      <span className="text-red-600 hover:text-red-700">
                        Choose file
                      </span>
                      <span className="text-gray-500"> or drag & drop</span>
                    </label>
                    {formData.profileImage && (
                      <p className="text-green-600 text-sm mt-2">
                        {formData.profileImage.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Emergency Contacts */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Phone className="mr-3 text-red-600" />
                Emergency Contacts
              </h2>
              {formData.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 border-2 border-gray-200 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Contact {index + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Contact name"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Relation *
                      </label>
                      <input
                        type="text"
                        value={contact.relation}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "relation",
                            e.target.value
                          )
                        }
                        placeholder="Relation"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        value={contact.contactNumber}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            index,
                            "contactNumber",
                            e.target.value
                          )
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                  required
                />
                <span className="ml-3 text-gray-600 text-sm">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    Privacy Policy
                  </a>
                  . I confirm that all information provided is accurate and
                  complete.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-3" size={24} />
                    Complete Registration
                  </>
                )}
              </button>
            </div>

            {/* Generated Code Display */}
            {generatedCode && (
              <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Registration Successful!
                </h3>
                <p className="text-green-700 mb-3">
                  Your unique identification code:
                </p>
                <div className="bg-white p-4 rounded-lg border-2 border-green-300 inline-block">
                  <code className="text-2xl font-mono text-green-800 font-bold">
                    {generatedCode}
                  </code>
                </div>
                <p className="text-green-600 text-sm mt-3">
                  Please save this code for future reference
                </p>
              </div>
            )}
          </form>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setCurrentPage("login")}
                className="text-red-600 hover:text-red-700 font-medium underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
