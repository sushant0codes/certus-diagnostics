import React from "react";

const LoadingSpinner = ({
  size = "medium",
  color = "blue",
  text = "",
  fullScreen = false,
  className = "",
}) => {
  // Size variants
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
    xlarge: "w-16 h-16",
  };

  // Color variants
  const colorClasses = {
    blue: "border-blue-500",
    white: "border-white",
    indigo: "border-indigo-500",
    green: "border-green-500",
    gray: "border-gray-400",
  };

  const spinnerClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    border-4 border-t-transparent 
    rounded-full 
    animate-spin
    drop-shadow-lg
    ${className}
  `;

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xlarge: "text-xl",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center animate-pulse">
          <div className="flex flex-col items-center space-y-4">
            <div className={spinnerClasses}></div>
            {text && (
              <p className={`text-white ${textSizeClasses[size]} font-medium`}>
                {text}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={spinnerClasses}></div>
      {text && (
        <p
          className={`text-white ${textSizeClasses[size]} font-medium text-center`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
