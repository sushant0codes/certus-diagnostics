import React from "react";
import TestsGrid from "../../components/TestsGrid.jsx";

export default function BookATest() {
  return (
    <div className="text-white min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Book A Test
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Schedule your diagnostic tests with ease
        </p>
        <p className="text-gray-400">
          Choose from our comprehensive range of tests and packages for accurate
          health monitoring
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-slate-800 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tests or packages..."
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none">
              <option value="">All Categories</option>
              <option value="blood">Blood Tests</option>
              <option value="urine">Urine Tests</option>
              <option value="thyroid">Thyroid Tests</option>
              <option value="diabetes">Diabetes Tests</option>
            </select>
            <select className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none">
              <option value="">Price Range</option>
              <option value="0-500">₹0 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000+">₹1000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Grid Component */}
      <TestsGrid />
    </div>
  );
}
