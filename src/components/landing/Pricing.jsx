import React, { useState } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1, rootMargin: '50px' });

  const pricingPlans = [
    {
      id: 1,
      name: "Student",
      description: "Perfect for law students and legal researchers starting their journey",
      monthlyPrice: 299,
      yearlyPrice: 2999,
      features: [
        { name: "Access to 10,000+ Judgments", included: true },
        { name: "Basic Legal Templates", included: true },
        { name: "AI Chatbot Support", included: true },
        { name: "YouTube Video Summaries", included: true },
        { name: "Old to New Law Mapping", included: false },
        { name: "Advanced Search Filters", included: false },
        { name: "Priority Support", included: false },
        { name: "API Access", included: false }
      ],
      popular: false,
      buttonText: "Start Free Trial",
      buttonStyle: "outline"
    },
    {
      id: 2,
      name: "Professional",
      description: "Ideal for practicing lawyers and legal consultants",
      monthlyPrice: 799,
      yearlyPrice: 7999,
      features: [
        { name: "Access to 50,000+ Judgments", included: true },
        { name: "Premium Legal Templates", included: true },
        { name: "Advanced AI Chatbot", included: true },
        { name: "YouTube Video Summaries", included: true },
        { name: "Old to New Law Mapping", included: true },
        { name: "Advanced Search Filters", included: true },
        { name: "Priority Support", included: true },
        { name: "API Access", included: false }
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonStyle: "primary"
    },
    {
      id: 3,
      name: "Enterprise",
      description: "Comprehensive solution for law firms and legal departments",
      monthlyPrice: 1499,
      yearlyPrice: 14999,
      features: [
        { name: "Unlimited Judgment Access", included: true },
        { name: "Custom Legal Templates", included: true },
        { name: "Advanced AI Chatbot", included: true },
        { name: "YouTube Video Summaries", included: true },
        { name: "Old to New Law Mapping", included: true },
        { name: "Advanced Search Filters", included: true },
        { name: "Dedicated Support", included: true },
        { name: "Full API Access", included: true }
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonStyle: "outline"
    }
  ];

  const togglePricing = () => {
    setIsYearly(!isYearly);
  };

  const getPrice = (plan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyPrice = plan.yearlyPrice;
    return monthlyTotal - yearlyPrice;
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
            Simple and Affordable Pricing
          </h2>
          
          <p 
            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            Choose the perfect plan for your legal practice. All plans include our core features 
            with flexible options to scale as your needs grow.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span 
              className={`text-lg font-medium transition-colors duration-300 ${
                !isYearly ? 'opacity-100' : 'opacity-60'
              }`}
              style={{ 
                color: !isYearly ? '#1E65AD' : '#8C969F',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              Monthly
            </span>
            
            <button
              onClick={togglePricing}
              className="relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50"
              style={{ 
                backgroundColor: isYearly ? '#1E65AD' : '#E5E7EB',
                focusRingColor: 'rgba(30, 101, 173, 0.3)'
              }}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                  isYearly ? 'transform translate-x-8' : 'transform translate-x-1'
                }`}
              ></div>
            </button>
            
            <span 
              className={`text-lg font-medium transition-colors duration-300 ${
                isYearly ? 'opacity-100' : 'opacity-60'
              }`}
              style={{ 
                color: isYearly ? '#1E65AD' : '#8C969F',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              Yearly
            </span>
            
            {isYearly && (
              <span 
                className="ml-2 px-3 py-1 rounded-full text-sm font-semibold"
                style={{ 
                  backgroundColor: '#CF9B63',
                  color: 'white',
                  fontFamily: 'Roboto, sans-serif'
                }}
              >
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                plan.popular 
                  ? 'border-2 scale-105' 
                  : 'border-gray-100'
              }`}
              style={{
                borderColor: plan.popular ? '#1E65AD' : '#E5E7EB'
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ 
                    backgroundColor: '#1E65AD',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
                >
                  {plan.name}
                </h3>
                
                <p 
                  className="text-gray-600 mb-6"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
                  >
                    ₹{getPrice(plan).toLocaleString()}
                  </span>
                  <span 
                    className="text-lg ml-2"
                    style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                  >
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>

                {/* Yearly Savings */}
                {isYearly && (
                  <div 
                    className="text-sm font-medium mb-4"
                    style={{ color: '#CF9B63', fontFamily: 'Roboto, sans-serif' }}
                  >
                    Save ₹{getSavings(plan).toLocaleString()} annually
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 mr-3">
                      {feature.included ? (
                        <svg 
                          className="w-5 h-5" 
                          style={{ color: '#1E65AD' }} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg 
                          className="w-5 h-5" 
                          style={{ color: '#8C969F' }} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span 
                      className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  plan.buttonStyle === 'primary' 
                    ? 'text-white' 
                    : 'border-2'
                }`}
                style={{
                  backgroundColor: plan.buttonStyle === 'primary' ? '#1E65AD' : 'transparent',
                  borderColor: plan.buttonStyle === 'primary' ? '#1E65AD' : '#1E65AD',
                  color: plan.buttonStyle === 'primary' ? 'white' : '#1E65AD',
                  fontFamily: 'Roboto, sans-serif',
                  boxShadow: plan.buttonStyle === 'primary' ? '0 4px 15px rgba(30, 101, 173, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (plan.buttonStyle === 'primary') {
                    e.target.style.backgroundColor = '#CF9B63';
                    e.target.style.boxShadow = '0 6px 20px rgba(207, 155, 99, 0.4)';
                  } else {
                    e.target.style.backgroundColor = '#1E65AD';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.buttonStyle === 'primary') {
                    e.target.style.backgroundColor = '#1E65AD';
                    e.target.style.boxShadow = '0 4px 15px rgba(30, 101, 173, 0.3)';
                  } else {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#1E65AD';
                  }
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
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
              14-Day Free Trial • No Credit Card Required
            </span>
          </div>
          
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
          >
            Need a Custom Solution?
          </h3>
          
          <p 
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            Contact our sales team for enterprise solutions, custom integrations, 
            and volume discounts for large organizations.
          </p>

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
            Contact Sales Team
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

export default Pricing;
