import React from 'react';
import { FaMobileAlt, FaCogs, FaRocket, FaGlobe, FaSyncAlt, FaHeadset } from 'react-icons/fa';

const features = [
    {
      icon: <FaMobileAlt className="text-6xl text-blue-500" />,
      title: "Platform Integration",
      description: "Use the app on any smartphone platform without compatibility issues.",
    },
    {
      icon: <FaCogs className="text-6xl text-blue-500" />,
      title: "Easy On Resources",
      description: "Runs smoothly even on older hardware due to advanced optimization.",
    },
    {
      icon: <FaRocket className="text-6xl text-blue-500" />,
      title: "Great Performance",
      description: "Experience ultra-fast responsiveness with optimized code and technology.",
    },
    {
      icon: <FaGlobe className="text-6xl text-blue-500" />,
      title: "Multiple Languages",
      description: "Choose from over 6 languages and connect globally with ease.",
    },
    {
      icon: <FaSyncAlt className="text-6xl text-blue-500" />,
      title: "Free Updates",
      description: "Pay once and enjoy all future updates at no extra cost.",
    },
    {
      icon: <FaHeadset className="text-6xl text-blue-500" />,
      title: "Support",
      description: "Get access to reliable customer support whenever you need assistance.",
    },
  ];

const Features = () => {
  return (
    <section className="py-16 bg-gray-50 text-gray-900" id="features">
      <div className="max-w-7xl text-center mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Features That Make a Difference
        </h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-white w-full aspect-square rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-800 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-800 text-center px-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
