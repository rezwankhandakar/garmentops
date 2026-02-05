import React from "react";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[350px] md:h-[450px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('https://i.ibb.co.com/tpsy6ytq/Black-White-Simple-Fashion-Sale-Medium-Banner-Landscape.png')",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center text-center md:text-left">
       
       
        <div className="flex justify-center pt-65 md:justify-start gap-3 flex-wrap">
          <Link
            to="/products"
            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-primary-focus hover:scale-105 transition-transform duration-300"
          >
            View Products
          </Link>
          <Link
            to="/contact"
            className="bg-white text-primary font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
