import React from "react";

export default function YourReports() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Your Reports</h1>
      <p className="text-lg text-gray-300 mb-8">
        Access and download your test reports
      </p>

      <div className="bg-slate-800 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Recent Reports</h2>
        <div className="space-y-4">
          <div className="bg-slate-700 p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Blood Test Report</h3>
              <p className="text-gray-300">Date: 2025-08-20</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
              Download
            </button>
          </div>
          <div className="bg-slate-700 p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Thyroid Function Test</h3>
              <p className="text-gray-300">Date: 2025-08-18</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
