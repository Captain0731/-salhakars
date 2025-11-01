import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import useSmoothInfiniteScroll from "../hooks/useSmoothInfiniteScroll";
import { 
  EnhancedJudgmentSkeleton, 
  EnhancedInfiniteScrollLoader, 
  SkeletonGrid,
  SmoothTransitionWrapper 
} from "../components/EnhancedLoadingComponents";

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
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-slide-in-bottom {
    animation: slideInFromBottom 0.8s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

export default function LegalJudgments() {
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  // Court type state - defaults to highcourt
  const [courtType, setCourtType] = useState("highcourt");

  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);

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
  const isInitialMountRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Filter states - will change based on court type
  const [filters, setFilters] = useState({
    search: '',
    title: '',
    cnr: '',
    highCourt: '',
    judge: '',
    petitioner: '',
    respondent: '',
    decisionDateFrom: ''
  });

  const pageSize = 10;

  // Get filter fields based on court type
  const getFilterFields = () => {
    if (courtType === "supremecourt") {
      return {
        search: '',
        title: '',
        cnr: '',
        judge: '',
        petitioner: '',
        respondent: '',
        decisionDateFrom: ''
      };
    } else {
      return {
        search: '',
        title: '',
        cnr: '',
        highCourt: '',
        judge: '',
        decisionDateFrom: ''
      };
    }
  };

  // Reset filters when court type changes
  useEffect(() => {
    setFilters(getFilterFields());
    setJudgments([]);
    setNextCursor(null);
    setHasMore(true);
  }, [courtType]);

  // Store filters in ref to always get latest values
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Fetch judgments function with cursor-based pagination
  const fetchJudgments = useCallback(async (isLoadMore = false, customFilters = null) => {
    if (!isMountedRef.current) return;
    
    // Prevent duplicate simultaneous requests
    if (isFetchingRef.current && !isLoadMore) {
      console.log('Already fetching, skipping duplicate request');
      return;
    }
    
    try {
      if (!isLoadMore) {
        isFetchingRef.current = true;
      }
      
      if (isLoadMore) {
        setIsSearching(true);
      } else {
        setLoading(true);
        setError(null);
      }
      
      // Use custom filters if provided, otherwise use current filters from ref
      const activeFilters = customFilters !== null ? customFilters : filtersRef.current;
      const currentNextCursor = nextCursorRef.current;
      
      // Reduced logging for production - only log important info
      if (process.env.NODE_ENV === 'development') {
        console.log(`Fetching ${courtType} judgments with params:`, { isLoadMore, filters: activeFilters, currentNextCursor });
      }
      
      // Prepare params based on court type
      const params = {
        limit: pageSize,
      };

      // Add filters - remove empty ones and map to API format
      Object.keys(activeFilters).forEach(key => {
        const value = activeFilters[key];
        // Skip empty values
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return;
        }
        
        // Map filter keys to API parameter names
        if (key === 'highCourt') {
          params.court_name = value;
        } else if (key === 'decisionDateFrom') {
          params.decision_date_from = value;
        } else if (key === 'search') {
          // Search parameter
          params.search = value;
        } else {
          // Direct mapping for: title, cnr, judge, petitioner, respondent
          params[key] = value;
        }
      });

      // Add cursor for pagination if loading more
      // According to API docs:
      // - High Court uses dual cursor: cursor_decision_date (YYYY-MM-DD) + cursor_id
      // - Supreme Court uses single cursor: cursor_id only
      if (isLoadMore && currentNextCursor) {
        if (courtType === "supremecourt") {
          // Supreme Court: Only cursor_id needed
          if (currentNextCursor.id) {
            params.cursor_id = currentNextCursor.id;
          }
        } else {
          // High Court: Both cursor_decision_date and cursor_id needed
          if (currentNextCursor.decision_date) {
            params.cursor_decision_date = currentNextCursor.decision_date;
          }
          if (currentNextCursor.id) {
            params.cursor_id = currentNextCursor.id;
          }
        }
      }

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      // Log params for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`${courtType} - Calling API with params:`, params);
      }

      // Call appropriate API based on court type
      let data;
      if (courtType === "supremecourt") {
        data = await apiService.getSupremeCourtJudgements(params);
      } else {
        // Use getJudgements for High Court (it uses /api/judgements endpoint as per API docs)
        data = await apiService.getJudgements(params);
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${courtType} - API Response:`, { 
          fullResponse: data,
          dataCount: data?.data?.length, 
          hasMore: data?.pagination_info?.has_more,
          nextCursor: data?.next_cursor,
          dataType: Array.isArray(data?.data) ? 'array' : typeof data?.data
        });
      }
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response: Expected object but got ' + typeof data);
      }
      
      // Handle different response structures
      let judgmentsArray = [];
      if (Array.isArray(data.data)) {
        judgmentsArray = data.data;
      } else if (Array.isArray(data)) {
        // If API returns array directly
        judgmentsArray = data;
      } else if (data.data) {
        // If data.data exists but isn't an array, try to convert
        console.warn(`${courtType}: API response data is not an array:`, data.data);
        judgmentsArray = [];
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${courtType} - Processed judgments:`, judgmentsArray.length, 'items');
      }
      
      if (!isMountedRef.current) return;
      
      const paginationInfo = data.pagination_info || {};
      
      if (isLoadMore) {
        setJudgments(prev => {
          const combined = [...prev, ...judgmentsArray];
          if (process.env.NODE_ENV === 'development') {
            console.log(`${courtType} - Total judgments after load more:`, combined.length);
          }
          return combined;
        });
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log(`${courtType} - Setting judgments:`, judgmentsArray.length, 'items');
        }
        setJudgments(judgmentsArray);
      }
      
      // Update cursor and hasMore based on API response
      setNextCursor(data.next_cursor || null);
      setHasMore(paginationInfo.has_more || false);
      
      if (!isLoadMore) {
        setTotalCount(judgmentsArray.length + (paginationInfo.has_more ? 1 : 0));
      }
      
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error(`${courtType} Error fetching judgments:`, error);
      
      // Enhanced error handling with specific messages
      const currentCourtLabel = courtType === "supremecourt" ? "Supreme Court" : "High Court";
      let errorMessage = `Failed to fetch ${currentCourtLabel.toLowerCase()} judgments. Please try again.`;
      
      if (error.message.includes('401') || error.message.includes('Authentication')) {
        errorMessage = "Authentication required. Please log in to access judgments.";
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorMessage = "Access denied. Please check your permissions.";
      } else if (error.message.includes('500') || error.message.includes('Internal Server')) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message.includes('Network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Clear judgments on error (except when loading more)
      if (!isLoadMore) {
        setJudgments([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setIsSearching(false);
        if (!isLoadMore) {
          isFetchingRef.current = false;
        }
      }
    }
  }, [courtType, pageSize]);

  // Store fetchJudgments in ref
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
    setFilters(getFilterFields());
    setJudgments([]);
    setHasMore(true);
    setNextCursor(null);
    setTimeout(() => {
      if (fetchJudgmentsRef.current) {
        fetchJudgmentsRef.current(false);
      }
    }, 100);
  };

  const applyFilters = () => {
    if (isFetchingRef.current) return;
    
    // Get current filters directly from state to ensure we use the latest values
    setJudgments([]);
    setHasMore(true);
    setNextCursor(null);
    setError(null);
    
    // Use setTimeout to ensure filters state is updated, then fetch with explicit filters
    setTimeout(() => {
      if (fetchJudgmentsRef.current) {
        // Pass current filters explicitly to avoid closure issues
        const currentFilters = filtersRef.current;
        if (process.env.NODE_ENV === 'development') {
          console.log('Applying filters:', currentFilters);
        }
        fetchJudgmentsRef.current(false, currentFilters);
      }
    }, 100);
  };

  // Sync nextCursor ref with state
  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  // Auto-apply filters when they change (with debounce) - Skip on initial mount
  useEffect(() => {
    // Skip auto-apply on initial mount
    if (isInitialMountRef.current) {
      return;
    }
    
    // Don't auto-apply if already fetching
    if (isFetchingRef.current) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      // Check if any filters have values (excluding search for auto-apply)
      const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
        if (key === 'search') return false; // Search should be applied manually
        return val && (typeof val === 'string' ? val.trim() !== '' : val !== '');
      });
      
      if (hasActiveFilters && !isFetchingRef.current && fetchJudgmentsRef.current) {
        const currentFilters = filtersRef.current;
        if (process.env.NODE_ENV === 'development') {
          console.log('Auto-applying filters:', currentFilters);
        }
        setJudgments([]);
        setHasMore(true);
        setNextCursor(null);
        setError(null);
        fetchJudgmentsRef.current(false, currentFilters);
      }
    }, 800); // Increased debounce for better UX

    return () => clearTimeout(timeoutId);
  }, [filters.title, filters.cnr, filters.highCourt, filters.judge, filters.petitioner, filters.respondent, filters.decisionDateFrom]);

  // Load initial data when court type changes - Only fetch once
  useEffect(() => {
    if (isInitialMountRef.current) {
      // On initial mount, fetch after a short delay to ensure everything is set up
      const timer = setTimeout(() => {
        if (!isFetchingRef.current) {
          fetchJudgments(false);
        }
      }, 100);
      isInitialMountRef.current = false;
      return () => clearTimeout(timer);
    } else {
      // On court type change, fetch immediately but check if not already fetching
      if (!isFetchingRef.current) {
        fetchJudgments(false);
      }
    }
  }, [courtType, fetchJudgments]);

  // Enhanced infinite scroll logic
  const loadMoreData = useCallback(async () => {
    if (!hasMore || loading || isSearching || !isMountedRef.current) return;
    if (fetchJudgmentsRef.current) {
      await fetchJudgmentsRef.current(true);
    }
  }, [hasMore, loading, isSearching]);

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
    rootMargin: '100px',
    preloadThreshold: 0.3,
    throttleDelay: 150
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

  const courtTypeLabel = courtType === "supremecourt" ? "Supreme Court" : "High Court";
  const highCourts = [
    "All High Courts",
    "Allahabad High Court",
    "Bombay High Court",
    "Calcutta High Court",
    "Gauhati High Court",
    "High Court for State of Telangana",
    "High Court of Andhra Pradesh",
    "High Court of Chhattisgarh",
    "High Court of Delhi",
    "High Court of Gujarat",
    "High Court of Himachal Pradesh",
    "High Court of Jammu and Kashmir",
    "High Court of Jharkhand",
    "High Court of Karnataka",
    "High Court of Kerala",
    "High Court of Madhya Pradesh",
    "High Court of Manipur",
    "High Court of Meghalaya",
    "High Court of Orissa",
    "High Court of Punjab and Haryana",
    "High Court of Rajasthan",
    "High Court of Sikkim",
    "High Court of Tripura",
    "High Court of Uttarakhand",
    "Madras High Court",
    "Patna High Court",
  ];

  return (
    <div className="min-h-screen animate-fade-in-up" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Enhanced Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 animate-slide-in-bottom">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Legal Judgments
            </h1>
            <div className="w-20 h-1 mx-auto mb-6 animate-fade-in-up" style={{ backgroundColor: '#CF9B63', animationDelay: '0.2s' }}></div>
            <p className="text-lg max-w-3xl mx-auto animate-fade-in-up" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif', animationDelay: '0.4s' }}>
              Search and access legal judgments from High Courts and Supreme Court of India
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* Court Type Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Select Court Type:
              </label>
              <div className="relative">
                <select
                  value={courtType}
                  onChange={(e) => setCourtType(e.target.value)}
                  className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium min-w-[250px]"
                  style={{ fontFamily: 'Roboto, sans-serif', color: '#1E65AD' }}
                >
                  <option value="highcourt">High Court Judgments</option>
                  <option value="supremecourt">Supreme Court Judgments</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                Search {courtTypeLabel} Judgments
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </button>
            </div>
            
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
                  placeholder="Search by case title, parties, judges, or any keyword..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && !isFetchingRef.current) {
                      e.preventDefault();
                      applyFilters();
                    }
                  }}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  title="Voice Search"
                >
                  <svg 
                    className="w-5 h-5"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dynamic Filters Based on Court Type - Hidden by default, shown when showFilters is true */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-6 mt-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Filter Options
                </h3>
            {courtType === "supremecourt" ? (
              /* Supreme Court Filters */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                </div>
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Petitioner
                  </label>
                  <input
                    type="text"
                    value={filters.petitioner}
                    onChange={(e) => handleFilterChange('petitioner', e.target.value)}
                    placeholder="e.g., State of Maharashtra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Respondent
                  </label>
                  <input
                    type="text"
                    value={filters.respondent}
                    onChange={(e) => handleFilterChange('respondent', e.target.value)}
                    placeholder="e.g., Union of India"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>
              </div>
            ) : (
              /* High Court Filters */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                </div>
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
                </div>
              </div>
            )}
            
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
                  placeholder={courtType === "supremecourt" ? "e.g., SC-123456-2023" : "e.g., HPHC010019512005"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              {/* High Court Filter - Only for High Court */}
              {courtType === "highcourt" && (
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
                    {highCourts.map((court) => (
                      <option key={court} value={court === "All High Courts" ? "" : court}>
                        {court}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  console.log('Apply Filters clicked. Current filters:', filters);
                  applyFilters();
                }}
                disabled={loading || isFetchingRef.current}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Apply Filters
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  console.log('Clear Filters clicked');
                  clearFilters();
                }}
                disabled={loading || isFetchingRef.current}
                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>

                {/* Active Filters Display */}
                {Object.values(filters).some(val => val && val.trim() !== '') && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Active Filters:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (value && value.trim() !== '') {
                          return (
                            <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                              {key === 'highCourt' ? 'Court' : key.charAt(0).toUpperCase() + key.slice(1)}: "{value}"
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Results Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  {Object.values(filters).some(val => val && val.trim() !== '') 
                    ? `Search Results - ${courtTypeLabel} Judgments` 
                    : `Latest ${courtTypeLabel} Judgments`}
                </h2>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {Object.values(filters).some(val => val && val.trim() !== '') 
                    ? `Showing ${courtTypeLabel.toLowerCase()} judgments matching your search criteria` 
                    : `Showing the most recent ${courtTypeLabel.toLowerCase()} judgments first`}
                </p>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {judgments.length} {judgments.length === 1 ? 'Judgment' : 'Judgments'}
                  </span>
                  {hasMore && !loading && (
                    <span className="text-xs text-blue-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      More available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <svg className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-red-800 font-semibold mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Error Loading Judgments
                      </h4>
                      <p className="text-red-700 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setError(null);
                      fetchJudgments(false);
                    }}
                    disabled={loading}
                    className="ml-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                  </button>
                </div>
              </div>
            )}

            {loading && judgments.length === 0 ? (
              <SkeletonGrid count={3} />
            ) : judgments.length === 0 && !error ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  No {courtTypeLabel.toLowerCase()} judgments found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {Object.values(filters).some(val => val && val.trim() !== '')
                    ? 'No judgments match your current search criteria. Try adjusting your filters or search terms.'
                    : `No ${courtTypeLabel.toLowerCase()} judgments are currently available. Please check back later.`}
                </p>
                {Object.values(filters).some(val => val && val.trim() !== '') && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {judgments.map((judgment, index) => (
                  <SmoothTransitionWrapper key={judgment.cnr || judgment.id || `${courtType}-${index}`} delay={index * 50}>
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 bg-white group">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <h3 className="text-xl font-semibold flex-1 group-hover:text-blue-700 transition-colors" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                              {judgment.title || judgment.case_info || judgment.case_title || judgment.case_number || 'Untitled Judgment'}
                            </h3>
                            {index === 0 && judgments.length > 0 && !loading && (
                              <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0">
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
                                <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.decision_date}</span>
                              </div>
                            )}
                            
                            {judgment.cnr && (
                              <div>
                                <span className="font-medium text-gray-800">CNR:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.cnr}</span>
                              </div>
                            )}
                            
                            {judgment.judge && (
                              <div>
                                <span className="font-medium text-gray-800">Judge:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.judge}</span>
                              </div>
                            )}

                            {judgment.petitioner && (
                              <div>
                                <span className="font-medium text-gray-800">Petitioner:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.petitioner}</span>
                              </div>
                            )}

                            {judgment.respondent && (
                              <div>
                                <span className="font-medium text-gray-800">Respondent:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.respondent}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex flex-col gap-3 w-full lg:w-48">
                          <button
                            onClick={() => viewJudgment(judgment)}
                            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            <span className="flex items-center justify-center gap-2">
                              View Details
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
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

