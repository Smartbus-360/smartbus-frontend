import React, { useEffect } from "react";
import Navbar from "../../components/navbar/home-nav";

export default function CoreValues() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-green-600 text-white h-[50vh] flex items-center justify-center text-center">
        <div className="container px-6 md:px-12">
          <h1 className="text-5xl font-extrabold mb-4">
            Core Values
          </h1>
          <p className="text-xl">
            Guiding Principles of SmartBus360
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValuesContent.map((item, index) => (
              <CoreValueCard key={index} title={item.title} description={item.description} />
            ))}
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

// Core Value Card Component
function CoreValueCard({ title, description }) {
  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold text-green-600 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

// Core Values Content
const coreValuesContent = [
  {
    title: "Innovation-Driven Impact",
    description: "We prioritize technological innovation to create solutions that transform everyday commuting experiences, making SmartBus360 a pioneer in real-time, accessible transportation tech for communities."
  },
  {
    title: "Smart Accessibility",
    description: "Our goal is to make advanced technology accessible to all. From urban hubs to rural villages, we strive to provide reliable, real-time tracking information that meets diverse community needs at minimal cost."
  },
  {
    title: "Data-Driven Precision",
    description: "Accuracy is at our core. By leveraging cutting-edge GPS and data analytics, SmartBus360 ensures our users receive precise, live updates they can rely on for School, College, or Company transportation."
  },
  {
    title: "User-Centric Innovation",
    description: "We innovate with users in mind, designing features that solve real problems and enhance daily lives. By listening to our users, we constantly evolve to provide a seamless, intuitive, and efficient experience."
  },
  {
    title: "Community Empowerment Through Technology",
    description: "We’re committed to bridging the digital divide, bringing powerful transportation solutions to underserved areas. By enabling real-time access to transportation, we empower communities to thrive."
  },
  {
    title: "Commitment to Security and Trust",
    description: "In a world of data, security is paramount. We prioritize data privacy and safety, ensuring users can trust SmartBus360 to provide secure and reliable location services without compromising personal information."
  },
  {
    title: "Sustainable Mobility Solutions",
    description: "We envision a sustainable future where optimized transportation reduces environmental impact. By making public transport efficient and accessible, we contribute to greener communities and smarter resource use."
  },
  {
    title: "Innovation with Purpose",
    description: "Every feature we create is designed to address real-world challenges. We believe in purposeful innovation that makes a difference in the lives of students, families, and communities across India."
  },
  {
    title: "Scalability for the Future",
    description: "SmartBus360 is built to grow. With scalable technology, we’re prepared to expand our services to reach more people, adapt to new needs, and continue driving transformation in the transportation sector."
  },
  {
    title: "Pioneering Digital Inclusion",
    description: "We’re dedicated to bringing state-of-the-art technology to all corners of society, promoting digital inclusion by ensuring even the most remote areas have access to reliable, innovative transportation solutions."
  },
];
