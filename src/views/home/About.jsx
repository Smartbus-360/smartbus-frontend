import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaRocket, FaHandsHelping, FaGlobeAmericas, FaBus, FaLeaf, FaRoute } from "react-icons/fa";
import NftBanner1 from '../../assets/img/background/background.png';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        style={{ backgroundImage: `url(${NftBanner1})` }}
        className="relative bg-cover bg-center h-[50vh] flex items-center justify-center text-center text-white"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
        <div className="relative z-10 px-6 md:px-12">
          <h1 className="text-5xl font-extrabold mb-4 animate__animated animate__fadeIn">
            Welcome to Smart Bus 360
          </h1>
          <p className="text-xl md:text-2xl mb-6 animate__animated animate__fadeIn animate__delay-1s">
            Seamless, Smart, and Sustainable Travel Solutions
          </p>
          <a
            href="#about-us"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full text-lg"
          >
            Discover More
          </a>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            About Smart Bus 360
          </h2>
          <p className="text-lg text-gray-700 mb-4 max-w-5xl mx-auto text-justify">
            SmartBus360 is a transformative platform designed to provide real-time bus tracking for private, school, university/college, and company transportation systems. With a mission to ensure no student or passenger misses their bus, SmartBus360 leverages innovative mobile-based GPS technology to track drivers&apos; and conductors&apos; smartphones, delivering live location updates directly to students, parents, teachers, and commuters.
          </p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            How It Works
          </h3>
          <p className="text-lg text-gray-700 mb-4 text-justify">
            SmartBus360 operates through a seamless mobile application that connects passengers and drivers in real-time. By tracking the driver or conductor&apos;s smartphone, the system continuously updates the bus&apos;s exact location and estimated arrival time, enabling passengers to plan their journeys with ease. Schools, colleges, and communities can rely on SmartBus360 to provide efficient, accurate location services at any moment.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Core Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={<FaBus className="text-4xl text-blue-500 mb-4" />}
              title="Live GPS Tracking"
              description="Provides live updates on bus locations, ensuring precise arrival times."
            />
            <Feature
              icon={<FaRoute className="text-4xl text-green-500 mb-4" />}
              title="Driver Location Tracking"
              description="Tracks the driver's phone for up-to-the-minute location updates."
            />
            <Feature
              icon={<FaRocket className="text-4xl text-yellow-500 mb-4" />}
              title="Safety Alerts"
              description="Offers alerts for route changes, delays, or safety concerns."
            />
            <Feature
              icon={<FaGlobeAmericas className="text-4xl text-purple-500 mb-4" />}
              title="Community Impact"
              description="Supports underserved areas with reliable transport solutions."
            />
            <Feature
              icon={<FaHandsHelping className="text-4xl text-pink-500 mb-4" />}
              title="Reduced Waiting Times"
              description="Minimizes waiting at stops with real-time updates for busy families."
            />
            <Feature
              icon={<FaLeaf className="text-4xl text-teal-500 mb-4" />}
              title="Eco-Friendly Solutions"
              description="Promotes greener travel with sustainable practices."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-4">
            Experience the Future of Travel Today
          </h2>
          <p className="text-lg mb-6">
            Join us in redefining bus travel with smart, sustainable solutions.
          </p>
          <Link
            to="/home/join-us"
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-600 px-6 py-3 rounded-full text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      <footer className="text-center py-4 bg-gray-50 text-gray-900">
        <p className="text-sm">
          © {new Date().getFullYear()} Smart Bus 360. All rights reserved.
        </p>
      </footer>
    </>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 shadow-lg rounded-lg">
      {icon}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}
