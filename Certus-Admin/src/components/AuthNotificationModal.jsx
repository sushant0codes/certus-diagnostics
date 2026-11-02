import React from "react";

export default function AuthNotificationModal({ notification, onClose }) {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return (
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case "pending":
        return (
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
        );
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case "success":
        return {
          border: "border-green-200",
          title: "text-green-800",
          message: "text-green-700",
          button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      case "pending":
        return {
          border: "border-yellow-200",
          title: "text-yellow-800",
          message: "text-yellow-700",
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "error":
        return {
          border: "border-red-200",
          title: "text-red-800",
          message: "text-red-700",
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      default:
        return {
          border: "border-gray-200",
          title: "text-gray-800",
          message: "text-gray-700",
          button: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full border-2 ${colors.border} transform transition-all duration-300 ease-in-out relative animate-fadeIn`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-full p-1"
          aria-label="Close notification"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6">
          <div className="text-center">
            {getIcon()}

            <h3 className={`text-xl font-bold ${colors.title} mb-3`}>
              {notification.title}
            </h3>

            <div className={`text-sm ${colors.message} mb-6`}>
              <p className="leading-relaxed">{notification.message}</p>
            </div>

            {notification.details && (
              <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                {notification.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="font-medium text-gray-700">
                      {detail.label}:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
            >
              {notification.buttonText || "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
