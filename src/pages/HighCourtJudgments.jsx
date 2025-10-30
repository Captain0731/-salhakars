import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import BookmarkButton from "../components/BookmarkButton";
import useSmoothInfiniteScroll from "../hooks/useSmoothInfiniteScroll";
import { 
  EnhancedJudgmentSkeleton, 
  EnhancedInfiniteScrollLoader, 
  SkeletonGrid,
  SmoothTransitionWrapper 
} from "../components/EnhancedLoadingComponents";

// Add custom CSS animations and smooth scrolling
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
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slideInFromBottom {
    from { 
      opacity: 0; 
      transform: translateY(50px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
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
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-slide-in-bottom {
    animation: slideInFromBottom 0.8s ease-out forwards;
  }
  
  /* Smooth scrolling for the entire page */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* Smooth transitions for all interactive elements */
  * {
    transition: all 0.2s ease-in-out;
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
  const { isAuthenticated } = useAuth();
  const isMountedRef = useRef(true);

  // Data states
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const nextCursorRef = useRef(null);
  const fetchJudgmentsRef = useRef(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    title: '',
    cnr: '',
    highCourt: '',
    judge: '',
    decisionDateFrom: ''
  });

  const pageSize = 10; // API maximum limit

  // Fetch judgments function with cursor-based pagination
  const fetchJudgments = useCallback(async (isLoadMore = false) => {
    if (!isMountedRef.current) return;
    
    try {
      if (isLoadMore) {
        setIsSearching(true);
      } else {
        setLoading(true);
        setError(null);
      }
      
      // Get current nextCursor value from ref
      const currentNextCursor = nextCursorRef.current;
      console.log('High Court: Fetching judgments with params:', { isLoadMore, filters, currentNextCursor });
      
      const params = {
        limit: pageSize,
        ...filters
      };
      
      // Log the filters being used
      console.log('High Court: Current filters state:', filters);
      console.log('High Court: All filters empty?', !filters.search && !filters.cnr && !filters.highCourt && !filters.decisionDateFrom);

      // Add cursor for pagination if loading more
      if (isLoadMore && currentNextCursor) {
        params.cursor_decision_date = currentNextCursor.decision_date;
        params.cursor_id = currentNextCursor.id;
      }

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log('High Court: Final API params:', params);
      const data = await apiService.getJudgements(params);
      console.log('High Court: API response:', data);
      console.log('High Court: Data length:', data?.data?.length);
      console.log('High Court: Has more data?', data?.pagination_info?.has_more);
      
      // Validate API response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response: Expected object but got ' + typeof data);
      }
      
      if (!Array.isArray(data.data)) {
        console.warn('High Court: API response data is not an array:', data.data);
        data.data = [];
      }
      
      if (!isMountedRef.current) return;
      
      // Ensure data structure is valid
      const newJudgments = Array.isArray(data.data) ? data.data : [];
      const paginationInfo = data.pagination_info || {};
      
      console.log('High Court: Processing judgments:', {
        newJudgmentsLength: newJudgments.length,
        paginationInfo,
        hasMore: paginationInfo.has_more,
        nextCursor: data.next_cursor
      });
      
      if (isLoadMore) {
        setJudgments(prev => [...prev, ...newJudgments]);
      } else {
        setJudgments(newJudgments);
      }
      
      // Update cursor and hasMore based on API response
      setNextCursor(data.next_cursor || null);
      setHasMore(paginationInfo.has_more || false);
      
      // Estimate total count (this might not be available in cursor-based pagination)
      if (!isLoadMore) {
        setTotalCount(newJudgments.length + (paginationInfo.has_more ? 1 : 0));
      }
      
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error('High Court: Error fetching judgments:', error);
      setError(error.message || 'Failed to fetch judgments');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setIsSearching(false);
      }
    }
  }, [filters, pageSize]);

  // Store fetchJudgments in ref to avoid dependency issues
  useEffect(() => {
    fetchJudgmentsRef.current = fetchJudgments;
  }, [fetchJudgments]);

  // Filter handling functions
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    console.log('High Court: Clearing filters...');
    
    // Clear all filters
    setFilters({
      search: '',
      title: '',
      cnr: '',
      highCourt: '',
      judge: '',
      decisionDateFrom: ''
    });
    
    // Reset pagination state
    setJudgments([]);
    setHasMore(true);
    setNextCursor(null);
    
    // Immediately fetch data without waiting for debounce
    console.log('High Court: Fetching data after clearing filters...');
    fetchJudgments(false);
  };

  const applyFilters = () => {
    setJudgments([]);
    setHasMore(true);
    setNextCursor(null);
    fetchJudgments(false);
  };

  // Sync nextCursor ref with state
  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  // Auto-apply filters when they change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only trigger search if there are active filters or if this is the initial load
      const hasActiveFilters = filters.search || filters.title || filters.cnr || filters.highCourt || filters.judge || filters.decisionDateFrom;
      
      if (hasActiveFilters) {
        console.log('High Court: Auto-applying filters with active filters:', filters);
        setJudgments([]);
        setHasMore(true);
        setNextCursor(null);
        fetchJudgments(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.title, filters.cnr, filters.highCourt, filters.judge, filters.decisionDateFrom, fetchJudgments]);

  // Load initial data
  useEffect(() => {
    fetchJudgments(false);
  }, []); // Empty dependency array to run only once on mount

  // Enhanced infinite scroll logic with cursor-based pagination
  const loadMoreData = useCallback(async () => {
    if (!hasMore || loading || isSearching || !isMountedRef.current) return;
    if (fetchJudgmentsRef.current) {
      await fetchJudgmentsRef.current(true);
    }
  }, [hasMore, loading, isSearching]);

  // Enhanced infinite scroll hook with smooth animations
  // Optimized for 10-item batches with smooth loading
  const { 
    loadingRef, 
    isLoadingMore, 
    error: scrollError, 
    retry, 
    retryCount,
    isFetching 
  } = useSmoothInfiniteScroll({
    fetchMore: loadMoreData,
    hasMore,
    isLoading: loading || isSearching,
    threshold: 0.1,
    rootMargin: '100px', // Optimal margin for 10-item batches
    preloadThreshold: 0.3, // Load when 30% visible for smooth experience
    throttleDelay: 150 // Faster response for better UX
  });

  const viewJudgment = (judgment) => {
    navigate('/view-pdf', { state: { judgment } });
  };


  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);


  return (
    <div className="min-h-screen animate-fade-in-up" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Enhanced Header Section with smooth animations */}
      <div className="bg-white border-b border-gray-200 pt-20 animate-slide-in-bottom">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              High Court Judgments
            </h1>
            <div className="w-20 h-1 mx-auto mb-6 animate-fade-in-up" style={{ backgroundColor: '#CF9B63', animationDelay: '0.2s' }}></div>
            <p className="text-lg max-w-3xl mx-auto animate-fade-in-up" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif', animationDelay: '0.4s' }}>
              Search and access legal judgments from High Courts across India
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* Enhanced Search and Filter Section with smooth animations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold mb-6 animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif', animationDelay: '0.8s' }}>
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

            {/* Title and Judge Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Title Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Case Title
                </label>
                <input
                  type="text"
                  value={filters.title}
                  onChange={(e) => handleFilterChange('title', e.target.value)}
                  placeholder="e.g., State vs John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Search by specific case title
                </p>
              </div>

              {/* Judge Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Judge Name
                </label>
                <input
                  type="text"
                  value={filters.judge}
                  onChange={(e) => handleFilterChange('judge', e.target.value)}
                  placeholder="e.g., Justice Singh"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Search by judge name
                </p>
              </div>
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
                  <option value="Bombay High Court">Bombay High Court</option>
                  <option value="Calcutta High Court">Calcutta High Court</option>
                  <option value="Gauhati High Court">Gauhati High Court</option>
                  <option value="High Court for State of Telangana">High Court for State of Telangana</option>
                  <option value="High Court of Andhra Pradesh">High Court of Andhra Pradesh</option>
                  <option value="High Court of Chhattisgarh">High Court of Chhattisgarh</option>
                  <option value="High Court of Delhi">High Court of Delhi</option>
                  <option value="High Court of Gujarat">High Court of Gujarat</option>
                  <option value="High Court of Himachal Pradesh">High Court of Himachal Pradesh</option>
                  <option value="High Court of Jammu and Kashmir">High Court of Jammu and Kashmir</option>
                  <option value="High Court of Jharkhand">High Court of Jharkhand</option>
                  <option value="High Court of Karnataka">High Court of Karnataka</option>
                  <option value="High Court of Kerala">High Court of Kerala</option>
                  <option value="High Court of Madhya Pradesh">High Court of Madhya Pradesh</option>
                  <option value="High Court of Manipur">High Court of Manipur</option>
                  <option value="High Court of Meghalaya">High Court of Meghalaya</option>
                  <option value="High Court of Orissa">High Court of Orissa</option>
                  <option value="High Court of Punjab and Haryana">High Court of Punjab and Haryana</option>
                  <option value="High Court of Rajasthan">High Court of Rajasthan</option>
                  <option value="High Court of Sikkim">High Court of Sikkim</option>
                  <option value="High Court of Tripura">High Court of Tripura</option>
                  <option value="High Court of Uttarakhand">High Court of Uttarakhand</option>
                  <option value="Madras High Court">Madras High Court</option>
                  <option value="Patna High Court">Patna High Court</option>
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
                  onChange={(e) => {
                    // Convert from yyyy-mm-dd to yyyy-mm-dd format (already correct for API)
                    handleFilterChange('decisionDateFrom', e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                  placeholder="DD-MM-YYYY"
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Format: DD-MM-YYYY (e.g., 17-10-2025)
                </p>
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
            {(filters.search || filters.title || filters.cnr || filters.highCourt || filters.judge || filters.decisionDateFrom) && (
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
                  {filters.title && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Title: "{filters.title}"
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
                  {filters.judge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Judge: "{filters.judge}"
                    </span>
                  )}
                  {filters.decisionDateFrom && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      From: {filters.decisionDateFrom}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Results Section with smooth animations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif', animationDelay: '1.2s' }}>
                  {filters.search || filters.title || filters.cnr || filters.highCourt || filters.judge || filters.decisionDateFrom 
                    ? 'Search Results - High Court Judgments' 
                    : 'Latest High Court Judgments'}
                </h2>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {filters.search || filters.title || filters.cnr || filters.highCourt || filters.judge || filters.decisionDateFrom 
                    ? 'Showing High Court judgments matching your search and filter criteria' 
                    : 'Showing the most recent High Court judgments first'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {hasMore 
                    ? `Showing ${judgments.length} judgments (and more available)`
                    : `Showing ${judgments.length} judgments`
                  }
                </span>
                {(filters.search || filters.title || filters.cnr || filters.highCourt || filters.judge || filters.decisionDateFrom) && (
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
                    onClick={() => fetchJudgments(false)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}


            {loading ? (
              <SkeletonGrid count={3} />
            ) : judgments.length === 0 && !error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  No judgments found
                </h3>
                <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  No High Court judgments found matching your search criteria. Please try different filters or check your connection.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {judgments.map((judgment, index) => (
                  <SmoothTransitionWrapper key={judgment.cnr || index} delay={index * 50}>
                    <div
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02] bg-white"
                    >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                            {judgment.title || judgment.case_info || judgment.case_title || 'Untitled Judgment'}
                          </h3>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Latest
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          {(judgment.court_name || judgment.court) && (
                            <div>
                              <span className="font-medium text-gray-800">Court:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.court_name || judgment.court}</span>
                            </div>
                          )}
                          
                          {judgment.decision_date && (
                            <div>
                              <span className="font-medium text-gray-800">Decision Date:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>
                                {judgment.decision_date}
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
                                {judgment.date_of_registration}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>

                      <div className="flex-shrink-0 flex flex-col gap-3 w-full lg:w-48">
                        <BookmarkButton
                          item={judgment}
                          type="judgement"
                          size="default"
                          showText={true}
                          className="w-full"
                        />
                        <button
                          onClick={() => viewJudgment(judgment)}
                          className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    </div>
                  </SmoothTransitionWrapper>
                ))}
                
                {/* Enhanced Infinite Scroll Loader */}
                <div ref={loadingRef}>
                  <EnhancedInfiniteScrollLoader 
                    isLoading={isLoadingMore} 
                    hasMore={hasMore} 
                    error={scrollError} 
                    onRetry={retry}
                    retryCount={retryCount}
                    isFetching={isFetching}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}