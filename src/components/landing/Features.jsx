import React from "react";
import { useNavigate } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";

// Separate component for feature cards to use hooks properly
const FeatureCard = ({ feature, index, onClick }) => {
  const { ref: featureRef, isVisible: isFeatureVisible } = useScrollAnimation({ 
    threshold: 0.2, 
    rootMargin: '50px',
    delay: index * 100 
  });

  return (
    <div
      ref={featureRef}
      className={`group cursor-pointer transform hover:scale-105 transition-all duration-300 flex ${
        isFeatureVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      onClick={() => onClick(feature.path)}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 w-full flex flex-col">
        {/* Feature Header */}
        <div 
          className="p-4 sm:p-6 md:p-8 text-center relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.secondaryColor} 100%)` 
          }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <h3 
              className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2"
              style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
            >
              {feature.title}
            </h3>
          </div>
        </div>

        {/* Feature Content */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
          <p 
            className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6 flex-grow"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {feature.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span 
              className="text-xs sm:text-sm font-semibold"
              style={{ color: feature.color, fontFamily: 'Roboto, sans-serif' }}
            >
              Learn More →
            </span>
            <div 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${feature.color}20` }}
            >
              <svg 
                className="w-3.5 h-3.5 sm:w-4 sm:h-4" 
                style={{ color: feature.color }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
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
      title: "AI Chatbot",
      description: "Intelligent legal assistant powered by AI to answer queries, provide legal guidance, and assist with research.",
      color: "#CF9B63",
      secondaryColor: "#8C969F",
      path: "/legal-chatbot"
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 md:mb-6 px-2 sm:px-4 leading-tight tracking-tight"
            style={{ 
              color: '#1E65AD', 
              fontFamily: 'Helvetica Hebrew Bold, sans-serif',
              textShadow: '0 2px 4px rgba(30, 101, 173, 0.1)',
              letterSpacing: '-0.02em'
            }}
          >
            Our Features
          </h2>
          
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed mb-4 sm:mb-6 md:mb-8 px-3 sm:px-4"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            Comprehensive legal technology solutions designed to empower legal professionals and students
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
