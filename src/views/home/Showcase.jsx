import React from "react";
import showcaseImg1 from "../../assets/img/home/1.jpeg";
import showcaseImg2 from "../../assets/img/home/2.jpeg";
import showcaseImg3 from "../../assets/img/home/3.jpeg";
import showcaseImg4 from "../../assets/img/home/4.jpeg";
import showcaseImg5 from "../../assets/img/home/5.jpeg";
import showcaseImg6 from "../../assets/img/home/6.png";
import showcaseImg8 from "../../assets/img/home/8.jpeg";

const showcases = [
  {
    img: showcaseImg1,
    title: "Enhanced Student Safety",
    description:
      "Real-time tracking and notifications provide parents and students with peace of mind, knowing exactly where the bus is, which strengthens trust in the institute’s transportation system.",
  },
  {
    img: showcaseImg2,
    title: "Improved Communication",
    description:
      "Instant alerts for bus arrivals, delays, and replacements keep parents, students, and institute staff well-informed and reduce miscommunication.",
  },
  {
    img: showcaseImg3,
    title: "Cost Savings",
    description:
      "SmartBus360 eliminates the need for costly GPS hardware, as it uses drivers’ mobile devices for tracking. This reduces initial setup costs and ongoing maintenance expenses.",
  },
  {
    img: showcaseImg4,
    title: "Efficient Route Management",
    description:
      "With an easy-to-use admin panel, institutes can update bus details, add or remove stops, and optimize routes, resulting in smoother operations and minimized delays.",
  },
  {
    img: showcaseImg5,
    title: "Positive Reputation",
    description:
      "Adopting SmartBus360 demonstrates the institute’s commitment to safety, efficiency, and technology, enhancing its reputation and appeal to parents and prospective students.",
  },
  {
    img: showcaseImg6,
    title: "Smart Branding",
    description:
      "Institutes can display the SmartBus360 logo on the front and back of each bus, showcasing a commitment to adopting smart technology, enhancing the institute’s reputation on the road.",
  },
  {
    img: showcaseImg6,
    title: "AI-Powered Student Safety",
    description:
      "SmartBus360 uses real-time GPS and AI-powered predictive alerts to keep parents and institutes informed of every movement. The system ensures students' safety with precision tracking, instant notifications, and intelligent risk monitoring—so you always know where your child is and when they'll arrive."
  },
  {
    img: showcaseImg8,
    title: "Intelligent Communication System",
    description:
      "No more confusion or repeated phone calls! SmartBus360’s AI-enhanced communication tools send real-time alerts for delays, arrivals, or emergencies. Parents, transport managers, and institute staff stay synced through automated updates—minimizing human error and enhancing trust."
  },
];

const Showcase = () => {
  return (
    <section className="mb-6 bg-gray-50 py-16 text-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Title Section */}
        <div className="mb-16 text-center">
          <h2 className="text-xl font-extrabold text-gray-800 lg:text-3xl">
            Key Benefits of Smart Bus 360 for Institutions
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 lg:text-xl">
            Discover the unparalleled benefits of Smart Bus 360 for your
            institution's transportation system.
          </p>
        </div>

        {/* Showcase List */}
        <div className="space-y-12">
          {showcases.map((showcase, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg lg:flex-row"
            >
              {/* Image Section */}
              <div className="overflow-hidden rounded-l-lg lg:w-1/4">
                <img
                  src={showcase.img}
                  alt={showcase.title}
                  className="h-36 w-full object-cover lg:h-full"
                />
              </div>

              {/* Text Content */}
              <div className="p-4 lg:w-3/4">
                <h3 className="mb-2 text-lg font-semibold text-blue-700">
                  {showcase.title}
                </h3>
                <p className="text-md text-gray-800">{showcase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
