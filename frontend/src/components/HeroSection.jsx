import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Instant Access to Critical Information",
      subtitle: "Smart Emergency Cards with Personal Medical Data",
      description:
        "Each smart card holds essential details like medical history, allergies, emergency contacts, and blood type. First responders can scan the card to act fast.",
    },
    {
      title: "Quick Identification in Emergencies",
      subtitle: "Scan the Card, Save a Life",
      description:
        "In critical situations, scanning the card provides instant access to the person's identity, medical conditions, ongoing treatments, and emergency contacts.",
    },
    {
      title: "Reliable and Secure Data Storage",
      subtitle: "Encrypted and Always Accessible",
      description:
        "The smart card securely stores all necessary personal and health data, enabling trusted medical personnel to retrieve important information without delay.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div key={currentSlide} className="animate-fade-in">
              <p className="text-lg font-light mb-4 tracking-wide uppercase opacity-90">
                {slides[currentSlide].title}
              </p>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {slides[currentSlide].subtitle}
              </h1>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                {slides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Book Appointment
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/signup/user")}
                    className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Get Started
                  </button>
                )}
                <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
