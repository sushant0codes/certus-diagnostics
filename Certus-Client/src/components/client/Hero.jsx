import React from "react";

export default function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
          Medical Reports, <br className="hidden md:block" /> Finally Made{" "}
          <span className="text-blue-400">Clear</span>.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          We translate complex medical data into simple, actionable insights. No
          more confusion, just a clear path to better health.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
          Book Your First Test
        </button>
      </div>
    </section>
  );
}
