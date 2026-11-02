import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/client/Header";
import StarRating from "./components/common/StarRating";
import ServicesCarousel from "./components/client/ServicesCarousel";
import Hero from "./components/client/Hero";
import TestimonialsCarousel from "./components/client/TestimonialsCarousel";
import Footer from "./components/common/Footer";
import LoginModal from "./components/LoginModal";
import { useAuth } from "./contexts/AuthContext";

// Page components
import Home from "./pages/Home";
import BookATest from "./pages/BookATest";
import YourReports from "./pages/YourReports";
import SignIn from "./pages/SignIn";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisited");

    // Show modal if user hasn't visited and is not logged in
    if (!hasVisited && !isLoggedIn) {
      setShowLoginModal(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, [isLoggedIn]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <Router>
      {/* This style tag injects the keyframes for the marquee animation */}
      <style>
        {`
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        /* This animates the container to the left by 50% of its width, which is the length of the original (non-duplicated) content */
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        /* Animation speed increased by reducing duration from 35s to 25s */
                        animation: marquee 25s linear infinite;
                    }
                    .hover\\:pause:hover {
                        /* This useful utility pauses the animation when the user hovers over it */
                        animation-play-state: paused;
                    }
                `}
      </style>
      <div
        style={{
          backgroundColor: "#2A3A5A",
          fontFamily: "'Inter', sans-serif",
          color: "#E0E0E0",
        }}
        className="antialiased min-h-screen flex flex-col overflow-x-hidden"
      >
        {/* Login Modal */}
        {showLoginModal && <LoginModal onClose={handleCloseModal} />}

        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book-a-test" element={<BookATest />} />
            <Route path="/your-reports" element={<YourReports />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
