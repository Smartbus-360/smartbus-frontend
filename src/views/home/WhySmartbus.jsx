import React, { useEffect } from "react";
import Navbar from "../../components/navbar/home-nav";

export default function WhySmartBus() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white h-[50vh] flex items-center justify-center text-center">
        <div className="container px-6 md:px-12">
          <h1 className="text-5xl font-extrabold mb-4">Why SmartBus360?</h1>
          <p className="text-xl">
            Affordable, Reliable, and Scalable Transportation Solutions
          </p>
        </div>
      </section>

      {/* Why SmartBus360 Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-12 lg:px-24 text-gray-800">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Why Choose SmartBus360?
          </h2>
          <ul className="space-y-8">
            <li>
              <h3 className="text-2xl font-bold mb-2">
                1. Reliable and Affordable Real-Time Tracking
              </h3>
              <p className="leading-7">
                Unlike traditional GPS systems that are expensive to install and maintain, SmartBus360&apos;s mobile-based GPS solution offers accurate, live tracking at a fraction of the cost, making it accessible for institutions of any size.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                2. Minimal Subscription Cost
              </h3>
              <p className="leading-7">
                Each student or user pays a nominal subscription fee, making it an affordable solution even for rural or budget-conscious schools, colleges, and companies. This minimal charge maximizes accessibility while delivering high-value service.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                3. Reduced Equipment and Maintenance Expenses
              </h3>
              <p className="leading-7">
                SmartBus360 eliminates the need for additional hardware by leveraging the driver or conductor&apos;s smartphone for tracking, reducing ongoing maintenance costs.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                4. Enhanced Safety and Peace of Mind for Parents and Staff
              </h3>
              <p className="leading-7">
                SmartBus360 provides parents and administrators with real-time bus locations, reducing uncertainty and minimizing long, stressful wait times.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                5. Convenient and Secure Mobile-Based GPS
              </h3>
              <p className="leading-7">
                Our mobile-based GPS tracking is easy to set up, highly secure, and regularly updated, offering a robust alternative to traditional GPS systems that require extensive installation.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                6. User-Friendly Alerts and Notifications
              </h3>
              <p className="leading-7">
                SmartBus360&apos;s app notifies users about changes in schedule, delays, or unexpected route changes, keeping parents, students, and employees informed without constant checking.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                7. Improved Punctuality and Transport Management
              </h3>
              <p className="leading-7">
                Real-time visibility helps institutions manage transportation schedules effectively, minimizing delays and ensuring timely arrivals, especially valuable in corporate environments.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                8. Data Privacy and Security
              </h3>
              <p className="leading-7">
                Unlike physical GPS devices, SmartBus360&apos;s secure, mobile-based technology ensures data privacy by tracking only necessary location information.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                9. Accessible Technology for All Locations
              </h3>
              <p className="leading-7">
                Designed for low-data usage, SmartBus360 is accessible even in areas with limited connectivity, making it a reliable solution for remote schools, colleges, and companies.
              </p>
            </li>
            <li>
              <h3 className="text-2xl font-bold mb-2">
                10. Scalability and Adaptability for Future Growth
              </h3>
              <p className="leading-7">
                SmartBus360 scales effortlessly to accommodate growing institutions, adapting to more users, routes, and locations for long-term, adaptable transport solutions.
              </p>
            </li>
          </ul>
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
