import SearchBar from "./SearchBar";
import QuickLinks from "./QuickLinks";

const Hero = () => {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#F9FAFC' }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#1E65AD' }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full opacity-10 animate-float animation-delay-1000" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 rounded-full opacity-10 animate-float animation-delay-2000" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full opacity-10 animate-float animation-delay-3000" style={{ backgroundColor: '#1E65AD' }}></div>
        
        {/* Gradient orbs */}
        <div className="absolute w-80 h-80 rounded-full top-10 left-10 blur-3xl animate-pulse-slow opacity-20" style={{ backgroundColor: '#1E65AD' }}></div>
        <div className="absolute w-64 h-64 rounded-full bottom-16 right-16 blur-3xl animate-pulse-slow opacity-20 animation-delay-2000" style={{ backgroundColor: '#CF9B63' }}></div>
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

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20"></div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
