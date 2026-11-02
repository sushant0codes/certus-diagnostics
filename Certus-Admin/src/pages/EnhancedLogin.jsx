import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import AuthNotificationModal from "../components/AuthNotificationModal";
import { API_ENDPOINTS } from "../utils/api";

export default function EnhancedLogin() {
  const navigate = useNavigate();
  const { login, isLoggedIn, loading } = useAdminAuth();
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, loading, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google admin login successful:", credentialResponse);
    setFormLoading(true);

    try {
      // Send to backend for 2-stage authentication
      const response = await fetch(API_ENDPOINTS.adminGoogleAuth, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "google_login",
          credential: credentialResponse.credential,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Successful login - admin exists and is approved
        console.log("Admin logged in:", result.admin);

        // Store admin data using AdminAuthContext
        login(result.admin);

        // Show success notification
        setNotification({
          type: "success",
          title: "Welcome Back!",
          message: `${result.admin.name}, you have been logged in successfully.`,
          details: [
            { label: "Email", value: result.admin.email },
            { label: "Role", value: "Administrator" },
          ],
          buttonText: "Go to Dashboard",
        });

        // Navigate after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else if (result.pending) {
        // Admin access request is pending approval
        console.log("Admin approval pending:", result.message);
        setNotification({
          type: "pending",
          title: "Approval Pending",
          message: result.message,
          details: [
            { label: "Status", value: "Waiting for approval" },
            { label: "Next Steps", value: "Check your email for updates" },
          ],
          buttonText: "Understood",
        });
      } else {
        // Authentication failed
        console.error("Admin authentication failed:", result.message);
        setNotification({
          type: "error",
          title: "Authentication Failed",
          message: result.message,
          buttonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error during Google admin authentication:", error);
      setNotification({
        type: "error",
        title: "Connection Error",
        message:
          "Unable to connect to the server. Please check your internet connection and try again.",
        buttonText: "Retry",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google admin login failed:", error);
    setNotification({
      type: "error",
      title: "Google Sign-In Failed",
      message:
        "Unable to sign in with Google. Please try again or contact support if the problem persists.",
      buttonText: "Close",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Login Page */}
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Secure 2-Stage Authentication</p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Administrator Sign In
            </h2>

            <div className="space-y-6">
              {/* Security Notice */}
              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <div>
                    <p className="text-blue-200 text-sm font-medium">
                      Secure Authentication
                    </p>
                    <p className="text-blue-300 text-xs mt-1">
                      Only authorized Google accounts can access the admin
                      panel. New admin requests require super admin approval.
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Login Button */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-4">
                    Sign in with your Google account
                  </p>

                  {formLoading ? (
                    <div className="flex items-center justify-center py-3">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
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
                      <span className="text-blue-400">Authenticating...</span>
                    </div>
                  ) : (
                    <div className="google-signin-container">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        width="300"
                        theme="filled_blue"
                        auto_select={true}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-xs">
                  © 2025 Certus Diagnostics. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Authorized access only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <AuthNotificationModal
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </>
  );
}
