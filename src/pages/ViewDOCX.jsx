import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import { FileText, Download, ArrowLeft, Loader2, AlertCircle, ExternalLink, Edit, Eye, Save } from "lucide-react";
import mammoth from "mammoth";

export default function ViewDOCX() {
  const navigate = useNavigate();
  const location = useLocation();
  const [docxUrl, setDocxUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Document Viewer");
  const [viewerUrl, setViewerUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [originalHtmlContent, setOriginalHtmlContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const editableContentRef = useRef(null);
  const iframeRef = useRef(null);
  const isContentInitialized = useRef(false);

  // Sample documents for showcase
  const sampleDocuments = [
    {
      id: 1,
      title: "10 Types of Reward and Recognition",
      url: "https://legalstuff.blr1.digitaloceanspaces.com/Copy%20of%2001-%2010%20Types%20of%20reward%20and%20recognition.docx",
      description: "Comprehensive guide on reward and recognition types"
    },
    {
      id: 2,
      title: "Sample Document 2",
      url: "https://legalstuff.blr1.digitaloceanspaces.com/Copy%20of%2001-%2010%20Types%20of%20reward%20and%20recognition.docx",
      description: "Example document for demonstration"
    },
    {
      id: 3,
      title: "Sample Document 3",
      url: "https://legalstuff.blr1.digitaloceanspaces.com/Copy%20of%2001-%2010%20Types%20of%20reward%20and%20recognition.docx",
      description: "Example document for demonstration"
    },
    {
      id: 4,
      title: "Sample Document 4",
      url: "https://legalstuff.blr1.digitaloceanspaces.com/Copy%20of%2001-%2010%20Types%20of%20reward%20and%20recognition.docx",
      description: "Example document for demonstration"
    },
    {
      id: 5,
      title: "Sample Document 5",
      url: "https://legalstuff.blr1.digitaloceanspaces.com/Copy%20of%2001-%2010%20Types%20of%20reward%20and%20recognition.docx",
      description: "Example document for demonstration"
    }
  ];

  useEffect(() => {
    // Get URL from location state or query params
    const urlFromState = location.state?.docxUrl;
    const urlFromQuery = new URLSearchParams(location.search).get("url");
    const titleFromState = location.state?.title || "Document Viewer";
    
    if (urlFromState || urlFromQuery) {
      setDocxUrl(urlFromState || urlFromQuery);
      setDocumentTitle(titleFromState);
      loadDocument(urlFromState || urlFromQuery);
    }
  }, [location]);

  const loadDocument = async (url, editMode = false) => {
    if (!url) return;

    setLoading(true);
    setError("");
    setViewerUrl("");
    setHtmlContent("");
    setIsEditMode(editMode);
    setHasChanges(false);
    isContentInitialized.current = false;

    try {
      if (editMode) {
        // For edit mode, fetch and convert DOCX to HTML for inline editing
        await loadDocumentForEditing(url);
      } else {
        // For view mode, use iframe viewer
        const encodedUrl = encodeURIComponent(url);
        const googleDocsViewer = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
        setViewerUrl(googleDocsViewer);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error setting up viewer:", err);
      setError(err.message || "Failed to load document viewer. Please check the URL and try again.");
      setLoading(false);
    }
  };

  const loadDocumentForEditing = async (url) => {
    try {
      let arrayBuffer;
      
      // Try direct fetch first
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/octet-stream, */*'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load document: ${response.status} ${response.statusText}`);
        }

        arrayBuffer = await response.arrayBuffer();
      } catch (fetchError) {
        // If direct fetch fails due to CORS, try using CORS proxies
        console.warn("Direct fetch failed, trying CORS proxy:", fetchError);
        
        const proxyServices = [
          `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
          `https://corsproxy.io/?${encodeURIComponent(url)}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        ];
        
        let proxySuccess = false;
        
        for (const proxyUrl of proxyServices) {
          try {
            const proxyResponse = await fetch(proxyUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/octet-stream, */*'
              }
            });

            if (!proxyResponse.ok) {
              throw new Error(`Proxy failed: ${proxyResponse.status}`);
            }

            arrayBuffer = await proxyResponse.arrayBuffer();
            
            if (arrayBuffer && arrayBuffer.byteLength > 0) {
              proxySuccess = true;
              break;
            }
          } catch (proxyError) {
            continue;
          }
        }
        
        if (!proxySuccess) {
          throw new Error("Unable to load document due to CORS restrictions.");
        }
      }

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("Document file is empty or could not be loaded");
      }

      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Heading 5'] => h5:fresh",
          "p[style-name='Heading 6'] => h6:fresh"
        ]
      });
      
      setHtmlContent(result.value);
      setOriginalHtmlContent(result.value);
      isContentInitialized.current = false; // Reset flag when loading new content
      
      if (result.messages.length > 0) {
        console.warn("Document conversion warnings:", result.messages);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading DOCX for editing:", err);
      setError(err.message || "Failed to load document for editing. Please check the URL and try again.");
      setLoading(false);
    }
  };

  const handleDocumentClick = (doc) => {
    setDocxUrl(doc.url);
    setDocumentTitle(doc.title);
    loadDocument(doc.url);
    // Scroll to viewer
    setTimeout(() => {
      document.getElementById("docx-viewer")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    // If Google Docs Viewer fails, try Microsoft Office Viewer
    if (docxUrl && viewerUrl.includes('docs.google.com')) {
      const encodedUrl = encodeURIComponent(docxUrl);
      const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
      setViewerUrl(officeViewer);
      setIsEditMode(false);
      setLoading(true);
    } else {
      setError("Unable to load document. The file may not be publicly accessible or the viewer service is unavailable.");
    }
  };

  const toggleEditMode = () => {
    if (docxUrl) {
      loadDocument(docxUrl, !isEditMode);
    }
  };

  const handleContentChange = () => {
    if (editableContentRef.current) {
      const newContent = editableContentRef.current.innerHTML;
      setHtmlContent(newContent);
      setHasChanges(newContent !== originalHtmlContent);
    }
  };

  const handleSave = () => {
    if (editableContentRef.current) {
      const content = editableContentRef.current.innerHTML;
      
      // Update the displayed content on screen
      setHtmlContent(content);
      setOriginalHtmlContent(content);
      setHasChanges(false);
      
      // Show success message using React state
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  const handleDownload = () => {
    if (docxUrl) {
      window.open(docxUrl, '_blank');
    }
  };

  const handleOpenInNewWindow = () => {
    if (docxUrl) {
      const encodedUrl = encodeURIComponent(docxUrl);
      if (isEditMode) {
        // Open in Microsoft Office Online Editor
        const officeEditor = `https://view.officeapps.live.com/op/view.aspx?src=${encodedUrl}`;
        window.open(officeEditor, '_blank');
      } else {
        // Open in Google Docs Viewer
        const googleDocsViewer = `https://docs.google.com/viewer?url=${encodedUrl}`;
        window.open(googleDocsViewer, '_blank');
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              DOCX Document Viewer
            </h1>
            <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              View and read Word documents directly in your browser
            </p>
          </div>

          {/* Sample Documents Showcase */}
          {!docxUrl && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                Sample Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sampleDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDocumentClick(doc)}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-blue-300"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors flex-shrink-0">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {doc.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {doc.description}
                        </p>
                        <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium">
                          <span>View Document</span>
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Viewer */}
          <div id="docx-viewer" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Viewer Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    {documentTitle}
                  </h2>
                  {docxUrl && (
                    <p className="text-xs sm:text-sm text-gray-500 truncate" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {docxUrl}
                    </p>
                  )}
                </div>
                {docxUrl && (
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                    <button
                      onClick={toggleEditMode}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2 w-full sm:w-auto ${
                        isEditMode 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {isEditMode ? (
                        <>
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>View Mode</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Edit Mode</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setDocxUrl("");
                        setViewerUrl("");
                        setHtmlContent("");
                        setDocumentTitle("Document Viewer");
                        setIsEditMode(false);
                        setHasChanges(false);
                      }}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium w-full sm:w-auto"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Close
                    </button>
                    {isEditMode && hasChanges && (
                      <button
                        onClick={handleSave}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Save Changes</span>
                      </button>
                    )}
                    {!isEditMode && (
                      <button
                        onClick={handleOpenInNewWindow}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                        title="Open in viewer (new window)"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Open Viewer</span>
                      </button>
                    )}
                    <button
                      onClick={handleDownload}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Document Content */}
            <div className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
                  <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600 animate-spin mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    {isEditMode ? "Loading Document for Editing..." : "Loading Document..."}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {isEditMode ? "Please wait while we convert the document" : "Please wait while we load the document viewer"}
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
                  <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-red-500 mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    Error Loading Document
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 text-center mb-4 max-w-md" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {error}
                  </p>
                  <button
                    onClick={() => docxUrl && loadDocument(docxUrl, isEditMode)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Try Again
                  </button>
                </div>
              ) : isEditMode && htmlContent ? (
                <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                  {hasChanges && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg flex items-center justify-between">
                      <p className="text-sm text-yellow-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        <strong>Unsaved changes:</strong> You have made changes to the document. Don't forget to save!
                      </p>
                    </div>
                  )}
                  {!hasChanges && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        <strong>✓ All changes saved</strong> - Your edits are displayed below
                      </p>
                    </div>
                  )}
                  <div
                    ref={(el) => {
                      editableContentRef.current = el;
                      // Set content only once when it changes, not on every render
                      if (el && htmlContent && !isContentInitialized.current) {
                        el.innerHTML = htmlContent;
                        isContentInitialized.current = true;
                      }
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleContentChange}
                    className="prose prose-sm sm:prose-base md:prose-lg max-w-none min-h-[400px] p-6 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      color: '#1F2937',
                      lineHeight: '1.75',
                      cursor: 'text'
                    }}
                  />
                </div>
              ) : viewerUrl ? (
                <div className="relative w-full" style={{ minHeight: '600px', height: 'calc(100vh - 300px)' }}>
                  <iframe
                    ref={iframeRef}
                    src={viewerUrl}
                    className="w-full h-full border-0"
                    style={{ minHeight: '600px', height: 'calc(100vh - 300px)' }}
                    title="DOCX Document Viewer"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    allow="fullscreen"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-gray-300 mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    No Document Selected
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Select a document from above to view it here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message - Using React state instead of DOM manipulation */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>Changes saved successfully!</span>
        </div>
      )}

      {/* Custom Styles for Editable Content */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        [contenteditable="true"] {
          outline: none;
        }
        [contenteditable="true"]:focus {
          outline: none;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #1E65AD;
          font-family: 'Helvetica Hebrew Bold', sans-serif;
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }
        .prose p {
          margin-bottom: 1em;
          line-height: 1.75;
        }
        .prose ul, .prose ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        .prose li {
          margin-bottom: 0.5em;
        }
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }
        .prose table th,
        .prose table td {
          border: 1px solid #E5E7EB;
          padding: 0.5em 1em;
          text-align: left;
        }
        .prose table th {
          background-color: #F3F4F6;
          font-weight: bold;
        }
        .prose img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
        .prose strong {
          font-weight: 600;
          color: #1F2937;
        }
        .prose em {
          font-style: italic;
        }
        .prose a {
          color: #1E65AD;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #1557A0;
        }
        .prose blockquote {
          border-left: 4px solid #1E65AD;
          padding-left: 1em;
          margin: 1em 0;
          color: #6B7280;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

