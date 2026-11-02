import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingButton from "../components/LoadingButton";

export default function Dashboard() {
  const { isLoggedIn, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Function to get a more reliable Google profile picture URL
  const getOptimizedProfilePicture = (originalUrl) => {
    if (!originalUrl) return null;

    // If it's a Google profile picture, try to use a smaller size to reduce rate limiting
    if (originalUrl.includes("googleusercontent.com")) {
      // Replace s96-c with s64-c for smaller size, which may have better rate limits
      return originalUrl.replace(/s\d+-c/, "s64-c");
    }

    return originalUrl;
  };

  useEffect(() => {
    // Only redirect if not loading and not logged in
    if (!loading && (!isLoggedIn || !user)) {
      // Redirect to sign in if not logged in
      navigate("/sign-in");
      return;
    }
  }, [isLoggedIn, user, navigate, loading]);

  // Reset image error state when user profile picture changes
  useEffect(() => {
    setImageLoadError(false);
  }, [user?.profile_picture]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdateProfile = () => {
    // Navigate to profile update page (to be created)
    alert("Profile update feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <LoadingSpinner
          size="large"
          color="white"
          text="Loading dashboard..."
        />
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <LoadingSpinner size="large" color="white" text="Redirecting..." />
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-300">
              Manage your tests, reports, and profile
            </p>
          </div>
          <LoadingButton
            onClick={handleLogout}
            isLoading={isLoggingOut}
            loadingText="Logging out..."
            color="red"
            size="medium"
          >
            Logout
          </LoadingButton>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-800/40 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {user.profile_picture && !imageLoadError ? (
                <img
                  src={getOptimizedProfilePicture(user.profile_picture)}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                  onError={() => {
                    console.warn(
                      "Profile picture failed to load, using fallback"
                    );
                    setImageLoadError(true);
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              )}
              {user.email_verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white">
                {user.name || "User"}
              </h2>
              <p className="text-gray-300">{user.email}</p>
              {user.phone && <p className="text-gray-300">{user.phone}</p>}
              <div className="flex items-center mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.email_verified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.email_verified ? "Verified" : "Unverified"}
                </span>
                {user.google_id && (
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Google Account
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Book a Test Card */}
          <div
            className="bg-slate-800/40 rounded-xl p-6 hover:bg-slate-800/60 transition-colors cursor-pointer"
            onClick={() => navigate("/book-a-test")}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white ml-4">
                Book a Test
              </h3>
            </div>
            <p className="text-gray-300">
              Schedule your diagnostic tests with us
            </p>
            <div className="mt-4 text-green-400 font-medium">Book Now →</div>
          </div>

          {/* Your Reports Card */}
          <div
            className="bg-slate-800/40 rounded-xl p-6 hover:bg-slate-800/60 transition-colors cursor-pointer"
            onClick={() => navigate("/your-reports")}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white ml-4">
                Your Reports
              </h3>
            </div>
            <p className="text-gray-300">View and download your test reports</p>
            <div className="mt-4 text-blue-400 font-medium">View Reports →</div>
          </div>

          {/* Contact Us Card */}
          <div
            className="bg-slate-800/40 rounded-xl p-6 hover:bg-slate-800/60 transition-colors cursor-pointer"
            onClick={() => navigate("/contact-us")}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white ml-4">
                Contact Us
              </h3>
            </div>
            <p className="text-gray-300">Get in touch with our support team</p>
            <div className="mt-4 text-purple-400 font-medium">Contact →</div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-slate-800/40 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-slate-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-300">
                  Account created successfully
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "Recently"}
              </span>
            </div>
            {user.last_login && (
              <div className="flex items-center justify-between py-3 border-b border-slate-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Last login</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(user.last_login).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-center py-6 text-gray-400">
              <span>
                More activity data will appear here as you use our services
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
