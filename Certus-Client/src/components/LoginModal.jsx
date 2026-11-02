import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PhoneNumberCollection from "./PhoneNumberCollection";
import { API_BASE_URL } from "../config/api";

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPhoneCollection, setShowPhoneCollection] = useState(false);
  const [newUserData, setNewUserData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handlePhoneSubmit = async (phoneNumber) => {
    setFormLoading(true);

    try {
      const requestBody = {
        user_id: newUserData.patient_id,
        phone_number: phoneNumber,
      };

      const response = await fetch(`${API_BASE_URL}/update-user-phone.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success) {
        const updatedUserData = { ...newUserData, phone: phoneNumber };
        login(updatedUserData);
        setShowPhoneCollection(false);
        onClose();
        navigate("/dashboard");
      } else {
        alert(`Failed to save phone number: ${result.message}`);
      }
    } catch (error) {
      console.error("Error saving phone number:", error);
      alert("Failed to save phone number. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePhoneSkip = () => {
    login(newUserData);
    setShowPhoneCollection(false);
    onClose();
    navigate("/dashboard");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setFormLoading(true);

    try {
      const userInfo = JSON.parse(
        atob(credentialResponse.credential.split(".")[1])
      );

      const googleUserData = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        google_id: userInfo.sub,
        email_verified: userInfo.email_verified,
        phone: userInfo.phone_number || userInfo.phone || "",
      };

      const response = await fetch(`${API_BASE_URL}/google-auth.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "google_login",
          credential: credentialResponse.credential,
          user_data: googleUserData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.is_new_user) {
          setNewUserData(result.user);
          setShowPhoneCollection(true);
        } else {
          login(result.user);
          onClose();
          navigate("/dashboard");
        }
      } else {
        alert(`Authentication failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during Google authentication:", error);
      alert("Authentication failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert("Google login failed. Please try again.");
  };

  if (showPhoneCollection && newUserData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <PhoneNumberCollection
          user={newUserData}
          onPhoneSubmit={handlePhoneSubmit}
          onSkip={handlePhoneSkip}
          isLoading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800/95 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative border border-slate-700/50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Logo or Icon */}
        <div className="text-center mb-6">
          <div className="hidden md:flex items-center justify-center mx-auto mb-4">
            <img
              src="/logo5.png"
              alt="Certus Diagnostics Logo"
              className="h-20 object-contain"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome to Certus Diagnostics
          </h2>
          <p className="text-gray-400 text-sm">
            Sign in to access your health reports and book tests
          </p>
        </div>

        {/* Google Sign In Button */}
        <div className="mb-6">
          <div className="w-full google-signin-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          {formLoading && (
            <div className="mt-4 flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="ml-3 text-gray-300 text-sm">
                Signing you in...
              </span>
            </div>
          )}
        </div>

        {/* Continue as Guest Button */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white transition-colors underline"
          >
            Continue as a guest
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center border-t border-slate-700 pt-4">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
