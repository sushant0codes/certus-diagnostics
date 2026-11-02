import React from "react";
import AdminNav from "../components/admin/AdminNav.jsx";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary p-2 sm:p-3 md:p-4 lg:p-6">
      <AdminNav />
      <main className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
