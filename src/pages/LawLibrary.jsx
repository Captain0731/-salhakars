import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SkeletonGrid, SmoothTransitionWrapper } from "../components/EnhancedLoadingComponents";
import { InfiniteScrollLoader } from "../components/LoadingComponents";

// Add custom CSS animations
const customStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slide-in-bottom {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }
  
  .animate-slide-in-bottom {
    animation: slide-in-bottom 0.6s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  if (!document.getElementById('law-library-styles')) {
    styleSheet.id = 'law-library-styles';
    document.head.appendChild(styleSheet);
  }
}

export default function LawLibrary() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("central"); // Default to Central Acts
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Initialize filters based on active section
  const getInitialFilters = (section) => {
    if (section === "central") {
      return {
        search: '',
        act_id: '',
        ministry: '',
        department: '',
        year: '',
        type: ''
      };
    } else {
      return {
        search: '',
        state: '',
        act_number: '',
        year: '',
        department: ''
      };
    }
  };

  const [filters, setFilters] = useState(getInitialFilters("central"));
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const librarySections = [
    {
      id: "central",
      title: "Central Acts",
      path: "/central-acts",
      description: "Browse acts passed by the Parliament of India. Search through central legislation, regulations, and constitutional documents.",
      color: "#1E65AD",
    },
    {
      id: "state",
      title: "State Acts",
      path: "/state-acts",
      description: "Access acts and legislation from various state governments across India. Find state-specific laws and regulations.",
      color: "#CF9B63",
    }
  ];

  const activeSectionData = librarySections.find(s => s.id === activeSection) || librarySections[0];
  const sectionLabel = activeSectionData.title;

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'search') {
      setSearchQuery(value);
    }
  };

  const fetchActs = useCallback(async (loadMore = false, customFilters = null) => {
    if (isSearching && !loadMore) {
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    setError(null);
    
    try {
      const activeFilters = customFilters !== null ? customFilters : filtersRef.current;
      const currentOffset = loadMore ? (pagination?.offset || 0) + (pagination?.current_page_size || 0) : 0;
      
      // Build API parameters
      const params = {
        limit: 20,
        offset: currentOffset
      };

      // Add filter parameters - search/short_title
      if (activeFilters.search && typeof activeFilters.search === 'string' && activeFilters.search.trim()) {
        params.short_title = activeFilters.search.trim();
      }
      
      // Central Acts specific filters
      if (activeSection === "central") {
        if (activeFilters.act_id && typeof activeFilters.act_id === 'string' && activeFilters.act_id.trim()) {
          params.act_id = activeFilters.act_id.trim();
        }
        if (activeFilters.ministry && typeof activeFilters.ministry === 'string' && activeFilters.ministry.trim()) {
          params.ministry = activeFilters.ministry.trim();
        }
      } else {
        // State Acts specific filters
        if (activeFilters.act_number && typeof activeFilters.act_number === 'string' && activeFilters.act_number.trim()) {
          params.act_number = activeFilters.act_number.trim();
        }
        if (activeFilters.state && typeof activeFilters.state === 'string' && activeFilters.state.trim()) {
          params.state = activeFilters.state.trim();
        }
      }
      
      // Common filters
      if (activeFilters.department && typeof activeFilters.department === 'string' && activeFilters.department.trim()) {
        params.department = activeFilters.department.trim();
      }
      
      if (activeFilters.year) {
        const yearValue = typeof activeFilters.year === 'string' ? activeFilters.year.trim() : String(activeFilters.year);
        if (yearValue) {
          const yearInt = parseInt(yearValue);
          if (!isNaN(yearInt) && yearInt > 0) {
            params.year = yearInt;
          }
        }
      }

      // Fetch data based on active section
      let data;
      if (activeSection === "central") {
        data = await apiService.getCentralActs(params);
      } else {
        data = await apiService.getStateActs(params);
      }

      if (!data || !data.data) {
        setActs([]);
        setError("No data received from the server");
        setPagination(null);
        return;
      }

      // Sort by year descending (newest first)
      if (data.data && data.data.length > 0) {
        data.data = data.data.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearB - yearA;
        });
      }

      if (loadMore) {
        setActs(prev => [...prev, ...(data.data || [])]);
      } else {
        setActs(data.data || []);
      }

      setPagination(data.pagination_info || null);
      setTotalCount(data.pagination_info?.total_count || data.data?.length || 0);
      
    } catch (err) {
      console.error('Error fetching acts:', err);
      setError(err.message || "Failed to fetch acts. Please try again.");
      if (!loadMore) {
        setActs([]);
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [activeSection, pagination, isSearching]);

  const fetchActsRef = useRef(fetchActs);
  useEffect(() => {
    fetchActsRef.current = fetchActs;
  }, [fetchActs]);

  const loadMoreData = useCallback(() => {
    if (fetchActsRef.current && pagination?.has_more && !loading && !isSearching) {
      fetchActsRef.current(true);
    }
  }, [pagination, loading, isSearching]);

  const { loadingRef, isLoadingMore, error: scrollError, retry } = useInfiniteScroll({
    fetchMore: loadMoreData,
    hasMore: pagination?.has_more || false,
    isLoading: loading || isSearching
  });

  const applyFilters = () => {
    setActs([]);
    setPagination(null);
    setError(null);
    // Reset offset when applying new filters
    const currentFilters = filtersRef.current;
    setTimeout(() => {
      fetchActs(false, currentFilters);
    }, 100);
  };
  
  // Auto-apply filters when they change (with debounce) - but only for non-search filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only auto-apply if filters panel is visible and filters have values
      const hasActiveFilters = Object.entries(filtersRef.current).some(([key, value]) => {
        if (key === 'search') return false; // Don't auto-apply search
        if (!value) return false;
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'number') return value !== 0;
        return value !== '';
      });
      
      if (hasActiveFilters && showFilters) {
        applyFilters();
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, showFilters]);

  const clearFilters = () => {
    const emptyFilters = getInitialFilters(activeSection);
    setFilters(emptyFilters);
    setSearchQuery('');
    setActs([]);
    setPagination(null);
    setError(null);
    setTimeout(() => {
      fetchActs(false, emptyFilters);
    }, 100);
  };

  const viewActDetails = (act) => {
    navigate('/act-details', { state: { act } });
  };

  const ministries = [
    "Ministry of Home Affairs",
    "Ministry of Law and Justice",
    "Ministry of Corporate Affairs",
    "Ministry of Consumer Affairs",
    "Ministry of Personnel, Public Grievances and Pensions",
    "Ministry of Road Transport and Highways",
    "Ministry of Finance",
    "Ministry of Health and Family Welfare"
  ];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi"
  ];

  const types = ["Central Act", "State Act", "Constitutional Document", "Ordinance", "Rule", "Regulation"];
  const years = Array.from({ length: 225 }, (_, i) => new Date().getFullYear() - i);

  // Initial load
  useEffect(() => {
    if (!loading && acts.length === 0 && !isSearching) {
      fetchActs(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Reload data when section changes
  useEffect(() => {
    setActs([]);
    setPagination(null);
    setError(null);
    const emptyFilters = getInitialFilters(activeSection);
    setFilters(emptyFilters);
    setSearchQuery('');
    if (fetchActsRef.current) {
      setTimeout(() => {
        fetchActsRef.current(false, emptyFilters);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]); // Reload when section changes

  return (
    <div className="min-h-screen animate-fade-in-up" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Enhanced Header Section */}
      <div className="bg-white border-b border-gray-200 pt-16 sm:pt-20 animate-slide-in-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Law Library
            </h1>
            <div className="w-16 sm:w-20 h-1 mx-auto mb-4 sm:mb-6 animate-fade-in-up" style={{ backgroundColor: '#CF9B63', animationDelay: '0.2s' }}></div>
            <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-2 animate-fade-in-up" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif', animationDelay: '0.4s' }}>
              Your comprehensive resource for accessing legal acts, regulations, and legislative documents from across India
            </p>
            
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Type Toggle Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <label className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Select Section:
              </label>
              
              {/* Toggle Button */}
              <div className="relative inline-flex items-center bg-gray-100 rounded-xl p-1 shadow-inner w-full sm:w-auto">
                {/* Sliding background indicator */}
                <div
                  className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-in-out z-0`}
                  style={{
                    left: activeSection === 'central' ? '4px' : 'calc(50% + 2px)',
                    width: 'calc(50% - 4px)',
                    backgroundColor: activeSection === 'central' ? '#1E65AD' : '#CF9B63',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                />
                
                <button
                  onClick={() => setActiveSection('central')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 relative z-10 flex-1 sm:flex-none sm:min-w-[140px] md:min-w-[180px] text-xs sm:text-sm ${
                    activeSection === 'central'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  Central Acts
                </button>
                <button
                  onClick={() => setActiveSection('state')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 relative z-10 flex-1 sm:flex-none sm:min-w-[140px] md:min-w-[180px] text-xs sm:text-sm ${
                    activeSection === 'state'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  State Acts
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                Search {sectionLabel}
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <svg 
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
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
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Search {sectionLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder={`Search ${sectionLabel.toLowerCase()}...`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      e.preventDefault();
                      applyFilters();
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base md:text-lg"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  title="Voice Search"
                >
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
              <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6 animate-fade-in-up">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Filter Options
                </h3>
                
                {activeSection === "central" ? (
                  /* Central Acts Filters */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Act ID Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Act ID
                      </label>
                      <input
                        type="text"
                        value={filters.act_id || ''}
                        onChange={(e) => handleFilterChange('act_id', e.target.value)}
                        placeholder="e.g., 186901"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                    </div>

                    {/* Ministry Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Ministry
                      </label>
                      <select
                        value={filters.ministry || ''}
                        onChange={(e) => handleFilterChange('ministry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <option value="">All Ministries</option>
                        {ministries.map((ministry) => (
                          <option key={ministry} value={ministry}>
                            {ministry}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Department Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Department
                      </label>
                      <input
                        type="text"
                        value={filters.department || ''}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        placeholder="e.g., Legislative Department"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                    </div>

                    {/* Year Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Year
                      </label>
                      <select
                        value={filters.year || ''}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <option value="">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Type
                      </label>
                      <select
                        value={filters.type || ''}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <option value="">All Types</option>
                        {types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  /* State Acts Filters */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* State Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        State
                      </label>
                      <select
                        value={filters.state || ''}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <option value="">All States</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Act Number Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Act Number
                      </label>
                      <input
                        type="text"
                        value={filters.act_number || ''}
                        onChange={(e) => handleFilterChange('act_number', e.target.value)}
                        placeholder="e.g., Act 12 of 2023"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                    </div>

                    {/* Department Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Department
                      </label>
                      <input
                        type="text"
                        value={filters.department || ''}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        placeholder="e.g., Legislative Department"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      />
                    </div>

                    {/* Year Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        Year
                      </label>
                      <select
                        value={filters.year || ''}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        <option value="">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Filter Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={applyFilters}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
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
                    disabled={loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                </div>

                {/* Active Filters Display */}
                {Object.values(filters).some(val => {
                  if (!val) return false;
                  if (typeof val === 'string') return val.trim() !== '';
                  if (typeof val === 'number') return val !== 0;
                  return val !== '';
                }) && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Active Filters:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        const hasValue = value && (
                          typeof value === 'string' ? value.trim() !== '' :
                          typeof value === 'number' ? value !== 0 :
                          value !== ''
                        );
                        if (!hasValue) return null;
                        
                        let label = key;
                        if (key === 'act_id') label = 'Act ID';
                        else if (key === 'act_number') label = 'Act Number';
                        else label = key.charAt(0).toUpperCase() + key.slice(1);
                        
                        return (
                          <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {label}: "{value}"
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Results Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold animate-fade-in-up" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  {Object.values(filters).some(val => {
                    if (!val) return false;
                    if (typeof val === 'string') return val.trim() !== '';
                    if (typeof val === 'number') return val !== 0;
                    return val !== '';
                  }) 
                    ? `Search Results - ${sectionLabel}` 
                    : `Latest ${sectionLabel}`}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {Object.values(filters).some(val => {
                    if (!val) return false;
                    if (typeof val === 'string') return val.trim() !== '';
                    if (typeof val === 'number') return val !== 0;
                    return val !== '';
                  }) 
                    ? `Showing ${sectionLabel.toLowerCase()} matching your search criteria` 
                    : `Showing the most recent ${sectionLabel.toLowerCase()} first`}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {acts.length} {acts.length === 1 ? 'Act' : 'Acts'}
                  </span>
                  {pagination?.has_more && !loading && (
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
                        Error Loading {sectionLabel}
                      </h4>
                      <p className="text-red-700 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setError(null);
                      fetchActs(false);
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

            {loading && acts.length === 0 ? (
              <SkeletonGrid count={3} />
            ) : acts.length === 0 && !error ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  No {sectionLabel.toLowerCase()} found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {Object.values(filters).some(val => {
                    if (!val) return false;
                    if (typeof val === 'string') return val.trim() !== '';
                    if (typeof val === 'number') return val !== 0;
                    return val !== '';
                  })
                    ? 'No acts match your current search criteria. Try adjusting your filters or search terms.'
                    : `No ${sectionLabel.toLowerCase()} are currently available. Please check back later.`}
                </p>
                {Object.values(filters).some(val => {
                  if (!val) return false;
                  if (typeof val === 'string') return val.trim() !== '';
                  if (typeof val === 'number') return val !== 0;
                  return val !== '';
                }) && (
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
                {acts.map((act, index) => (
                  <SmoothTransitionWrapper key={act.id || act.act_id || `act-${index}`} delay={index * 50}>
                    <div 
                      onClick={() => viewActDetails(act)}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 bg-white group cursor-pointer"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold flex-1 group-hover:text-blue-700 transition-colors break-words" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                              {act.short_title || act.long_title || 'Untitled Act'}
                            </h3>
                            {index === 0 && !loading && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex-shrink-0">
                                Latest
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm mb-2 sm:mb-3">
                            {act.year && (
                              <div>
                                <span className="font-medium text-gray-800">Year:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{act.year}</span>
                              </div>
                            )}
                            {act.ministry && (
                              <div>
                                <span className="font-medium text-gray-800">Ministry:</span>
                                <span className="ml-2 block sm:inline" style={{ color: '#8C969F' }}>{act.ministry}</span>
                              </div>
                            )}
                            {act.department && (
                              <div>
                                <span className="font-medium text-gray-800">Department:</span>
                                <span className="ml-2 block sm:inline" style={{ color: '#8C969F' }}>{act.department}</span>
                              </div>
                            )}
                            {act.act_id && (
                              <div>
                                <span className="font-medium text-gray-800">Act ID:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{act.act_id}</span>
                              </div>
                            )}
                            {act.act_number && (
                              <div>
                                <span className="font-medium text-gray-800">Act Number:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{act.act_number}</span>
                              </div>
                            )}
                            {act.state && (
                              <div>
                                <span className="font-medium text-gray-800">State:</span>
                                <span className="ml-2" style={{ color: '#8C969F' }}>{act.state}</span>
                              </div>
                            )}
                          </div>

                          {act.long_title && act.long_title !== act.short_title && (
                            <div className="mb-3">
                              <span className="font-medium text-gray-800 text-sm">Description:</span>
                              <p className="mt-1 text-sm" style={{ color: '#8C969F' }}>{act.long_title}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              viewActDetails(act);
                            }}
                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </SmoothTransitionWrapper>
                ))}
              </div>
            )}
            
            {/* Infinite Scroll Loader */}
            {acts.length > 0 && (
              <div ref={loadingRef} className="mt-6">
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
