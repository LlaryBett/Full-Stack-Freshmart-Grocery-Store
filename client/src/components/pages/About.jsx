import React from "react";

const About = () => (
  <div className="container mx-auto px-4 py-24 max-w-3xl">
    <h1 className="text-3xl font-bold text-green-700 mb-6">About FreshMart</h1>
    <p className="text-gray-700 mb-4">
      <strong>FreshMart</strong> is your trusted online grocery store, dedicated to delivering the freshest produce and quality products right to your doorstep. We partner directly with local farmers and reputable suppliers to ensure you get the best selection at affordable prices.
    </p>
    <p className="text-gray-700 mb-4">
      Our mission is to make grocery shopping convenient, safe, and enjoyable for everyone. Whether you’re looking for daily essentials, organic options, or exclusive deals, FreshMart is here to serve you.
    </p>
    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Why Shop With Us?</h2>
    <ul className="list-disc pl-6 text-gray-700 mb-4">
      <li>Fresh produce sourced daily</li>
      <li>Wide range of groceries and household items</li>
      <li>Fast and reliable delivery</li>
      <li>Secure payment options</li>
      <li>Friendly customer support</li>
    </ul>
    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Our Promise</h2>
    <p className="text-gray-700 mb-4">
      We are committed to quality, transparency, and customer satisfaction. Thank you for choosing FreshMart as your grocery partner!
    </p>
    <div className="mt-8">
      <span className="text-green-600 font-semibold">Contact us:</span>
      <div className="text-gray-700 mt-2">
        Email: <a href="mailto:support@freshmart.com" className="text-green-600 hover:underline">support@freshmart.com</a><br />
        Phone: <a href="tel:+1234567890" className="text-green-600 hover:underline">(123) 456-7890</a>
      </div>
    </div>
  </div>
);

export default About;
