import React from 'react';
import HeroSection from '../components/HeroSection';
import { Features } from '../components/Features';

const HomePage = ({ user }) => {
  return (
    <>
      {/* This div container with responsive padding was in the original App.jsx */}
      <div className="pt-24 md:pt-20"> 
        <HeroSection user={user} />
        <Features />
      </div>

      {/* 
        This style block contains the animation for the Hero Section.
        It was originally in App.jsx and is now placed here to ensure
        the animation works correctly on the homepage.
      */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </>
  );
};

export default HomePage;