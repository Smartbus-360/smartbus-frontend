import React from "react";
import {Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/home";
import HeroSection from "./HeroSection.jsx";
import Features from "./Features.jsx";
import Showcase from "./Showcase.jsx";
import Clients from "./Clients.jsx";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <section id="downloads">
        <HeroSection />
      </section>
      <section id="features">
        <Features />
      </section>
      <Showcase />
      {/* <Clients /> */}
      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xl font-semibold mb-2">
            © {new Date().getFullYear()} Smart Bus 360. All rights reserved.
          </p>
          <p className="text-md text-gray-600 mb-4">
            Delivering smarter transportation solutions for a more connected world.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.facebook.com/smartbus360" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">
              Facebook
            </a>
            <a href="https://twitter.com/smartbus360" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition duration-300 ease-in-out">
              Twitter
            </a>
            <a href="https://www.linkedin.com/company/smartbus360" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition duration-300 ease-in-out">
              LinkedIn
            </a>
          </div>
          <div className="text-md text-gray-500 mb-4">
            <p>
              For inquiries, reach us at{" "}
              <a href="mailto:support@smartbus360.com" className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
                sales@smartbus360.com
              </a>
            </p>
            <p>
              <span><Link to="/home/privacy-policy" className="font-semibold">Privacy Policy</Link></span> | <span><Link to="/home/terms-and-conditions" className="font-semibold">Terms of Service</Link></span>
            </p>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>
              Powered by <span className="font-semibold">Smart Bus 360</span>, a leader in innovative transportation technology.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
