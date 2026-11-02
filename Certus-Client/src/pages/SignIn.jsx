import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PhoneNumberCollection from "../components/PhoneNumberCollection";
import AuthModal from "../components/AuthModal";
import { API_BASE_URL } from "../config/api";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, isLoggedIn, loading } = useAuth();
  const [showPhoneCollection, setShowPhoneCollection] = useState(false);
  const [newUserData, setNewUserData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, loading, navigate]);

  const handlePhoneSubmit = async (phoneNumber) => {
    setFormLoading(true);

    console.log("Submitting phone number for user:", newUserData);
    console.log("Phone number:", phoneNumber);

    try {
      // Update user with phone number in database
      const requestBody = {
        user_id: newUserData.patient_id,
        phone_number: phoneNumber,
      };

      console.log("Request body:", requestBody);

      const response = await fetch(`${API_BASE_URL}/update-user-phone.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response result:", result);

      if (result.success) {
        // Update user data with phone number
        const updatedUserData = { ...newUserData, phone: phoneNumber };

        // Store user data using AuthContext
        login(updatedUserData);

        // Show success modal
        setShowModal({
          type: "success",
          title: "Welcome!",
          message: `Hi ${newUserData.name}! Your account has been created successfully.`,
        });

        // Hide phone collection and redirect to dashboard
        setShowPhoneCollection(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);

        console.log("Phone number saved successfully:", updatedUserData);
      } else {
        console.error("Failed to save phone number:", result.message);
        setShowModal({
          type: "error",
          title: "Failed to Save",
          message:
            result.message || "Unable to save phone number. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error saving phone number:", error);
      setShowModal({
        type: "error",
        title: "Error",
        message: "Failed to save phone number. Please try again.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handlePhoneSkip = () => {
    // Store user data without phone number
    login(newUserData);

    // Hide phone collection and redirect to dashboard
    setShowPhoneCollection(false);
    navigate("/dashboard");

    console.log("Phone number collection skipped");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google login successful:", credentialResponse);
    setFormLoading(true);

    try {
      // Decode the JWT token to get user info
      const userInfo = JSON.parse(
        atob(credentialResponse.credential.split(".")[1])
      );
      console.log("User info:", userInfo);

      // Extract user data from Google response
      const googleUserData = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        google_id: userInfo.sub,
        email_verified: userInfo.email_verified,
        phone: userInfo.phone_number || userInfo.phone || "", // Extract phone if available
      };

      // Send to backend to check if user exists or create new user
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
          // New user created - show phone number collection
          console.log("New user created:", result.user);
          setNewUserData(result.user);
          setShowPhoneCollection(true);

          // Don't redirect yet - wait for phone number collection
        } else {
          // Existing user logged in
          console.log("Setting success modal for existing user");

          // Store user data using AuthContext first
          login(result.user);

          setShowModal({
            type: "success",
            title: "Welcome Back!",
            message: `Hi ${userInfo.name}! You have been logged in successfully.`,
            onModalClose: () => {
              console.log("Modal closed, navigating to dashboard");
              navigate("/dashboard");
            },
          });

          console.log("Existing user logged in:", result.user);
        }

        console.log("User authenticated successfully:", result.user);
      } else {
        console.error("Authentication failed:", result.message);
        setShowModal({
          type: "error",
          title: "Authentication Failed",
          message:
            result.message || "Unable to authenticate. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during Google authentication:", error);
      setShowModal({
        type: "error",
        title: "Authentication Error",
        message: "Authentication failed. Please try again.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
    setShowModal({
      type: "error",
      title: "Google Login Failed",
      message: "Unable to sign in with Google. Please try again.",
    });
  };

  return (
    <>
      {/* Show phone number collection for new Google users */}
      {showPhoneCollection && newUserData && (
        <PhoneNumberCollection
          user={newUserData}
          onPhoneSubmit={handlePhoneSubmit}
          onSkip={handlePhoneSkip}
          isLoading={formLoading}
        />
      )}

      {/* Main SignIn Form - hidden when collecting phone number */}
      {!showPhoneCollection && (
        <div className="min-h-full flex items-center justify-center px-4 md:px-6 py-20">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Welcome to Certus Diagnostics
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Sign in to access your health reports and book tests
              </p>
            </div>

            <div className="bg-slate-800/40 p-6 md:p-8 rounded-xl">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Sign In
                </h2>
                <p className="text-gray-400 text-sm">
                  Continue with your Google account
                </p>
              </div>

              {/* Google OAuth Login */}
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
                    className="animate-spin h-6 w-6 text-blue-500"
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
                  <span className="ml-3 text-gray-300">Signing you in...</span>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showModal && (
        <AuthModal
          type={showModal.type}
          title={showModal.title}
          message={showModal.message}
          onClose={() => {
            if (showModal.onModalClose) {
              showModal.onModalClose();
            }
            setShowModal(null);
          }}
        />
      )}
    </>
  );
}
