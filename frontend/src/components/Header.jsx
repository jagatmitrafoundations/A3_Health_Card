import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, UserPlus, LogIn } from "lucide-react";

// AnimatedA3Logo component remains unchanged...
const AnimatedA3Logo = ({ width = 200, height = 60, isMobile = false }) => {
  return (
    <div
      className={`flex items-center cursor-pointer group ${
        isMobile ? "space-x-0" : "space-x-4"
      }`}
    >
      <div className="transform hover:scale-105 transition-transform duration-300">
        <svg
          width={width}
          height={height}
          viewBox="0 0 800 400"
          className="drop-shadow-lg"
        >
          <defs>
            {/* Shadow filter */}
            <filter
              id="dropshadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="2"
                floodColor="#00000020"
              />
            </filter>

            {/* ECG glow effect */}
            <filter id="ecgGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Heart shape with shadow */}
          <path
            d="M 120 100 
               C 120 60, 160 40, 200 80
               C 240 40, 280 60, 280 100
               C 280 140, 200 200, 200 240
               C 200 200, 120 140, 120 100 Z"
            fill="none"
            stroke="#dc2626"
            strokeWidth="6"
            filter="url(#dropshadow)"
          />

          {/* Static ECG line base */}
          <line
            x1="80"
            y1="160"
            x2="720"
            y2="160"
            stroke="#dc2626"
            strokeWidth="4"
            filter="url(#dropshadow)"
          />

          {/* Animated ECG heartbeat pattern - MARQUEE STYLE */}
          <g filter="url(#ecgGlow)">
            {/* Main ECG pattern that moves from left to right, then restarts */}
            <path
              d="M 80 160 
                 L 120 160
                 L 130 150
                 L 140 170
                 L 150 120
                 L 160 200
                 L 170 160
                 L 200 160
                 L 210 158
                 L 220 162
                 L 230 160
                 L 280 160
                 L 290 155
                 L 300 165
                 L 310 140
                 L 320 180
                 L 330 160
                 L 380 160
                 L 390 158
                 L 400 162
                 L 410 160
                 L 480 160
                 L 490 150
                 L 500 170
                 L 510 130
                 L 520 190
                 L 530 160
                 L 580 160
                 L 590 158
                 L 600 162
                 L 610 160
                 L 720 160"
              fill="none"
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            >
              {/* Marquee animation: start invisible, appear, move across, disappear, restart */}
              <animate
                attributeName="opacity"
                values="0;1;1;1;0"
                dur="4s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-200,0; 0,0; 0,0; 200,0; 400,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>

            {/* Second ECG pattern with delay */}
            <path
              d="M 80 160 
                 L 100 160
                 L 105 155
                 L 110 165
                 L 115 145
                 L 120 175
                 L 125 160
                 L 150 160"
              fill="none"
              stroke="#dc2626"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-100,0; 0,0; 600,0; 700,0"
                dur="3s"
                begin="1s"
                repeatCount="indefinite"
              />
            </path>

            {/* Pulsing dot that appears periodically */}
            <circle cx="400" cy="160" r="3" fill="#dc2626" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="0.5s"
                begin="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="3;5;3"
                dur="0.5s"
                begin="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* A3 Text */}
          <text
            x="580"
            y="200"
            fontFamily="Arial, sans-serif"
            fontSize="160"
            fontWeight="bold"
            fill="#dc2626"
            filter="url(#dropshadow)"
          >
            A3
          </text>

          {/* Health card text */}
          <text
            x="480"
            y="300"
            fontFamily="Arial, sans-serif"
            fontSize="92"
            fontWeight="bold"
            fill="#000000"
          >
            Health card
          </text>
        </svg>
      </div>

      {/* Only show text on desktop */}
      {!isMobile && (
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            A3 Health Card
          </h1>
          <p className="text-xs text-gray-500 font-medium flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Healthcare & Wellness</span>
          </p>
        </div>
      )}
    </div>
  );
};

const Header = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // <-- ADD THIS LINE
    setIsMenuOpen(false);
    navigate("/");
  };

  const userTypes = [
    { name: "User", slug: "user" },
    { name: "Hospital", slug: "hospital" },
    { name: "Doctor", slug: "doctor" },
    { name: "MNC", slug: "mnc" },
    { name: "Pharmacy", slug: "pharmacy" },
    { name: "Admin", slug: "admin" },
    { name: "Superadmin", slug: "superadmin" },
    { name: "Health Authority", slug: "healthauthority" },
    { name: "Insurance Company", slug: "insurancecompany" },
  ];

  const navigationItems = [
    { name: "Home", path: "/" },
    // ADDED PROFILE LINK WHEN USER IS LOGGED IN
    ...(user ? [{ name: "Profile", path: "/profile" }] : []),
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavigation = (type) => {
    if (!selectedUserType) return;
    const path = `/${type}/${selectedUserType}`;
    navigate(path);
    setDropdownOpen(null);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-2xl border-b border-red-100"
          : "bg-white/95 backdrop-blur-md shadow-xl"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link
            to="/"
            className="transform hover:scale-105 transition-transform duration-300"
          >
            <AnimatedA3Logo
              width={isMobile ? 120 : 280}
              height={isMobile ? 40 : 70}
              isMobile={isMobile}
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 xl:px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg"
                      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 relative">
            {user ? (
              <div className="flex items-center space-x-3 xl:space-x-4">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-red-50 to-red-100 px-3 xl:px-5 py-2 xl:py-3 rounded-2xl border border-red-200 shadow-lg">
                  <div className="w-8 xl:w-10 h-8 xl:h-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl flex items-center justify-center text-xs xl:text-sm font-bold">
                    {user.name && user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-xs xl:text-sm">
                      {user.name}
                    </p>
                    <p className="text-gray-600 text-xs">Online</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 xl:px-8 py-2 xl:py-3 rounded-2xl font-semibold text-xs xl:text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 xl:space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 px-4 xl:px-8 py-2 xl:py-3 rounded-2xl font-semibold text-xs xl:text-sm border-2 text-red-600 border-red-600"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === "signup" ? null : "signup"
                      )
                    }
                    className={`flex items-center space-x-2 px-4 xl:px-8 py-2 xl:py-3 rounded-2xl font-semibold text-xs xl:text-sm border-2 ${
                      dropdownOpen === "signup"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                        : "text-red-600 border-red-600"
                    }`}
                  >
                    <UserPlus size={16} />
                    <span>Register</span>
                  </button>
                  {dropdownOpen === "signup" && (
                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl border rounded-xl z-50 p-3">
                      <select
                        value={selectedUserType}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg"
                      >
                        <option value="">Select User Type</option>
                        {userTypes.map((type, idx) => (
                          <option key={idx} value={type.slug}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={!selectedUserType}
                        onClick={() => handleNavigation("signup")}
                        className="mt-3 w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 text-gray-700 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 40 }}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`lg:hidden fixed top-16 sm:top-20 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-red-100 transition-all duration-300 transform ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 45 }}
      >
        <div className="px-4 py-6">
          <nav className="space-y-1 mb-6">
            {navigationItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600 border-l-4 border-red-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {user ? (
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  {user.name && user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">Logged in</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Register as a new...
                </h3>
                <select
                  value={selectedUserType}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg mb-3"
                >
                  <option value="">Select User Type</option>
                  {userTypes.map((type, idx) => (
                    <option key={idx} value={type.slug}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <button
                  disabled={!selectedUserType}
                  onClick={() => handleNavigation("signup")}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <UserPlus size={16} />
                  <span>Continue to Registration</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
