import { useEffect } from "react";

export default function AuthModal({
  type = "success",
  title,
  message,
  onClose,
}) {
  useEffect(() => {
    console.log("AuthModal mounted with:", { type, title, message });

    // Auto-close success modals after 3 seconds
    if (type === "success") {
      const timer = setTimeout(() => {
        console.log("Auto-closing success modal");
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose, title, message]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
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
      case "info":
        return (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-10 w-10 text-blue-600"
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
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-600",
          hover: "hover:bg-green-700",
        };
      case "error":
        return {
          bg: "bg-red-600",
          hover: "hover:bg-red-700",
        };
      case "info":
        return {
          bg: "bg-blue-600",
          hover: "hover:bg-blue-700",
        };
      default:
        return {
          bg: "bg-gray-600",
          hover: "hover:bg-gray-700",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn border border-slate-700">
        <div className="text-center">
          {getIcon()}

          <h3 className="mt-6 text-2xl font-bold text-white">{title}</h3>

          <p className="mt-3 text-gray-300 text-base">{message}</p>

          <button
            onClick={onClose}
            className={`mt-6 w-full ${colors.bg} ${
              colors.hover
            } text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-${
              type === "success" ? "green" : type === "error" ? "red" : "blue"
            }-500`}
          >
            {type === "success" ? "Continue" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
