import React from "react";

export default function ManageWebsite() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Website</h1>
      <p className="text-lg text-gray-300 mb-8">
        Update website content and settings
      </p>

      <div className="space-y-8">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Homepage Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero Title
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                placeholder="Main headline for homepage"
                defaultValue="Welcome to Certus Diagnostics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero Description
              </label>
              <textarea
                rows={3}
                className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                placeholder="Description text for homepage"
                defaultValue="Your trusted partner for diagnostic services"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Test Services</h2>
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Blood Test</h3>
                <p className="text-gray-300">
                  Complete blood count and analysis
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90">
                  Edit
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-500">
                  Remove
                </button>
              </div>
            </div>
            <div className="bg-slate-700 p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Thyroid Test</h3>
                <p className="text-gray-300">
                  Comprehensive thyroid function tests
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90">
                  Edit
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-500">
                  Remove
                </button>
              </div>
            </div>
          </div>
          <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-500">
            Add New Service
          </button>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Website Settings</h2>
          <div className="flex gap-4">
            <button className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90">
              Update Logo
            </button>
            <button className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500">
              Change Theme
            </button>
            <button className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500">
              Backup Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
