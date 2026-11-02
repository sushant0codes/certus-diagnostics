import React, { useState, useEffect } from "react";
import { API_BASE_URL, UPLOAD_BASE_URL } from "../config/api";

const TestCard = ({ test }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-2 md:p-6 hover:bg-slate-700 transition-colors duration-300 h-fit">
      {/* Vertical layout for better image display */}
      <div className="flex flex-col items-center text-center">
        {/* Large Vertical Test Image */}
        <div className="mb-3 md:mb-6 w-full">
          <img
            src={
              test.photo
                ? `${UPLOAD_BASE_URL}/${test.photo}`
                : "/placeholder-test.jpg"
            }
            alt={test.name}
            className="w-full h-[70vh] md:w-90 md:h-[42rem] object-cover rounded-lg shadow-xl border-2 border-gray-600"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDMyMCA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNTEyIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNjAgMTUwTDIyMCAzMDBIMTYwSDEwMEwxNjAgMTUwWiIgZmlsbD0iIzYzNzQ4QiIvPgo8Y2lyY2xlIGN4PSIxNjAiIGN5PSIxMjAiIHI9IjMwIiBmaWxsPSIjNjM3NDhCIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iNDAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRlc3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=";
            }}
          />
        </div>

        {/* Test Information */}
        <div className="w-full px-2 md:px-0">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">
            {test.name}
          </h3>
          <div className="flex flex-col items-center gap-1 md:gap-2 mb-3 md:mb-4">
            <span className="text-xl md:text-2xl font-bold text-blue-400">
              ₹{test.price}
            </span>
            <span className="text-xs text-gray-400">
              Added on {new Date(test.date_created).toLocaleDateString()}
            </span>
          </div>

          {/* Test Features/Benefits */}
          <div className="mb-4 md:mb-6 text-left">
            <h4 className="text-sm font-semibold text-gray-300 mb-2 text-center">
              Test Includes:
            </h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Comprehensive analysis</li>
              <li>• Digital report delivery</li>
              <li>• Expert consultation available</li>
              <li>• Quick and accurate results</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Book Now
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestsGrid = () => {
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("tests");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tests
        const testsResponse = await fetch(`${API_BASE_URL}/tests`);
        const testsData = await testsResponse.json();

        // Fetch packages
        const packagesResponse = await fetch(`${API_BASE_URL}/packages`);
        const packagesData = await packagesResponse.json();

        if (testsData.success) {
          setTests(testsData.data);
        }

        if (packagesData.success) {
          setPackages(packagesData.data);
        }
      } catch (err) {
        setError("Failed to load tests and packages");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const currentData = activeTab === "tests" ? tests : packages;

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex mb-8 bg-slate-800 rounded-lg p-1">
        <button
          className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
            activeTab === "tests"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("tests")}
        >
          Individual Tests ({tests.length})
        </button>
        <button
          className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
            activeTab === "packages"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("packages")}
        >
          Test Packages ({packages.length})
        </button>
      </div>

      {/* Tests/Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <TestCard
              key={activeTab === "tests" ? item.test_id : item.package_id}
              test={item}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">
              No {activeTab} available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsGrid;
