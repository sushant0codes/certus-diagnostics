import React from "react";
import Nav from "../components/client/Nav.jsx";

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary p-2 sm:p-3 md:p-4 lg:p-6">
      <Nav />
      <main className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
