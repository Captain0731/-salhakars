import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { ActSkeleton, InfiniteScrollLoader } from "../components/LoadingComponents";

export default function StateActs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    act_number: "",
    year: "",
    department: ""
  });
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountLoaded, setTotalCountLoaded] = useState(false);

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Andaman and Nicobar Islands"
  ];

  const departments = [
    "Department of LAW AND JUDICIAL",
    "Medical Education and Drugs Department",
    "Water Resources Department",
    "Revenue Department",
    "Home Department",
    "Education Department",
    "Health Department",
    "Transport Department",
    "Urban Development Department",
    "Rural Development Department"
  ];
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

  const handleSearch = useCallback(async (offset = 0) => {
    console.log('handleSearch called with offset:', offset);
    console.log('Current searchQuery:', searchQuery);
    console.log('Current filters:', filters);
    
    setLoading(true);
    setError("");
    
    // Validate filters before making API call
    const validationWarnings = validateFilters();
    if (validationWarnings.length > 0) {
      console.log('Validation warnings:', validationWarnings);
      setError(validationWarnings.join('. '));
      setLoading(false);
      return;
    }
    
    try {
      // Build API parameters for State Acts search
      const apiParams = {
        limit: 20,
        offset
      };

      // Add search query if provided - use short_title for search
      if (searchQuery.trim()) {
        apiParams.short_title = searchQuery.trim();
      }

      // Add filters only if they have values - using correct API parameter names
      if (filters.state && filters.state.trim()) {
        apiParams.state = filters.state.trim();
      }
      if (filters.act_number && filters.act_number.trim()) {
        apiParams.act_number = filters.act_number.trim();
      }
      if (filters.year && filters.year.trim()) {
        // Convert year to integer for API consistency
        const yearValue = parseInt(filters.year);
        console.log('Year filter applied:', filters.year, 'converted to:', yearValue);
        if (!isNaN(yearValue)) {
          apiParams.year = yearValue;
          console.log('Year parameter added to API call:', yearValue);
        } else {
          console.error('Year conversion failed:', filters.year);
        }
      } else {
        console.log('No year filter applied. Current year filter:', filters.year);
      }
      if (filters.department && filters.department.trim()) {
        apiParams.department = filters.department.trim();
      }

      console.log('Making State Acts API call with params:', apiParams);
      const queryString = new URLSearchParams(apiParams).toString();
      console.log('API URL will be:', `${apiService.baseURL}/api/acts/state-acts?${queryString}`);
      console.log('Query string breakdown:', queryString);
      
      // Test API call
      const data = await apiService.getStateActs(apiParams);
      console.log('State Acts API response received:', data);
      
      // Handle response data
      if (offset === 0) {
        setActs(data.data || []);
      } else {
        setActs(prev => [...prev, ...(data.data || [])]);
      }
      
      // Update pagination info
      setPagination(data.pagination_info || data.pagination);
      
      // Clear any previous errors
      setError("");
    } catch (err) {
      let errorMessage = "Failed to fetch state acts. Please try again.";
      
      if (err.message.includes('401')) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (err.message.includes('403')) {
        errorMessage = "Access denied. Please check your permissions.";
      } else if (err.message.includes('500')) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.message.includes('ProgrammingError')) {
        errorMessage = "Server configuration error. Please try different filters.";
      }
      
      setError(errorMessage);
      setActs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Function to load more data for infinite scroll
  const loadMoreData = useCallback(async () => {
    if (!pagination?.has_more || loading) return;
    await handleSearch(acts.length);
  }, [pagination?.has_more, loading, acts.length, handleSearch]);

  // Infinite scroll hook
  const { loadingRef, isLoadingMore, error: scrollError, retry } = useInfiniteScroll({
    fetchMore: loadMoreData,
    hasMore: pagination?.has_more || false,
    isLoading: loading
  });

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, '=', value);
    if (key === 'year') {
      console.log('Year filter specifically changed to:', value, 'type:', typeof value);
    }
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      console.log('New filters:', newFilters);
      return newFilters;
    });
  };

  // Validate filters before sending to API
  const validateFilters = () => {
    console.log('Validating filters:', filters);
    const warnings = [];
    
    // Check if year is valid
    if (filters.year && filters.year.trim()) {
      const year = parseInt(filters.year);
      console.log('Validating year:', filters.year, 'parsed as:', year, 'isNaN:', isNaN(year));
      const currentYear = new Date().getFullYear();
      const maxYear = currentYear + 1;
      console.log('Year validation range: 1800 to', maxYear, 'for year:', year);
      
      if (isNaN(year) || year < 1800 || year > maxYear) {
        console.log('Year validation failed for:', year, 'Range: 1800 to', maxYear);
        warnings.push('Please enter a valid year between 1800 and ' + maxYear);
      } else {
        console.log('Year validation passed for:', year);
      }
    }
    
    // Check if act_number is valid (should be numeric)
    if (filters.act_number && filters.act_number.trim()) {
      const actNum = filters.act_number.trim();
      if (!/^\d+$/.test(actNum)) {
        warnings.push('Act number should contain only digits');
      }
    }
    
    console.log('Validation warnings:', warnings);
    return warnings;
  };

  // Function to get total count of State Acts
  const getTotalCount = async () => {
    try {
      console.log('Fetching total count for State Acts...');
      
      const params = {
        limit: 1,
      };
      
      const data = await apiService.getStateActs(params);
      console.log('State Acts total count API response:', data);
      
      // Try to extract total count from various possible fields
      let count = 0;
      if (data.total_count) count = data.total_count;
      else if (data.pagination_info?.total_count) count = data.pagination_info.total_count;
      else if (data.total) count = data.total;
      else if (data.count) count = data.count;
      else if (data.pagination?.total) count = data.pagination.total;
      else if (data.meta?.total) count = data.meta.total;
      else if (data.total_results) count = data.total_results;
      
      console.log('Extracted State Acts count:', count);
      
      if (count > 0) {
        setTotalCount(count);
        setTotalCountLoaded(true);
        console.log('State Acts total count set to:', count);
      } else {
        // Fallback: set a reasonable default
        setTotalCount(9678);
        setTotalCountLoaded(true);
        console.log('Using fallback State Acts total count: 9678');
      }
    } catch (error) {
      console.error('Error fetching State Acts total count:', error);
      // Fallback on error
      setTotalCount(9678);
      setTotalCountLoaded(true);
    }
  };

  const clearFilters = () => {
    setFilters({
      state: "",
      act_number: "",
      year: "",
      department: ""
    });
    setSearchQuery("");
    setActs([]);
    setPagination(null);
    // Trigger search with cleared filters
    setTimeout(() => handleSearch(0), 100);
  };

  const viewActDetails = (act) => {
    // Navigate to act details page with act data
    navigate('/act-details', { state: { act } });
  };


  const loadMore = () => {
    if (pagination?.has_more) {
      handleSearch(pagination.offset + pagination.limit);
    }
  };

  // Auto-apply filters when they change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(0);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }, isInitialLoad ? 100 : 500); // Shorter delay for initial load

    return () => clearTimeout(timeoutId);
  }, [handleSearch, isInitialLoad]);

  // Load total count on component mount
  useEffect(() => {
    if (!totalCountLoaded) {
      getTotalCount();
    }
  }, [totalCountLoaded]);

  // Test API call on mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing State Acts API with basic call...');
        const testData = await apiService.getStateActs({ limit: 5 });
        console.log('Test API call successful:', testData);
        
        // Test with year filter
        console.log('Testing State Acts API with year filter...');
        const testDataWithYear = await apiService.getStateActs({ limit: 5, year: 2023 });
        console.log('Test API call with year successful:', testDataWithYear);
        
        // Test with different year
        console.log('Testing State Acts API with year 2020...');
        const testDataWithYear2020 = await apiService.getStateActs({ limit: 5, year: 2020 });
        console.log('Test API call with year 2020 successful:', testDataWithYear2020);
      } catch (error) {
        console.error('Test API call failed:', error);
      }
    };
    testAPI();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Clean Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              State Acts
            </h1>
            <div className="w-16 sm:w-20 h-1 mx-auto mb-4 sm:mb-6" style={{ backgroundColor: '#CF9B63' }}></div>
            <p className="text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Search and access State Government Acts and legal documents
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Search & Filter State Acts
            </h2>
            
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Search Acts
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    console.log('Search query changed:', e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search by act title, state, department, or any keyword..."
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
                Search across act titles, states, departments, and other act details
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* State Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Act Number Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Act Number
                </label>
                <input
                  type="text"
                  value={filters.act_number}
                  onChange={(e) => handleFilterChange('act_number', e.target.value)}
                  placeholder="e.g., 20217"
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
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <option value="">All Departments</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleSearch(0)}
                disabled={loading}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={clearFilters}
                disabled={loading}
                className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Clear Filters
              </button>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || filters.state || filters.act_number || filters.year || filters.department) && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-blue-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Active Filters:
                  </h3>
                  <span className="text-xs text-blue-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {acts.length} results found
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {filters.state && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      State: {filters.state}
                    </span>
                  )}
                  {filters.act_number && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Act Number: {filters.act_number}
                    </span>
                  )}
                  {filters.year && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Year: {filters.year}
                    </span>
                  )}
                  {filters.department && (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                      </svg>
                      Department: {filters.department}
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
                  {searchQuery || filters.state || filters.act_number || filters.year || filters.department 
                    ? 'Search Results - State Acts' 
                    : 'Latest State Acts'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {searchQuery || filters.state || filters.act_number || filters.year || filters.department 
                    ? 'Showing State Acts matching your search and filter criteria' 
                    : 'Showing the most recent State Acts first'}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Showing {acts.length} of {totalCount > 0 ? totalCount.toLocaleString() : '9,678'} acts
                </span>
                {(searchQuery || filters.state || filters.act_number || filters.year || filters.department) && (
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
                    onClick={() => handleSearch(0)}
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
                  <ActSkeleton key={index} />
                ))}
              </div>
            ) : acts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  No State Acts Found
                </h3>
                <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  No State Acts found matching your search criteria. Please try different filters or check your connection.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {acts.map((act, index) => (
                  <div
                    key={act.act_id || index}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                            {act.short_title || 'Untitled Act'}
                          </h3>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Latest
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          {act.location && (
                            <div>
                              <span className="font-medium text-gray-800">Location:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{act.location}</span>
                            </div>
                          )}
                          {act.department && (
                            <div>
                              <span className="font-medium text-gray-800">Department:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{act.department}</span>
                            </div>
                          )}
                          {act.year && (
                            <div>
                              <span className="font-medium text-gray-800">Year:</span>
                              <span className={`ml-2 ${index === 0 ? 'font-bold text-blue-600' : ''}`} style={{ color: index === 0 ? '#1E65AD' : '#8C969F' }}>
                                {act.year}
                                {index === 0 && <span className="ml-1 text-xs">(Newest)</span>}
                              </span>
                            </div>
                          )}
                          {act.ministry && (
                            <div>
                              <span className="font-medium text-gray-800">Ministry:</span>
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {act.ministry}
                              </span>
                            </div>
                          )}
                          {act.act_id && (
                            <div>
                              <span className="font-medium text-gray-800">Act ID:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{act.act_id}</span>
                            </div>
                          )}
                          {act.source && (
                            <div>
                              <span className="font-medium text-gray-800">Source:</span>
                              <span className="ml-2" style={{ color: '#8C969F' }}>{act.source}</span>
                            </div>
                          )}
                        </div>

                        {act.long_title && act.long_title !== act.short_title && (
                          <div className="mb-4">
                            <span className="font-medium text-gray-800">Description:</span>
                            <span className="ml-2" style={{ color: '#8C969F' }}>{act.long_title}</span>
                          </div>
                        )}

                      </div>

                      <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => viewActDetails(act)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
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
              <div ref={loadingRef} className="mt-8">
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
