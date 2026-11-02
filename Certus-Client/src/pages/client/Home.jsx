import React from "react";

export default function Home() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Certus Diagnostics</h1>
      <p className="text-lg text-gray-300">
        Your trusted partner for diagnostic services
      </p>
      <div className="mt-8">
        <p className="text-gray-300 mb-4">
          We provide comprehensive diagnostic services to help you maintain your
          health.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Book A Test</h3>
            <p className="text-gray-300">
              Schedule your diagnostic tests online
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">View Reports</h3>
            <p className="text-gray-300">Access your test reports securely</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Expert Care</h3>
            <p className="text-gray-300">Professional healthcare services</p>
          </div>
        </div>
      </div>
    </div>
  );
}
