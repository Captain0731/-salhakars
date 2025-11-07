import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import PDFTranslator from "../components/PDFTranslator";
import BookmarkButton from "../components/BookmarkButton";
import { FileText, StickyNote, Share2 } from "lucide-react";

export default function ViewPDF() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [notesContent, setNotesContent] = useState("");
  const [notesFolders, setNotesFolders] = useState([{ id: 'default', name: 'Default', content: '' }]);
  const [activeFolderId, setActiveFolderId] = useState('default');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [popupSize, setPopupSize] = useState({ width: 500, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Get act or judgment data from location state
    const actData = location.state?.act;
    const judgmentData = location.state?.judgment;
   
    if (judgmentData) {
      console.log('📄 ViewPDF: Received judgment data:', judgmentData);
      setJudgmentInfo(judgmentData);
      
      // Handle both pdf_url (from API) and pdf_link (for backward compatibility)
      // Priority: pdf_link > pdf_url > empty string
      const originalPdfUrl = judgmentData.pdf_link || judgmentData.pdf_url || "";
      
      console.log('📄 ViewPDF: PDF URL resolved:', originalPdfUrl);
      
      if (!originalPdfUrl || originalPdfUrl.trim() === "") {
        console.warn('⚠️ ViewPDF: No PDF URL found in judgment data');
        setError('PDF URL not available for this judgment');
      }
      
      setPdfUrl(originalPdfUrl);
      setTranslatedPdfUrl(originalPdfUrl); // Initialize with original URL
      setTotalPages(25); // Default page count, could be enhanced with API data
      setLoading(false);
    } else if (actData) {
      // Handle act data if needed
      setJudgmentInfo(actData);
      const actPdfUrl = actData.pdf_link || actData.pdf_url || "";
      setPdfUrl(actPdfUrl);
      setTranslatedPdfUrl(actPdfUrl);
      setLoading(false);
    } else {
      // No data provided, redirect back to appropriate page
      console.warn('⚠️ ViewPDF: No judgment or act data provided, redirecting...');
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

  // Load saved notes from localStorage when judgment/act changes
  useEffect(() => {
    if (judgmentInfo) {
      const notesKey = `notes_${judgmentInfo?.id || judgmentInfo?.act_id || 'default'}`;
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) {
        try {
          const parsedFolders = JSON.parse(savedNotes);
          if (parsedFolders && Array.isArray(parsedFolders) && parsedFolders.length > 0) {
            setNotesFolders(parsedFolders);
            setActiveFolderId(parsedFolders[0].id);
            setNotesContent(parsedFolders[0].content || '');
          }
        } catch (error) {
          console.error('Error loading saved notes:', error);
        }
      }
    }
  }, [judgmentInfo?.id, judgmentInfo?.act_id]);

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

  // Handle window resize to keep popup within bounds
  useEffect(() => {
    const handleResize = () => {
      if (showNotesPopup) {
        const maxX = window.innerWidth - popupSize.width;
        const maxY = window.innerHeight - popupSize.height;
        
        // Adjust popup size if it exceeds viewport
        setPopupSize(prev => ({
          width: Math.min(prev.width, window.innerWidth * 0.9),
          height: Math.min(prev.height, window.innerHeight * 0.9)
        }));
        
        setPopupPosition(prev => ({
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY))
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showNotesPopup, popupSize]);


  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="pt-16 sm:pt-20 flex justify-center items-center h-96">
          <div className="text-center px-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading PDF...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="pt-16 sm:pt-20 flex justify-center items-center h-96 px-4">
          <div className="text-center max-w-md w-full">
            <div className="text-red-600 text-base sm:text-lg mb-3 sm:mb-4 font-semibold">Error loading PDF</div>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
              style={{ fontFamily: 'Roboto, sans-serif' }}
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
      <div className="pt-16 sm:pt-20">
      
      {/* PDF Translator Component - Handles PDF translation */}
      <PDFTranslator 
        pdfUrl={pdfUrl} 
        onTranslatedUrlChange={handleTranslatedUrlChange}
      />

      {/* Responsive Layout: Stacked on mobile, side-by-side on desktop */}
      <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 h-full">
            {/* Details - Left Side */}
            <div className="lg:col-span-1 order-1 lg:order-1 pt-3">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-2 sm:p-2 md:p-6 h-auto lg:h-full max-h-[10S0vh] sm:max-h-[60vh] md:max-h-96 lg:max-h-none overflow-hidden">
                <div className="mb-3 sm:mb-4 md:mb-6">
                  <div className="flex flex-col grid grid-cols-2  sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      {location.state?.act ? 'Act Details' : 'Judgment Details'}
                    </h3>
                    {judgmentInfo && (
                      <div className="flex items-center gap-2 justify-end self-start sm:self-auto">
                        <button
                          onClick={() => {
                            const url = window.location.href;
                            navigator.clipboard.writeText(url).then(() => {
                              alert('Link copied to clipboard!');
                            }).catch(() => {
                              alert('Failed to copy link');
                            });
                          }}
                          className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                          style={{ 
                            backgroundColor: '#1E65AD',
                            color: '#FFFFFF'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1a5a9a';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1E65AD';
                          }}
                          title="Share"
                        >
                          <Share2 className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#FFFFFF' }} />
                        </button>
                        <BookmarkButton
                          item={judgmentInfo}
                          type={location.state?.act ? "act" : "judgement"}
                          size="small"
                          showText={false}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-10 sm:w-12 h-0.5 sm:h-1 bg-gradient-to-r" style={{ background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)' }}></div>
                </div>

                <div className="space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-6">
                  {/* Title */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {location.state?.act ? 'Act Title' : 'Case Title'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words" style={{ fontFamily: 'Roboto, sans-serif' }}>
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
                <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 pt-2.5 sm:pt-3 md:pt-4 lg:pt-6 border-t border-gray-200">
                  <div className="space-y-2">
                    {/* View PDF Button - Mobile Only */}
                    {isMobile && (
                      <button
                        onClick={() => {
                          navigate('/mobile-pdf', {
                            state: {
                              pdfUrl: translatedPdfUrl || pdfUrl,
                              judgment: judgmentInfo,
                              act: location.state?.act ? judgmentInfo : null
                            }
                          });
                        }}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View PDF
                      </button>
                    )}
                    <button
                      onClick={() => navigate(-1)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Results
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF Viewer - Right Side */}
            <div className="lg:col-span-2 order-2 lg:order-2 hidden lg:block">
              {/* Desktop View: Show PDF Viewer */}
              {!isMobile && (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-280px)] sm:h-[calc(100vh-320px)] md:h-[500px] lg:h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex flex-col">
                {/* PDF Toolbar - Search, Summary, Notes */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-2.5 md:p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-[120px] sm:min-w-[200px]">
                    <img 
                      src="/uit3.GIF" 
                      alt="Search" 
                      className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 object-contain pointer-events-none z-10"
                    />
                    
                    <input
                      type="text"
                      placeholder="Search With Kiki AI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          // Trigger PDF search functionality
                          console.log('Searching for:', searchQuery);
                          // You can implement PDF search logic here
                        }
                      }}
                    />
                  </div>
                  
                  {/* Action Buttons Container */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    {/* Summary Button */}
                    <button
                      onClick={() => {
                        // Navigate to summary or show summary modal
                        console.log('Summary clicked for:', judgmentInfo?.id || judgmentInfo?.title);
                        // You can implement summary functionality here
                      }}
                      className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow-md whitespace-nowrap"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                      title="View Summary"
                    >
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Summary</span>
                    </button>
                    
                    {/* Notes Button */}
                    <button
                    onClick={() => {
                      // Check if we have saved notes, if not initialize with default content
                      const notesKey = `notes_${judgmentInfo?.id || judgmentInfo?.act_id || 'default'}`;
                      const savedNotes = localStorage.getItem(notesKey);
                      
                      if (!savedNotes) {
                        // Initialize notes content with judgment/act data for default folder
                        const initialContent = `# ${judgmentInfo?.title || judgmentInfo?.short_title || 'Untitled Note'}\n\n${judgmentInfo?.summary || 'No summary available.'}\n\n## Details\n\n${location.state?.act ? 'Ministry' : 'Court'}: ${location.state?.act ? (judgmentInfo?.ministry || 'N/A') : (judgmentInfo?.court_name || 'N/A')}\nDate: ${judgmentInfo?.decision_date || judgmentInfo?.year || 'N/A'}`;
                        
                        // Initialize folders if empty
                        if (notesFolders.length === 0 || (notesFolders.length === 1 && notesFolders[0].content === '')) {
                          setNotesFolders([{ id: 'default', name: 'Default', content: initialContent }]);
                          setActiveFolderId('default');
                          setNotesContent(initialContent);
                        }
                      } else {
                        // Load existing content
                        const currentFolder = notesFolders.find(f => f.id === activeFolderId);
                        setNotesContent(currentFolder?.content || '');
                      }
                      
                      setShowNotesPopup(true);
                    }}
                    className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 text-white rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow-md whitespace-nowrap"
                    style={{ 
                      fontFamily: 'Roboto, sans-serif',
                      background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #1a5a9a 0%, #b88a56 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)';
                    }}
                    title="Add Notes"
                  >
                    <StickyNote className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Notes</span>
                  </button>
                  </div>
                </div>
                
                {/* PDF Content */}
                <div className="flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
                {pdfUrl && pdfUrl.trim() !== "" ? (
                  <div className="relative h-full w-full" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
                    {/* Desktop View: Show PDF in iframe */}
                    <>
                      {/* PDF Embed - Try iframe first, fallback to button */}
                      <div className="w-full h-full flex-1" style={{ minHeight: 0, position: 'relative' }}>
                        <iframe
                          src={`${translatedPdfUrl || pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&page=${currentPage}&zoom=page-fit&view=FitH`}
                          className="absolute inset-0 w-full h-full border-0 rounded-lg"
                          title={location.state?.act ? 'Act PDF' : 'Judgment PDF'}
                          style={{ 
                            width: '100%', 
                            height: '100%',
                            display: 'block'
                          }}
                          allow="fullscreen"
                          scrolling="auto"
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
                      </div>
                        
                        {/* Fallback PDF Access - Show when iframe fails */}
                        {translationError && (
                      <div className="absolute inset-0 bg-white flex items-center justify-center p-3 sm:p-4 md:p-8">
                        <div className="text-center max-w-md w-full px-2">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-full bg-gradient-to-br flex items-center justify-center" 
                               style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                            <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-base sm:text-lg md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 px-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                            {location.state?.act ? 'Act PDF Document' : 'Judgment PDF Document'}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 px-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            The PDF cannot be embedded due to security restrictions. Click the button below to view the {location.state?.act ? 'act' : 'judgment'} PDF document in a new tab.
                          </p>
                          <div className="space-y-2 sm:space-y-3 px-2">
                            <button
                              onClick={() => window.open(translatedPdfUrl || pdfUrl, '_blank')}
                              className="w-full px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base"
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
                    </>
                    
                    {/* Translation Status Indicator - Only show on desktop */}
                    {isTranslating && (
                      <div className="absolute top-2 right-2 sm:top-3 md:top-4 sm:right-3 md:right-4 bg-blue-100 border border-blue-300 text-blue-700 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg z-10 max-w-[calc(100%-1rem)] sm:max-w-none">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 border-2 border-blue-600 border-t-transparent flex-shrink-0"></div>
                          <span className="hidden sm:inline">Translating PDF...</span>
                          <span className="sm:hidden">Translating...</span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1 hidden sm:block">
                          Fast translation in progress...
                        </div>
                      </div>
                    )}

                    {/* Translation Error Indicator - Only show on desktop */}
                    {translationError && !error && (
                      <div className="absolute top-2 right-2 sm:top-3 md:top-4 sm:right-3 md:right-4 bg-yellow-100 border border-yellow-300 text-yellow-700 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg z-10 max-w-[calc(100%-1rem)] sm:max-w-none">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">Fast fallback - showing original</span>
                          <span className="sm:hidden">Fallback</span>
                        </div>
                      </div>
                    )}

                    {/* Loading Overlay - Only show on desktop */}
                    {loading && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center rounded-lg">
                        <div className="text-center p-3 sm:p-4 md:p-6">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 md:h-12 md:w-12 border-4 border-gray-200 mx-auto"></div>
                            <div className="animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 md:h-12 md:w-12 border-4 border-transparent border-t-blue-600 absolute top-0 left-0"></div>
                          </div>
                          <p className="mt-2 sm:mt-3 md:mt-4 text-gray-600 font-medium text-xs sm:text-sm md:text-base px-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {translatedPdfUrl !== pdfUrl ? 'Loading Translated PDF...' : 'Loading PDF Document...'}
                          </p>
                          <p className="mt-1 text-xs sm:text-sm text-gray-500 px-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {translatedPdfUrl !== pdfUrl ? 'Please wait while we load the translated document' : 'Please wait while we prepare the document'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                   <div className="flex items-center justify-center h-full min-h-[350px] sm:min-h-[400px]">
                     <div className="text-center p-3 sm:p-4 md:p-8">
                       <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 rounded-full bg-gradient-to-br flex items-center justify-center" 
                            style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                         <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                       </div>
                       <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 px-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                         PDF Not Available
                       </h3>
                       <p className="text-gray-600 text-xs sm:text-sm px-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                         This {location.state?.act ? 'act' : 'judgment'} does not have a PDF document available.
                       </p>
                     </div>
                   </div>
                 )}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Draggable Notes Popup */}
      {showNotesPopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowNotesPopup(false)}
          />
          
          {/* Draggable Popup */}
          <div
            className="fixed bg-white rounded-lg shadow-2xl z-50 flex flex-col"
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`,
              width: `${popupSize.width}px`,
              height: `${popupSize.height}px`,
              minWidth: '400px',
              minHeight: '300px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              fontFamily: 'Roboto, sans-serif',
              userSelect: isDragging || isResizing ? 'none' : 'auto'
            }}
            onMouseDown={(e) => {
              // Only start dragging if clicking on the header
              if (e.target.closest('.notes-popup-header')) {
                setIsDragging(true);
                const rect = e.currentTarget.getBoundingClientRect();
                setDragOffset({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top
                });
              }
            }}
            onMouseMove={(e) => {
              if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;
                
                // Constrain to viewport
                const maxX = window.innerWidth - popupSize.width;
                const maxY = window.innerHeight - popupSize.height;
                
                setPopupPosition({
                  x: Math.max(0, Math.min(newX, maxX)),
                  y: Math.max(0, Math.min(newY, maxY))
                });
              } else if (isResizing) {
                const deltaX = e.clientX - resizeStart.x;
                const deltaY = e.clientY - resizeStart.y;
                
                const newWidth = Math.max(400, Math.min(window.innerWidth * 0.9, resizeStart.width + deltaX));
                const newHeight = Math.max(300, Math.min(window.innerHeight * 0.9, resizeStart.height + deltaY));
                
                setPopupSize({
                  width: newWidth,
                  height: newHeight
                });
                
                // Adjust position if popup goes out of bounds
                const maxX = window.innerWidth - newWidth;
                const maxY = window.innerHeight - newHeight;
                setPopupPosition(prev => ({
                  x: Math.min(prev.x, maxX),
                  y: Math.min(prev.y, maxY)
                }));
              }
            }}
            onMouseUp={() => {
              setIsDragging(false);
              setIsResizing(false);
            }}
            onMouseLeave={() => {
              setIsDragging(false);
              setIsResizing(false);
            }}
          >
            {/* Header - Draggable Area */}
            <div 
              className="notes-popup-header flex items-center justify-between p-4 border-b border-gray-200"
              style={{ 
                borderTopLeftRadius: '0.5rem', 
                borderTopRightRadius: '0.5rem',
                cursor: isDragging ? 'grabbing' : 'move',
                userSelect: 'none',
                background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)'
              }}
              onMouseEnter={(e) => {
                if (!isDragging) {
                  e.currentTarget.style.cursor = 'move';
                }
              }}
            >
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Notes
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Size Control Buttons */}
                <div className="flex items-center gap-1 border-r border-white border-opacity-30 pr-2 mr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopupSize(prev => ({
                        width: Math.max(400, prev.width - 50),
                        height: Math.max(300, prev.height - 50)
                      }));
                    }}
                    className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-opacity-20"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                    title="Make Smaller"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopupSize(prev => ({
                        width: Math.min(window.innerWidth * 0.9, prev.width + 50),
                        height: Math.min(window.innerHeight * 0.9, prev.height + 50)
                      }));
                    }}
                    className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-opacity-20"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                    title="Make Bigger"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotesPopup(false);
                  }}
                  className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-opacity-20 flex-shrink-0"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Resize Handle - Bottom Right Corner */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(30, 101, 173, 0.3) 50%, rgba(30, 101, 173, 0.3) 100%)',
                borderBottomRightRadius: '0.5rem',
                cursor: isResizing ? 'nwse-resize' : 'nwse-resize'
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsResizing(true);
                setResizeStart({
                  x: e.clientX,
                  y: e.clientY,
                  width: popupSize.width,
                  height: popupSize.height
                });
              }}
              onMouseEnter={(e) => {
                if (!isResizing) {
                  e.currentTarget.style.cursor = 'nwse-resize';
                }
              }}
              title="Drag to resize"
            />

            {/* Folder Tabs */}
            <div className="border-b border-gray-200 bg-gray-50 flex items-center gap-1 px-2 py-1 overflow-x-auto">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {notesFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Save current folder content before switching
                      setNotesFolders(prev => prev.map(f => 
                        f.id === activeFolderId ? { ...f, content: notesContent } : f
                      ));
                      // Switch to new folder
                      setActiveFolderId(folder.id);
                      setNotesContent(folder.content || '');
                    }}
                    className={`px-3 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                      activeFolderId === folder.id
                        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>{folder.name}</span>
                    {notesFolders.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notesFolders.length > 1) {
                            const newFolders = notesFolders.filter(f => f.id !== folder.id);
                            setNotesFolders(newFolders);
                            if (activeFolderId === folder.id) {
                              const newActiveId = newFolders[0]?.id || 'default';
                              setActiveFolderId(newActiveId);
                              setNotesContent(newFolders.find(f => f.id === newActiveId)?.content || '');
                            }
                          }
                        }}
                        className="ml-1 hover:bg-gray-200 rounded p-0.5 transition-colors"
                        title="Delete folder"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </button>
                ))}
                
                {/* Add New Folder Button */}
                {showNewFolderInput ? (
                  <div className="flex items-center gap-1 px-2">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newFolderName.trim()) {
                          const newFolder = {
                            id: `folder-${Date.now()}`,
                            name: newFolderName.trim(),
                            content: ''
                          };
                          setNotesFolders([...notesFolders, newFolder]);
                          setActiveFolderId(newFolder.id);
                          setNotesContent('');
                          setNewFolderName('');
                          setShowNewFolderInput(false);
                        } else if (e.key === 'Escape') {
                          setShowNewFolderInput(false);
                          setNewFolderName('');
                        }
                      }}
                      placeholder="Folder name..."
                      className="px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      style={{ fontFamily: 'Roboto, sans-serif', minWidth: '120px' }}
                      autoFocus
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNewFolderInput(false);
                        setNewFolderName('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNewFolderInput(true);
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-t-lg transition-all flex items-center gap-1"
                    title="Add new folder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">New Folder</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col" style={{ cursor: 'text' }}>
              <textarea
                value={notesContent}
                onChange={(e) => {
                  setNotesContent(e.target.value);
                  // Update folder content in real-time
                  setNotesFolders(prev => prev.map(f => 
                    f.id === activeFolderId ? { ...f, content: e.target.value } : f
                  ));
                }}
                placeholder="Write your notes here..."
                className="flex-1 w-full p-4 border-0 resize-none focus:outline-none focus:ring-0"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  minHeight: '300px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#1E65AD',
                  cursor: 'text'
                }}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  // Save current folder content before closing
                  setNotesFolders(prev => prev.map(f => 
                    f.id === activeFolderId ? { ...f, content: notesContent } : f
                  ));
                  setShowNotesPopup(false);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                style={{ fontFamily: 'Roboto, sans-serif', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save notes logic here - save all folders
                  setNotesFolders(prev => prev.map(f => 
                    f.id === activeFolderId ? { ...f, content: notesContent } : f
                  ));
                  console.log('Saving notes folders:', notesFolders);
                  // You can implement save functionality here (localStorage, API, etc.)
                  // Save to localStorage for persistence
                  const notesKey = `notes_${judgmentInfo?.id || judgmentInfo?.act_id || 'default'}`;
                  const updatedFolders = notesFolders.map(f => 
                    f.id === activeFolderId ? { ...f, content: notesContent } : f
                  );
                  localStorage.setItem(notesKey, JSON.stringify(updatedFolders));
                  setShowNotesPopup(false);
                }}
                className="px-4 py-2 text-white rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow-md"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #1a5a9a 0%, #b88a56 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)';
                }}
              >
                Save Notes
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
