import React, { useEffect } from "react";

export default function MissionAndVision() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white h-[50vh] flex items-center justify-center text-center">
        <div className="container px-6 md:px-12">
          <h1 className="text-5xl font-extrabold mb-4">
            Vision and Mission
          </h1>
          <p className="text-xl">
            Driving Reliability, Safety, and Sustainability in Transportation
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Vision</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visionContent.map((item, index) => (
              <VisionCard key={index} title={item.title} description={item.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Mission</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {missionContent.map((item, index) => (
              <MissionCard key={index} title={item.title} description={item.description} />
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

// Vision Card Component
function VisionCard({ title, description }) {
  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

// Mission Card Component
function MissionCard({ title, description }) {
  return (
    <div className="p-6 bg-gray-100 shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold text-green-600 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

// Vision Content
const visionContent = [
  {
    title: "A World Where Every Journey is Reliable",
    description: "Create a world where no student, parent, or commuter waits uncertainly for transportation, ensuring every journey is dependable through real-time tracking."
  },
  {
    title: "Connecting Rural Communities with Technology",
    description: "Bridge the transportation gap in underserved and rural areas by providing affordable, cutting-edge location services that empower local communities."
  },
  {
    title: "Empowering Education Through Accessibility",
    description: "Support education by ensuring that students never miss a bus, promoting punctuality and safety so learning remains uninterrupted and accessible to all."
  },
  {
    title: "Safety and Efficiency as Standards",
    description: "Set new standards in transportation safety and efficiency, using innovative technology to minimize delays, increase safety, and provide peace of mind."
  },
  {
    title: "Affordable Innovation for All",
    description: "Make advanced transportation technology affordable and accessible to everyone, prioritizing inclusivity and equal opportunity."
  },
  {
    title: "Sustainable, Smart Transportation for Tomorrow",
    description: "Contribute to sustainable urban and rural transportation solutions by reducing environmental impact through efficient public transport use."
  },
  {
    title: "A Platform of Trust and Transparency",
    description: "Build a platform that passengers, parents, and institutions can trust, prioritizing transparency, accuracy, and reliability in every update."
  },
  {
    title: "Global Impact Through Local Innovation",
    description: "Transform local transportation with innovations that have a global impact, supporting connectivity and development from grassroots levels to a worldwide scale."
  },
];

// Mission Content
const missionContent = [
  {
    title: "Affordable Service with a Purpose",
    description: "Make innovative services accessible to every student and family in India with minimal subscription costs, serving communities at the lowest possible charges."
  },
  {
    title: "Deliver Reliable Transportation Access for All",
    description: "Provide every student, parent, and passenger with accurate, real-time access to bus locations, ensuring transportation is never a barrier."
  },
  {
    title: "Empower Rural and Underserved Communities",
    description: "Bring advanced bus-tracking technology to rural and underserved areas, making reliable transportation information accessible to all."
  },
  {
    title: "Promote Safety and Peace of Mind",
    description: "Enhance safety with live tracking, safety alerts, and timely updates, giving parents and commuters peace of mind."
  },
  {
    title: "Make Transportation Affordable and Inclusive",
    description: "Offer high-quality tracking services at a nominal price, ensuring advanced transportation solutions are affordable for every community."
  },
  {
    title: "Build Trust Through Transparency",
    description: "Create a platform passengers and institutions trust by delivering clear, real-time information and fostering confidence in public systems."
  },
  {
    title: "Drive Educational Access through Reliable Commutes",
    description: "Support students in reaching their schools and colleges on time, removing transportation challenges that hinder access to education."
  },
  {
    title: "Encourage Sustainable Transport Solutions",
    description: "Reduce environmental impact by optimizing public transport use, decreasing unnecessary wait times, and making public transportation more appealing."
  },
  {
    title: "Support Institutions with Effective Transport Management",
    description: "Enable schools, colleges, and organizations to better manage transportation logistics with easy, centralized access to bus and driver locations."
  },
];
