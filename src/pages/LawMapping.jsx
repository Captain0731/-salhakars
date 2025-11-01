import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  if (!document.getElementById('law-mapping-styles')) {
    styleSheet.id = 'law-mapping-styles';
    document.head.appendChild(styleSheet);
  }
}

export default function LawMapping() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMountedRef = useRef(true);

  // Get mapping type from URL query parameter, default to bns_ipc
  const getInitialMappingType = () => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    // Validate that the type is one of the valid mapping types
    const validTypes = ['bns_ipc', 'bsa_iea', 'bnss_crpc'];
    if (typeParam && validTypes.includes(typeParam)) {
      return typeParam;
    }
    return "bns_ipc"; // default
  };

  // Mapping type state - initialize from URL query parameter
  const [mappingType, setMappingType] = useState(getInitialMappingType);

  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);

  // Data states
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const fetchMappingsRef = useRef(null);
  const isInitialMountRef = useRef(true);
  const isFetchingRef = useRef(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    source_section: '',
    target_section: ''
  });

  const pageSize = 50; // Increased from 20 to show more mappings per page

  const mappingTypes = [
    { value: "bns_ipc", label: "IPC ↔ BNS (Criminal Law)", description: "Indian Penal Code to Bharatiya Nyaya Sanhita" },
    { value: "bsa_iea", label: "IEA ↔ BSA (Evidence Law)", description: "Indian Evidence Act to Bharatiya Sakshya Adhiniyam" },
    { value: "bnss_crpc", label: "CrPC ↔ BNSS (Criminal Procedure)", description: "Code of Criminal Procedure to Bharatiya Nagarik Suraksha Sanhita" }
  ];

  // Update mapping type when URL query parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    const validTypes = ['bns_ipc', 'bsa_iea', 'bnss_crpc'];
    if (typeParam && validTypes.includes(typeParam) && typeParam !== mappingType) {
      setMappingType(typeParam);
    }
  }, [location.search]);

  // Reset filters when mapping type changes
  useEffect(() => {
    setFilters({
      search: '',
      subject: '',
      source_section: '',
      target_section: ''
    });
    setMappings([]);
    setOffset(0);
    setHasMore(true);
  }, [mappingType]);

  // Store filters in ref to always get latest values
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Fetch mappings function with offset-based pagination
  const fetchMappings = useCallback(async (isLoadMore = false, customFilters = null) => {
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
      const currentOffset = isLoadMore ? offsetRef.current : 0;
      
      // Prepare params - ensure mapping_type is always included
      const params = {
        limit: pageSize,
        offset: currentOffset,
        mapping_type: mappingType  // Always include mapping_type
      };

      // Add filters - remove empty ones
      Object.keys(activeFilters).forEach(key => {
        const value = activeFilters[key];
        // Skip empty values
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return;
        }
        
        // Add non-empty filter values
        params[key] = value;
      });

      // Remove empty params (but keep mapping_type even if it's empty string - it shouldn't be)
      Object.keys(params).forEach(key => {
        if (key === 'mapping_type') return; // Always keep mapping_type
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      // Log the request for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching mappings with params:', params);
      }

      // Call API
      const data = await apiService.getLawMappingsWithOffset(currentOffset, pageSize, params);
      
      // Log the response for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Mappings API response:', { 
          mappingType, 
          dataCount: data?.data?.length,
          paginationInfo: data?.pagination_info 
        });
      }
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response: Expected object but got ' + typeof data);
      }
      
      // Handle different response structures
      let mappingsArray = [];
      if (Array.isArray(data.data)) {
        mappingsArray = data.data;
      } else if (Array.isArray(data)) {
        mappingsArray = data;
      } else if (data.data) {
        console.warn('API response data is not an array:', data.data);
        mappingsArray = [];
      }
      
      if (!isMountedRef.current) return;
      
      const paginationInfo = data.pagination_info || {};
      
      if (isLoadMore) {
        setMappings(prev => [...prev, ...mappingsArray]);
        setOffset(prev => prev + mappingsArray.length);
        offsetRef.current = offsetRef.current + mappingsArray.length;
      } else {
        setMappings(mappingsArray);
        setOffset(mappingsArray.length);
        offsetRef.current = mappingsArray.length;
      }
      
      // Update hasMore based on API response
      setHasMore(paginationInfo.has_more !== false); // Default to true if not specified
      
      // Update total count from pagination info if available
      if (paginationInfo.total_count !== undefined) {
        setTotalCount(paginationInfo.total_count);
      } else if (!isLoadMore) {
        // If no total count, estimate based on current data
        setTotalCount(mappingsArray.length + (paginationInfo.has_more ? pageSize : 0));
      }
      
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error('Error fetching mappings:', error);
      
      let errorMessage = `Failed to fetch law mappings. Please try again.`;
      
      if (error.message.includes('401') || error.message.includes('Authentication')) {
        errorMessage = "Authentication required. Please log in to access mappings.";
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        errorMessage = "Access denied. Please check your permissions.";
      } else if (error.message.includes('500') || error.message.includes('Internal Server')) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Clear mappings on error (except when loading more)
      if (!isLoadMore) {
        setMappings([]);
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
  }, [mappingType, pageSize]);

  // Store fetchMappings in ref
  useEffect(() => {
    fetchMappingsRef.current = fetchMappings;
  }, [fetchMappings]);

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
      subject: '',
      source_section: '',
      target_section: ''
    });
    setMappings([]);
    setHasMore(true);
    setOffset(0);
    offsetRef.current = 0;
    setTimeout(() => {
      if (fetchMappingsRef.current) {
        fetchMappingsRef.current(false);
      }
    }, 100);
  };

  const applyFilters = () => {
    if (isFetchingRef.current) return;
    
    setMappings([]);
    setHasMore(true);
    setOffset(0);
    offsetRef.current = 0;
    setError(null);
    
    setTimeout(() => {
      if (fetchMappingsRef.current) {
        const currentFilters = filtersRef.current;
        fetchMappingsRef.current(false, currentFilters);
      }
    }, 100);
  };

  // Sync offset ref with state
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  // Auto-apply filters when they change (with debounce) - Skip on initial mount
  useEffect(() => {
    if (isInitialMountRef.current) {
      return;
    }
    
    if (isFetchingRef.current) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
        if (key === 'search') return false;
        return val && (typeof val === 'string' ? val.trim() !== '' : val !== '');
      });
      
      if (hasActiveFilters && !isFetchingRef.current && fetchMappingsRef.current) {
        const currentFilters = filtersRef.current;
        setMappings([]);
        setHasMore(true);
        setOffset(0);
        offsetRef.current = 0;
        setError(null);
        fetchMappingsRef.current(false, currentFilters);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [filters.subject, filters.source_section, filters.target_section]);

  // Load initial data when mapping type changes
  useEffect(() => {
    // Reset offset when mapping type changes
    setOffset(0);
    offsetRef.current = 0;
    setMappings([]);
    setHasMore(true);
    setError(null);
    
    if (isInitialMountRef.current) {
      const timer = setTimeout(() => {
        if (!isFetchingRef.current && fetchMappingsRef.current) {
          fetchMappingsRef.current(false);
        }
      }, 100);
      isInitialMountRef.current = false;
      return () => clearTimeout(timer);
    } else {
      // When mapping type changes, immediately fetch new data
      if (!isFetchingRef.current && fetchMappingsRef.current) {
        const timer = setTimeout(() => {
          fetchMappingsRef.current(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [mappingType]);

  // Enhanced infinite scroll logic
  const loadMoreData = useCallback(async () => {
    if (!hasMore || loading || isSearching || !isMountedRef.current) return;
    if (fetchMappingsRef.current) {
      await fetchMappingsRef.current(true);
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

  const viewMappingDetails = (mapping) => {
    // Navigate to mapping details page with mapping data and current mapping type
    navigate('/mapping-details', { state: { mapping, mappingType } });
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const mappingTypeLabel = mappingTypes.find(m => m.value === mappingType)?.label || "Law Mapping";

  return (
    <div className="min-h-screen animate-fade-in-up" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Enhanced Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 animate-slide-in-bottom">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Law Mapping
            </h1>
            <div className="w-20 h-1 mx-auto mb-6 animate-fade-in-up" style={{ backgroundColor: '#CF9B63', animationDelay: '0.2s' }}></div>
            <p className="text-lg max-w-3xl mx-auto animate-fade-in-up" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif', animationDelay: '0.4s' }}>
              Navigate the transition from old legal codes to new ones. Map sections between IPC-BNS, IEA-BSA, and CrPC-BNSS.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* Mapping Type Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Select Mapping Type:
              </label>
              <div className="relative">
                <select
                  value={mappingType}
                  onChange={(e) => setMappingType(e.target.value)}
                  className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium min-w-[300px]"
                  style={{ fontFamily: 'Roboto, sans-serif', color: '#1E65AD' }}
                >
                  {mappingTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                Search {mappingTypeLabel}
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
                Search Mappings
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by subject, section number, or any keyword..."
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

            {/* Dynamic Filters - Hidden by default, shown when showFilters is true */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-6 mt-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Filter Options
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={filters.subject}
                      onChange={(e) => handleFilterChange('subject', e.target.value)}
                      placeholder="e.g., Theft, Murder, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {mappingType === 'bns_ipc' ? 'IPC Section' : mappingType === 'bsa_iea' ? 'IEA Section' : 'CrPC Section'}
                    </label>
                    <input
                      type="text"
                      value={filters.source_section}
                      onChange={(e) => handleFilterChange('source_section', e.target.value)}
                      placeholder={mappingType === 'bns_ipc' ? 'e.g., 302, 304, 307' : mappingType === 'bsa_iea' ? 'e.g., 3, 5, 24' : 'e.g., 154, 161, 173'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {mappingType === 'bns_ipc' ? 'BNS Section' : mappingType === 'bsa_iea' ? 'BSA Section' : 'BNSS Section'}
                    </label>
                    <input
                      type="text"
                      value={filters.target_section}
                      onChange={(e) => handleFilterChange('target_section', e.target.value)}
                      placeholder={mappingType === 'bns_ipc' ? 'e.g., 101, 103, 106' : mappingType === 'bsa_iea' ? 'e.g., 3, 5, 24' : 'e.g., 154, 161, 173'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={applyFilters}
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
                    onClick={clearFilters}
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
                {Object.values(filters).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val !== '')) && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Active Filters:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (value && (typeof value === 'string' ? value.trim() !== '' : value !== '')) {
                          const label = key === 'source_section' ? 'Source Section' : 
                                       key === 'target_section' ? 'Target Section' :
                                       key.charAt(0).toUpperCase() + key.slice(1);
                          return (
                            <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                              {label}: "{value}"
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
                  {Object.values(filters).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val !== '')) 
                    ? `Search Results - ${mappingTypeLabel}` 
                    : `Latest ${mappingTypeLabel}`}
                </h2>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {Object.values(filters).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val !== '')) 
                    ? `Showing mappings matching your search criteria` 
                    : `Showing the most recent mappings first`}
                </p>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {mappings.length} {mappings.length === 1 ? 'Mapping' : 'Mappings'}
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
                        Error Loading Mappings
                      </h4>
                      <p className="text-red-700 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setError(null);
                      fetchMappings(false);
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

            {loading && mappings.length === 0 ? (
              <SkeletonGrid count={3} />
            ) : mappings.length === 0 && !error ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  No mappings found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {Object.values(filters).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val !== ''))
                    ? 'No mappings match your current search criteria. Try adjusting your filters or search terms.'
                    : `No mappings are currently available. Please check back later.`}
                </p>
                {Object.values(filters).some(val => val && (typeof val === 'string' ? val.trim() !== '' : val !== '')) && (
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
                {mappings.map((mapping, index) => {
                  // Get section numbers based on mapping type
                  const getSourceSection = () => {
                    if (mappingType === 'bns_ipc') {
                      return mapping.ipc_section || mapping.source_section;
                    } else if (mappingType === 'bsa_iea') {
                      return mapping.iea_section || mapping.source_section;
                    } else {
                      return mapping.crpc_section || mapping.source_section;
                    }
                  };
                  
                  const getTargetSection = () => {
                    if (mappingType === 'bns_ipc') {
                      return mapping.bns_section || mapping.target_section;
                    } else if (mappingType === 'bsa_iea') {
                      return mapping.bsa_section || mapping.target_section;
                    } else {
                      return mapping.bnss_section || mapping.target_section;
                    }
                  };
                  
                  const sourceSection = getSourceSection();
                  const targetSection = getTargetSection();
                  const subject = mapping.subject || mapping.title || 'Mapping';
                  const summary = mapping.summary || mapping.description || mapping.source_description || '';
                  
                  // Get colors based on mapping type
                  const getSourceColor = () => {
                    if (mappingType === 'bns_ipc') return { bg: 'bg-red-50', text: 'text-red-600' };
                    if (mappingType === 'bsa_iea') return { bg: 'bg-purple-50', text: 'text-purple-600' };
                    return { bg: 'bg-blue-50', text: 'text-blue-600' };
                  };
                  
                  const getTargetColor = () => {
                    if (mappingType === 'bns_ipc') return { bg: 'bg-green-50', text: 'text-green-600' };
                    if (mappingType === 'bsa_iea') return { bg: 'bg-orange-50', text: 'text-orange-600' };
                    return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
                  };
                  
                  const sourceColor = getSourceColor();
                  const targetColor = getTargetColor();
                  
                  const getSourceLabel = () => {
                    if (mappingType === 'bns_ipc') return 'IPC Section';
                    if (mappingType === 'bsa_iea') return 'IEA Section';
                    return 'CrPC Section';
                  };
                  
                  const getTargetLabel = () => {
                    if (mappingType === 'bns_ipc') return 'BNS Section';
                    if (mappingType === 'bsa_iea') return 'BSA Section';
                    return 'BNSS Section';
                  };
                  
                  return (
                    <SmoothTransitionWrapper key={mapping.id || `mapping-${index}`} delay={index * 50}>
                      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 bg-white group">
                        {/* Section Mapping Display */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
                          {/* Source Section */}
                          <div className={`${sourceColor.bg} p-4 rounded-lg`}>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-600 mb-1">{getSourceLabel()}</div>
                              {sourceSection && (
                                <div className={`text-2xl font-bold ${sourceColor.text} mb-2`}>{sourceSection}</div>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 transform rotate-90 md:rotate-0">
                              ⇄
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Maps to</div>
                          </div>

                          {/* Target Section */}
                          <div className={`${targetColor.bg} p-4 rounded-lg`}>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-600 mb-1">{getTargetLabel()}</div>
                              {targetSection && (
                                <div className={`text-2xl font-bold ${targetColor.text} mb-2`}>{targetSection}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Subject and Summary */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                              {subject}
                            </h3>
                            {summary && (
                              <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                                {summary}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex-shrink-0 flex flex-col gap-3 w-full lg:w-48">
                            <button
                              onClick={() => viewMappingDetails(mapping)}
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
                  );
                })}
                
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
