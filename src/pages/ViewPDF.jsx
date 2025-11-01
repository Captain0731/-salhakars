import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import PDFTranslator from "../components/PDFTranslator";
import BookmarkButton from "../components/BookmarkButton";
import { useAuth } from "../contexts/AuthContext";

export default function ViewPDF() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [pdfUrl, setPdfUrl] = useState("");
  const [translatedPdfUrl, setTranslatedPdfUrl] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  const [translationTimeout, setTranslationTimeout] = useState(null);
  const [judgmentInfo, setJudgmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Get act or judgment data from location state
    const actData = location.state?.act;
    const judgmentData = location.state?.judgment;
    
    if (actData) {
      setJudgmentInfo(actData);
      // Use pdf_url from API data, fallback to empty string if not available
      const originalPdfUrl = actData.pdf_url || "";
      setPdfUrl(originalPdfUrl);
      setTranslatedPdfUrl(originalPdfUrl); // Initialize with original URL
      setTotalPages(25); // Default page count, could be enhanced with API data
      setLoading(false);
    } else if (judgmentData) {
      setJudgmentInfo(judgmentData);
      // Use pdf_link from judgment data, fallback to empty string if not available
      const originalPdfUrl = judgmentData.pdf_link || "";
      setPdfUrl(originalPdfUrl);
      setTranslatedPdfUrl(originalPdfUrl); // Initialize with original URL
      setTotalPages(25); // Default page count, could be enhanced with API data
      setLoading(false);
    } else {
      // No data provided, redirect back to appropriate page
      const referrer = document.referrer;
      if (referrer.includes('/state-acts')) {
        navigate('/state-acts');
      } else if (referrer.includes('/supreme-court') || referrer.includes('/high-court')) {
        navigate('/supreme-court');
      } else {
        navigate('/central-acts');
      }
    }
  }, [location.state, navigate]);

  // Stable callback for PDF translation changes
  const handleTranslatedUrlChange = useCallback((url) => {
    setTranslatedPdfUrl(url);
    const isTranslated = url !== pdfUrl && url.includes('translate.google.com');
    setIsTranslating(isTranslated);
    setTranslationError(false);
    
    // Set timeout for translation
    if (isTranslated) {
      // Clear existing timeout
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
      
      // Set new timeout - fallback to original after 2 seconds
      const timeout = setTimeout(() => {
        console.log('PDF translation timeout, falling back to original');
        setTranslatedPdfUrl(pdfUrl);
        setIsTranslating(false);
        setTranslationError(true);
      }, 2000);
      
      setTranslationTimeout(timeout);
    } else {
      // Clear timeout for original PDF
      if (translationTimeout) {
        clearTimeout(translationTimeout);
        setTranslationTimeout(null);
      }
    }
  }, [pdfUrl, translationTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
    };
  }, [translationTimeout]);


  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading PDF...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">Error loading PDF</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      
      {/* PDF Translator Component - Handles PDF translation */}
      <PDFTranslator 
        pdfUrl={pdfUrl} 
        onTranslatedUrlChange={handleTranslatedUrlChange}
      />

      {/* Responsive Layout: Stacked on mobile, side-by-side on desktop */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-full">
            {/* Details - Left Side */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 h-full max-h-96 lg:max-h-none overflow-y-auto">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      {location.state?.act ? 'Act Details' : 'Judgment Details'}
                    </h3>
                    {isAuthenticated && !location.state?.act && judgmentInfo && (
                      <BookmarkButton
                        item={judgmentInfo}
                        type="judgement"
                        size="small"
                        showText={false}
                      />
                    )}
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r" style={{ background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)' }}></div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Title */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? 'Act Title' : 'Case Title'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {judgmentInfo?.title || judgmentInfo?.short_title || judgmentInfo?.long_title}
                    </p>
                  </div>

                  {/* Long Title/Description for Acts */}
                  {location.state?.act && judgmentInfo?.long_title && judgmentInfo?.long_title !== judgmentInfo?.short_title && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Description
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo.long_title}
                      </p>
                    </div>
                  )}

                  {/* Court/Ministry Information */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? 'Ministry' : 'Court'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? (judgmentInfo?.ministry || 'N/A') : (judgmentInfo?.court_name || 'N/A')}
                    </p>
                  </div>

                  {/* Judge/Department */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? 'Department' : 'Judge'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? (judgmentInfo?.department || 'N/A') : (judgmentInfo?.judge || 'N/A')}
                    </p>
                  </div>

                  {/* Location for State Acts */}
                  {location.state?.act && judgmentInfo?.location && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Location
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo.location}
                      </p>
                    </div>
                  )}

                  {/* Decision Date/Year */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? 'Year' : 'Decision Date'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? (judgmentInfo?.year || 'N/A') : (judgmentInfo?.decision_date ? new Date(judgmentInfo.decision_date).toLocaleDateString() : 'N/A')}
                    </p>
                  </div>

                  {/* Enactment Date for Acts */}
                  {location.state?.act && judgmentInfo?.enactment_date && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Enactment Date
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {new Date(judgmentInfo.enactment_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Enforcement Date for Acts */}
                  {location.state?.act && judgmentInfo?.enforcement_date && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Enforcement Date
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {new Date(judgmentInfo.enforcement_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Act ID for Acts */}
                  {location.state?.act && judgmentInfo?.act_id && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Act ID
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 font-mono" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo.act_id}
                      </p>
                    </div>
                  )}

                  {/* CNR/Source */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? 'Source' : 'CNR Number'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-mono" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? (judgmentInfo?.source || 'N/A') : (judgmentInfo?.cnr || 'N/A')}
                    </p>
                  </div>

                  {/* Disposal Nature/Type */}
                  {(judgmentInfo?.disposal_nature || judgmentInfo?.type) && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {location.state?.act ? 'Type' : 'Disposal Nature'}
                      </h4>
                      <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium" 
                           style={{ backgroundColor: '#E3F2FD', color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#1E65AD' }}></div>
                        {location.state?.act ? judgmentInfo.type : judgmentInfo.disposal_nature}
                      </div>
                    </div>
                  )}

                  {/* Year for Judgments */}
                  {!location.state?.act && judgmentInfo?.year && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Year
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo.year}
                      </p>
                    </div>
                  )}

                  {/* Case Info for Judgments */}
                  {!location.state?.act && judgmentInfo?.case_info && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Case Information
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo.case_info}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="space-y-2 sm:space-y-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {pdfUrl && pdfUrl.trim() !== "" ? (
                  <div className="relative h-full" style={{ minHeight: '300px' }}>
                    {/* PDF Embed - Try iframe first, fallback to button */}
                    <iframe
                      src={`${translatedPdfUrl || pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&page=${currentPage}&zoom=${zoom}`}
                      className="w-full h-full border-0 rounded-lg"
                      title={location.state?.act ? 'Act PDF' : 'Judgment PDF'}
                      onLoad={() => {
                        setLoading(false);
                        setIsTranslating(false);
                        setTranslationError(false);
                      }}
                      onError={() => {
                        // If iframe fails, show the button fallback
                        setError("PDF cannot be embedded due to security restrictions");
                        setIsTranslating(false);
                        setTranslationError(true);
                      }}
                    />
                    
                    {/* Fallback PDF Access - Show when iframe fails */}
                    {translationError && (
                      <div className="absolute inset-0 bg-white flex items-center justify-center p-4 sm:p-8">
                        <div className="text-center max-w-md">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br flex items-center justify-center" 
                               style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                            <svg className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                            {location.state?.act ? 'Act PDF Document' : 'Judgment PDF Document'}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            The PDF cannot be embedded due to security restrictions. Click the button below to view the {location.state?.act ? 'act' : 'judgment'} PDF document in a new tab.
                          </p>
                          <div className="space-y-2 sm:space-y-3">
                            <button
                              onClick={() => window.open(translatedPdfUrl || pdfUrl, '_blank')}
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
                    )}

                    {/* Translation Status Indicator */}
                    {isTranslating && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-blue-100 border border-blue-300 text-blue-700 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg z-10">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-600 border-t-transparent"></div>
                          <span className="hidden sm:inline">Translating PDF...</span>
                          <span className="sm:hidden">Translating...</span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1 hidden sm:block">
                          Fast translation in progress...
                        </div>
                      </div>
                    )}

                    {/* Translation Error Indicator */}
                    {translationError && !error && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-yellow-100 border border-yellow-300 text-yellow-700 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg z-10">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">Fast fallback - showing original</span>
                          <span className="sm:hidden">Fallback</span>
                        </div>
                      </div>
                    )}

                    {/* Loading Overlay */}
                    {loading && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center rounded-lg">
                        <div className="text-center p-4">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-gray-200 mx-auto"></div>
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
                          </div>
                          <p className="mt-3 sm:mt-4 text-gray-600 font-medium text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {translatedPdfUrl !== pdfUrl ? 'Loading Translated PDF...' : 'Loading PDF Document...'}
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {translatedPdfUrl !== pdfUrl ? 'Please wait while we load the translated document' : 'Please wait while we prepare the document'}
                          </p>
                        </div>
                      </div>
                    )}
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
                        This {location.state?.act ? 'act' : 'judgment'} does not have a PDF document available.
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
