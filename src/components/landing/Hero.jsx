import React, { forwardRef } from "react";
import SearchBar from "./SearchBar";
import QuickLinks from "./QuickLinks";

const Hero = forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{ 
        background: 'radial-gradient(ellipse at center, #B8D4E8 0%, #D8E8F0 30%, #FCFFFF 50%, #F5F5F0 100%)'
      }}
    >
      {/* Soft Radial Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(184, 212, 232, 0.4) 0%, rgba(245, 245, 240, 0.2) 70%, transparent 100%)'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center mb-8 sm:mb-12">
          
          <img src="/logo31.png" alt="सलहाकार Logo" className="w-1/2 h-21 object-contain max-h-24 sm:max-h-32 md:max-h-30 lg:max-h-38 xl:max-h-36" />

          <p 
            className=" sm:text-lg md:text-xl lg:text-2xl max-w-4xl px-4 leading-relaxed text-center text-3xl"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            India's first{" "}
            <span 
              className="font-semibold"
              style={{ color: '#000' }}
            >
              AI-Powered
            </span>{" "}
            multilingual legal tech platform
          </p>
          
          <div className="w-16 sm:w-20 md:w-24 h-1 mx-auto mt-4 sm:mt-6 rounded-full" style={{ backgroundColor: '#CF9B63' }}></div>
        </div>

        {/* Search + Quick Links */}
        <div className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto">
          <SearchBar />
          <QuickLinks />
        </div>
      </div>

    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
