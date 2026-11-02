import React, { useState } from "react";
import LoadingButton from "../components/LoadingButton";

export default function BookATest() {
  const [loadingStates, setLoadingStates] = useState({});

  const handleBookTest = (testName) => {
    setLoadingStates((prev) => ({ ...prev, [testName]: true }));

    // Simulate booking process
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [testName]: false }));
      alert(`Booking for ${testName} completed!`);
    }, 2000);
  };

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Book a Test
        </h1>
        <div className="bg-slate-800/40 p-8 rounded-xl">
          <p className="text-gray-300 mb-6 text-center">
            Choose from our comprehensive range of diagnostic tests and
            packages.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Complete Health Checkup
              </h3>
              <p className="text-gray-400 mb-4">
                Comprehensive screening of your vital organs
              </p>
              <LoadingButton
                isLoading={loadingStates["health-checkup"]}
                loadingText="Booking..."
                onClick={() => handleBookTest("health-checkup")}
                color="blue"
                className="w-full"
              >
                Book Now
              </LoadingButton>
            </div>

            <div className="bg-slate-700/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Diabetic Care Package
              </h3>
              <p className="text-gray-400 mb-4">
                Essential tests for diabetes monitoring
              </p>
              <LoadingButton
                isLoading={loadingStates["diabetic-care"]}
                loadingText="Booking..."
                onClick={() => handleBookTest("diabetic-care")}
                color="blue"
                className="w-full"
              >
                Book Now
              </LoadingButton>
            </div>

            <div className="bg-slate-700/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">
                Heart Health Panel
              </h3>
              <p className="text-gray-400 mb-4">
                Cardiovascular risk assessment
              </p>
              <LoadingButton
                isLoading={loadingStates["heart-health"]}
                loadingText="Booking..."
                onClick={() => handleBookTest("heart-health")}
                color="blue"
                className="w-full"
              >
                Book Now
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
