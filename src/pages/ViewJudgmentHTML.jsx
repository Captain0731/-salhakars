import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import BookmarkButton from "../components/BookmarkButton";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";

export default function ViewJudgmentHTML() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get judgment ID from URL params
  const { isAuthenticated } = useAuth();
  
  const [judgmentInfo, setJudgmentInfo] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingHtml, setLoadingHtml] = useState(true);

  useEffect(() => {
    const fetchJudgmentData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Get judgment ID from URL params or location state
        const judgmentId = id || location.state?.judgment?.id || location.state?.judgmentId;
        
        if (!judgmentId) {
          setError("Judgment ID is required");
          setLoading(false);
          return;
        }

        // Fetch judgment metadata first
        const metadata = await apiService.getJudgementById(judgmentId);
        setJudgmentInfo(metadata);
        
        // Then fetch HTML content
        setLoadingHtml(true);
        const html = await apiService.getJudgementByIdHTML(judgmentId);
        setHtmlContent(html);
        setLoadingHtml(false);
        
      } catch (err) {
        console.error("Error fetching judgment:", err);
        setError(err.message || "Failed to load judgment. Please try again.");
        setLoadingHtml(false);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgmentData();
  }, [id, location.state]);

  if (loading && !judgmentInfo) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex justify-center items-center h-96 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Loading judgment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !judgmentInfo) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex justify-center items-center h-96 pt-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-600 text-xl mb-4 font-bold" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Error loading judgment
            </div>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="ml-3 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md hover:shadow-lg"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Retry
              </button>
            </div>
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
              {/* Details - Left Side */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 h-full max-h-96 lg:max-h-none overflow-y-auto sticky top-24">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                        Judgment Details
                      </h3>
                      {isAuthenticated && judgmentInfo && (
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
                        Case Title
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo?.title || 'N/A'}
                      </p>
                    </div>

                    {/* Court */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Court
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo?.court_name || 'N/A'}
                      </p>
                    </div>

                    {/* Judge */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Judge
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo?.judge || 'N/A'}
                      </p>
                    </div>

                    {/* Decision Date */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Decision Date
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo?.decision_date ? new Date(judgmentInfo.decision_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>

                    {/* CNR */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        CNR Number
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 font-mono" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {judgmentInfo?.cnr || 'N/A'}
                      </p>
                    </div>

                    {/* Disposal Nature */}
                    {judgmentInfo?.disposal_nature && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Disposal Nature
                        </h4>
                        <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium" 
                             style={{ backgroundColor: '#E3F2FD', color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: '#1E65AD' }}></div>
                          {judgmentInfo.disposal_nature}
                        </div>
                      </div>
                    )}

                    {/* Year */}
                    {judgmentInfo?.year && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Year
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {judgmentInfo.year}
                        </p>
                      </div>
                    )}

                    {/* Case Info */}
                    {judgmentInfo?.case_info && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Case Information
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {judgmentInfo.case_info}
                        </p>
                      </div>
                    )}

                    {/* Bench */}
                    {judgmentInfo?.bench && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Bench
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {judgmentInfo.bench}
                        </p>
                      </div>
                    )}

                    {/* Date of Registration */}
                    {judgmentInfo?.date_of_registration && (
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Registration Date
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {judgmentInfo.date_of_registration}
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
                      
                      {judgmentInfo?.pdf_link && (
                        <button
                          onClick={() => navigate('/view-pdf', { state: { judgment: judgmentInfo } })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          View PDF Version
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* HTML Content - Right Side */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-96 sm:h-[500px] lg:h-full">
                  {loadingHtml ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-4 sm:p-8">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 mx-auto"></div>
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-4 text-gray-600 font-medium text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Loading judgment content...
                        </p>
                        <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          Please wait while we prepare the document
                        </p>
                      </div>
                    </div>
                  ) : error && !htmlContent ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-4 sm:p-8 max-w-md mx-auto">
                        <div className="text-red-600 text-lg mb-4 font-bold" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                          Error Loading Content
                        </div>
                        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>{error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : htmlContent ? (
                    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                      <style>{`
                        .judgment-html-content {
                          font-family: 'Roboto', sans-serif;
                          color: #1f2937;
                          line-height: 1.6;
                        }
                        .judgment-html-content h1,
                        .judgment-html-content h2,
                        .judgment-html-content h3,
                        .judgment-html-content h4 {
                          color: #1E65AD;
                          font-weight: bold;
                          margin-top: 1.5em;
                          margin-bottom: 0.5em;
                        }
                        .judgment-html-content p {
                          margin-bottom: 1em;
                          text-align: justify;
                        }
                        .judgment-html-content table {
                          width: 100%;
                          border-collapse: collapse;
                          margin: 1em 0;
                        }
                        .judgment-html-content table td,
                        .judgment-html-content table th {
                          border: 1px solid #e5e7eb;
                          padding: 0.5em;
                        }
                        .judgment-html-content table th {
                          background-color: #f3f4f6;
                          font-weight: bold;
                        }
                      `}</style>
                      <div 
                        className="judgment-html-content"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-4 sm:p-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br flex items-center justify-center" 
                             style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                          <svg className="w-10 h-10" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                          Content Not Available
                        </h3>
                        <p className="text-gray-600 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          HTML content is not available for this judgment.
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
