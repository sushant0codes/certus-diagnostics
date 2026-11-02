import React from "react";

export default function Logo() {
  return (
    <div className="flex-shrink-0">
      <img
        src="/logof.png"
        alt="Certus Diagnostics - Partnered with Thyrocare"
        className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain filter brightness-110 contrast-110 sharp pl-2 sm:pl-6 md:pl-10"
        style={{
          imageRendering: "crisp-edges",
          filter: "contrast(1.1) brightness(1.1) saturate(1.1)",
        }}
      />
    </div>
  );
}
