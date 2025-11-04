import React, { useState, useRef } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const VideoSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1, rootMargin: '50px' });

  const features = [
    {
      icon: "⚡",
      title: "Instant research",
      description: "Judgments and acts in just one to three clicks."
    },
    {
      icon: "🔒",
      title: "Multilingual Access",
      description: "Instantly view research in any Indian language."
    },
    {
      icon: "📱",
      title: "Voice assistance",
      description: "Speak your query; get instant, accurate results."
    },
    {
      icon: "🎯",
      title: "Concise Summaries",
      description: "Get the gist in two to three lines instantly."
    },
    {
      icon: "📊",
      title: "Universal Search",
      description: "Find cases with keywords or simple questions - no details needed."
    },
    {
      icon: "🔄",
      title: "Kiki AI",
      description: "Smart assistant answers, automates, and guides your legal research."
    }
  ];

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`py-20 relative overflow-hidden transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ backgroundColor: '#F9FAFC' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#1E65AD' }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full opacity-10 animate-float animation-delay-1000" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 rounded-full opacity-10 animate-float animation-delay-2000" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full opacity-10 animate-float animation-delay-3000" style={{ backgroundColor: '#1E65AD' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-4 lg:px-0"
                style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                Why Choose Salhakar
              </h2>
              
              <p 
                className="text-lg sm:text-xl leading-relaxed mb-6 sm:mb-8 px-4 lg:px-0"
                style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
              >
                Salhakar aims to make legal research in India simple, convenient, and reliable, leveraging advanced AI to give every user a smarter edge.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4 lg:px-0">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: '#1E65AD' }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 
                      className="font-semibold mb-1"
                      style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 px-4 lg:px-0">
              <button
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                style={{ 
                  backgroundColor: '#1E65AD', 
                  fontFamily: 'Roboto, sans-serif',
                  boxShadow: '0 4px 15px rgba(30, 101, 173, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#CF9B63';
                  e.target.style.boxShadow = '0 6px 20px rgba(207, 155, 99, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1E65AD';
                  e.target.style.boxShadow = '0 4px 15px rgba(30, 101, 173, 0.3)';
                }}
              >
                Get Started Free
              </button>
              
              <button
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold border-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                style={{ 
                  borderColor: '#1E65AD',
                  color: '#1E65AD',
                  fontFamily: 'Roboto, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1E65AD';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#1E65AD';
                }}
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Side - Video Section */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Video Container */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {!isVideoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 z-10">
                    <div className="text-center">
                      {/* Play Button */}
                      <button
                        onClick={handlePlayVideo}
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                        style={{ 
                          backgroundColor: '#1E65AD',
                          boxShadow: '0 8px 25px rgba(30, 101, 173, 0.4)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#CF9B63';
                          e.target.style.boxShadow = '0 12px 30px rgba(207, 155, 99, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#1E65AD';
                          e.target.style.boxShadow = '0 8px 25px rgba(30, 101, 173, 0.4)';
                        }}
                      >
                        <svg 
                          className="w-8 h-8 text-white ml-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </button>
                      
                      <p 
                        className="mt-4 text-lg font-semibold"
                        style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
                      >
                        Watch Video
                      </p>
                    </div>
                  </div>
                ) : null}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${!isVideoPlaying ? 'opacity-0 absolute' : 'opacity-100 relative'} transition-opacity duration-300`}
                  controls
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onEnded={() => setIsVideoPlaying(false)}
                  poster=""
                >
                  <source src="/sl.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
                >
                  Platform Overview
                </h3>
                <p 
                  className="text-gray-600 mb-4"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  See how सलहाकार transforms legal research and documentation workflows
                </p>
                
                {/* Video Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: '#CF9B63' }}
                    ></div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                    >
                      Live Demo
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" style={{ color: '#8C969F' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                    >
                      2:30 min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            {/* <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg" style={{ backgroundColor: '#CF9B63' }}>
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div> */}

            {/* <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl flex items-center justify-center transform -rotate-12 shadow-lg" style={{ backgroundColor: '#8C969F' }}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H4.5C3.67 2 3 2.67 3 3.5v15C3 19.33 3.67 20 4.5 20h15c.83 0 1.5-.67 1.5-1.5v-15C21 2.67 20.33 2 19.5 2z"/>
              </svg>
            </div> */}
          </div>
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
};

export default VideoSection;
