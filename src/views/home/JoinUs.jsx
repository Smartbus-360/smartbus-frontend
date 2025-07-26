import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/home-nav";
import axios from "axios";

export function Contact() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const fullName = formData.get("full-name");
      const companyName = formData.get("company-name");
      const email = formData.get("email");
      const mobile = formData.get("mobile");
      const buses = formData.get("number-of-buses");
      const address = formData.get("address");
      const pincode = formData.get("pincode");
      const description = formData.get("description");

      if(!fullName||
        !companyName||
        !email||
        !mobile||
        !buses||
        !address||
        !pincode||
        !description){
        setMessage("Please fill all rquired field");
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/join-us`, {
        fullName,
        companyName,
        email,
        mobile,
        buses,
        address,
        pincode,
        description,
      });
      console.log('response', response);
      if (response.status === 201) {
        setMessage(`Hi ${fullName}, your message was sent successfully!`);
        e.target.reset();
      } else {
        setMessage("Sending message failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 px-8 py-16 lg:py-24">
        <div className="container mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700">Join Smart Bus 360</h1>
            <p className="text-lg text-gray-900 max-w-3xl mx-auto">
              Become a part of the Smart Bus 360 community. Share your details, and we&apos;ll connect with you to discuss how we can partner for a better future in travel and transportation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-blue-700 mb-8">
                We are here to help
              </h2>
              <ul className="text-gray-800 space-y-5">
                <li className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">Phone:</span>
                  <a href="tel:+918234999207" className="text-blue-600 hover:text-blue-800 transition duration-300">
                    +91-8234999207
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">Customer Support:</span>
                  <a href="mailto:support@smartbus360.com" className="text-blue-600 hover:text-blue-800 transition duration-300">
                    support@smartbus360.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">Sales Inquiries:</span>
                  <a href="mailto:support@smartbus360.com" className="text-blue-600 hover:text-blue-800 transition duration-300">
                  sales@smartbus360.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">Address:</span>
                  <span className="text-gray-700">Bhilai-3, Near Ram Mandir, Durg - 490021, Chhattisgarh, India</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">Office Hours:</span>
                  <span className="text-gray-700">9:00 AM - 9:00 PM</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">Website:</span>
                  <a href="https://www.smartbus360.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-300">
                    www.smartbus360.com
                  </a>
                </li>
              </ul>
            </div>


            {/* Contact Form */}
            <div>
              <form className="bg-white p-8 rounded-lg shadow-lg" onSubmit={handleContactSubmit}>
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Send Us Your Details</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="full-name"
                      className="text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company-name"
                      className="text-sm font-medium text-gray-900"
                    >
                      Institute/Company Name
                    </label>
                    <input
                      type="text"
                      id="company-name"
                      name="company-name"
                      className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Institute or Company Name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-900"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="name@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mobile"
                      className="text-sm font-medium text-gray-900"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Mobile Number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="number-of-buses"
                      className="text-sm font-medium text-gray-900"
                    >
                      Number of Buses
                    </label>
                    <input
                      type="number"
                      id="number-of-buses"
                      name="number-of-buses"
                      className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Number of Buses"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="pincode"
                      className="text-sm font-medium text-gray-900"
                    >
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Area Pincode"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-900"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="2"
                    className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Address"
                    required
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="border border-gray-300 p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us more about your requirements"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-blue-700 text-white py-3 px-6 rounded-full w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                {message && (
                  <p className="mt-4 text-md font-semibold text-gray-900">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
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

export default Contact;