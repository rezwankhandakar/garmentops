import React from "react";
import { FaRegClipboard, FaShippingFast, FaSmile } from "react-icons/fa";

const steps = [
  {
    id: 1,
    icon: <FaRegClipboard className="text-4xl text-primary mb-2" />,
    title: "Select Products",
    description: "Browse our catalog and select the products you want to order."
  },
  {
    id: 2,
    icon: <FaShippingFast className="text-4xl text-primary mb-2" />,
    title: "Fast Delivery",
    description: "Once you place the order, we ensure quick and safe delivery to your doorstep."
  },
  {
    id: 3,
    icon: <FaSmile className="text-4xl text-primary mb-2" />,
    title: "Enjoy & Repeat",
    description: "Receive your products, enjoy them, and come back for more!"
  }
];

const HowItWorks = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 bg-base-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center bg-base-200 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
