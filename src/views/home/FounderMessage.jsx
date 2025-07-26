import React, { useEffect } from "react";
import Navbar from "../../components/navbar/home-nav";

export default function FounderMessage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white h-[50vh] flex items-center justify-center text-center">
        <div className="container px-6 md:px-12">
          <h1 className="text-5xl font-extrabold mb-4">Founder&apos;s Message</h1>
          <p className="text-xl">
            A Vision of Smarter, Safer Transportation
          </p>
        </div>
      </section>

      {/* Founder’s Message Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-12 lg:px-24 text-gray-800">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Welcome to SmartBus360!
          </h2>
          <p className="leading-7 text-justify mb-4">
            In a world that&apos;s moving fast, the need for reliable, real-time transportation information has never been more essential. SmartBus360 was born from a simple idea: to bridge the transportation gap in underserved areas and ensure that no student, parent, or commuter is left waiting in uncertainty. Our platform exists to make transportation dependable, safe, and accessible to all.
          </p>
          <p className="leading-7 text-justify mb-4">
            From my own experiences, I&apos;ve seen firsthand the challenges families and communities face with transportation delays, particularly in rural areas. SmartBus360 was built to solve these very issues, using innovative technology to bring the power of real-time tracking to students, parents, and institutions across India. Our aim is to provide peace of mind, where waiting times are minimized, and journeys become reliable.
          </p>
          <p className="leading-7 text-justify mb-4">
            Our mission extends beyond just tracking buses. We envision a future where technology empowers communities, where waiting times are a thing of the past, and where parents can focus on their work knowing their children&apos;s journeys are safe. By keeping our subscription costs minimal, we&apos;re making sure this solution reaches every corner of society, transforming the way India travels, one bus ride at a time.
          </p>
          <p className="leading-7 text-justify mb-4">
            At SmartBus360, we&apos;re committed to constant innovation, security, and user-centricity. We believe in a sustainable, inclusive approach that benefits not only students and parents but entire communities. By partnering with schools, institutions, and local governments, we are building a platform that&apos;s easy to use, impactful, and, above all, reliable.
          </p>
          <p className="leading-7 text-justify mb-8">
            Thank you for being part of our journey toward smarter, safer transportation. With SmartBus360, we&apos;re not just tracking buses; we&apos;re building a community powered by innovation, trust, and accessibility.
          </p>
          <div className="text-center mt-8">
            <p className="text-lg font-medium">Warm regards,</p>
            <p className="text-xl font-semibold mt-2">Rupesh Kumar Singh</p>
            <p className="text-lg">Founder & CEO, SmartBus360</p>
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
