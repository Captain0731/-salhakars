import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Documentation", href: "#api" },
      { name: "Integrations", href: "#integrations" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Team", href: "#team" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" }
    ],
    resources: [
      { name: "Blog", href: "#blog" },
      { name: "Help Center", href: "#help" },
      { name: "Legal Templates", href: "#templates" },
      { name: "Case Studies", href: "#cases" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Refund Policy", href: "/refund-policy" }
    ]
  };

  const socialLinks = [
    { name: "LinkedIn", icon: "💼", href: "#linkedin" },
    { name: "Twitter", icon: "🐦", href: "#twitter" },
    { name: "Facebook", icon: "📘", href: "#facebook" },
    { name: "YouTube", icon: "📺", href: "#youtube" }
  ];

  const contactInfo = [
    { icon: "📧", text: "support@salhakar.com" },
    { icon: "📞", text: "+91 98765 43210" },
    { icon: "📍", text: "New Delhi, India" }
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#1E65AD' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-10 animate-float" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full opacity-10 animate-float animation-delay-1000" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 rounded-full opacity-10 animate-float animation-delay-2000" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full opacity-10 animate-float animation-delay-3000" style={{ backgroundColor: '#8C969F' }}></div>
        
        {/* Subtle geometric patterns */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: '#CF9B63' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full opacity-25" style={{ backgroundColor: '#8C969F' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: '#CF9B63' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="mb-4">
                  <h3 
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: 'white', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
                  >
                    सलहाकार
                  </h3>
                </div>
                
                <p 
                  className="text-base sm:text-lg leading-relaxed mb-6"
                  style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Roboto, sans-serif' }}
                >
                  Empowering legal professionals with AI-driven research tools, 
                  comprehensive judgment access, and modern practice management solutions.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-xl mr-3">{contact.icon}</span>
                    <span 
                      className="text-sm"
                      style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Roboto, sans-serif' }}
                    >
                      {contact.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#CF9B63';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 
                className="text-base sm:text-lg font-semibold mb-4 sm:mb-6"
                style={{ color: 'white', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:opacity-80"
                      style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Roboto, sans-serif' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#CF9B63';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 
                className="text-base sm:text-lg font-semibold mb-4 sm:mb-6"
                style={{ color: 'white', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:opacity-80"
                      style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Roboto, sans-serif' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#CF9B63';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 
                className="text-base sm:text-lg font-semibold mb-4 sm:mb-6"
                style={{ color: 'white', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:opacity-80"
                      style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Roboto, sans-serif' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#CF9B63';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div 
          className="py-6 sm:py-8 border-t border-opacity-20"
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0 text-center lg:text-left">
              <h4 
                className="text-lg sm:text-xl font-semibold mb-2"
                style={{ color: 'white', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                Stay Updated
              </h4>
              <p 
                className="text-sm sm:text-base"
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Roboto, sans-serif' }}
              >
                Get the latest legal insights and platform updates delivered to your inbox.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-opacity-50 w-full sm:w-64"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  focusRingColor: 'rgba(207, 155, 99, 0.3)'
                }}
              />
              <button
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base"
                style={{ 
                  backgroundColor: '#CF9B63', 
                  fontFamily: 'Roboto, sans-serif',
                  boxShadow: '0 4px 15px rgba(207, 155, 99, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#8C969F';
                  e.target.style.boxShadow = '0 6px 20px rgba(140, 150, 159, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#CF9B63';
                  e.target.style.boxShadow = '0 4px 15px rgba(207, 155, 99, 0.3)';
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="py-4 sm:py-6 border-t border-opacity-20"
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <div className="mb-4 sm:mb-0">
              <p 
                className="text-xs sm:text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Roboto, sans-serif' }}
              >
                © {currentYear} सलहाकार. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-end space-x-4 sm:space-x-6">
              {footerLinks.legal.map((link, index) => {
                const isInternalLink = link.href.startsWith('/') && !link.href.endsWith('.pdf');
                
                if (isInternalLink) {
                  return (
                    <Link
                      key={index}
                      to={link.href}
                      className="text-xs transition-colors duration-300 hover:opacity-80"
                      style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Roboto, sans-serif' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#CF9B63';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      }}
                    >
                      {link.name}
                    </Link>
                  );
                } else {
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs transition-colors duration-300 hover:opacity-80"
                      style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Roboto, sans-serif' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#CF9B63';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                      }}
                    >
                      {link.name}
                    </a>
                  );
                }
              })}
            </div>
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
    </footer>
  );
};

export default Footer;
