import React from "react";
import Navbar from "../../components/navbar/home";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          Privacy Policy for SmartBus360
        </h1>
        <p className="mb-2 text-lg font-bold">
          Last Updated on November 24,2024
        </p>
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">1. Data Collection</h2>
          <p>We collect the following categories of data:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Personal Information:</strong> Name, email, phone number,
              and address.
            </li>
            <li>
              <strong>Driver-Specific Information:</strong> Phone number,
              address, driver license details, photo, Aadhaar card.
            </li>
            <li>
              <strong>Student-Specific Information:</strong> Phone number,
              address, photo, Aadhaar card.
            </li>
            <li>
              <strong>Device Information:</strong> IP address, operating system
              version, and browser type.
            </li>
            <li>
              <strong>Location Data:</strong> Real-time location for tracking
              purposes (mandatory for Drivers, optional for Students).
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">2. App & Website Data Usage</h2>
          <p>The data collected is used to:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Provide tracking services and enable real-time updates.</li>
            <li>Enhance user experience and ensure platform functionality.</li>
            <li>Comply with legal obligations and resolve disputes.</li>
            <li>
              Allow Drivers to share their location with Students in accordance
              with platform usage.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">3. Student Data Protection</h2>
          <p>
            We do not sell user data. Data may be shared in the following
            circumstances:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              With authorized service providers for maintenance and technical
              support.
            </li>
            <li>
              With law enforcement agencies, if required by law or court orders.
            </li>
            <li>
              Between users, such as Drivers sharing real-time locations with
              Students.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
          <p>
            SmartBus360 employs industry-standard security protocols, including
            encryption and secure server storage, to protect user data from
            unauthorized access, disclosure, or loss.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">5. User Rights</h2>
          <ul className="list-disc pl-5">
            <li>
              Users can access, update, or delete their personal information by
              contacting us.
            </li>
            <li>
              Users may opt out of certain data collection activities; however,
              this may impact the platform&apos;s functionality.
            </li>
            <li>
              Users can withdraw consent for data processing where applicable.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">6. Data Retention</h2>
          <p>
            We retain user data only as long as necessary for the purposes
            outlined in this policy or to comply with legal obligations.
            Location data is stored temporarily and deleted after it is no
            longer required for tracking purposes.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">7. Cookies</h2>
          <p>
            Our web portal uses cookies to improve functionality and user
            experience. Users can manage or disable cookie preferences through
            browser settings. Disabling cookies may limit certain features.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">
            8. Updates to Privacy Policy
          </h2>
          <p>
            We may revise this Privacy Policy periodically. Users will be
            notified of any significant updates via email, app notifications, or
            web portal announcements.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
          <p>
            For inquiries or concerns regarding these Terms and Conditions or
            Privacy Policy, please reach out to us at{" "}
            <a
              href="mailto:support@smartbus360.com"
              className="text-blue-500 underline"
            >
              support@smartbus360.com
            </a>
            .
          </p>
        </div>
      </div>
      <footer className="text-center py-4 bg-gray-50 text-gray-900">
        <p className="text-sm">
          © {new Date().getFullYear()} Smart Bus 360. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default PrivacyPolicy;
