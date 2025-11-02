import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import VideoSection from "../components/landing/VideoSection";
import Testimonials from "../components/landing/Testimonials";
import Pricing from "../components/landing/Pricing";
import BlogSection from "../components/landing/BlogSection";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <div className="font-sans bg-white overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <VideoSection />
      <Testimonials />
      <div id="pricing">
        <Pricing />
      </div>
      <div id="blogs">
        <BlogSection />
      </div>
      <FAQ />
      <Footer />
    </div>
  );
}

export default LandingPage;


