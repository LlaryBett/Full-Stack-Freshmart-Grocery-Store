import React from "react";

const Faq = () => (
  <div className="container mx-auto px-4 py-24 max-w-3xl">
    <h1 className="text-3xl font-bold text-green-700 mb-6">Frequently Asked Questions (FAQ)</h1>
    <div className="mb-6">
      <h2 className="font-semibold text-lg mb-2">How do I place an order?</h2>
      <p className="text-gray-700">Browse our products, add items to your cart, and proceed to checkout. Follow the prompts to complete your order.</p>
    </div>
    <div className="mb-6">
      <h2 className="font-semibold text-lg mb-2">What payment methods do you accept?</h2>
      <p className="text-gray-700">We accept Visa, Mastercard, PayPal, Apple Pay, and M-Pesa.</p>
    </div>
    <div className="mb-6">
      <h2 className="font-semibold text-lg mb-2">How can I track my order?</h2>
      <p className="text-gray-700">After placing your order, you’ll receive a confirmation email with tracking details. You can also view your order status in your account.</p>
    </div>
    <div className="mb-6">
      <h2 className="font-semibold text-lg mb-2">Can I return or exchange items?</h2>
      <p className="text-gray-700">Yes! Please see our Returns & Refunds page for details on our return policy.</p>
    </div>
    <div>
      <h2 className="font-semibold text-lg mb-2">Need more help?</h2>
      <p className="text-gray-700">Contact us at <a href="mailto:support@freshmart.com" className="text-green-600 hover:underline">support@freshmart.com</a>.</p>
    </div>
  </div>
);

export default Faq;
