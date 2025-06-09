import React from "react";

const Privacy = () => (
  <div className="container mx-auto px-4 py-24 max-w-3xl">
    <h1 className="text-3xl font-bold text-green-700 mb-6">Privacy Policy</h1>
    <p className="text-gray-700 mb-4">
      Your privacy is important to us. We are committed to protecting your personal information and using it only as described in this policy.
    </p>
    <ul className="list-disc pl-6 text-gray-700 mb-4">
      <li>We collect only necessary information to process your orders</li>
      <li>Your data is never sold to third parties</li>
      <li>All transactions are secured with industry-standard encryption</li>
      <li>You can request to view or delete your data at any time</li>
    </ul>
    <p className="text-gray-700">For questions about our privacy practices, contact <a href="mailto:support@freshmart.com" className="text-green-600 hover:underline">support@freshmart.com</a>.</p>
  </div>
);

export default Privacy;
