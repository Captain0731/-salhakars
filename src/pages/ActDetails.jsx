import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import BookmarkButton from "../components/BookmarkButton";
import { useAuth } from "../contexts/AuthContext";

export default function ActDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [act, setAct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get act data from location state or fetch from API
    if (location.state?.act) {
      setAct(location.state.act);
      setLoading(false);
    } else {
      // If no act data, redirect back
      navigate(-1);
    }
  }, [location.state, navigate]);

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading act details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={goBack}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!act) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No act data available</p>
            <button
              onClick={goBack}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="pt-20">
      
      {/* Responsive Layout: Stacked on mobile, side-by-side on desktop */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-full">
            {/* Act Details - Left Side */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 h-full max-h-96 lg:max-h-none overflow-y-auto">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      Act Details
                    </h3>
                    {isAuthenticated && (
                      <BookmarkButton
                        item={act}
                        type={act.location ? "state_act" : "central_act"}
                        size="small"
                        showText={false}
                      />
                    )}
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r" style={{ background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)' }}></div>
                </div>

                <div className="space-y-6">
                  {/* Act Title */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Act Title
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {act.short_title || act.long_title}
                    </p>
                  </div>

                  {/* Long Title/Description */}
                  {act.long_title && act.long_title !== act.short_title && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {act.long_title}
                      </p>
                    </div>
                  )}
                  
                  {/* Ministry */}
                  {act.ministry && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Ministry
                      </h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {act.ministry}
                      </p>
                    </div>
                  )}
                  
                  {/* Department */}
                  {act.department && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Department
                      </h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {act.department}
                      </p>
                    </div>
                  )}

                  {/* Location for State Acts */}
                  {act.location && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Location
                      </h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {act.location}
                      </p>
                    </div>
                  )}
                  
                  {/* Year */}
                  {act.year && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Year
                      </h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {act.year}
                      </p>
                    </div>
                  )}
                  
                  {/* Enactment Date */}
                  {act.enactment_date && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Enactment Date
                      </h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {new Date(act.enactment_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {/* Enforcement Date */}
                  {act.enforcement_date && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Enforcement Date
                      </h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {new Date(act.enforcement_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {/* Act ID */}
                  {act.act_id && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Act ID
                      </h4>
                      <p className="text-sm text-gray-600 font-mono" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {act.act_id}
                      </p>
                    </div>
                  )}

                  {/* Source */}
                  {act.source && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Source
                      </h4>
                      <p className="text-sm text-gray-600 font-mono" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {act.source}
                      </p>
                    </div>
                  )}

                  {/* Type */}
                  {act.type && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Type
                      </h4>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" 
                           style={{ backgroundColor: '#E3F2FD', color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1E65AD' }}></div>
                        {act.type}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <button
                      onClick={goBack}
                      className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Results
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Viewer - Right Side */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-96 sm:h-[500px] lg:h-full">
                {act.pdf_url && act.pdf_url.trim() !== "" ? (
                  <div className="relative h-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
                    {/* PDF Viewer - Open in new tab due to X-Frame-Options restrictions */}
                    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8">
                      <div className="text-center max-w-md">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br flex items-center justify-center" 
                             style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                          <svg className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                          Act PDF Document
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Click the button below to view the act PDF document in a new tab. The document cannot be embedded due to security restrictions.
                        </p>
                        <div className="space-y-2 sm:space-y-3">
                          <button
                            onClick={() => window.open(act.pdf_url, '_blank')}
                            className="w-full px-4 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open PDF Document
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center p-4 sm:p-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br flex items-center justify-center" 
                           style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                        <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                        PDF Not Available
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        This act does not have a PDF document available.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
