import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/api";
import {
  User,
  LogIn,
  Key,
  Smartphone,
  Fingerprint,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

const UnifiedLoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ uniqueCode: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password");
  const [biometricType, setBiometricType] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "uniqueCode") {
      value = value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
    }
    setFormData({ ...formData, [name]: value });
    if (errors[name] || errors.form) {
      setErrors({ ...errors, [name]: "", form: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.uniqueCode) {
      newErrors.uniqueCode = "16-digit unique code is required";
    }
    if (loginMethod === "password") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    }
    return newErrors;
  };

  const handleBiometricAuth = async (type) => {
    setBiometricType(type);
    setIsLoading(true);
    setTimeout(() => {
      // This is a placeholder for a real biometric implementation
      const mockUser = {
        name: "Biometric User",
        uniqueCode: formData.uniqueCode,
        userType: "user",
      };
      if (setUser) setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setIsLoading(false);
      alert("Biometric login successful! Navigating to your profile...");
      navigate("/profile");
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await auth.unifiedLogin({
        uniqueCode: formData.uniqueCode.replace(/-/g, "").trim(),
        password: formData.password.trim(),
      });

      if (response.data.success) {
        console.log("Credentials validated, navigating to verification page.");
        // Navigate to the verification page, passing user identifiers via state
        navigate("/verify", { state: { userData: response.data.userData } });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials or server error.";
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl">
          <div className="text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 text-white p-3 rounded-full">
                <Shield size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Sign in to your A3 Health Card account
            </p>
          </div>
          <div className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  16-Digit Unique Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="uniqueCode"
                    value={formData.uniqueCode}
                    onChange={handleChange}
                    maxLength="20"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-center text-lg tracking-wider ${
                      errors.uniqueCode
                        ? "border-red-500"
                        : "border-gray-300 focus:border-red-500"
                    }`}
                    placeholder="Enter your Unique Code"
                  />
                  <Key
                    className="absolute right-3 top-3 text-gray-400"
                    size={20}
                  />
                </div>
                {errors.uniqueCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.uniqueCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-3">
                  Choose Authentication Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLoginMethod("password")}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      loginMethod === "password"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 text-gray-600 hover:border-red-300"
                    }`}
                  >
                    <Key size={20} className="mx-auto mb-1" />
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod("biometric")}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      loginMethod === "biometric"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 text-gray-600 hover:border-red-300"
                    }`}
                  >
                    <Fingerprint size={20} className="mx-auto mb-1" />
                    Biometric
                  </button>
                </div>
              </div>
              {loginMethod === "password" && (
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 pr-12 ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 focus:border-red-500"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
              )}
              {loginMethod === "biometric" && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-gray-600 text-sm mb-4">
                      Choose your biometric authentication:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleBiometricAuth("fingerprint")}
                        disabled={isLoading}
                        className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 hover:border-red-400 transition-all hover:bg-red-50 disabled:opacity-50"
                      >
                        <Fingerprint size={32} className="text-red-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Fingerprint
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBiometricAuth("face")}
                        disabled={isLoading}
                        className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 hover:border-red-400 transition-all hover:bg-red-50 disabled:opacity-50"
                      >
                        <Smartphone size={32} className="text-red-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Face ID
                        </span>
                      </button>
                    </div>
                    {isLoading && biometricType && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-blue-700 text-sm">
                            {biometricType === "fingerprint"
                              ? "Place your finger on the sensor..."
                              : "Look at the camera..."}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {errors.form && (
                <div className="text-center text-red-600 bg-red-100 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                  <AlertCircle size={18} /> {errors.form}
                </div>
              )}
              {loginMethod === "password" && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Validating...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              )}
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Need help?
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/signup/user")}
                  className="text-red-600 hover:text-red-700 text-sm font-medium mr-4"
                >
                  Create Account
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() =>
                    alert("Contact support: support@jagmitracare.com")
                  }
                  className="text-red-600 hover:text-red-700 text-sm font-medium ml-4"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
