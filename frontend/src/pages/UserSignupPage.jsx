import React, { useState } from "react";
import axios from 'axios';
// import { useNavigate } from "react-router-dom"; // Commented out for compatibility in all environments
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
  Loader2, // Added for loading spinners
  AlertCircle, // Added for error messages
} from "lucide-react";

const RegistrationPage = ({ setUser }) => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
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
    uniqueId: { country: "", type: "", number: "" },
    documentType: "",
    profileImage: null,
    documentFile: null,
    useBiometric: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

 // Add this to your state declarations
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
  const isSubmitDisabled =
    isLoading || !otpState.isEmailVerified || !otpState.isPhoneVerified;

  // --- Complete Country List (Preserved as provided) ---
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

  // Using the single, corrected handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpState((prev) => ({ ...prev, [name]: value, otpError: "" }));
  };

 const handleEmergencyContactChange = (index, field, value) => {
  const updatedContacts = [...formData.emergencyContacts];
  
  if (field === "contactNumber") {
    // Only keep digits
    value = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (value && !value.startsWith('+')) {
      value = `+${value}`;
    }
    
    // Add validation hint if needed
    if (value.length > 1 && value.replace('+', '').length < 6) {
      setErrors(prev => ({
        ...prev,
        [`emergencyContact${index}`]: "Contact number must have at least 6 digits after +"
      }));
    } else {
      // Clear the error if it's valid now
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[`emergencyContact${index}`];
        return newErrors;
      });
    }
  }
  
  updatedContacts[index][field] = value;
  setFormData((prev) => ({ ...prev, emergencyContacts: updatedContacts }));
};

  const handleUniqueIdChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      uniqueId: {
        ...prev.uniqueId ,
        [field]: value,
        ...(field === "country" && { type: countries[value]?.idType || "" }),
      },
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
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
      // Using the endpoint that works in Postman
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
    if (!/^\d{10,15}$/.test(formData.mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter a valid 10 to 15-digit mobile number first.",
      }));
      return;
    }
    setOtpState((prev) => ({ ...prev, sendingPhoneOtp: true }));
    
    try {
      // Using the endpoint that works in Postman
      const response = await axios.post('/api/auth/send-otp', {
        mobile: `+91${formData.mobile}`,
        type: 'USER_REGISTRATION'
      });
      
      setOtpState((prev) => ({
        ...prev,
        sendingPhoneOtp: false,
        isPhoneOtpSent: true,
        otpMessage: response.data.message || `An OTP has been sent to ${formData.mobile}.`
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
        otpMessage: response.data.message || "Email verified successfully!",
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
        mobile: `+91${formData.mobile}`,
        otp: otpState.phoneOtp,
        type: 'USER_REGISTRATION'
      });
      
      setOtpState((prev) => ({
        ...prev,
        verifyingPhoneOtp: false,
        isPhoneVerified: true,
        isPhoneOtpSent: false,
        otpMessage: response.data.message || "Phone number verified successfully!",
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
  
  // Validate required fields based on your User.js model
  if (!formData.name) newErrors.name = "Name is required";
  if (!/\S+@\S+\.\S+/.test(formData.email))
    newErrors.email = "A valid email is required";
  if (!formData.mobile)
    newErrors.mobile = "Mobile number is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData.dob) newErrors.dob = "Date of birth is required";
  if (!formData.sex) newErrors.sex = "Sex is required";
  
  // Check for required address fields
  if (!formData.presentAddress.houseNo) 
    newErrors.presentAddressHouseNo = "House number is required";
  if (!formData.presentAddress.district)
    newErrors.presentAddressDistrict = "District is required";
  if (!formData.presentAddress.state)
    newErrors.presentAddressState = "State is required";
  if (!formData.presentAddress.country)
    newErrors.presentAddressCountry = "Country is required";
  if (!formData.presentAddress.pincode)
    newErrors.presentAddressPincode = "Pincode is required";
  
  // Validate 3 emergency contacts
  if (formData.emergencyContacts.length !== 3) {
    newErrors.emergencyContacts = "You must provide exactly 3 emergency contacts";
  }
  
  // Check for verification
  if (!otpState.isEmailVerified)
    newErrors.email = "Please verify your email address.";
  if (!otpState.isPhoneVerified)
    newErrors.mobile = "Please verify your mobile number.";
  
  return newErrors;
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
  //   // setTimeout(() => {
  //   //   const userData = { ...formData };
  //   //   console.log("Registration data:", userData);
  //   //   if (setUser) setUser({ name: formData.fullName, email: formData.email });
  //   //   setIsLoading(false);
  //   //   // navigate("/"); // Commented out for compatibility
  //   // }, 2000);
    
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  setIsLoading(true);
  
  try {
    const formDataToSend = new FormData();
    
    // Fix field names to match your backend model
    formDataToSend.append('name', formData.name); // This is correct
    formDataToSend.append('email', formData.email); // This is correct
    formDataToSend.append('mobile', `+91${formData.mobile}`); // This is correct
    formDataToSend.append('password', formData.password); // This is correct
    formDataToSend.append('dob', formData.dob); // This is correct
    formDataToSend.append('sex', formData.sex); // This is correct
    formDataToSend.append('maritalStatus', formData.maritalStatus); // This is correct
    
    // These are correct
    formDataToSend.append('guardianName', formData.guardianName);
    formDataToSend.append('guardianRelation', formData.guardianRelation);
    
    // Append addresses as JSON strings
    formDataToSend.append('presentAddress', JSON.stringify(formData.presentAddress));
    formDataToSend.append('permanentAddress', JSON.stringify(formData.permanentAddress));
    
    // Append other fields
    formDataToSend.append('occupation', formData.occupation);
    formDataToSend.append('educationLevel', formData.educationLevel);
    formDataToSend.append('emergencyContacts', JSON.stringify(formData.emergencyContacts));
    formDataToSend.append('uniqueId', JSON.stringify(formData.uniqueId));
    formDataToSend.append('useBiometric', formData.useBiometric);
    
    // For file uploads - match your backend model naming
    if (formData.profileImage) {
      formDataToSend.append('profileImage', formData.profileImage); // This is correct
    }
    
    if (formData.documentFile) {
      // Change this to match backend model
      formDataToSend.append('documentFile', formData.documentFile);
    }
    
    // Call registration API with correct endpoint
    const response = await axios.post('/api/signup', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("Complete API response:", response.data);
    // Get unique code from response - make sure backend returns uniqueCode
    const uniqueCode = response.data.uniqueCode || response.data.Id;
    setGeneratedCode(uniqueCode);
    
    alert(`Registration successful! Your unique ID is: ${uniqueCode}`);
    
    setTimeout(() => {
      if (setUser) {
        setUser({ 
          name: formData.name,
          email: formData.email,
          uniqueCode: uniqueCode
        });
      }
      // navigate("/");
    }, 2000);
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.response && error.response.data) {
      console.log('Error details:', error.response.data);
      setErrors({
        submit: error.response.data.message || 'Registration failed. Please try again.'
      });
    } else {
      setErrors({
        submit: 'Registration failed. Please try again.'
      });
    }
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
            <h1 className="text-4xl font-bold">A3 Health Card Registration</h1>
            <p className="text-red-100 mt-2">
              Complete your comprehensive profile
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Shield className="mr-3 text-red-600" /> Account Credentials &
                Verification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-lg border-2 ${
                      errors.name? "border-red-500" : "border-gray-300"
                    } focus:border-red-500 focus:outline-none`}
                  />
                  {errors.name&& (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name}
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
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      readOnly={
                        otpState.isPhoneVerified || otpState.isPhoneOtpSent
                      }
                      className={`flex-grow px-4 py-3 rounded-lg border-2 ${
                        errors.mobile
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
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobile}
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
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="mr-3 text-red-600" /> Personal Information
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
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <Users className="mr-3 text-red-600" /> Guardian Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Guardian Name*
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
                    <Briefcase className="mr-3 text-red-600" /> Professional &
                    Education
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
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MapPin className="mr-3 text-red-600" /> Address Details
              </h2>
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
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-red-600" /> Identification &
                Documents
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
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Phone className="mr-3 text-red-600" /> Emergency Contacts
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
            <div className="mb-8">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
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
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6 mr-3" />{" "}
                    Processing...
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
          <div className="bg-gray-50 px-8 py-4 text-center border-t">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => alert("Navigate to login page")}
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
