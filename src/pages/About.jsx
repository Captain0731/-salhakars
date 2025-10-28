import React from "react";
import Navbar from "../components/landing/Navbar";

const About = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
            >
              About सलहाकार
            </h1>
            <p 
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}
            >
              Empowering legal professionals with AI-driven tools and comprehensive legal resources
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="prose prose-lg max-w-none">
              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                Our Mission
              </h2>
              <p 
                className="mb-6 leading-relaxed"
                style={{ color: '#374151', fontFamily: 'Roboto, sans-serif' }}
              >
                सलहाकार is dedicated to revolutionizing the legal industry by providing cutting-edge AI-powered tools and comprehensive legal resources. We believe in making legal research, documentation, and practice management more efficient and accessible for legal professionals across India.
              </p>

              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                What We Offer
              </h2>
              <ul 
                className="mb-6 space-y-3"
                style={{ color: '#374151', fontFamily: 'Roboto, sans-serif' }}
              >
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>AI-powered legal research and judgment search</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>Comprehensive legal document templates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>Intelligent legal chatbot assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>Law mapping and legal framework analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span>YouTube video summarization for legal content</span>
                </li>
              </ul>

              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}
              >
                Our Vision
              </h2>
              <p 
                className="leading-relaxed"
                style={{ color: '#374151', fontFamily: 'Roboto, sans-serif' }}
              >
                To become India's leading legal technology platform, empowering lawyers, law students, and legal professionals with innovative tools that enhance productivity, accuracy, and accessibility in legal practice. We envision a future where legal research and documentation are seamlessly integrated with artificial intelligence to deliver exceptional results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
