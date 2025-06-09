import React from "react";

const Returns = () => (
  <div className="container mx-auto px-4 py-24 max-w-3xl">
    <h1 className="text-3xl font-bold text-green-700 mb-6">Returns & Refunds</h1>
    <p className="text-gray-700 mb-4">
      We want you to be 100% satisfied with your purchase. If you are not happy with your order, you can return eligible items within 7 days of delivery.
    </p>
    <ul className="list-disc pl-6 text-gray-700 mb-4">
      <li>Contact our support team to initiate a return</li>
      <li>Items must be unused and in original packaging</li>
      <li>Refunds are processed within 3-5 business days after receiving the returned item</li>
      <li>Some perishable items may not be eligible for return</li>
    </ul>
    <p className="text-gray-700">For more details, email <a href="mailto:support@freshmart.com" className="text-green-600 hover:underline">support@freshmart.com</a>.</p>
  </div>
);

export default Returns;
