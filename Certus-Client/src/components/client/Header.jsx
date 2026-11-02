import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/Logo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

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

  // Reset image error state when user profile picture changes
  useEffect(() => {
    setImageLoadError(false);
    // Debug logging
    console.log("Header - User profile picture URL:", user?.profile_picture);
    console.log(
      "Header - Optimized URL:",
      getOptimizedProfilePicture(user?.profile_picture)
    );
  }, [user?.profile_picture]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-slate-800/30 backdrop-blur-lg sticky top-0 z-50 w-full overflow-x-hidden">
      <nav className="container mx-auto px-4 md:px-6 py-1 md:py-2 flex justify-between items-center max-w-full">
        <Link to="/" className="flex items-center flex-shrink-0">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/book-a-test"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Book a Test
          </Link>
          <Link
            to="/your-reports"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Your Reports
          </Link>
          <Link
            to="/contact-us"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact Us
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                {user?.profile_picture && !imageLoadError ? (
                  <img
                    src={getOptimizedProfilePicture(user.profile_picture)}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={() => {
                      console.warn(
                        "Header profile picture failed to load, using fallback"
                      );
                      setImageLoadError(true);
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                )}
                <span className="text-gray-300 text-sm">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-1 pb-3 space-y-2">
          <Link
            to="/"
            className="block text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/book-a-test"
            className="block text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Book a Test
          </Link>
          <Link
            to="/your-reports"
            className="block text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Your Reports
          </Link>
          <Link
            to="/contact-us"
            className="block text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="block text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-2 py-2">
                {user?.profile_picture && !imageLoadError ? (
                  <img
                    src={getOptimizedProfilePicture(user.profile_picture)}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={() => {
                      console.warn(
                        "Mobile header profile picture failed to load, using fallback"
                      );
                      setImageLoadError(true);
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                )}
                <span className="text-gray-300 text-sm">{user?.name}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full bg-red-500 hover:bg-red-600 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="block bg-blue-500 hover:bg-blue-600 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
