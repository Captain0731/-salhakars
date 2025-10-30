import SearchBar from "./SearchBar";
import QuickLinks from "./QuickLinks";

const Hero = () => {
  return (
    <section
      className="relative min-h-[100vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{ 
        background: 'radial-gradient(ellipse at center, #B8D4E8 0%, #D8E8F0 30%, #E8EEF2 60%, #F5F5F0 100%)'
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
          
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 tracking-tight px-4 leading-tight"
            style={{ 
              color: '#000', 
              fontFamily: 'Helvetica Hebrew Bold, sans-serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              letterSpacing: '-0.02em'
            }}
          >
            सलहाकार
          </h1>

          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl px-4 leading-relaxed text-center"
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
};

export default Hero;
