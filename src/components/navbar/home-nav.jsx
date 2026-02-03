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
        <div className="hidden md:flex items-center justify-between w-full ml-10">
  
  {/* LEFT: Navigation */}
  <div className="flex items-center space-x-6">
    <Link to="/" className="nav-link">Home</Link>
    <ScrollLink to="features" smooth duration={500} className="nav-link">
      Features
    </ScrollLink>
    <Link to="/home/join-us" className="nav-link">Join Us</Link>

    {/* About Dropdown */}
    <div className="relative" ref={desktopDropdownRef}>
      <button
        onClick={() => setDropdownOpen((p) => !p)}
        className="nav-link flex items-center"
      >
        About <FaChevronDown className="ml-1 text-sm" />
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 mt-2 w-52 rounded-xl bg-white shadow-xl">
          {[
            ["About Smartbus360", "/home/about"],
            ["Mission & Vision", "/home/mission-vision"],
            ["Core Values", "/home/core-values"],
            ["Founder’s Message", "/home/founder-mesage"],
            ["Why Smartbus360?", "/home/why-smartbus360"],
          ].map(([label, path]) => (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* RIGHT: Actions */}
  <div className="flex items-center space-x-3">
    <a
      href="https://admin.smartbus360.com/"
      target="_blank"
      className="btn-primary-purple"
      rel="noreferrer"
    >
      Admin Panel
    </a>

    <a
      href="https://coordinates.smartbus360.com/login"
      target="_blank"
      className="btn-primary-indigo"
      rel="noreferrer"
    >
      Coordinates
    </a>

    <button
      onClick={() => navigate("/student/login")}
      className="btn-primary-blue"
    >
      Student
    </button>

    <button
      onClick={() => navigate("/auth/sign-in")}
      className="btn-primary-yellow"
    >
      Login
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
          <a
  href="https://admin.smartbus360.com/"
  target="_blank"
  rel="noreferrer"
  className="my-2 block w-full rounded-lg bg-purple-500 px-6 py-3 text-center text-white shadow-lg transition-all duration-300 hover:bg-purple-600"
>
  Admin Panel
</a>

<a
  href="https://coordinates.smartbus360.com/login"
  target="_blank"
  rel="noreferrer"
  className="my-2 block w-full rounded-lg bg-indigo-500 px-6 py-3 text-center text-white shadow-lg transition-all duration-300 hover:bg-indigo-600"
>
  Coordinates Login
</a>

<button
  onClick={() => {
    setIsOpen(false);
    navigate("/student/login");
  }}
  className="my-2 w-full rounded-lg bg-blue-500 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-600"
>
  Student Login
</button>
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
