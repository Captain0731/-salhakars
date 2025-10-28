import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonials = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      title: "Senior Advocate, Supreme Court",
      company: "Sharma & Associates",
      content: "सलहाकार has revolutionized how I conduct legal research. The AI-powered judgment search saves me hours of work, and the old-to-new law mapping feature is incredibly helpful for understanding legislative changes.",
      rating: 5,
      avatar: "👩‍⚖️"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      title: "Legal Consultant",
      company: "Kumar Legal Services",
      content: "The platform's comprehensive legal templates and document generation features have streamlined my practice. The chatbot provides instant answers to complex legal queries, making it an indispensable tool.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      id: 3,
      name: "Anita Mehta",
      title: "Law Student",
      company: "National Law University",
      content: "As a law student, सलहाकार has been a game-changer. The YouTube video summaries help me understand complex legal concepts quickly, and the judgment access feature provides excellent case law references.",
      rating: 5,
      avatar: "👩‍🎓"
    },
    {
      id: 4,
      name: "Vikram Singh",
      title: "Managing Partner",
      company: "Singh & Partners Law Firm",
      content: "Our firm has seen a 40% increase in efficiency since implementing सलहाकार. The browse acts feature and legal reference library have made our research process much more comprehensive and accurate.",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      id: 5,
      name: "Dr. Meera Patel",
      title: "Legal Researcher",
      company: "Institute of Legal Studies",
      content: "The platform's AI capabilities are remarkable. The legal chatbot provides nuanced answers, and the document templates are professionally crafted. It's become an essential part of our research workflow.",
      rating: 5,
      avatar: "👩‍🔬"
    },
    {
      id: 6,
      name: "Arjun Gupta",
      title: "Corporate Lawyer",
      company: "Gupta & Associates",
      content: "सलहाकार's integration of modern technology with traditional legal practice is impressive. The old-to-new law mapping feature helps me stay updated with legislative changes, and the judgment search is incredibly fast.",
      rating: 5,
      avatar: "👨‍⚖️"
    }
  ];

  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const slidesPerView = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(testimonials.length / slidesPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Reset current slide when switching between mobile/desktop
  useEffect(() => {
    setCurrentSlide(0);
  }, [isMobile]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className="w-5 h-5"
        style={{ color: '#CF9B63' }}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F9FAFC' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-5 animate-float" style={{ backgroundColor: '#1E65AD' }}></div>
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-5 animate-float animation-delay-1000" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 rounded-full opacity-5 animate-float animation-delay-2000" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 rounded-full opacity-5 animate-float animation-delay-3000" style={{ backgroundColor: '#1E65AD' }}></div>
        
        {/* Subtle geometric patterns */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-20" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full opacity-25" style={{ backgroundColor: '#1E65AD' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4"
            style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
          >
            What Our Users Say
          </h2>
          
          <p 
            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed px-4"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            Discover how सलहाकार is transforming legal practice for professionals, students, and law firms across India. 
            Our users share their experiences and success stories.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ 
              backgroundColor: '#1E65AD',
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
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ 
              backgroundColor: '#1E65AD',
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
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className={`grid gap-6 sm:gap-8 px-4 ${
                    isMobile 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {testimonials
                      .slice(slideIndex * slidesPerView, (slideIndex + 1) * slidesPerView)
                      .map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                        >
                          {/* Rating Stars */}
                          <div className="flex items-center mb-4">
                            {renderStars(testimonial.rating)}
                          </div>

                          {/* Testimonial Content */}
                          <blockquote 
                            className="text-gray-700 mb-6 leading-relaxed"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            "{testimonial.content}"
                          </blockquote>

                          {/* Separator Line */}
                          <div 
                            className="w-full h-px mb-6"
                            style={{ backgroundColor: '#E5E7EB' }}
                          ></div>

                          {/* User Information */}
                          <div className="flex items-center">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4"
                              style={{ backgroundColor: '#F3F4F6' }}
                            >
                              {testimonial.avatar}
                            </div>
                            <div>
                              <h4 
                                className="font-semibold text-lg"
                                style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
                              >
                                {testimonial.name}
                              </h4>
                              <p 
                                className="text-sm"
                                style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                              >
                                {testimonial.title}
                              </p>
                              <p 
                                className="text-xs font-medium"
                                style={{ color: '#CF9B63', fontFamily: 'Roboto, sans-serif' }}
                              >
                                {testimonial.company}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  backgroundColor: index === currentSlide ? '#1E65AD' : '#8C969F'
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(30, 101, 173, 0.1)' }}
          >
            <svg className="w-5 h-5 mr-2" style={{ color: '#1E65AD' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span 
              className="font-semibold"
              style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
            >
              Join 10,000+ Legal Professionals
            </span>
          </div>
          
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
          >
            Ready to Transform Your Legal Practice?
          </h3>
          
          <p 
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            Experience the power of AI-driven legal research and documentation tools. 
            Start your free trial today and join thousands of satisfied users.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
              Start Free Trial
            </button>
            
            <button
              className="px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 transform hover:scale-105"
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
              View All Features
            </button>
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

export default Testimonials;
