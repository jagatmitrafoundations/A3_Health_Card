import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import Components
import Header from "./components/Header";

// Import Pages
import HomePage from "./pages/HomePage";
import UnifiedLoginPage from "./pages/UnifiedLoginPage";
import ProfilePage from "./pages/ProfilePage";
import CommonVerificationPage from "./pages/CommonVerificationPage";

// --- Import Signup Pages ---
import UserSignupPage from "./pages/UserSignupPage";
import AdminSignupPage from "./pages/AdminSignup";
import DoctorSignupPage from "./pages/DoctorSignup";
import HealthAuthoritySignUpPage from "./pages/HealthAuthoritySignUp";
import HospitalSignupPage from "./pages/HospitalSignupPage";
import InsuranceCompanySignupPage from "./pages/InsuranceCompanySignup";
import MNCSignupPage from "./pages/MNCSignup";
import PharmacySignupPage from "./pages/PharmacySignupPage";
import SuperAdminSignupPage from "./pages/SuperAdminSignUp";

// Placeholder pages for navigation
const AboutPage = () => (
  <div className="pt-24 h-screen flex items-center justify-center text-2xl font-bold">
    About Us Page
  </div>
);
const ServicesPage = () => (
  <div className="pt-24 h-screen flex items-center justify-center text-2xl font-bold">
    Our Services Page
  </div>
);
const ContactPage = () => (
  <div className="pt-24 h-screen flex items-center justify-center text-2xl font-bold">
    Contact Us Page
  </div>
);

// A Protected Route component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        const foundUser = JSON.parse(loggedInUser);
        setUser(foundUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      <Header user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/login"
            element={<UnifiedLoginPage setUser={setUser} />}
          />
          <Route
            path="/verify"
            element={<CommonVerificationPage setUser={setUser} />}
          />

          {/* Main Profile Route which will handle rendering specific profiles */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userType"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage user={user} />
              </ProtectedRoute>
            }
          />

          {/* Signup Routes */}
          <Route
            path="/signup/user"
            element={<UserSignupPage setUser={setUser} />}
          />
          <Route path="/signup/admin" element={<AdminSignupPage />} />
          <Route path="/signup/doctor" element={<DoctorSignupPage />} />
          <Route
            path="/signup/healthauthority"
            element={<HealthAuthoritySignUpPage />}
          />
          <Route path="/signup/hospital" element={<HospitalSignupPage />} />
          <Route
            path="/signup/insurancecompany"
            element={<InsuranceCompanySignupPage />}
          />
          <Route path="/signup/mnc" element={<MNCSignupPage />} />
          <Route path="/signup/pharmacy" element={<PharmacySignupPage />} />
          <Route path="/signup/superadmin" element={<SuperAdminSignupPage />} />

          {/* Static Page Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
