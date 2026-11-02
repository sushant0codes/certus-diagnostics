import React, { useState } from "react";

export default function AgilusPackages() {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [showMobileDetails, setShowMobileDetails] = useState(true);

  const packages = [
    {
      name: "Complete Care Vital",
      parameters: 74,
      originalPrice: "₹2500",
      offerPrice: "₹1999",
      color: "bg-blue-600",
    },
    {
      name: "Complete Care Vital Pro",
      parameters: 92,
      originalPrice: "₹3500",
      offerPrice: "₹2499",
      color: "bg-blue-700",
    },
    {
      name: "Complete Care Active",
      parameters: 97,
      originalPrice: "₹4500",
      offerPrice: "₹2999",
      color: "bg-blue-800",
    },
    {
      name: "Complete Care Active Pro",
      parameters: 100,
      originalPrice: "₹5500",
      offerPrice: "₹3999",
      color: "bg-blue-900",
    },
    {
      name: "Complete Care Premium",
      parameters: 106,
      originalPrice: "₹7500",
      offerPrice: "₹6499",
      color: "bg-gray-800",
    },
  ];

  const tests = [
    {
      name: "CBC (Complete Blood Count)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Fasting Glucose (Diabetes)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "HbA1c (Diabetes)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Vitamin D (Bone Health)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Calcium (Bone Health)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Vitamin B12 (Nerve & Anemia)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Urinalysis (Kidney)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "TSH (Thyroid)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "FT3, FT4, TSH (Thyroid)",
      vital: false,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Kidney Screen (Kidney)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Liver Screen (Liver)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "hs-CRP / CRP (Heart)",
      vital: true,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Lipid Profile (Heart)",
      vital: false,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Kidney Profile - KFT (Kidney)",
      vital: false,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Liver Profile - LFT (Liver)",
      vital: false,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Iron (Anemia)",
      vital: false,
      vitalPro: true,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "TIBC (Anemia)",
      vital: false,
      vitalPro: false,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Phosphorus (Bone Health)",
      vital: false,
      vitalPro: false,
      active: true,
      activePro: true,
      premium: true,
    },
    {
      name: "Magnesium (Muscle & Heart)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: true,
      premium: true,
    },
    {
      name: "Folic Acid (Anemia)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: true,
      premium: true,
    },
    {
      name: "RA Factor (Bone & Joints)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: true,
      premium: true,
    },
    {
      name: "Cortisol (Stress)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: true,
      premium: true,
    },
    {
      name: "Allergy Screen Adult (Allergy)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: true,
      premium: true,
    },
    {
      name: "APhAI (Heart)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: false,
      premium: true,
    },
    {
      name: "APhAI (Heart)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: false,
      premium: true,
    },
    {
      name: "Lp(a) (Heart)",
      vital: false,
      vitalPro: false,
      active: false,
      activePro: false,
      premium: true,
    },
  ];

  const getTestValue = (test, packageIndex) => {
    const keys = ["vital", "vitalPro", "active", "activePro", "premium"];
    return test[keys[packageIndex]];
  };

  return (
    <section className="py-8 md:py-16 bg-slate-800/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
            <img
              src="/agilus.png"
              alt="Agilus"
              className="h-6 md:h-8 object-contain"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Complete Care Packages
            </h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Comprehensive health checkup packages designed for different health
            needs and budgets
          </p>
        </div>

        {/* Mobile Package Selection */}
        <div className="md:hidden mb-6">
          <div className="flex flex-col gap-2 mb-4">
            {packages.map((pkg, index) => (
              <button
                key={index}
                onClick={() => setSelectedPackage(index)}
                className={`p-3 rounded-lg text-white text-xs font-semibold transition-all ${
                  pkg.color
                } ${
                  selectedPackage === index
                    ? "ring-2 ring-white scale-105"
                    : "opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left flex-1">
                    <div className="mb-1">{pkg.name}</div>
                    <div className="text-xs opacity-90">
                      {pkg.parameters} Parameters
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-xs line-through opacity-75">
                      {pkg.originalPrice}
                    </div>
                    <div className="font-bold">{pkg.offerPrice}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMobileDetails(!showMobileDetails)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            {showMobileDetails ? "Hide" : "Show"} Test Details
          </button>
        </div>

        {/* Mobile Test Details */}
        {showMobileDetails && (
          <div className="md:hidden mb-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div
                className={`p-4 text-white ${packages[selectedPackage].color}`}
              >
                <h3 className="font-bold text-lg">
                  {packages[selectedPackage].name}
                </h3>
                <p className="text-sm opacity-90">
                  {packages[selectedPackage].parameters} Parameters
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {tests.map((test, index) => {
                  const isIncluded = getTestValue(test, selectedPackage);
                  return (
                    <div
                      key={index}
                      className={`p-3 border-b border-gray-100 flex items-center justify-between ${
                        isIncluded ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <span className="text-sm text-gray-700 flex-1 pr-3">
                        {test.name}
                      </span>
                      {isIncluded ? (
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-red-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Comparison Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-6 bg-gray-50">
            <div className="p-4 lg:p-6 border-r border-gray-200">
              <h3 className="font-bold text-gray-800 text-sm lg:text-lg">
                Parameters
              </h3>
            </div>
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`p-3 lg:p-6 text-center text-white ${pkg.color} ${
                  index < packages.length - 1 ? "border-r border-white/20" : ""
                }`}
              >
                <h4 className="font-bold text-xs lg:text-sm mb-2">
                  {pkg.name}
                </h4>
                <div className="bg-white/20 rounded-full px-2 lg:px-3 py-1 mb-3">
                  <span className="text-xs font-semibold">
                    {pkg.parameters} Parameters
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Test Rows */}
          <div className="max-h-96 overflow-y-auto">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`grid grid-cols-6 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-colors`}
              >
                <div className="p-3 lg:p-4 border-r border-gray-200">
                  <span className="text-xs lg:text-sm text-gray-700 font-medium">
                    {test.name}
                  </span>
                </div>
                <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                  {test.vital ? (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                  {test.vitalPro ? (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                  {test.active ? (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                  {test.activePro ? (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="p-3 lg:p-4 text-center">
                  {test.premium ? (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cancer Markers Row */}
          <div className="bg-red-50 border-t-2 border-red-200">
            <div className="grid grid-cols-6">
              <div className="p-3 lg:p-4 border-r border-gray-200">
                <span className="text-xs lg:text-sm text-gray-700 font-bold">
                  Cancer Markers
                </span>
              </div>
              <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                <div className="text-xs text-blue-600 font-semibold">
                  For Women:
                  <br />
                  CA 125 (Ovary)
                </div>
              </div>
              <div className="p-3 lg:p-4 text-center border-r border-gray-200">
                <div className="text-xs text-blue-600 font-semibold">
                  For Women:
                  <br />
                  CA 125 (Ovary)
                </div>
              </div>
              <div className="p-3 lg:p-4 text-center">
                <div className="text-xs text-blue-600 font-semibold">
                  For Women: CA 125,
                  <br />
                  CA 15.3 (Ovary &<br />
                  Comprehensive)
                  <br />
                  For Men: PSA, CEA
                </div>
              </div>
            </div>
          </div>

          {/* Smart Score Row */}
          <div className="bg-gray-800 text-white">
            <div className="grid grid-cols-6">
              <div className="p-3 lg:p-4 border-r border-gray-600">
                <span className="text-xs lg:text-sm font-bold">
                  SMART
                  <br />
                  Test Parameters
                </span>
              </div>
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`p-3 lg:p-4 text-center ${
                    index < packages.length - 1
                      ? "border-r border-gray-600"
                      : ""
                  }`}
                >
                  <div className="text-lg lg:text-2xl font-bold mb-2">
                    {pkg.parameters}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="bg-gray-900 text-white">
            <div className="grid grid-cols-6">
              <div className="p-3 lg:p-4 border-r border-gray-600">
                <div className="text-xs lg:text-sm">
                  <div className="font-bold mb-1">
                    Sum of Individual Test MRP
                  </div>
                  <div className="font-bold">Offer Price</div>
                </div>
              </div>
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`p-3 lg:p-4 text-center ${
                    index < packages.length - 1
                      ? "border-r border-gray-600"
                      : ""
                  }`}
                >
                  <div className="text-xs lg:text-sm line-through text-gray-400 mb-1">
                    {pkg.originalPrice}
                  </div>
                  <div className="text-sm lg:text-xl font-bold text-green-400">
                    {pkg.offerPrice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Packages */}

        {/* Call to Action */}
        <div className="mt-6 md:mt-8 text-center">
          <div className="bg-blue-600 text-white rounded-lg py-3 px-6 md:py-4 md:px-8 inline-block">
            <div className="text-lg md:text-xl font-bold">
              To Book a Test Call: 8198074000
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
