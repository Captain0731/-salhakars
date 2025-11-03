import React, { forwardRef } from "react";
import SearchBar from "./SearchBar";
import QuickLinks from "./QuickLinks";

const Hero = forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-2 sm:px-4 md:px-6 lg:px-8"
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
      <div className="relative z-10 max-w-6xl mx-auto w-full py-8 sm:py-12 md:py-16">
        {/* Heading */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4">
          
          <img 
            src="/logo31.png" 
            alt="सलहाकार Logo" 
            className="w-64 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem] h-auto object-contain mb-4 sm:mb-6" 
          />

          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl px-2 sm:px-4 leading-relaxed text-center"
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
          
          <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 sm:h-1 mx-auto mt-3 sm:mt-4 md:mt-6 rounded-full" style={{ backgroundColor: '#CF9B63' }}></div>
        </div>

        {/* Search + Quick Links */}
        <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-4xl mx-auto px-2 sm:px-4">
          <SearchBar />
          <QuickLinks />
        </div>
      </div>

    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
