import React, { useEffect, useState } from "react";

export default function ServicesCarousel() {
  const packages = [
    {
      title: "Aarogyam Care Profile 1",
      parameters: "62 Parameters",
      originalPrice: "₹2299",
      discountedPrice: "₹1149",
      tests: [
        "Lipid Profile [10]",
        "Liver Profile [12]",
        "Kidney Profile [7]",
        "Thyroid Profile [3]",
        "Diabetes Profile [2]",
        "CBC [28]",
      ],
      icon: (
        <svg
          className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mx-auto mb-2 md:mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Aarogyam Care Profile 2",
      parameters: "69 Parameters",
      originalPrice: "₹3399",
      discountedPrice: "₹1699",
      tests: ["Vitamin Profile [2]", "Cardiac Risk Markers [5]"],
      icon: (
        <svg
          className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mx-auto mb-2 md:mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Aarogyam Care Profile 3",
      parameters: "78 Parameters",
      originalPrice: "₹4799",
      discountedPrice: "₹2399",
      tests: [
        "Iron Deficiency Profile [4]",
        "Serum Electrolytes [2]",
        "Rheumatoid Factor (RF)",
        "Erythrocyte Sedimentation Rate (ESR)",
        "C-reactive Protein (CRP)",
      ],
      icon: (
        <svg
          className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mx-auto mb-2 md:mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 3);
    };
    window.addEventListener("resize", updateItemsPerView);
    updateItemsPerView();
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev >= packages.length - itemsPerView ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? packages.length - itemsPerView : prev - 1
    );
  };

  return (
    <section id="tests" className="md:py-16 bg-slate-900/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-2">
          <img
            src="/thyrocare.png"
            alt="Thyrocare"
            className="h-8 md:h-12 object-contain"
          />
          <img
            src="/aarogyam.jpg"
            alt="Aarogyam"
            className="h-8 md:h-12 object-contain"
          />
          <span className="text-xl md:text-3xl font-bold text-white">
            Packages
          </span>
        </div>
        <p className="text-center text-gray-400 mb-6 md:mb-12 text-sm md:text-base px-4">
          Comprehensive health checkup packages with 50% discount available.
        </p>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full md:w-1/3 px-2 md:px-4"
              >
                <div className="relative bg-white/5 backdrop-blur-sm p-4 md:p-8 rounded-xl text-center md:h-full md:flex md:flex-col border border-slate-600/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50 group">
                  {/* Subtle background accent */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Professional Icon */}
                    <div className="mb-3 md:mb-6">
                      <div className="bg-slate-700/50 p-3 md:p-4 rounded-xl mx-auto w-fit border border-slate-600/50 group-hover:border-blue-400/50 transition-colors duration-300">
                        {pkg.icon}
                      </div>
                    </div>
                    {/* Package Title */}
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3 group-hover:text-blue-100 transition-colors duration-300">
                      {pkg.title}
                    </h3>
                    {/* Parameters Badge */}
                    <div className="inline-block bg-slate-700/40 border border-slate-500/30 rounded-lg px-3 md:px-4 py-1.5 md:py-2 mb-3 md:mb-6">
                      <p className="text-blue-300 text-xs md:text-sm font-medium">
                        {pkg.parameters}
                      </p>
                    </div>
                    {/* Professional Pricing Section */}
                    <div className="mb-3 md:mb-6">
                      <div className="bg-slate-800/40 border border-slate-600/40 rounded-lg p-3 md:p-4">
                        <div className="flex items-center justify-center gap-3 md:gap-4">
                          <span className="text-red-400 text-base md:text-lg font-semibold line-through">
                            {pkg.originalPrice}
                          </span>
                          <span className="text-xl md:text-2xl font-bold text-green-400">
                            {pkg.discountedPrice}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 md:mt-2">
                          Inclusive of all taxes
                        </p>
                      </div>
                    </div>
                    {/* Professional Tests List */}
                    <div className="text-left mb-3 md:mb-6 md:flex-grow">
                      {/* Previous package reference */}
                      {index > 0 && (
                        <>
                          <div className="text-center mb-6">
                            <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border-2 border-blue-400/40 rounded-xl p-6 shadow-lg">
                              <div className="flex items-center justify-center mb-3">
                                <div className="bg-blue-500/30 border border-blue-400/50 rounded-full p-2 mr-3">
                                  <svg
                                    className="w-5 h-5 text-blue-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                  </svg>
                                </div>
                                <span className="text-blue-200 font-bold text-lg tracking-wide">
                                  INCLUDES
                                </span>
                              </div>
                              <h4 className="text-white font-bold text-xl mb-2 leading-tight">
                                {packages[index - 1].title}
                              </h4>
                              <div className="inline-block bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2">
                                <span className="text-blue-200 font-semibold text-base">
                                  {packages[index - 1].parameters}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center mb-6">
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/40 rounded-full p-3 shadow-lg">
                              <svg
                                className="w-6 h-6 text-green-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Tests with professional styling */}
                      <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg p-4">
                        <h4 className="text-white font-medium text-sm mb-3 text-center">
                          Additional Tests Included:
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          {pkg.tests.map((test, testIndex) => (
                            <li key={testIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="hover:text-white transition-colors">
                                {test}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Enhanced CTA Button */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                      <a
                        href="#"
                        className="relative block w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-blue-500/50 group-hover:border-blue-400"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Book Now
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 md:-left-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full focus:outline-none transition"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 md:-right-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full focus:outline-none transition"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
