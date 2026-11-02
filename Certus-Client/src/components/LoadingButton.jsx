import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingButton = ({
  isLoading = false,
  disabled = false,
  children,
  loadingText = "Loading...",
  className = "",
  size = "medium",
  color = "blue",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed";

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3 text-base",
    large: "px-6 py-4 text-lg",
  };

  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white",
    green: "bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white",
    red: "bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white",
    indigo:
      "bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white",
    gray: "bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white",
    gradient:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white shadow-lg",
  };

  const spinnerSizes = {
    small: "small",
    medium: "small",
    large: "medium",
  };

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${colorClasses[color]}
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner
            size={spinnerSizes[size]}
            color="white"
            className="border-2"
          />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
