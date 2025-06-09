import React from "react";

const Help = () => (
  <div className="container mx-auto px-4 py-24 max-w-3xl">
    <h1 className="text-3xl font-bold text-green-700 mb-6">Help Center</h1>
    <p className="text-gray-700 mb-4">
      Welcome to the FreshMart Help Center. Here you can find answers to common questions, get support, and learn how to make the most of your shopping experience.
    </p>
    <ul className="list-disc pl-6 text-gray-700 mb-4">
      <li>Need assistance? Email us at <a href="mailto:support@freshmart.com" className="text-green-600 hover:underline">support@freshmart.com</a></li>
      <li>Call our support line: <a href="tel:+1234567890" className="text-green-600 hover:underline">(123) 456-7890</a></li>
    </ul>
    <p className="text-gray-700">For more detailed topics, check our FAQ, Shipping, Returns, and Privacy Policy pages.</p>
  </div>
);

export default Help;
