import React, { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqData = [
    {
      id: 1,
      question: "What is सलहाकार and how does it help legal professionals?",
      answer: "सलहाकार is an AI-powered legal technology platform designed to revolutionize legal research and practice management. It provides comprehensive access to judgments, legal templates, AI chatbot assistance, and advanced search capabilities to help lawyers, law students, and legal professionals work more efficiently and effectively."
    },
    {
      id: 2,
      question: "How accurate is the AI chatbot for legal queries?",
      answer: "Our AI chatbot is trained on extensive legal databases and continuously updated with the latest legal precedents and regulations. While it provides highly accurate information for general legal queries, we always recommend consulting with qualified legal professionals for specific case advice. The chatbot serves as a powerful research assistant and starting point for legal analysis."
    },
    {
      id: 3,
      question: "Is my data secure and confidential?",
      answer: "Absolutely. We take data security and confidentiality very seriously. All data is encrypted using industry-standard protocols, and we comply with relevant data protection regulations. We never share your personal information or case details with third parties. Our platform is designed with privacy-by-design principles to ensure your sensitive legal information remains secure."
    },
    {
      id: 4,
      question: "How do I get started with सलहाकार?",
      answer: "Getting started is easy! Simply sign up for a free trial account, choose your profession (Student, Lawyer, Law Firm, or Other), and complete the verification process. Once verified, you'll have access to all features for 14 days. You can upgrade to a paid plan anytime during or after your trial period."
    },
    {
      id: 5,
      question: "What types of legal documents and templates are available?",
      answer: "We offer a comprehensive library of legal templates including contracts, agreements, court filings, legal notices, and procedural documents. Our templates cover various practice areas such as corporate law, civil litigation, criminal law, family law, and more. All templates are regularly updated to reflect current legal requirements and best practices."
    },
    {
      id: 6,
      question: "How does the judgment search feature work?",
      answer: "Our judgment search feature uses advanced AI algorithms to search through thousands of legal judgments from various courts across India. You can search by keywords, case numbers, judge names, dates, or legal concepts. The system provides relevant results with highlighted excerpts and case summaries to help you quickly find the information you need."
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full mb-8" style={{ backgroundColor: 'rgba(30, 101, 173, 0.1)' }}>
            <span className="text-2xl mr-3">❓</span>
            <span className="font-semibold text-lg" style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
              Frequently Asked Questions
            </span>
          </div>
          
          <h2 
            className="text-5xl sm:text-6xl font-bold mb-8"
            style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
          >
            Questions?
          </h2>
          
          <p 
            className="text-2xl max-w-4xl mx-auto leading-relaxed"
            style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
          >
            We're here to help. Find answers to common questions about सलहाकार and get the support you need.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column - FAQ Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
                >
                  About Our FAQ
                </h3>
                <p 
                  className="text-lg leading-relaxed"
                  style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
                >
                  Our comprehensive FAQ section covers the most common questions about सलहाकार. If you can't find what you're looking for, our support team is always ready to help.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h4 
                className="text-2xl font-bold mb-6"
                style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
              >
                Quick Stats
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#CF9B63' }}>6+</div>
                  <div className="text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>Common Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#CF9B63' }}>24/7</div>
                  <div className="text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#CF9B63' }}>100%</div>
                  <div className="text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>Secure Platform</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#CF9B63' }}>5★</div>
                  <div className="text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>User Rating</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - FAQ List */}
          <div className="space-y-6">
            {faqData.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-300 group-hover:bg-gray-50"
                  style={{ focusRingColor: 'rgba(30, 101, 173, 0.3)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-6">
                      <h3 
                        className="text-lg font-bold leading-relaxed"
                        style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
                      >
                        {item.question}
                      </h3>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          openItems[item.id] 
                            ? 'bg-blue-100 transform rotate-180' 
                            : 'bg-gray-100 group-hover:bg-blue-50'
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 transition-all duration-300 ${
                            openItems[item.id] ? 'text-blue-600' : 'text-gray-600'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openItems[item.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div 
                      className="w-full h-px mb-4"
                      style={{ backgroundColor: '#E5E7EB' }}
                    ></div>
                    
                    <p 
                      className="text-gray-700 leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;