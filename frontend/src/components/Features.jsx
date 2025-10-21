import React from 'react';
import { Star, Shield, Heart, Users } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: <Star size={32} />,
      title: "Expert Dentists",
      description: "Our team consists of highly qualified and experienced dental professionals."
    },
    {
      icon: <Shield size={32} />,
      title: "Safe Treatment",
      description: "We follow strict safety protocols and use sterilized equipment for all treatments."
    },
    {
      icon: <Heart size={32} />,
      title: "Comfortable Care",
      description: "Patient comfort is our priority with a relaxing environment and gentle care."
    },
    {
      icon: <Users size={32} />,
      title: "Family Friendly",
      description: "We provide comprehensive dental care for patients of all ages and families."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Jagmitra Care?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional dental care with the highest standards of professionalism and comfort.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="text-red-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
