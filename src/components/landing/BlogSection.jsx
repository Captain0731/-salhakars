import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BlogSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const blogPosts = [
    {
      id: 1,
      title: "Understanding the New Legal Framework: A Comprehensive Guide",
      description: "Explore the latest changes in Indian legal system and how they impact modern legal practice. Learn about new regulations and their practical applications.",
      category: "Legal Updates",
      author: "Dr. Priya Sharma",
      authorTitle: "Senior Legal Advisor",
      date: "2024",
      image: "📚",
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "AI-Powered Legal Research: Transforming Case Law Analysis",
      description: "Discover how artificial intelligence is revolutionizing legal research and case analysis. Learn about the latest tools and techniques for efficient legal work.",
      category: "Technology",
      author: "Rajesh Kumar",
      authorTitle: "Legal Tech Specialist",
      date: "2024",
      image: "🤖",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Digital Transformation in Law Firms: Best Practices",
      description: "Learn how law firms are embracing digital transformation to improve efficiency, client service, and operational excellence in the modern legal landscape.",
      category: "Business",
      author: "Anita Mehta",
      authorTitle: "Legal Consultant",
      date: "2024",
      image: "💼",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "Contract Management in the Digital Age: Tools and Strategies",
      description: "Master the art of digital contract management with modern tools and proven strategies. Streamline your contract lifecycle and reduce legal risks.",
      category: "Contracts",
      author: "Vikram Singh",
      authorTitle: "Corporate Lawyer",
      date: "2024",
      image: "📋",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Legal Ethics in the Digital Era: Navigating New Challenges",
      description: "Explore the evolving landscape of legal ethics in our digital world. Understand new responsibilities and ethical considerations for modern lawyers.",
      category: "Ethics",
      author: "Dr. Meera Patel",
      authorTitle: "Legal Ethics Expert",
      date: "2024",
      image: "⚖️",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "Building a Successful Legal Practice: Modern Strategies",
      description: "Learn proven strategies for building and growing a successful legal practice in today's competitive market. From client acquisition to practice management.",
      category: "Practice Management",
      author: "Arjun Gupta",
      authorTitle: "Practice Development Coach",
      date: "2024",
      image: "🏆",
      readTime: "12 min read"
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
  const totalSlides = Math.ceil(blogPosts.length / slidesPerView);

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
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Reset current slide when switching between mobile/desktop
  useEffect(() => {
    setCurrentSlide(0);
  }, [isMobile]);

  const getCategoryColor = (category) => {
    const colors = {
      "Legal Updates": "#1E65AD",
      "Technology": "#CF9B63",
      "Business": "#8C969F",
      "Contracts": "#1E65AD",
      "Ethics": "#CF9B63",
      "Practice Management": "#8C969F"
    };
    return colors[category] || "#1E65AD";
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F9FAFC' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full opacity-5 animate-float" style={{ backgroundColor: '#1E65AD' }}></div>
        <div className="absolute top-40 right-32 w-32 h-32 rounded-full opacity-5 animate-float animation-delay-1000" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute bottom-32 left-40 w-36 h-36 rounded-full opacity-5 animate-float animation-delay-2000" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full opacity-5 animate-float animation-delay-3000" style={{ backgroundColor: '#1E65AD' }}></div>
        
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
            Our Latest Blogs
          </h2>
          
          <p 
            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed px-4"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            Stay updated with the latest insights, trends, and best practices in legal technology, 
            practice management, and industry developments from our expert team.
          </p>
        </div>

        {/* Blog Slider */}
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
                    {blogPosts
                      .slice(slideIndex * slidesPerView, (slideIndex + 1) * slidesPerView)
                      .map((post) => (
                        <article
                          key={post.id}
                          onClick={() => navigate('/blog')}
                          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden cursor-pointer"
                        >
                          {/* Blog Image */}
                          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-6xl">{post.image}</div>
                            
                            {/* Category Tag */}
                            <div 
                              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
                              style={{ 
                                backgroundColor: getCategoryColor(post.category),
                                fontFamily: 'Roboto, sans-serif'
                              }}
                            >
                              {post.category}
                            </div>
                          </div>

                          {/* Blog Content */}
                          <div className="p-6">
                            {/* Title */}
                            <h3 
                              className="text-xl font-bold mb-3 leading-tight"
                              style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
                            >
                              {post.title}
                            </h3>

                            {/* Description */}
                            <p 
                              className="text-gray-600 mb-4 leading-relaxed"
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {post.description}
                            </p>

                            {/* Read Time */}
                            <div className="flex items-center mb-4">
                              <svg className="w-4 h-4 mr-2" style={{ color: '#8C969F' }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span 
                                className="text-sm font-medium"
                                style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                              >
                                {post.readTime}
                              </span>
                            </div>

                            {/* Separator Line */}
                            <div 
                              className="w-full h-px mb-4"
                              style={{ backgroundColor: '#E5E7EB' }}
                            ></div>

                            {/* Author Info */}
                            <div className="flex items-center">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-lg mr-3"
                                style={{ backgroundColor: '#F3F4F6' }}
                              >
                                👤
                              </div>
                              <div>
                                <h4 
                                  className="font-semibold text-sm"
                                  style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {post.author}
                                </h4>
                                <p 
                                  className="text-xs"
                                  style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {post.authorTitle}
                                </p>
                                <p 
                                  className="text-xs font-medium"
                                  style={{ color: '#CF9B63', fontFamily: 'Roboto, sans-serif' }}
                                >
                                  {post.date}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
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

        {/* View All Blogs Button */}
        <div className="text-center mt-12 sm:mt-16">
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{ 
              backgroundColor: '#1E65AD',
              color: '#FFFFFF',
              fontFamily: 'Roboto, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#CF9B63';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1E65AD';
            }}
          >
            View All Blogs
          </button>
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

export default BlogSection;
