import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import PDFTranslator from "../components/PDFTranslator";
import { ArrowLeft, Share2, FileText, StickyNote, X } from "lucide-react";

export default function MobilePDFViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState("");
  const [translatedPdfUrl, setTranslatedPdfUrl] = useState("");
  const [judgmentInfo, setJudgmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [notesContent, setNotesContent] = useState("");
  const [notesFolders, setNotesFolders] = useState([{ id: 'default', name: 'Default', content: '' }]);
  const [activeFolderId, setActiveFolderId] = useState('default');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [saveButtonText, setSaveButtonText] = useState("Save Notes");
  const [saveButtonColor, setSaveButtonColor] = useState("");

  useEffect(() => {
    // Get PDF URL and judgment/act data from location state
    const pdfData = location.state?.pdfUrl;
    const judgmentData = location.state?.judgment;
    const actData = location.state?.act;
    
    if (pdfData) {
      setPdfUrl(pdfData);
      setTranslatedPdfUrl(pdfData);
      setJudgmentInfo(judgmentData || actData);
      setLoading(false);
    } else {
      // If no PDF URL, redirect back
      setError("No PDF URL provided");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  }, [location.state, navigate]);

  // Stable callback for PDF translation changes
  const handleTranslatedUrlChange = (url) => {
    setTranslatedPdfUrl(url);
  };

  // Load saved notes from localStorage when judgment/act changes
  useEffect(() => {
    if (judgmentInfo) {
      const notesKey = `notes_${judgmentInfo?.id || judgmentInfo?.act_id || 'default'}`;
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) {
        try {
          const parsedFolders = JSON.parse(savedNotes);
          if (Array.isArray(parsedFolders) && parsedFolders.length > 0) {
            setNotesFolders(parsedFolders);
            setActiveFolderId(parsedFolders[0].id);
            setNotesContent(parsedFolders[0].content || '');
          }
        } catch (error) {
          console.error('Error parsing saved notes:', error);
        }
      }
    }
  }, [judgmentInfo]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="pt-14 sm:pt-16 md:pt-20 flex justify-center items-center" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="text-center px-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>Loading PDF...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="pt-20 sm:pt-16 md:pt-20 flex justify-center items-center px-4" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="text-center max-w-md w-full pt-10">
            <div className="text-red-600 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>Error loading PDF</div>
            <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs sm:text-sm md:text-base font-medium"
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* PDF Translator Component - Handles PDF translation */}
      <PDFTranslator 
        pdfUrl={pdfUrl} 
        onTranslatedUrlChange={handleTranslatedUrlChange}
      />

      <div className="flex-1 flex flex-col pt-14 sm:pt-16 md:pt-20">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-14 sm:top-16 md:top-20 z-30 flex-shrink-0 pt-8">
          <div className="w-full mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Back</span>
            </button>
            
            <h2 className="text-xs sm:text-sm md:text-base font-bold flex-1 text-center px-2 truncate" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              {judgmentInfo?.title || judgmentInfo?.short_title || 'PDF Viewer'}
            </h2>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied to clipboard!');
                  }).catch(() => {
                    alert('Failed to copy link');
                  });
                }}
                className="p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Toolbar - Search, Summary, Notes */}
        <div className="bg-gray-50 border-b border-gray-200 px-2 sm:px-4 py-2 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[150px]">
              <img 
                src="/uit3.GIF" 
                alt="Search" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 object-contain pointer-events-none z-10"
              />
              <input
                type="text"
                placeholder="Search With Kiki AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                style={{ fontFamily: 'Roboto, sans-serif' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    console.log('Searching for:', searchQuery);
                  }
                }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Summary Button */}
              <button
                onClick={() => {
                  console.log('Summary clicked for:', judgmentInfo?.id || judgmentInfo?.title);
                }}
                className="flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all font-medium text-xs shadow-sm hover:shadow-md whitespace-nowrap"
                style={{ fontFamily: 'Roboto, sans-serif' }}
                title="View Summary"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Summary</span>
              </button>
              
              {/* Notes Button */}
              <button
                onClick={() => {
                  const notesKey = `notes_${judgmentInfo?.id || judgmentInfo?.act_id || 'default'}`;
                  const savedNotes = localStorage.getItem(notesKey);
                  
                  if (!savedNotes) {
                    const initialContent = `# ${judgmentInfo?.title || judgmentInfo?.short_title || 'Untitled Note'}\n\n${judgmentInfo?.summary || 'No summary available.'}\n\n## Details\n\nCourt: ${judgmentInfo?.court_name || 'N/A'}\nDate: ${judgmentInfo?.decision_date || judgmentInfo?.year || 'N/A'}`;
                    
                    if (notesFolders.length === 0 || (notesFolders.length === 1 && notesFolders[0].content === '')) {
                      setNotesFolders([{ id: 'default', name: 'Default', content: initialContent }]);
                      setActiveFolderId('default');
                      setNotesContent(initialContent);
                    }
                  } else {
                    const currentFolder = notesFolders.find(f => f.id === activeFolderId);
                    setNotesContent(currentFolder?.content || '');
                  }
                  
                  setShowNotesPopup(true);
                }}
                className="flex items-center justify-center gap-1 px-2 py-1.5 text-white rounded-lg transition-all font-medium text-xs shadow-sm hover:shadow-md whitespace-nowrap"
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
                <StickyNote className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="w-full flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {pdfUrl && pdfUrl.trim() !== "" ? (
            <iframe
              src={`${translatedPdfUrl || pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-fit&view=FitH`}
              className="w-full h-full border-0"
              title={judgmentInfo?.title || 'PDF Document'}
              style={{ 
                width: '100%', 
                height: '100vh',
                display: 'block'
              }}
              allow="fullscreen"
              scrolling="auto"
              onLoad={() => {
                setLoading(false);
              }}
              onError={() => {
                setError("PDF cannot be loaded. Please try opening it directly.");
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center max-w-md w-full">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br flex items-center justify-center" 
                     style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
                  <svg className="w-8 h-8" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  PDF Not Available
                </h3>
                <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  This document does not have a PDF available.
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Popup - Mobile Optimized */}
      {showNotesPopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            onClick={() => setShowNotesPopup(false)}
          />
          
          {/* Popup */}
          <div
            className="fixed bg-white rounded-t-2xl sm:rounded-lg shadow-2xl z-50 flex flex-col"
            style={{
              left: '0',
              right: '0',
              bottom: '0',
              top: '10%',
              maxHeight: '90vh',
              minHeight: '400px',
              fontFamily: 'Roboto, sans-serif',
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b border-white border-opacity-20"
              style={{ 
                background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)',
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem'
              }}
            >
              <div className="flex items-center gap-2.5">
                <StickyNote className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <h3 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Notes
                </h3>
              </div>
              <button
                onClick={() => setShowNotesPopup(false)}
                className="text-white hover:text-gray-200 active:text-gray-300 transition-colors p-1.5 rounded-full hover:bg-white hover:bg-opacity-20 active:bg-opacity-30"
                style={{ 
                  borderRadius: '50%'
                }}
                aria-label="Close"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            {/* Folder Tabs */}
            <div className="border-b border-gray-200 bg-gray-50" style={{ position: 'relative', zIndex: 1 }}>
              <div className="flex items-center gap-2 p-3 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                {/* Folder Tabs */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {notesFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setActiveFolderId(folder.id);
                        setNotesContent(folder.content || '');
                      }}
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        activeFolderId === folder.id
                          ? 'bg-blue-600 text-white shadow-md scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-gray-200'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {folder.name}
                    </button>
                  ))}
                </div>
                
                {/* Action Buttons Container */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {showNewFolderInput ? (
                    <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name"
                        className="px-2.5 py-1.5 border-2 border-blue-500 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                        style={{ 
                          fontFamily: 'Roboto, sans-serif', 
                          minWidth: '120px',
                          maxWidth: '150px'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newFolderName.trim()) {
                            const newFolder = {
                              id: Date.now().toString(),
                              name: newFolderName.trim(),
                              content: ''
                            };
                            setNotesFolders([...notesFolders, newFolder]);
                            setActiveFolderId(newFolder.id);
                            setNotesContent('');
                            setNewFolderName('');
                            setShowNewFolderInput(false);
                          }
                        }}
                        onBlur={() => {
                          // Don't close on blur, let user click Add or Cancel
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          if (newFolderName.trim()) {
                            const newFolder = {
                              id: Date.now().toString(),
                              name: newFolderName.trim(),
                              content: ''
                            };
                            setNotesFolders([...notesFolders, newFolder]);
                            setActiveFolderId(newFolder.id);
                            setNotesContent('');
                            setNewFolderName('');
                          }
                          setShowNewFolderInput(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm whitespace-nowrap ${
                          newFolderName.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        disabled={!newFolderName.trim()}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowNewFolderInput(false);
                          setNewFolderName('');
                        }}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 active:bg-gray-400 transition-colors whitespace-nowrap"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowNewFolderInput(true)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        + New
                      </button>
                      {notesFolders.length > 1 && (
                        <button
                          onClick={() => {
                            if (notesFolders.length > 1 && window.confirm('Delete this folder?')) {
                              const newFolders = notesFolders.filter(f => f.id !== activeFolderId);
                              setNotesFolders(newFolders);
                              setActiveFolderId(newFolders[0].id);
                              setNotesContent(newFolders[0].content || '');
                            }
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col p-4 bg-gray-50">
              <textarea
                value={notesContent}
                onChange={(e) => {
                  setNotesContent(e.target.value);
                  const updatedFolders = notesFolders.map(f =>
                    f.id === activeFolderId ? { ...f, content: e.target.value } : f
                  );
                  setNotesFolders(updatedFolders);
                }}
                className="flex-1 w-full p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white shadow-inner"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  lineHeight: '1.6',
                  minHeight: '200px'
                }}
                placeholder="Write your notes here...&#10;&#10;You can use markdown formatting:&#10;# Heading&#10;## Subheading&#10;**Bold text**&#10;*Italic text*"
              />
              
              {/* Save Button */}
              <button
                onClick={() => {
                  const notesKey = `notes_${judgmentInfo?.id || judgmentInfo?.act_id || 'default'}`;
                  localStorage.setItem(notesKey, JSON.stringify(notesFolders));
                  
                  // Visual feedback
                  setSaveButtonText('✓ Saved!');
                  setSaveButtonColor('#10b981');
                  setTimeout(() => {
                    setSaveButtonText('Save Notes');
                    setSaveButtonColor('');
                  }, 2000);
                }}
                className="mt-3 w-full px-4 py-3 text-white rounded-xl hover:bg-opacity-90 active:bg-opacity-80 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  backgroundColor: saveButtonColor || '#2563eb'
                }}
              >
                {saveButtonText}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

