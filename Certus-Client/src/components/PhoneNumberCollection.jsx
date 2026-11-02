import React, { useState } from "react";
import LoadingButton from "./LoadingButton";

const PhoneNumberCollection = ({ user, onPhoneSubmit, isLoading = false }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const validatePhoneNumber = (phone) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");

    // Check if it's exactly 10 digits
    if (cleaned.length === 10) {
      return true;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    const formattedPhone = phoneNumber.replace(/\D/g, "");
    onPhoneSubmit(formattedPhone);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(cleaned);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center px-6 py-20">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxkZWZzPgogICAgICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgICAgICA8L3BhdHRlcm4+CiAgICA8L2RlZnM+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgogICAgPC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 max-w-md w-full">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white/20">
                <span className="text-2xl font-bold text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-300">
            To complete your account setup, please provide your phone number
          </p>
        </div>

        {/* Phone Number Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-white/20 bg-white/10 text-gray-300 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit phone number"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  maxLength="10"
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-1">
                We'll use this for order notifications and support
              </p>
            </div>

            <div className="space-y-3">
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Setting up account..."
                className="w-full"
                size="large"
                color="blue"
                disabled={phoneNumber.length !== 10}
              >
                Complete Setup
              </LoadingButton>
            </div>
          </form>

          {/* Account Info */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center text-sm text-gray-400">
              <p className="mb-2">Account Details:</p>
              <p className="text-white">{user?.email}</p>
              {user?.email_verified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mt-2">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberCollection;
