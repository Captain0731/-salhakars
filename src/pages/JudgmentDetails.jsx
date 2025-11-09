import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import apiService from '../services/api';
import { ArrowLeft, FileText, Calendar, User, Building, Download, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function JudgmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [judgment, setJudgment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markdownContent, setMarkdownContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const fetchJudgment = async () => {
      if (!id) {
        setError('Judgment ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if judgment data is passed via state (from bookmarks, etc.)
        const judgmentFromState = location.state?.judgment;
        if (judgmentFromState && judgmentFromState.id === parseInt(id)) {
          setJudgment(judgmentFromState);
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await apiService.getJudgementById(id);
        
        // Handle different response structures
        let judgmentData = response;
        if (response.data) {
          judgmentData = response.data;
        } else if (response.judgment) {
          judgmentData = response.judgment;
        }

        setJudgment(judgmentData);
      } catch (err) {
        console.error('Error fetching judgment:', err);
        setError(err.message || 'Failed to load judgment details');
      } finally {
        setLoading(false);
      }
    };

    fetchJudgment();
  }, [id, location.state]);

  // Fetch markdown content
  useEffect(() => {
    const fetchMarkdown = async () => {
      if (!id) return;

      try {
        setLoadingContent(true);
        const response = await fetch(`${apiService.baseURL}/api/judgements/${id}?format=markdown`, {
          method: 'GET',
          headers: apiService.getAuthHeaders()
        });

        if (!response.ok) {
          throw new Error('Failed to fetch markdown content');
        }

        const text = await response.text();
        setMarkdownContent(text);
      } catch (err) {
        console.error('Error fetching markdown content:', err);
        setError(err.message || 'Failed to load markdown content');
      } finally {
        setLoadingContent(false);
      }
    };

    if (judgment) {
      fetchMarkdown();
    }
  }, [id, judgment]);

  const handleViewPDF = () => {
    if (judgment?.pdf_link || judgment?.pdf_url) {
      const pdfUrl = judgment.pdf_link || judgment.pdf_url;
      const judgmentId = judgment.id || judgment.cnr || id;
      const url = judgmentId ? `/judgment/${judgmentId}` : '/judgment';
      navigate(url, {
        state: {
          judgment: {
            ...judgment,
            pdf_link: pdfUrl,
            pdf_url: pdfUrl
          }
        }
      });
    }
  };

  const handleDownloadPDF = () => {
    if (judgment?.pdf_link || judgment?.pdf_url) {
      const pdfUrl = judgment.pdf_link || judgment.pdf_url;
      window.open(pdfUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Loading judgment details...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Error Loading Judgment
                </h2>
                <p className="text-gray-600 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {error}
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!judgment) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Judgment not found
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          {/* Judgment Header */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              {judgment.title || judgment.case_info || 'Judgment Details'}
            </h1>

            {/* Judgment Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {judgment.judge && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Judge
                    </p>
                    <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {judgment.judge}
                    </p>
                  </div>
                </div>
              )}

              {judgment.decision_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Decision Date
                    </p>
                    <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {new Date(judgment.decision_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {judgment.court_name && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Court
                    </p>
                    <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {judgment.court_name}
                    </p>
                  </div>
                </div>
              )}

              {judgment.cnr && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      CNR
                    </p>
                    <p className="text-sm font-medium text-gray-900 break-all" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {judgment.cnr}
                    </p>
                  </div>
                </div>
              )}

              {judgment.disposal_nature && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Disposal Nature
                    </p>
                    <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {judgment.disposal_nature}
                    </p>
                  </div>
                </div>
              )}

              {judgment.year && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Year
                    </p>
                    <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {judgment.year}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {(judgment.pdf_link || judgment.pdf_url) && (
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleViewPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <FileText className="h-4 w-4" />
                  <span>View PDF</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Markdown Content Display Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 mt-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Judgment Content
            </h2>
            {loadingContent ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="ml-3 text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Loading content...
                </p>
              </div>
            ) : markdownContent ? (
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none 
                           prose-headings:text-gray-900 prose-headings:font-bold
                           prose-p:text-gray-700 prose-p:leading-relaxed
                           prose-strong:text-gray-900 prose-strong:font-semibold
                           prose-ul:text-gray-700 prose-ol:text-gray-700
                           prose-li:text-gray-700 prose-li:my-1
                           prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                           prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                           prose-code:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                           prose-pre:bg-gray-900 prose-pre:text-gray-100
                           prose-table:border-collapse prose-table:w-full
                           prose-th:bg-gray-100 prose-th:font-semibold prose-th:p-2
                           prose-td:border prose-td:p-2"
                style={{ fontFamily: 'Roboto, sans-serif', lineHeight: '1.8' }}
              >
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  No content available for this judgment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

