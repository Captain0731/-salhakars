import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import ReactPDFViewer from '../components/ReactPDFViewer';
import { FileText, ExternalLink } from 'lucide-react';

export default function ReactPDFViewerDemo() {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState('');
  
  // Sample PDF URLs for testing
  const samplePDFs = [
    {
      id: 1,
      title: 'Aligarh Muslim University vs Naresh Agarwal',
      url: '/Aligarh_Muslim_University_Through_Its_vs_Naresh_Agarwal_on_8_November_2024.PDF',
    },
    {
      id: 2,
      title: 'Delhi Development Authority vs Tejpal',
      url: '/Delhi_Development_Authority_vs_Tejpal_on_17_May_2024.PDF',
    },
    {
      id: 3,
      title: 'Mineral Area Development Authority vs M.S. Steel Authority',
      url: '/Mineral_Area_Development_Authority_Etc_vs_M_S_Steel_Authority_Of_India_on_25_July_2024.PDF',
    },
    {
      id: 4,
      title: 'State of U.P. vs M.S. Lalta Prasad Vaish',
      url: '/State_Of_U_P_vs_M_S_Lalta_Prasad_Vaish_And_Sons_on_23_October_2024.PDF',
    },
    {
      id: 5,
      title: 'State of Punjab vs Davinder Singh',
      url: '/The_State_Of_Punjab_vs_Davinder_Singh_on_1_August_2024.PDF',
    },
  ];

  // Get PDF URL from location state or query params, or load default PDF
  React.useEffect(() => {
    const urlFromState = location.state?.pdfUrl;
    const urlFromQuery = new URLSearchParams(location.search).get('url');
    
    if (urlFromState || urlFromQuery) {
      console.log('Setting PDF URL from state/query:', urlFromState || urlFromQuery);
      setPdfUrl(urlFromState || urlFromQuery);
    } else {
      // Load default PDF from public folder
      const defaultUrl = '/Aligarh_Muslim_University_Through_Its_vs_Naresh_Agarwal_on_8_November_2024.PDF';
      console.log('Setting default PDF URL:', defaultUrl);
      setPdfUrl(defaultUrl);
    }
  }, [location]);

  const handlePDFSelect = (url) => {
    setPdfUrl(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              React PDF Viewer Demo
            </h1>
            <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              View PDF documents using react-pdf library with full controls
            </p>
          </div>

          {/* Sample PDFs Showcase */}
          {!pdfUrl && (
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                Sample PDF Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {samplePDFs.map((pdf) => (
                  <div
                    key={pdf.id}
                    onClick={() => handlePDFSelect(pdf.url)}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-blue-300"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors flex-shrink-0">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {pdf.title}
                        </h3>
                        <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium">
                          <span>View PDF</span>
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF Viewer */}
          {pdfUrl && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
              <ReactPDFViewer pdfUrl={pdfUrl} title="PDF Document" />
            </div>
          )}

          {/* Instructions */}
          {!pdfUrl && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                How to Use:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-blue-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <li>Click on any sample PDF above to view it</li>
                <li>Use the navigation buttons to move between pages</li>
                <li>Zoom in/out using the zoom controls</li>
                <li>Rotate the document if needed</li>
                <li>Download the PDF using the download button</li>
                <li>You can also pass a PDF URL via query parameter: <code className="bg-blue-100 px-2 py-1 rounded">/react-pdf-viewer?url=YOUR_PDF_URL</code></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

