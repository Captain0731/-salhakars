import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { ActSkeleton, InfiniteScrollLoader } from "../components/LoadingComponents";

export default function OldToNewLawMapping() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMappingType, setSelectedMappingType] = useState("bns_ipc");
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [showSectionDetails, setShowSectionDetails] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    section: "",
    subject: "",
    source_section: "",
    target_section: ""
  });


  const mappingTypes = [
    { value: "bns_ipc", label: "BNS ↔ IPC (Criminal Law)", description: "Bharatiya Nyaya Sanhita to Indian Penal Code" },
    { value: "bsa_iea", label: "BSA ↔ IEA (Evidence Law)", description: "Bharatiya Sakshya Adhiniyam to Indian Evidence Act" }
  ];

  const handleSearch = async (offset = 0) => {
    setLoading(true);
    setError("");
    
    try {
      const params = {
        limit: 20,
        offset,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      const data = await apiService.getLawMappings({
        mapping_type: selectedMappingType,
        ...params
      });

      if (offset === 0) {
        setMappings(data.data);
      } else {
        setMappings(prev => [...prev, ...data.data]);
      }

      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || "Failed to fetch law mappings");
      setMappings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedMappingType("bns_ipc");
    setSearchQuery("");
    setFilters({
      section: "",
      subject: "",
      source_section: "",
      target_section: ""
    });
    setMappings([]);
    setPagination(null);
    // Trigger search with cleared filters
    setTimeout(() => handleSearch(0), 100);
  };

  // Auto-apply filters when they change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.values(filters).some(value => value.trim()) || selectedMappingType) {
        handleSearch(0);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, selectedMappingType]);

  const loadMore = () => {
    if (pagination?.has_more) {
      handleSearch(pagination.offset + pagination.limit);
    }
  };

  // Function to load more data for infinite scroll
  const loadMoreData = useCallback(async () => {
    if (!pagination?.has_more || loading) return;
    await loadMore();
  }, [pagination?.has_more, loading, loadMore]);

  // Infinite scroll hook
  const { loadingRef, isLoadingMore, error: scrollError, retry } = useInfiniteScroll({
    fetchMore: loadMoreData,
    hasMore: pagination?.has_more || false,
    isLoading: loading
  });

  const viewSectionDetails = (section, mapping) => {
    setSelectedSection({ ...section, mapping });
    setShowSectionDetails(true);
  };

  const closeSectionDetails = () => {
    setShowSectionDetails(false);
    setSelectedSection(null);
  };

  const downloadMapping = (mapping) => {
    // In a real app, this would trigger a download
    console.log("Downloading mapping:", mapping.title);
    alert(`Downloading: ${mapping.title}\n\nThis would download the complete mapping document in a real application.`);
  };

  // Handle initial load and navigation filter
  useEffect(() => {
    // Check if there's a filter from navigation
    if (location.state?.filter) {
      setSelectedMappingType(location.state.filter);
    }
  }, [location.state?.filter]);

  // Load mappings when mapping type changes
  useEffect(() => {
    handleSearch();
  }, [selectedMappingType]);

  // Update filters when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilters(prev => ({
        ...prev,
        subject: searchQuery.trim()
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        subject: ""
      }));
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Old to New Law Mapping
            </h1>
            <p className="text-lg mb-2" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Understand the transition from old legal frameworks to new ones with detailed section-wise mapping
            </p>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                   style={{ 
                     backgroundColor: selectedMappingType === 'bns_ipc' ? '#FEF3C7' : '#DBEAFE',
                     color: selectedMappingType === 'bns_ipc' ? '#92400E' : '#1E40AF'
                   }}>
                <span className="mr-2">📋</span>
                Currently viewing: {mappingTypes.find(t => t.value === selectedMappingType)?.label}
              </div>
              
              {/* Help Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowHelpTooltip(!showHelpTooltip)}
                  className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: '#E3F2FD' }}
                  onMouseEnter={() => setShowHelpTooltip(true)}
                  onMouseLeave={() => setShowHelpTooltip(false)}
                >
                  <svg className="w-5 h-5" style={{ color: '#1E65AD' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                {/* Help Tooltip */}
                {showHelpTooltip && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border p-6 z-50"
                       style={{ borderColor: '#E5E7EB' }}
                       onMouseEnter={() => setShowHelpTooltip(true)}
                       onMouseLeave={() => setShowHelpTooltip(false)}>
                    <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t transform rotate-45"
                         style={{ borderColor: '#E5E7EB' }}></div>
                    
                    <h3 className="text-lg font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      How to Use This Tool
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: '#10B981', fontFamily: 'Roboto, sans-serif' }}>
                          Search by Section Number
                        </h4>
                        <ul className="text-sm space-y-1" style={{ color: '#6B7280', fontFamily: 'Roboto, sans-serif' }}>
                          <li>• Enter IPC section numbers (e.g., 109, 203, 302)</li>
                          <li>• Enter BNS section numbers (e.g., 48, 224, 302)</li>
                          <li>• View corresponding sections in both acts</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2" style={{ color: '#F59E0B', fontFamily: 'Roboto, sans-serif' }}>
                          Search by Keywords
                        </h4>
                        <ul className="text-sm space-y-1" style={{ color: '#6B7280', fontFamily: 'Roboto, sans-serif' }}>
                          <li>• Enter legal terms (e.g., murder, fraud, abetment)</li>
                          <li>• Search offense types (e.g., domestic violence, rape)</li>
                          <li>• Find sections by common names</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Search Law Mappings
            </h2>
            
            {/* Main Search Bar */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by act name, section number, or keywords..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    style={{ fontFamily: 'Roboto, sans-serif', '--tw-ring-color': '#1E65AD' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ backgroundColor: '#1E65AD', fontFamily: 'Roboto, sans-serif', minHeight: '44px' }}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {/* Mapping Type Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                Law Mapping Type
              </label>
              <select
                value={selectedMappingType}
                onChange={(e) => setSelectedMappingType(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                style={{ fontFamily: 'Roboto, sans-serif', '--tw-ring-color': '#1E65AD' }}
              >
                {mappingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {mappingTypes.find(t => t.value === selectedMappingType)?.description}
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                  Section Number
                </label>
                <input
                  type="text"
                  value={filters.section}
                  onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                  placeholder="e.g., 302, 34(1)"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ fontFamily: 'Roboto, sans-serif', '--tw-ring-color': '#1E65AD' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                  Source Section
                </label>
                <input
                  type="text"
                  value={filters.source_section}
                  onChange={(e) => setFilters(prev => ({ ...prev, source_section: e.target.value }))}
                  placeholder={selectedMappingType === 'bns_ipc' ? 'IPC Section' : 'IEA Section'}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ fontFamily: 'Roboto, sans-serif', '--tw-ring-color': '#1E65AD' }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
              >
                {loading ? "Searching..." : "Apply Filters"}
              </button>
              <button
                onClick={clearFilters}
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 border-2"
                style={{ 
                  color: '#8C969F', 
                  borderColor: '#8C969F', 
                  fontFamily: 'Roboto, sans-serif' 
                }}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                {mappingTypes.find(t => t.value === selectedMappingType)?.label} Mappings
              </h2>
              <div className="text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
                {pagination ? (
                  <span>
                    Showing {mappings.length} of {pagination.total_count} mappings
                  </span>
                ) : (
                  <span>{mappings.length} mappings found</span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <ActSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-2">Error loading mappings</div>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => handleSearch()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : mappings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No mappings found</div>
                <p className="text-gray-400">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mappings.map((mapping) => (
                  <div
                    key={mapping.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => viewSectionDetails(mapping)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      {/* Source Section */}
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            {selectedMappingType === 'bns_ipc' ? 'IPC Section' : 'IEA Section'}
                          </div>
                          <div className="text-2xl font-bold text-red-600 mb-2">
                            {selectedMappingType === 'bns_ipc' ? mapping.ipc_section : mapping.iea_section}
                          </div>
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
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            {selectedMappingType === 'bns_ipc' ? 'BNS Section' : 'BSA Section'}
                          </div>
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {selectedMappingType === 'bns_ipc' ? mapping.bns_section : mapping.bsa_section}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subject and Summary */}
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                        {mapping.subject}
                      </h3>
                      <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {mapping.summary}
                      </p>
                    </div>
                  </div>
                )                )}

                {/* Infinite Scroll Loader */}
                {mappings.length > 0 && (
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
            )}
          </div>
        </div>
      </div>

      {/* Section Details Modal */}
      {showSectionDetails && selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Section Mapping Details
                </h2>
                <button
                  onClick={closeSectionDetails}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg" style={{ color: '#1E65AD' }}>
                    {selectedMappingType === 'bns_ipc' ? 'IPC Section' : 'IEA Section'}
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      {selectedMappingType === 'bns_ipc' ? selectedSection.ipc_section : selectedSection.iea_section}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Act:</strong> {selectedMappingType === 'bns_ipc' ? 'Indian Penal Code, 1860' : 'Indian Evidence Act, 1872'}
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg" style={{ color: '#1E65AD' }}>
                    {selectedMappingType === 'bns_ipc' ? 'BNS Section' : 'BSA Section'}
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {selectedMappingType === 'bns_ipc' ? selectedSection.bns_section : selectedSection.bsa_section}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Act:</strong> {selectedMappingType === 'bns_ipc' ? 'Bharatiya Nyaya Sanhita, 2023' : 'Bharatiya Sakshya Adhiniyam, 2023'}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg" style={{ color: '#1E65AD' }}>Subject</h3>
                <p className="text-gray-800 p-4 bg-gray-50 rounded-lg text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {selectedSection.subject}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg" style={{ color: '#1E65AD' }}>Summary</h3>
                <p className="text-gray-600 p-4 bg-blue-50 rounded-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {selectedSection.summary}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeSectionDetails}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
