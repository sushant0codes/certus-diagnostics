import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../common/Logo.jsx";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center px-4 sm:px-6 py-4 justify-between w-full border-b border-gray-400">
      <Logo />

      {/* Mobile Menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex text-gray-200 text-2xl font-semibold justify-end flex-1 space-x-16 pr-20">
        <Link
          to="/"
          className="hover:text-white cursor-pointer transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          to="/book-test"
          className="hover:text-white cursor-pointer transition-colors duration-200"
        >
          Book A Test
        </Link>
        <Link
          to="/reports"
          className="hover:text-white cursor-pointer transition-colors duration-200"
        >
          Your Reports
        </Link>
        <Link
          to="/login"
          className="hover:text-white cursor-pointer transition-colors duration-200"
        >
          Login
        </Link>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`
        fixed top-0 right-0 h-full w-64 bg-slate-800 border-l border-gray-400 md:hidden z-50
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-300 hover:text-white focus:outline-none transition-colors duration-200"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          <Link
            to="/"
            className="block text-gray-200 hover:text-white cursor-pointer py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-600"
          >
            Home
          </Link>
          <Link
            to="/book-test"
            className="block text-gray-200 hover:text-white cursor-pointer py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-600"
          >
            Book A Test
          </Link>
          <Link
            to="/reports"
            className="block text-gray-200 hover:text-white cursor-pointer py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-600"
          >
            Your Reports
          </Link>
          <Link
            to="/login"
            className="block text-gray-200 hover:text-white cursor-pointer py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-600"
          >
            Login
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}
