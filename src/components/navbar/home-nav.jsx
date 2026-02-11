import { useState, useEffect, useRef } from "react";
import Logo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaAndroid, FaApple, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setIsOpen(false);
  };

  return (
<nav className="relative z-[9999] w-full bg-gray-50 text-gray-900 shadow-md">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* TOP ROW */}
        <div className="flex items-center justify-between py-4">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Smart Bus 360" className="h-14" />
            <span className="text-lg font-bold">Smart Bus 360</span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">

            {/* LEFT LINKS */}
            <div className="flex items-center gap-6">
              <Link to="/" className="nav-link">Home</Link>
              <ScrollLink to="features" smooth duration={500} className="nav-link">
                Features
              </ScrollLink>
              <Link to="/home/join-us" className="nav-link">Join Us</Link>

              {/* ABOUT */}
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="nav-link flex items-center gap-1"
                >
                  About <FaChevronDown className="text-xs" />
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

            {/* RIGHT ACTIONS */}
            {/* RIGHT ACTIONS */}
<div className="flex items-center gap-3">

  {/* Android Button */}
  <a
    href="https://play.google.com/store/apps/details?id=com.smartbus360.app"
    target="_blank"
    rel="noreferrer"
    className="btn-green flex items-center gap-2"
  >
    <FaAndroid /> Android
  </a>

  {/* iOS Button */}
  <a
    href="https://apps.apple.com/us/app/smartbus360/id6742678067"
    target="_blank"
    rel="noreferrer"
    className="btn-black flex items-center gap-2"
  >
    <FaApple /> iOS
  </a>

  <a
    href="https://admin.smartbus360.com/"
    target="_blank"
    rel="noreferrer"
    className="btn-purple"
  >
    Admin
  </a>

  <a
    href="https://coordinates.smartbus360.com/login"
    target="_blank"
    rel="noreferrer"
    className="btn-indigo"
  >
    Coordinates
  </a>

  <button onClick={() => navigate("/student/login")} className="btn-blue">
    Student
  </button>

  <button onClick={() => navigate("/auth/sign-in")} className="btn-yellow">
    Login
  </button>
</div>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg p-4 space-y-3">

            <Link to="/" onClick={() => setIsOpen(false)} className="mobile-link">Home</Link>
            <ScrollLink to="features" smooth duration={500} onClick={() => setIsOpen(false)} className="mobile-link">
              Features
            </ScrollLink>
            <Link to="/home/join-us" onClick={() => setIsOpen(false)} className="mobile-link">
              Join Us
            </Link>

            {/* <a href="https://admin.smartbus360.com/" target="_blank" rel="noreferrer" className="btn-purple w-full text-center">
              Admin Panel
            </a>
            <a href="https://coordinates.smartbus360.com/login" target="_blank" rel="noreferrer" className="btn-indigo w-full text-center">
              Coordinates Login
            </a> */}
            <button onClick={() => navigate("/student/login")} className="btn-blue w-full">
              Student Login
            </button>

            <div ref={mobileDropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="mobile-link flex justify-center items-center gap-1"
              >
                About <FaChevronDown className="text-xs" />
              </button>

              {dropdownOpen && (
                <div className="space-y-1">
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
                      className="block w-full py-2 text-center hover:bg-gray-100"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <a href="https://play.google.com/store/apps/details?id=com.smartbus360.app" target="_blank" rel="noreferrer" className="btn-green w-full flex justify-center gap-2">
                <FaAndroid /> Android
              </a>
              <a href="https://apps.apple.com/us/app/smartbus360/id6742678067" target="_blank" rel="noreferrer" className="btn-black w-full flex justify-center gap-2">
                <FaApple /> iOS
              </a>
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
