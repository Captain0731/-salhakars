import React from "react";
import { useNavigate } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";

// Separate component for feature cards with unique modern design
const FeatureCard = ({ feature, index, onClick }) => {
  const { ref: featureRef, isVisible: isFeatureVisible } = useScrollAnimation({ 
    threshold: 0.2, 
    rootMargin: '50px',
    delay: index * 100 
  });
  
  const [isHovered, setIsHovered] = React.useState(false);

  // Unique icons for each feature
  const icons = {
    1: "⚖️",
    2: "🔗",
    3: "📚",
    4: "📄",
    5: "🤖",
    6: "🎬"
  };

  return (
    <div
      ref={featureRef}
      className={`group cursor-pointer transform transition-all duration-500 flex ${
        isFeatureVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-90'
      }`}
      onClick={() => onClick(feature.path)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        transitionDelay: `${index * 80}ms`,
        perspective: '1000px'
      }}
    >
      <div 
        className="relative w-full flex flex-col overflow-hidden"
        // style={{
        //   transformStyle: 'preserve-3d',
        //   transform: isHovered ? 'rotateY(5deg) rotateX(-5deg)' : 'rotateY(0deg) rotateX(0deg)',
        //   transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
        // }}
      >
        {/* Glassmorphism Card with Gradient Background */}
        <div 
          className="relative rounded-3xl sm:rounded-[2rem] flex flex-col flex-grow backdrop-blur-xl border border-white/200  overflow-hidden"
          // style={{
          //   background: isHovered 
          //     ? `linear-gradient(145deg, ${feature.color}15 0%, ${feature.secondaryColor}25 50%, ${feature.color}15 100%)`
          //     : `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)`,
          //   boxShadow: isHovered 
          //     ? `0 20px 60px -15px ${feature.color}40, 0 0 30px ${feature.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.6)`
          //     : '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          //   transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
          // }}
        >
          {/* Animated Gradient Overlay */}
          <div 
            // className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            // style={{
            //   background: `linear-gradient(135deg, ${feature.color}08 0%, ${feature.secondaryColor}12 50%, ${feature.color}08 100%)`,
            //   backgroundSize: '200% 200%',
            //   animation: isHovered ? 'gradientShift 3s ease infinite' : 'none'
            // }}
          />

          {/* Floating Icon Badge */}
            {/* <div 
              className="absolute -top-4 -right-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-all duration-500 z-10"
              style={{
                background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.secondaryColor} 100%)`,
                boxShadow: `0 8px 25px ${feature.color}40, inset 0 2px 8px rgba(255, 255, 255, 0.3)`,
                transform: isHovered ? 'translate(3px, 3px) scale(1.1) rotate(10deg)' : 'translate(0, 0) scale(1) rotate(0deg)'
              }}
            >
              <span className="relative z-10">{icons[feature.id] || "✨"}</span>
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: feature.color }}
              />
            </div> */}

          {/* Content Container */}
          <div className="p-4 sm:p-6 md:p-7 flex flex-col flex-grow relative z-10 pt-12 sm:pt-14">
            {/* Title */}
            <h3 
              className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 leading-tight transition-all duration-300"
              style={{ 
                color: isHovered ? feature.color : '#1E65AD',
                fontFamily: 'Helvetica Hebrew Bold, sans-serif',
                transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                textShadow: isHovered ? `0 2px 10px ${feature.color}30` : 'none',
                fontWeight: 600
              }}
            >
              {feature.title}
            </h3>

            {/* Description */}
            <p 
              className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5 flex-grow transition-colors duration-300"
              style={{ 
                fontFamily: 'Roboto, sans-serif',
                color: isHovered ? '#4B5563' : '#6B7280'
              }}
            >
              {feature.description}
            </p>

            {/* Interactive Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200/50">
              <span 
                className="text-xs sm:text-sm font-normal transition-all duration-300 inline-flex items-center gap-2"
                style={{ 
                  color: feature.color,
                  fontFamily: 'Roboto, sans-serif',
                  transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
                  fontWeight: 400
                }}
              >
                Explore Feature
                <svg 
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              
              {/* Animated Arrow Circle */}
              <div 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  background: isHovered 
                    ? `linear-gradient(135deg, ${feature.color} 0%, ${feature.secondaryColor} 100%)`
                    : `${feature.color}10`,
                  transform: isHovered ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                  boxShadow: isHovered 
                    ? `0 6px 18px ${feature.color}40`
                    : `0 2px 6px ${feature.color}20`
                }}
              >
                <svg 
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5" 
                  style={{ color: isHovered ? 'white' : feature.color }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Corner Accent */}
          <div 
            className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
            // style={{
            //   background: `radial-gradient(circle at top left, ${feature.color}, transparent)`,
            //   transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            //   transition: 'all 0.5s ease'
            // }}
          />
        </div>

        {/* Glow Effect Behind Card */}
        {/* <div 
          className="absolute inset-0 rounded-3xl sm:rounded-[2rem] -z-10 blur-2xl transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${feature.color}40, ${feature.secondaryColor}40)`,
            opacity: isHovered ? 0.6 : 0,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        /> */}
      </div>
    </div>
  );
};

const Features = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const internalRef = React.useRef(null);
  const sectionRef = ref || internalRef;
  const { ref: animationRef, isVisible } = useScrollAnimation({ threshold: 0.1, rootMargin: '50px' });
  
  // Combine refs
  React.useEffect(() => {
    if (typeof sectionRef === 'function') {
      sectionRef(animationRef.current);
    } else if (sectionRef && 'current' in sectionRef) {
      sectionRef.current = animationRef.current;
    }
  }, [sectionRef, animationRef]);

  const features = [
    {
      id: 1,
      title: "Legal Judgment",
      description: "Access comprehensive database of legal judgments from High Courts and Supreme Court with advanced search and filtering capabilities.",
      color: "#1E65AD",
      secondaryColor: "#CF9B63",
      path: "/high-court-judgments"
    },
    {
      id: 2,
      title: "Law Mapping",
      description: "Seamlessly map between old and new legal frameworks including BNS to IEA, BNSS to CrPC, and BNS to IPC transitions.",
      color: "#CF9B63",
      secondaryColor: "#1E65AD",
      path: "/old-to-new-law-mapping"
    },
    {
      id: 3,
      title: "Law Library",
      description: "Comprehensive collection of Central Acts and State Acts with detailed provisions, amendments, and cross-references.",
      color: "#8C969F",
      secondaryColor: "#1E65AD",
      path: "/browse-acts"
    },
    {
      id: 4,
      title: "Legal Templates",
      description: "Professional legal document templates for various purposes including contracts, agreements, and legal notices.",
      color: "#1E65AD",
      secondaryColor: "#8C969F",
      path: "/legal-template"
    },
    {
      id: 5,
      title: "Smart Dashboard",
      description: "Intelligent legal assistant powered by AI to answer queries, provide legal guidance, and assist with research.",
      color: "#CF9B63",
      secondaryColor: "#8C969F",
      path: "/dashboard"
    },
    {
      id: 6,
      title: "YouTube Summarizer",
      description: "AI-powered summarization of legal YouTube videos, extracting key insights and important legal concepts.",
      color: "#8C969F",
      secondaryColor: "#CF9B63",
      path: "/youtube-summary"
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <section 
      ref={(node) => {
        if (typeof sectionRef === 'function') {
          sectionRef(node);
        } else if (sectionRef && 'current' in sectionRef) {
          sectionRef.current = node;
        }
        if (animationRef.current !== node) {
          animationRef.current = node;
        }
      }}
      className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
      style={{ 
        backgroundColor: '#F9FAFC'
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#1E65AD' }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full opacity-10 animate-float animation-delay-1000" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 rounded-full opacity-10 animate-float animation-delay-2000" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full opacity-10 animate-float animation-delay-3000" style={{ backgroundColor: '#1E65AD' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 sm:mb-4 md:mb-6 px-2 sm:px-4 leading-tight tracking-tight"
            style={{ 
              color: '#1E65AD', 
              fontFamily: 'Helvetica Hebrew Bold, sans-serif',
              textShadow: '0 2px 4px rgba(30, 101, 173, 0.1)',
              letterSpacing: '-0.02em',
              fontWeight: 600
            }}
          >
            Our Features
          </h2>
          
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-3 sm:px-4"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            Comprehensive legal-tech solutions for lawyers, students, and researchers that save hours every week.
          </p>
          
          <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 sm:h-1 mx-auto rounded-full" style={{ backgroundColor: '#CF9B63' }}></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.id}
              feature={feature}
              index={index}
              onClick={handleFeatureClick}
            />
          ))}
        </div>

      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
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
});

Features.displayName = 'Features';

export default Features;
