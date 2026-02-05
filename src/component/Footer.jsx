import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">

        {/* Logo & Description */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">GarmentOps</h2>
          <p className="max-w-xs">
            GarmentOps is your one-stop solution for managing products, orders, and users efficiently.
          </p>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} GarmentOps. All rights reserved.</p>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Useful Links</h3>
          <ul className="flex flex-col gap-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/products" className="hover:underline">All Products</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
