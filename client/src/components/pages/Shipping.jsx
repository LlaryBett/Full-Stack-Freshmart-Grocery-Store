import React from "react";

const Shipping = () => (
  <div className="container mx-auto px-4 py-24 max-w-3xl">
    <h1 className="text-3xl font-bold text-green-700 mb-6">Shipping & Delivery</h1>
    <p className="text-gray-700 mb-4">
      We offer fast and reliable delivery to your doorstep. Orders are processed within 24 hours and delivered within 1-3 business days.
    </p>
    <ul className="list-disc pl-6 text-gray-700 mb-4">
      <li>Standard Delivery: 1-3 business days</li>
      <li>Express Delivery: Same-day delivery for orders placed before 12pm</li>
      <li>Free delivery for orders over ksh 1000</li>
      <li>Track your order in your account dashboard</li>
    </ul>
    <p className="text-gray-700">For any shipping questions, contact us at <a href="mailto:support@freshmart.com" className="text-green-600 hover:underline">support@freshmart.com</a>.</p>
  </div>
);

export default Shipping;
