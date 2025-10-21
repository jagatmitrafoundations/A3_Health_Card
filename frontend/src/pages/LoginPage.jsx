import React, { useState } from 'react';
import { auth } from '../services/api';
import { Eye, EyeOff, User, Fingerprint, Smartphone, Key, Shield } from 'lucide-react';

const LoginPage = ({ setCurrentPage, setUser }) => {
  const [formData, setFormData] = useState({
    uniqueCode: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'biometric'
  const [biometricType, setBiometricType] = useState(''); // 'fingerprint' or 'face'
   
  const handleChange = (e) => {
    let value = e.target.value;
    
    // Format unique code input with dashes
    if (e.target.name === 'uniqueCode') {
      // Remove all non-alphanumeric characters
      value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      
      // Add dashes at appropriate positions (XXX-XXXXXXXX-XXXXXX)
      if (value.length > 3 && value.length <= 11) {
        value = value.substring(0, 3) + '-' + value.substring(3);
      } else if (value.length > 11) {
        value = value.substring(0, 3) + '-' + value.substring(3, 11) + '-' + value.substring(11, 17);
      }
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.uniqueCode) {
      newErrors.uniqueCode = '16-digit unique code is required';
    } else {
      const cleanCode = formData.uniqueCode.replace(/[^A-Za-z0-9]/g, '');
      if (cleanCode.length !== 16) {
        newErrors.uniqueCode = 'Unique code must be exactly 16 characters';
      }
    }
    
    if (loginMethod === 'password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    return newErrors;
  };

  const handleBiometricAuth = async (type) => {
    setBiometricType(type);
    setIsLoading(true);
    
    // Simulate biometric authentication
    setTimeout(() => {
      // Mock successful biometric authentication
      setUser({
        name: 'John Doe',
        email: 'user@example.com',
        uniqueCode: formData.uniqueCode
      });
      setIsLoading(false);
      setCurrentPage('home');
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
    
    // Simulate API call
    // setTimeout(() => {
    //   // Mock successful login
    //   setUser({
    //     name: 'John Doe',
    //     email: 'user@example.com',
    //     uniqueCode: formData.uniqueCode
    //   });
    //   setIsLoading(false);
    //   setCurrentPage('home');
    // }, 1500);
    try {
      // First send OTP
      await auth.sendOtp({ 
        email: formData.uniqueCode.includes('@') ? formData.uniqueCode : null,
        mobile: !formData.uniqueCode.includes('@') ? formData.uniqueCode : null 
      });

      // Then verify OTP with password
      const { data } = await auth.verifyOtp({
        email: formData.uniqueCode.includes('@') ? formData.uniqueCode : null,
        mobile: !formData.uniqueCode.includes('@') ? formData.uniqueCode : null,
        otp: formData.password
      });

      setUser(data.user);
      setCurrentPage('home');
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || 'Login failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 text-white p-3 rounded-full">
                <Shield size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your Jagmitra Care account</p>
          </div>

          <div className="space-y-6">
            {/* Unique Code Input */}
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
                  maxLength="18" // Including dashes
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-center text-lg tracking-wider ${
                    errors.uniqueCode ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
                  }`}
                  placeholder="XXX-XXXXXXXX-XXXXXX"
                />
                <Key className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
              {errors.uniqueCode && <p className="text-red-500 text-sm mt-1">{errors.uniqueCode}</p>}
              <p className="text-gray-500 text-xs mt-1">
                Enter the 16-digit code you received during registration
              </p>
            </div>

            {/* Authentication Method Selector */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Choose Authentication Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    loginMethod === 'password'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 text-gray-600 hover:border-red-300'
                  }`}
                >
                  <Key size={20} className="mx-auto mb-1" />
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('biometric')}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    loginMethod === 'biometric'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 text-gray-600 hover:border-red-300'
                  }`}
                >
                  <Fingerprint size={20} className="mx-auto mb-1" />
                  Biometric
                </button>
              </div>
            </div>

            {/* Password Input (shown only if password method selected) */}
            {loginMethod === 'password' && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 pr-12 ${
                      errors.password ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
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
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            )}

            {/* Biometric Options (shown only if biometric method selected) */}
            {loginMethod === 'biometric' && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-gray-600 text-sm mb-4">Choose your biometric authentication:</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleBiometricAuth('fingerprint')}
                      disabled={isLoading}
                      className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 hover:border-red-400 transition-all hover:bg-red-50 disabled:opacity-50"
                    >
                      <Fingerprint size={32} className="text-red-600 mb-2" />
                      <span className="text-sm font-medium text-gray-700">Fingerprint</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleBiometricAuth('face')}
                      disabled={isLoading}
                      className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-300 hover:border-red-400 transition-all hover:bg-red-50 disabled:opacity-50"
                    >
                      <Smartphone size={32} className="text-red-600 mb-2" />
                      <span className="text-sm font-medium text-gray-700">Face ID</span>
                    </button>
                  </div>
                  
                  {isLoading && biometricType && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-blue-700 text-sm">
                          {biometricType === 'fingerprint' ? 'Place your finger on the sensor...' : 'Look at the camera...'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Remember Me and Forgot Options */}
            {loginMethod === 'password' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="text-red-600 focus:ring-red-500" />
                  <span className="ml-2 text-gray-600 text-sm">Remember me</span>
                </label>
                <a href="#" className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button (only for password method) */}
            {loginMethod === 'password' && (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            )}
          </div>

          {/* Alternative Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-red-600 hover:text-red-700 text-sm font-medium mr-4"
              >
                Create Account
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => alert('Contact support: support@jagmitracare.com')}
                className="text-red-600 hover:text-red-700 text-sm font-medium ml-4"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have your unique code?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;