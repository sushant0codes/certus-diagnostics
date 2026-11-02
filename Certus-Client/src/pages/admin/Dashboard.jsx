import React, { useState, useEffect } from "react";
import ApiService from "../../utils/api.js";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_patients: 0,
    tests_today: 0,
    pending_home_collections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      } else {
        console.error("Failed to load dashboard stats:", response.message);
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-lg text-gray-300 mb-8">Welcome to the admin panel</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Total Patients</h3>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : stats.total_patients}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Tests Today</h3>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : stats.tests_today}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">
            Pending Home Collections
          </h3>
          <p className="text-3xl font-bold text-white">
            {loading ? "..." : stats.pending_home_collections}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90">
            Add New Patient
          </button>
          <button className="bg-slate-700 text-white px-6 py-3 rounded hover:bg-slate-600">
            Generate Report
          </button>
          <button className="bg-slate-700 text-white px-6 py-3 rounded hover:bg-slate-600">
            Send Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
