import { useState, useEffect, useRef } from "react";
import Logo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaAndroid, FaApple } from "react-icons/fa";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaDownload
} from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const dropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      if (
  desktopDropdownRef.current &&
  !desktopDropdownRef.current.contains(event.target) &&
  mobileDropdownRef.current &&
  !mobileDropdownRef.current.contains(event.target)
) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the desired path
    setDropdownOpen(false); // Close dropdown
    setIsOpen(false); // Close mobile menu
  };

  return (
    <nav className="z-10 w-full bg-gray-50 text-gray-900 shadow-lg">
      {/* <div className="container mx-auto px-4 lg:px-8"> */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between py-4 lg:justify-around">
          {/* Logo */}
          <div className="flex items-center">
            <img src={Logo} alt="Smart Bus 360 Logo" className="h-20" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Smart Bus 360
            </span>
          </div>

          {/* Menu items */}
          <div className="hidden flex-wrap items-center space-x-8 md:flex">
            <Link
              to="/"
              className="font-medium text-gray-900 transition duration-300 hover:text-yellow-300"
            >
              Home
            </Link>
            <ScrollLink
              to="features"
              smooth={true}
              duration={500}
              className="cursor-pointer font-medium text-gray-900 transition duration-300 hover:text-yellow-300"
            >
              Features
            </ScrollLink>
            <Link
              to="/home/join-us"
              className="font-medium text-gray-900 transition duration-300 hover:text-yellow-300"
            >
              Join Us
            </Link>
            {/* Dropdown */}
<div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center font-medium text-gray-900 transition duration-300 hover:text-yellow-300"
              >
                About <FaChevronDown className="ml-2" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 z-20 mt-2 w-48 rounded-lg bg-white shadow-lg">
                  <button
                    onClick={() => handleNavigation("/home/about")}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    About Smartbus360
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/mission-vision")}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    Mission and Vision
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/core-values")}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    Core Values
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/founder-mesage")}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    Founder&apos;s Message
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/why-smartbus360")}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    Why Smartbus360?
                  </button>
                </div>
              )}
            </div>
            {/* <ScrollLink
              to="downloads"
              smooth={true}
              duration={500}
              className="hidden items-center font-medium text-gray-900 transition duration-300 hover:text-yellow-300 lg:flex"
            >
              Download <FaDownload className="ml-2" />
            </ScrollLink> */}
            <div className="hidden lg:flex space-x-2">
  <a
    href="https://play.google.com/store/apps/details?id=com.smartbus360.app"
    target="_blank"
    rel="noreferrer"
    className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 transition text-sm"
  >
    <FaAndroid className="mr-2 text-xl" />
    Android
  </a>
  <a
    href="https://apps.apple.com/us/app/smartbus360/id6742678067"
    target="_blank"
    rel="noreferrer"
    className="bg-black flex items-center rounded-lg px-6 py-3 text-gray-700 transition-all duration-300 hover:bg-gray-800 hover:text-white" 
  >
    <FaApple className="mr-2 text-xl" />
    iOS
  </a>
</div>

            {/* Admin Login Button */}
            <button
              onClick={() => navigate("/auth/sign-in")}
              className="rounded-lg bg-yellow-400 px-8 py-3 text-gray-800 shadow-lg transition-all duration-300 hover:bg-yellow-500"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="block md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-yellow-300 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          // <div className="block md:hidden">
        <div className="absolute left-0 top-full z-50 w-full bg-white shadow-lg md:hidden">
            <Link
              to="/"
              onClick={() => setIsOpen(false)} // Close menu after navigation
              className="block px-4 py-2 text-center text-gray-800 transition duration-300 hover:bg-gray-100"
            >
              Home
            </Link>
            <ScrollLink
              to="features"
              smooth={true}
              duration={500}
              onClick={() => setIsOpen(false)} // Close menu after navigation
              className="block px-4 py-2 text-center text-gray-800 transition duration-300 hover:bg-gray-100"
            >
              Features
            </ScrollLink>
            <Link
              to="/home/join-us"
              onClick={() => setIsOpen(false)} // Close menu after navigation
              className="block px-4 py-2  text-center text-gray-800 transition duration-300 hover:bg-gray-100"
            >
              Join Us
            </Link>
<div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="block flex w-full items-center justify-center px-4 py-2 text-center text-gray-800 transition duration-300 hover:bg-gray-100"
              >
                About <FaChevronDown className="ml-1" />
              </button>
              {dropdownOpen && (
                <div className="ml-4 z-50">
                  <button
                    onClick={() => handleNavigation("/home/about")}                    
                    className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-100"
                  >
                    About Smartbus360
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/mission-vision")}
                    className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-100"
                  >
                    Mission and Vision
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/core-values")}
                    className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-100"
                  >
                    Core Values
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/founder-mesage")}
                    className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-100"
                  >
                    Founder&apos;s Message
                  </button>
                  <button
                    onClick={() => handleNavigation("/home/why-smartbus360")}
                    className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-100"
                  >
                    Why Smartbus360?
                  </button>
                </div>
              )}
            </div>
            {/* <ScrollLink
              to="downloads"
              smooth={true}
              duration={500}
              onClick={() => setIsOpen(false)} // Close menu after navigation
              className="mb-2 block flex items-center px-4 py-2 text-gray-800 transition duration-300 hover:bg-gray-100"
            >
              Download <FaDownload className="ml-1" />
            </ScrollLink>
             */}
<div className="flex flex-col space-y-2 px-4 py-2">
  <a
    href="https://play.google.com/store/apps/details?id=com.smartbus360.app"
    target="_blank"
    rel="noreferrer"
    className="flex w-full items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 transition-all duration-300 text-sm"
  >
    <FaAndroid className="mr-2 text-xl" />
    Android
  </a>
  <a
    href="https://play.google.com/store/apps/details?id=com.smartbus360.app"
    target="_blank"
    rel="noreferrer"
    className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-300 text-sm"
  >
    <FaApple className="mr-2 text-xl" />
    iOS
  </a>
</div>

            <button
              onClick={() => {
                setIsOpen(false); // Close menu
                navigate("/auth/sign-in");
              }}
              className="mb-2 rounded-lg bg-yellow-400 px-8 py-3 text-gray-800 shadow-lg transition-all duration-300 hover:bg-yellow-500"
            >
              Login
            </button>
            

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
