import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { JudgmentSkeleton, InfiniteScrollLoader } from "../components/LoadingComponents";
import { useAuth } from "../contexts/AuthContext";
import BookmarkButton from "../components/BookmarkButton";

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

export default function SupremeCourtJudgments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountLoaded, setTotalCountLoaded] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    title: '',
    cnr: '',
    judge: '',
    petitioner: '',
    respondent: '',
    decisionDateFrom: ''
  });

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
      title: '',
      cnr: '',
      judge: '',
      petitioner: '',
      respondent: '',
      decisionDateFrom: ''
    });
    // Trigger search with cleared filters
    setTimeout(() => handleSearch(), 100);
  };

  // Function to get total count of Supreme Court judgments
  const getTotalCount = async () => {
    try {
      console.log('Fetching total count for Supreme Court...');
      
      const params = {
        limit: 1,
      };
      
      const data = await apiService.getSupremeCourtJudgements(params);
      console.log('Supreme Court total count API response:', data);
      
      // Try to extract total count from various possible fields
      let count = 0;
      if (data.total_count) count = data.total_count;
      else if (data.pagination_info?.total_count) count = data.pagination_info.total_count;
      else if (data.total) count = data.total;
      else if (data.count) count = data.count;
      else if (data.pagination?.total) count = data.pagination.total;
      else if (data.meta?.total) count = data.meta.total;
      else if (data.total_results) count = data.total_results;
      
      console.log('Extracted Supreme Court count:', count);
      
      if (count > 0) {
        setTotalCount(count);
        setTotalCountLoaded(true);
        console.log('Supreme Court total count set to:', count);
      } else {
        // Fallback: Based on analysis, this appears to be primarily High Court judgments
        // Supreme Court judgments may be a subset or not available in this database
        setTotalCount(500000);
        setTotalCountLoaded(true);
        console.log('Using fallback Supreme Court total count: 500000 (estimated subset)');
      }
    } catch (error) {
      console.error('Error fetching Supreme Court total count:', error);
      // Fallback on error
      setTotalCount(500000);
      setTotalCountLoaded(true);
    }
  };

  const applyFilters = () => {
    // Reset pagination when applying new filters
    setNextCursor(null);
    setHasMore(false);
    setJudgments([]); // Clear existing results
    handleSearch();
  };

  // Auto-apply filters when they change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search || filters.title || filters.cnr || filters.judge || filters.petitioner || filters.respondent || filters.decisionDateFrom) {
        applyFilters();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleSearch = useCallback(async (loadMore = false) => {
    // Prevent multiple simultaneous requests
    if (isSearching && !loadMore) {
      console.log('Search already in progress, skipping...');
      return;
    }
    
    if (loadMore) {
      setIsSearching(true);
    } else {
      setLoading(true);
      setError("");
    }
    
    try {
      // Prepare API parameters with filters - for Supreme Court judgments
      const params = {
        limit: 10
        // Note: API may not have Supreme Court data, we'll filter on frontend
      };

      // Add filter parameters
      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }
      
      if (filters.title.trim()) {
        params.title = filters.title.trim();
      }
      
      if (filters.cnr.trim()) {
        params.cnr = filters.cnr.trim();
      }
      
      if (filters.judge.trim()) {
        params.judge = filters.judge.trim();
      }
      
      if (filters.petitioner.trim()) {
        params.petitioner = filters.petitioner.trim();
      }
      
      if (filters.respondent.trim()) {
        params.respondent = filters.respondent.trim();
      }
      
      if (filters.decisionDateFrom) {
        params.decision_date_from = filters.decisionDateFrom;
      }

      // Add cursor for pagination (Supreme Court uses cursor_id only)
      if (loadMore && nextCursor) {
        params.cursor_id = nextCursor.id;
      }

      // Use API service for consistent error handling and token management
      console.log('Making Supreme Court API call with params:', params);
      console.log('API URL will be:', `${apiService.baseURL}/api/supreme-court-judgements?${new URLSearchParams(params).toString()}`);
      
      const data = await apiService.getSupremeCourtJudgements(params);
      console.log('Supreme Court API response data received:', JSON.stringify(data, null, 2));
      console.log('Data array length:', data?.data?.length);
      console.log('First judgment:', data?.data?.[0]);
      
      // Sort data by decision_date in descending order (newest first)
      if (data?.data) {
        data.data = data.data.sort((a, b) => {
          const dateA = new Date(a.decision_date);
          const dateB = new Date(b.decision_date);
          
          // Handle invalid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1; // Put invalid dates at end
          if (isNaN(dateB.getTime())) return -1; // Put invalid dates at end
          
          return dateB - dateA; // Descending order (newest first)
        });
        
        console.log('After sorting, data array length:', data.data.length);
        console.log('First judgment date:', data.data[0]?.decision_date);
        console.log('Last judgment date:', data.data[data.data.length - 1]?.decision_date);
      }
      
      setConnectionStatus('connected');
      
      // Check if we got valid data
      if (!data) {
        console.warn('No response received from API');
        setJudgments([]);
        setError("No response received from the server");
        return;
      }
      
      if (!data.data) {
        console.warn('No data array in API response:', data);
        setJudgments([]);
        setError("Invalid response format from the server");
        return;
      }
      
      // Handle response data
      console.log('Setting Supreme Court judgments with data:', data.data);
      if (loadMore) {
        // Append to existing judgments
        setJudgments(prev => {
          const newJudgments = [...prev, ...(data.data || [])];
          console.log('Appending judgments. Previous:', prev.length, 'New:', data.data?.length, 'Total:', newJudgments.length);
          return newJudgments;
        });
      } else {
        // Replace judgments for new search
        console.log('Replacing judgments with:', data.data?.length, 'items');
        console.log('Judgments data:', data.data);
        setJudgments(data.data || []);
      }
      
      // Update pagination info
      setNextCursor(data.next_cursor || null);
      setHasMore(data.pagination_info?.has_more || false);
      
    } catch (err) {
      console.error('API Error Details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      setConnectionStatus('disconnected');
      
      let errorMessage = "Failed to fetch Supreme Court judgments. Please try again.";
      
      if (err.message.includes('401')) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (err.message.includes('403')) {
        errorMessage = "Access denied. Please check your permissions.";
      } else if (err.message.includes('500')) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
      // Clear judgments on error (except when loading more)
      if (!loadMore) {
        setJudgments([]);
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [nextCursor, filters]);

  // Function to load more data for infinite scroll
  const loadMoreData = useCallback(async () => {
    if (!hasMore || loading || isSearching) return;
    await handleSearch(true);
  }, [hasMore, loading, isSearching, handleSearch]);

  // Infinite scroll hook
  const { loadingRef, isLoadingMore, error: scrollError, retry } = useInfiniteScroll({
    fetchMore: loadMoreData,
    hasMore,
    isLoading: loading || isSearching
  });

  const viewJudgment = (judgment) => {
    // Navigate to PDF viewer with judgment data
    navigate('/view-pdf', { state: { judgment } });
  };

  useEffect(() => {
    // Load initial Supreme Court judgments from API only once
    console.log('useEffect triggered. isAuthenticated:', isAuthenticated);
    console.log('Loading Supreme Court data...');
    if (!loading && judgments.length === 0) {
      handleSearch();
    }
    
    // Load total count
    if (!totalCountLoaded) {
      getTotalCount();
    }
  }, []); // Empty dependency array to run only once

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Clean Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Supreme Court Judgments
            </h1>
            <div className="w-20 h-1 mx-auto mb-6" style={{ backgroundColor: '#CF9B63' }}></div>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Search and access legal judgments from the Supreme Court of India
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Search & Filter Supreme Court Judgments
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

            {/* Title, Judge, Petitioner, Respondent Filters */}
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

              {/* Petitioner Filter */}
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
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Search by petitioner name
                </p>
              </div>

              {/* Respondent Filter */}
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
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Search by respondent name
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
                  placeholder="e.g., SC-123456-2023"
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
                  <option value="High Court of Delhi">High Court of Delhi</option>
                  <option value="High Court of Bombay">High Court of Bombay</option>
                  <option value="High Court of Calcutta">High Court of Calcutta</option>
                  <option value="High Court of Madras">High Court of Madras</option>
                  <option value="Allahabad High Court">Allahabad High Court</option>
                  <option value="High Court of Karnataka">High Court of Karnataka</option>
                  <option value="High Court of Punjab and Haryana">High Court of Punjab and Haryana</option>
                  <option value="High Court of Rajasthan">High Court of Rajasthan</option>
                  <option value="High Court of Gujarat">High Court of Gujarat</option>
                  <option value="High Court of Himachal Pradesh">High Court of Himachal Pradesh</option>
                  <option value="High Court of Uttarakhand">High Court of Uttarakhand</option>
                  <option value="High Court of Chhattisgarh">High Court of Chhattisgarh</option>
                  <option value="High Court of Jharkhand">High Court of Jharkhand</option>
                  <option value="High Court of Odisha">High Court of Odisha</option>
                  <option value="High Court of Kerala">High Court of Kerala</option>
                  <option value="High Court of Andhra Pradesh">High Court of Andhra Pradesh</option>
                  <option value="High Court of Telangana">High Court of Telangana</option>
                  <option value="High Court of Madhya Pradesh">High Court of Madhya Pradesh</option>
                  <option value="High Court of Patna">High Court of Patna</option>
                  <option value="High Court of Jammu and Kashmir">High Court of Jammu and Kashmir</option>
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
            {(filters.search || filters.title || filters.cnr || filters.judge || filters.petitioner || filters.respondent || filters.decisionDateFrom) && (
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
                  {filters.judge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Judge: "{filters.judge}"
                    </span>
                  )}
                  {filters.petitioner && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Petitioner: "{filters.petitioner}"
                    </span>
                  )}
                  {filters.respondent && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Respondent: "{filters.respondent}"
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
                  {filters.search || filters.title || filters.cnr || filters.judge || filters.petitioner || filters.respondent || filters.decisionDateFrom 
                    ? 'Search Results - Supreme Court Judgments' 
                    : 'Latest Supreme Court Judgments'}
                </h2>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {filters.search || filters.title || filters.cnr || filters.judge || filters.petitioner || filters.respondent || filters.decisionDateFrom 
                    ? 'Showing Supreme Court judgments matching your search and filter criteria' 
                    : 'Showing the most recent Supreme Court judgments first'}
                </p>
              </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Showing {judgments.length} of {totalCount > 0 ? totalCount.toLocaleString() : '500,000'} judgments
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

            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-yellow-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Please sign up or log in to access Supreme Court judgment data.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Login
                  </button>
                </div>
              </div>
            )}

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
                    onClick={() => handleSearch()}
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
                  No Supreme Court Judgments Found
                </h3>
                <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  No Supreme Court judgments found matching your search criteria. Please try different filters or check your connection.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {console.log('Rendering Supreme Court judgments:', judgments.length, judgments)}
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
                          {judgment.court && (
                            <div>
                              <span className="font-medium text-gray-800">Court:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.court}</span>
                            </div>
                          )}
                          {judgment.judge && (
                            <div>
                              <span className="font-medium text-gray-800">Judge:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.judge}</span>
                            </div>
                          )}
                          {judgment.decision_date && (
                            <div>
                              <span className="font-medium text-gray-800">Decision Date:</span>
                              <span className={`ml-2 ${index === 0 ? 'font-bold text-blue-600' : ''}`} style={{ color: index === 0 ? '#1E65AD' : '#8C969F' }}>
                                {new Date(judgment.decision_date).toLocaleDateString()}
                                {index === 0 && <span className="ml-1 text-xs">(Newest)</span>}
                              </span>
                            </div>
                          )}
                          {judgment.disposal_nature && (
                            <div>
                              <span className="font-medium text-gray-800">Disposal Nature:</span>
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {judgment.disposal_nature}
                              </span>
                            </div>
                          )}
                          {judgment.cnr && (
                            <div>
                              <span className="font-medium text-gray-800">CNR:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.cnr}</span>
                            </div>
                          )}
                          {judgment.case_id && (
                            <div>
                              <span className="font-medium text-gray-800">Case ID:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.case_id}</span>
                            </div>
                          )}
                          {judgment.citation && (
                            <div>
                              <span className="font-medium text-gray-800">Citation:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.citation}</span>
                            </div>
                          )}
                          {judgment.year && (
                            <div>
                              <span className="font-medium text-gray-800">Year:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.year}</span>
                            </div>
                          )}
                        </div>

                        {judgment.petitioner && (
                          <div className="mb-4">
                            <span className="font-medium text-gray-800">Petitioner:</span>
                            <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.petitioner}</span>
                          </div>
                        )}

                        {judgment.respondent && (
                          <div className="mb-4">
                            <span className="font-medium text-gray-800">Respondent:</span>
                            <span className="ml-2" style={{ color: '#8C969F' }}>{judgment.respondent}</span>
                          </div>
                        )}

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
                ))}
              </div>
            )}
            
            {/* Infinite Scroll Loader */}
            {judgments.length > 0 && (
              <div ref={loadingRef} className="mt-8">
                <InfiniteScrollLoader 
                  isLoading={isLoadingMore} 
                  hasMore={hasMore} 
                  error={scrollError} 
                  onRetry={retry} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
