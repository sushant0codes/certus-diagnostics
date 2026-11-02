import React from "react";

export default function Login() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <p className="text-lg text-gray-300 mb-8">Access your account</p>

      <div className="bg-slate-800 p-8 rounded-lg max-w-md mx-auto">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded hover:bg-primary/90 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
