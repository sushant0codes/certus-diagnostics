import { useEffect } from "react";

const NotificationModal = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification && notification.autoClose !== false) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-green-600"
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
      case "error":
        return (
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-600"
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
      case "warning":
        return (
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        );
      case "info":
      default:
        return (
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getColors = (type) => {
    switch (type) {
      case "success":
        return {
          border: "border-green-200",
          title: "text-green-800",
          message: "text-green-600",
          button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      case "error":
        return {
          border: "border-red-200",
          title: "text-red-800",
          message: "text-red-600",
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "warning":
        return {
          border: "border-yellow-200",
          title: "text-yellow-800",
          message: "text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "info":
      default:
        return {
          border: "border-blue-200",
          title: "text-blue-800",
          message: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const colors = getColors(notification.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full border-2 ${colors.border} transform transition-all duration-300 ease-in-out relative`}
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
            {getIcon(notification.type)}

            <h3 className={`text-lg font-semibold ${colors.title} mb-2`}>
              {notification.title}
            </h3>

            <div className={`text-sm ${colors.message} mb-4 space-y-2`}>
              {notification.message && <p>{notification.message}</p>}

              {notification.details && (
                <div className="bg-gray-50 rounded-lg p-3 text-left">
                  {notification.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="font-medium text-gray-700">
                        {detail.label}:
                      </span>
                      <span className="text-gray-900">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {notification.actions?.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.handler();
                    if (action.closeAfter !== false) onClose();
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                    action.style || colors.button
                  }`}
                >
                  {action.label}
                </button>
              )) || (
                <button
                  onClick={onClose}
                  className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
