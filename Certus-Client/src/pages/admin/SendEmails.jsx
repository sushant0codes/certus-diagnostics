import React from "react";

export default function SendEmails() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Send Emails</h1>
      <p className="text-lg text-gray-300 mb-8">
        Communicate with patients and staff
      </p>

      <div className="bg-slate-800 p-6 rounded-lg">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipients
              </label>
              <select className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none">
                <option>All Patients</option>
                <option>Specific Patient</option>
                <option>Staff Members</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Template
              </label>
              <select className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none">
                <option>Test Results Available</option>
                <option>Appointment Reminder</option>
                <option>Health Tips</option>
                <option>Custom Message</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
              placeholder="Enter email subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              rows={6}
              className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
              placeholder="Enter your message here..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90"
            >
              Send Email
            </button>
            <button
              type="button"
              className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500"
            >
              Save Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
