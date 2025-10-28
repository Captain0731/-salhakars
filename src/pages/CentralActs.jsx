import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { ActSkeleton, InfiniteScrollLoader } from "../components/LoadingComponents";

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

export default function CentralActs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountLoaded, setTotalCountLoaded] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    act_id: '',
    ministry: '',
    department: '',
    year: '',
    type: ''
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
      act_id: '',
      ministry: '',
      department: '',
      year: '',
      type: ''
    });
    // Trigger search with cleared filters
    setTimeout(() => handleSearch(), 100);
  };

  // Function to get total count of Central Acts
  const getTotalCount = async () => {
    try {
      console.log('Fetching total count for Central Acts...');
      
      const params = {
        limit: 1,
      };
      
      const data = await apiService.getCentralActsWithOffset(params);
      console.log('Central Acts total count API response:', data);
      
      // Try to extract total count from various possible fields
      let count = 0;
      if (data.total_count) count = data.total_count;
      else if (data.pagination_info?.total_count) count = data.pagination_info.total_count;
      else if (data.total) count = data.total;
      else if (data.count) count = data.count;
      else if (data.pagination?.total) count = data.pagination.total;
      else if (data.meta?.total) count = data.meta.total;
      else if (data.total_results) count = data.total_results;
      
      console.log('Extracted Central Acts count:', count);
      
      if (count > 0) {
        setTotalCount(count);
        setTotalCountLoaded(true);
        console.log('Central Acts total count set to:', count);
      } else {
        // Fallback: set a reasonable default
        setTotalCount(873);
        setTotalCountLoaded(true);
        console.log('Using fallback Central Acts total count: 873');
      }
    } catch (error) {
      console.error('Error fetching Central Acts total count:', error);
      // Fallback on error
      setTotalCount(873);
      setTotalCountLoaded(true);
    }
  };

  const applyFilters = () => {
    // Reset pagination when applying new filters
    setPagination(null);
    setActs([]); // Clear existing results
    handleSearch();
  };

  // Auto-apply filters when they change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search || filters.act_id || filters.ministry || filters.department || filters.year || filters.type) {
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
    
    setIsSearching(true);
    setLoading(true);
    setError("");
    
    try {
      // Calculate offset for pagination
      const currentOffset = loadMore ? (pagination?.offset || 0) + (pagination?.current_page_size || 0) : 0;
      
      // Prepare API parameters with filters - for Central Acts
      const params = {
        limit: 10,
        offset: currentOffset
      };

      // Add filter parameters based on API documentation
      if (filters.search.trim()) {
        // Search can be applied to short_title field
        params.short_title = filters.search.trim();
      }
      
      if (filters.act_id.trim()) {
        params.act_id = filters.act_id.trim();
      }
      
      if (filters.ministry.trim()) {
        params.ministry = filters.ministry.trim();
      }
      
      if (filters.department.trim()) {
        params.department = filters.department.trim();
      }
      
      if (filters.year.trim()) {
        params.year = parseInt(filters.year);
      }
      
      // Note: API doesn't have 'type' parameter, but we keep it for UI consistency
      // The type filter won't be sent to API but will be handled on frontend if needed

      // Use API service for consistent error handling and token management
      console.log('Making Central Acts API call with params:', params);
      console.log('API URL will be:', `${apiService.baseURL}/api/acts/central-acts?${new URLSearchParams(params).toString()}`);
      
      const data = await apiService.getCentralActsWithOffset(currentOffset, 10, params);
      console.log('Central Acts API response data received:', JSON.stringify(data, null, 2));
      console.log('Data array length:', data?.data?.length);
      console.log('First act:', data?.data?.[0]);
      
      // Sort data by year in descending order (newest first)
      if (data?.data) {
        data.data = data.data.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearB - yearA; // Descending order (newest first)
        });
        
        console.log('After sorting, data array length:', data.data.length);
        console.log('First act year:', data.data[0]?.year);
        console.log('Last act year:', data.data[data.data.length - 1]?.year);
      }
      
      setConnectionStatus('connected');
      
      // Check if we got valid data
      if (!data) {
        console.warn('No response received from API');
        setActs([]);
        setError("No response received from the server");
        return;
      }
      
      if (!data.data) {
        console.warn('No data array in API response:', data);
        setActs([]);
        setError("Invalid response format from the server");
        return;
      }
      
      // Handle response data
      console.log('Setting Central Acts with data:', data.data);
      if (loadMore) {
        // Append to existing acts
        setActs(prev => {
          const newActs = [...prev, ...(data.data || [])];
          console.log('Appending acts. Previous:', prev.length, 'New:', data.data?.length, 'Total:', newActs.length);
          return newActs;
        });
      } else {
        // Replace acts for new search
        console.log('Replacing acts with:', data.data?.length, 'items');
        console.log('Acts data:', data.data);
        setActs(data.data || []);
      }
      
      // Update pagination info
      setPagination(data.pagination_info || null);
      
    } catch (err) {
      console.error('API Error Details:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      setConnectionStatus('disconnected');
      
      let errorMessage = "Failed to fetch Central Acts. Please try again.";
      
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
      // Clear acts on error (except when loading more)
      if (!loadMore) {
        setActs([]);
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [pagination, filters]);

  // Function to load more data for infinite scroll
  const loadMoreData = useCallback(async () => {
    if (!pagination?.has_more || loading || isSearching) return;
    await handleSearch(true);
  }, [pagination?.has_more, loading, isSearching, handleSearch]);

  // Infinite scroll hook
  const { loadingRef, isLoadingMore, error: scrollError, retry } = useInfiniteScroll({
    fetchMore: loadMoreData,
    hasMore: pagination?.has_more || false,
    isLoading: loading || isSearching
  });

  const viewActDetails = (act) => {
    // Navigate to act details page with act data
    navigate('/act-details', { state: { act } });
  };

  useEffect(() => {
    // Load initial Central Acts from API only once
    console.log('useEffect triggered.');
    console.log('Loading Central Acts data...');
    if (!loading && acts.length === 0) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Central Acts
            </h1>
            <div className="w-16 sm:w-20 h-1 mx-auto mb-4 sm:mb-6" style={{ backgroundColor: '#CF9B63' }}></div>
            <p className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Search and access Central Government Acts and legal documents
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Search & Filter Central Acts
            </h2>
            
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Search Acts
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by act title, ministry, department, or any keyword..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base lg:text-lg"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Search across act titles, ministries, departments, and other act details
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Act ID Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Act ID
                </label>
                <input
                  type="text"
                  value={filters.act_id}
                  onChange={(e) => handleFilterChange('act_id', e.target.value)}
                  placeholder="e.g., 186901"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              {/* Ministry Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Ministry
                </label>
                <select
                  value={filters.ministry}
                  onChange={(e) => handleFilterChange('ministry', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <option value="">All Ministries</option>
                  <option value="Ministry of Home Affairs">Ministry of Home Affairs</option>
                  <option value="Ministry of Law and Justice">Ministry of Law and Justice</option>
                  <option value="Ministry of Corporate Affairs">Ministry of Corporate Affairs</option>
                  <option value="Ministry of Consumer Affairs">Ministry of Consumer Affairs</option>
                  <option value="Ministry of Personnel, Public Grievances and Pensions">Ministry of Personnel, Public Grievances and Pensions</option>
                  <option value="Ministry of Road Transport and Highways">Ministry of Road Transport and Highways</option>
                  <option value="Ministry of Finance">Ministry of Finance</option>
                  <option value="Ministry of Health and Family Welfare">Ministry of Health and Family Welfare</option>
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Department
                </label>
                <input
                  type="text"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  placeholder="e.g., Legislative Department"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 225 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <option value="">All Types</option>
                  <option value="Central Act">Central Act</option>
                  <option value="Constitutional Document">Constitutional Document</option>
                  <option value="Ordinance">Ordinance</option>
                  <option value="Rule">Rule</option>
                  <option value="Regulation">Regulation</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={applyFilters}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
              
              <button
                onClick={clearFilters}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Clear Filters
              </button>
            </div>

            {/* Active Filters Display */}
            {(filters.search || filters.act_id || filters.ministry || filters.department || filters.year || filters.type) && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-xs sm:text-sm font-medium text-blue-800 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Active Filters:
                </h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {filters.search && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      Search: "{filters.search}"
                    </span>
                  )}
                  {filters.act_id && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      Act ID: {filters.act_id}
                    </span>
                  )}
                  {filters.ministry && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      Ministry: {filters.ministry}
                    </span>
                  )}
                  {filters.department && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      Department: {filters.department}
                    </span>
                  )}
                  {filters.year && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      Year: {filters.year}
                    </span>
                  )}
                  {filters.type && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      Type: {filters.type}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Clean Results Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  {filters.search || filters.act_id || filters.ministry || filters.department || filters.year || filters.type 
                    ? 'Search Results - Central Acts' 
                    : 'Latest Central Acts'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {filters.search || filters.act_id || filters.ministry || filters.department || filters.year || filters.type 
                    ? 'Showing Central Acts matching your search and filter criteria' 
                    : 'Showing the most recent Central Acts first'}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Showing {acts.length} of {totalCount > 0 ? totalCount.toLocaleString() : '873'} acts
                </span>
                {(filters.search || filters.act_id || filters.ministry || filters.department || filters.year || filters.type) && (
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
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSearch()}
                    disabled={loading}
                    className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 self-start sm:self-auto"
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
                  <ActSkeleton key={index} />
                ))}
              </div>
            ) : acts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  No Central Acts Found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base px-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  No Central Acts found matching your search criteria. Please try different filters or check your connection.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {console.log('Rendering Central Acts:', acts.length, acts)}
                {acts.map((act, index) => (
                  <div
                    key={act.id || index}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-3">
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                            {act.short_title || act.long_title || 'Untitled Act'}
                          </h3>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium self-start">
                              Latest
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
                          {act.ministry && (
                            <div>
                              <span className="font-medium text-gray-800">Ministry:</span>
                              <span className="ml-1 sm:ml-2 block sm:inline" style={{ color: '#8C969F' }}>{act.ministry}</span>
                            </div>
                          )}
                          {act.department && (
                            <div>
                              <span className="font-medium text-gray-800">Department:</span>
                              <span className="ml-1 sm:ml-2 block sm:inline" style={{ color: '#8C969F' }}>{act.department}</span>
                            </div>
                          )}
                          {act.year && (
                            <div>
                              <span className="font-medium text-gray-800">Year:</span>
                              <span className={`ml-1 sm:ml-2 block sm:inline ${index === 0 ? 'font-bold text-blue-600' : ''}`} style={{ color: index === 0 ? '#1E65AD' : '#8C969F' }}>
                                {act.year}
                                {index === 0 && <span className="ml-1 text-xs">(Newest)</span>}
                              </span>
                            </div>
                          )}
                          {act.type && (
                            <div>
                              <span className="font-medium text-gray-800">Type:</span>
                              <span className="ml-1 sm:ml-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {act.type}
                              </span>
                            </div>
                          )}
                          {act.source && (
                            <div>
                              <span className="font-medium text-gray-800">Source:</span>
                              <span className="ml-1 sm:ml-2 block sm:inline" style={{ color: '#8C969F' }}>{act.source}</span>
                            </div>
                          )}
                        </div>

                        {act.long_title && act.long_title !== act.short_title && (
                          <div className="mb-3 sm:mb-4">
                            <span className="font-medium text-gray-800 text-xs sm:text-sm">Description:</span>
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm block" style={{ color: '#8C969F' }}>{act.long_title}</span>
                          </div>
                        )}

                      </div>

                      <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => viewActDetails(act)}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
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
            {acts.length > 0 && (
              <div ref={loadingRef} className="mt-6 sm:mt-8">
                <InfiniteScrollLoader 
                  isLoading={isLoadingMore} 
                  hasMore={pagination?.has_more || false} 
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