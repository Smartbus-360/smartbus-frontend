import React from "react";
// import Navbar from "../../components/navbar/home";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          Terms and Conditions for SmartBus360
        </h1>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
          <p>
            Welcome to SmartBus360, a mobile-based tracking system designed to
            enhance convenience and safety for its users. By accessing or using
            SmartBus360, you agree to these Terms and Conditions. If you do not
            agree, please refrain from using the platform. These terms apply to
            all users, including Drivers and Students.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">2. Scope of Services/Subscription Terms</h2>
          <p>
            SmartBus360 provides location tracking, real-time updates, and
            related features on Android, iOS, and web portals. The platform
            supports two distinct roles:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Drivers:</strong> Can share real-time location data with
              Students upon initiating tracking, including when the app is
              running in the background.
            </li>
            <li>
              <strong>Students:</strong> Can view shared locations from Drivers
              but have the option to disable their own location-sharing feature.
            </li>
          </ul>
          <p className="mt-2">
            Access to the system is granted on a subscription or pay-per-use
            basis.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">
            3. School/College/User Responsibilities
          </h2>
          <ul className="list-disc pl-5">
            <li>
              Users must provide accurate and up-to-date information during
              registration.
            </li>
            <li>
              Access credentials, including usernames and passwords, must be
              kept confidential and not shared with others.
            </li>
            <li>
              Users are prohibited from using the platform for unlawful
              activities, including unauthorized tracking or data misuse.
            </li>
            <li>
              <strong>Drivers:</strong> are responsible for ensuring that their
              shared location data is accurate, active only during approved
              times, and not misused.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">
            4. Supported Platforms
          </h2>
          <p>SmartBus360 is compatible with:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Mobile Devices:</strong> Android (7.0 to 14.0), iOS (12.0
              to 17.6.1).
            </li>
            <li>
              <strong>Web Browsers:</strong> Mozilla Firefox (60.0+), Google
              Chrome (65.0+), Internet Explorer (11.0), Microsoft Edge, and
              Apple Safari (11+).
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">
            5. Service Usage Rules
            {/* Limitation of Liability */}
          </h2>
          <p>
            SmartBus360 is provided "as is" without warranties of any kind,
            either express or implied. While we strive to ensure accurate and
            reliable service, we are not liable for:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>Service disruptions, technical issues, or data loss.</li>
            <li>
              Inaccuracies in data caused by third-party dependencies or user
              actions.
            </li>
            <li>
              Unauthorized access due to negligence in securing login
              credentials.
            </li>
            <li>
              Misuse of location or personal data shared between Drivers and
              Students.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">6. Data Usage</h2>
          <p>
            All data collected is processed in accordance with our Privacy
            Policy. By using SmartBus360, you consent to the collection, use,
            and sharing of your data as described.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts found
            violating these Terms and Conditions, engaging in unlawful
            activities, or compromising platform integrity.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-semibold">8. Governing Law (India)</h2>
          <p>
            These Terms and Conditions are governed by applicable laws in the
            jurisdiction of the user’s residence or use of the application.
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

export default TermsAndConditions;
