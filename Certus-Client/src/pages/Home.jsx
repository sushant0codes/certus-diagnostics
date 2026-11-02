import React from "react";
import Hero from "../components/client/Hero";
import ServicesCarousel from "../components/client/ServicesCarousel";
import AgilusPackages from "../components/client/AgilusPackages";
import TestimonialsCarousel from "../components/client/TestimonialsCarousel";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesCarousel />
      <AgilusPackages />
      <TestimonialsCarousel />
    </>
  );
}
