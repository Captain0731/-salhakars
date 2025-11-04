import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import VideoSection from "../components/landing/VideoSection";
import Testimonials from "../components/landing/Testimonials";
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
      <Stats />
      <VideoSection />
      <Testimonials />
      <div id="blogs">
        <BlogSection />
      </div>
      <FAQ />
      <Footer />
    </div>
  );
}

export default LandingPage;


