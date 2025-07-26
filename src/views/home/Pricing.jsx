import React from "react";

const Pricing = () => {
  const plans = [
    {
      title: "Basic",
      price: "Free",
      features: ["Bus Tracking", "Basic Routes", "Ad-Supported"],
    },
    {
      title: "Premium",
      price: "$4.99/month",
      features: ["Advanced Tracking", "Priority Support", "No Ads", "Unlimited Routes"],
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: ["Custom Solutions", "Dedicated Support", "API Access", "Enterprise Integration"],
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center"
            >
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">{plan.title}</h3>
              <p className="text-4xl font-extrabold mb-6">
                {plan.price}
              </p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-600">
                    <span className="text-indigo-600 font-bold">✔</span> {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-indigo-600 text-gray-900 px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
