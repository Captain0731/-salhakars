import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { JudgmentSkeleton } from "../components/SkeletonLoaders";

// Add custom CSS animations
const customStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .animate-shimmer {
    animation: shimmer 3s ease-in-out infinite;
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

export default function HighCourtJudgments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, bookmarkJudgement, removeJudgementBookmark } = useAuth();
  const [bookmarkedJudgments, setBookmarkedJudgments] = useState(new Set());
  const [bookmarkError, setBookmarkError] = useState('');

  // Data states
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    cnr: '',
    highCourt: '',
    decisionDateFrom: ''
  });

  const pageSize = 10;

  // Fetch judgments function
  const fetchJudgments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('High Court: Fetching judgments with params:', { page, filters });
      
      const params = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log('High Court: Final API params:', params);
      const data = await apiService.getJudgements(params);
      console.log('High Court: API response:', data);
      
      setJudgments(data.data || []);
      setTotalCount(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
      setCurrentPage(page);
    } catch (error) {
      console.error('High Court: Error fetching judgments:', error);
      setError(error.message || 'Failed to fetch judgments');
    } finally {
      setLoading(false);
    }
  };

  // Filter handling functions
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      cnr: '',
      highCourt: '',
      decisionDateFrom: ''
    });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchJudgments(1);
  };

  // Auto-apply filters when they change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search || filters.cnr || filters.highCourt || filters.decisionDateFrom) {
        applyFilters();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.cnr, filters.highCourt, filters.decisionDateFrom]);

  // Load initial data
  useEffect(() => {
    fetchJudgments(1);
  }, []);

  // Pagination functions
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchJudgments(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const viewJudgment = (judgment) => {
    navigate('/view-pdf', { state: { judgment } });
  };

  const handleBookmarkToggle = async (judgment) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const isBookmarked = bookmarkedJudgments.has(judgment.id);

      if (isBookmarked) {
        await removeJudgementBookmark(judgment.id);
        setBookmarkedJudgments(prev => {
          const newSet = new Set(prev);
          newSet.delete(judgment.id);
          return newSet;
        });
      } else {
        await bookmarkJudgement(judgment.id);
        setBookmarkedJudgments(prev => new Set(prev).add(judgment.id));
      }
      setBookmarkError(''); // Clear any previous error
    } catch (error) {
      console.error('Bookmark toggle error:', error);
      setBookmarkError('Failed to update bookmark. Please try again.');
    }
  };

  useEffect(() => {
    console.log('useEffect triggered.');
    console.log('Loading High Court data...');
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Clean Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              High Court Judgments
            </h1>
            <div className="w-20 h-1 mx-auto mb-6" style={{ backgroundColor: '#CF9B63' }}></div>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Search and access legal judgments from High Courts across India
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Search & Filter High Court Judgments
            </h2>
            
            {/* Search Bar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Search Judgments
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by case title, petitioner, respondent, or any keyword..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Search across case titles, parties, judges, and other judgment details
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* CNR Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  CNR Number
                </label>
                <input
                  type="text"
                  value={filters.cnr}
                  onChange={(e) => handleFilterChange('cnr', e.target.value)}
                  placeholder="e.g., HPHC010019512005"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              {/* High Court Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  High Court
                </label>
                <select
                  value={filters.highCourt}
                  onChange={(e) => handleFilterChange('highCourt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <option value="">All High Courts</option>
                  <option value="Allahabad High Court">Allahabad High Court</option>
                  <option value="Andhra Pradesh High Court">Andhra Pradesh High Court</option>
                  <option value="Bombay High Court">Bombay High Court</option>
                  <option value="Calcutta High Court">Calcutta High Court</option>
                  <option value="Chhattisgarh High Court">Chhattisgarh High Court</option>
                  <option value="Delhi High Court">Delhi High Court</option>
                  <option value="Gauhati High Court">Gauhati High Court</option>
                  <option value="Gujarat High Court">Gujarat High Court</option>
                  <option value="Himachal Pradesh High Court">Himachal Pradesh High Court</option>
                  <option value="Jammu & Kashmir and Ladakh High Court">Jammu & Kashmir and Ladakh High Court</option>
                  <option value="Jharkhand High Court">Jharkhand High Court</option>
                  <option value="Karnataka High Court">Karnataka High Court</option>
                  <option value="Kerala High Court">Kerala High Court</option>
                  <option value="Madhya Pradesh High Court">Madhya Pradesh High Court</option>
                  <option value="Madras High Court">Madras High Court</option>
                  <option value="Manipur High Court">Manipur High Court</option>
                  <option value="Meghalaya High Court">Meghalaya High Court</option>
                  <option value="Orissa High Court">Orissa High Court</option>
                  <option value="Patna High Court">Patna High Court</option>
                  <option value="Punjab and Haryana High Court">Punjab and Haryana High Court</option>
                  <option value="Rajasthan High Court">Rajasthan High Court</option>
                  <option value="Sikkim High Court">Sikkim High Court</option>
                  <option value="Telangana High Court">Telangana High Court</option>
                  <option value="Tripura High Court">Tripura High Court</option>
                  <option value="Uttarakhand High Court">Uttarakhand High Court</option>
                </select>
              </div>

              {/* Decision Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Decision Date From
                </label>
                <input
                  type="date"
                  value={filters.decisionDateFrom}
                  onChange={(e) => handleFilterChange('decisionDateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={applyFilters}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
              
              <button
                onClick={clearFilters}
                disabled={loading}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Clear Filters
              </button>
            </div>

            {/* Active Filters Display */}
            {(filters.search || filters.cnr || filters.highCourt || filters.decisionDateFrom) && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Active Filters:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Search: "{filters.search}"
                    </span>
                  )}
                  {filters.cnr && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      CNR: {filters.cnr}
                    </span>
                  )}
                  {filters.highCourt && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Court: {filters.highCourt}
                    </span>
                  )}
                  {filters.decisionDateFrom && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      From: {new Date(filters.decisionDateFrom).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Clean Results Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  {filters.search || filters.cnr || filters.highCourt || filters.decisionDateFrom 
                    ? 'Search Results - High Court Judgments' 
                    : 'Latest High Court Judgments'}
                </h2>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {filters.search || filters.cnr || filters.highCourt || filters.decisionDateFrom 
                    ? 'Showing High Court judgments matching your search and filter criteria' 
                    : 'Showing the most recent High Court judgments first'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {totalCount} judgments found
                </span>
                {(filters.search || filters.cnr || filters.highCourt || filters.decisionDateFrom) && (
                  <div className="mt-1">
                    <button
                      onClick={clearFilters}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => fetchJudgments(currentPage)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Bookmark Error */}
            {bookmarkError && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {bookmarkError}
                    </p>
                  </div>
                  <button
                    onClick={() => setBookmarkError('')}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700 transition-colors"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <JudgmentSkeleton key={index} />
                ))}
              </div>
            ) : judgments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  No High Court Judgments Found
                </h3>
                <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  No High Court judgments found matching your search criteria. Please try different filters or check your connection.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {console.log('Rendering High Court judgments:', judgments.length, judgments)}
                {judgments.map((judgment, index) => (
                  <div
                    key={judgment.cnr || index}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                            {judgment.title || judgment.case_info || 'Untitled Judgment'}
                          </h3>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Latest
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          {judgment.court_name && (
                            <div>
                              <span className="font-medium text-gray-800">Court:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.court_name}</span>
                            </div>
                          )}
                          
                          {judgment.decision_date && (
                            <div>
                              <span className="font-medium text-gray-800">Decision Date:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>
                                {new Date(judgment.decision_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          {judgment.cnr && (
                            <div>
                              <span className="font-medium text-gray-800">CNR:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.cnr}</span>
                            </div>
                          )}
                          
                          {judgment.case_info && (
                            <div>
                              <span className="font-medium text-gray-800">Case No.:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.case_info}</span>
                            </div>
                          )}
                          
                          {judgment.judge && (
                            <div>
                              <span className="font-medium text-gray-800">Judge:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.judge}</span>
                            </div>
                          )}
                          
                          {judgment.disposal_nature && (
                            <div>
                              <span className="font-medium text-gray-800">Disposal:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.disposal_nature}</span>
                            </div>
                          )}
                          
                          {judgment.date_of_registration && (
                            <div>
                              <span className="font-medium text-gray-800">Registration Date:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>
                                {new Date(judgment.date_of_registration).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>

                      <div className="flex-shrink-0 flex flex-col gap-2">
                        <button
                          onClick={() => viewJudgment(judgment)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleBookmarkToggle(judgment)}
                          className={`px-4 py-2 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md ${
                            bookmarkedJudgments.has(judgment.id)
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                          title={bookmarkedJudgments.has(judgment.id) ? 'Remove bookmark' : 'Add bookmark'}
                        >
                          {bookmarkedJudgments.has(judgment.id) ? '★ Bookmarked' : '☆ Bookmark'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between">
                    <div className="text-sm text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              disabled={loading}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}