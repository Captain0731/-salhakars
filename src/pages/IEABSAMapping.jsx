import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { ActSkeleton, InfiniteScrollLoader } from "../components/LoadingComponents";
import BookmarkButton from "../components/BookmarkButton";

export default function IEABSAMapping() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [showMappingDetails, setShowMappingDetails] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    subject: "",
    source_section: "",
    target_section: ""
  });

  const handleSearch = async (offset = 0) => {
    setLoading(true);
    setError("");
    
    try {
      // Build API parameters according to documentation
      const apiParams = {
        mapping_type: 'bsa_iea',
        limit: 20,
        offset
      };

      // Add filters only if they have values
      if (filters.subject && filters.subject.trim()) {
        apiParams.subject = filters.subject.trim();
      }
      if (filters.source_section && filters.source_section.trim()) {
        apiParams.source_section = filters.source_section.trim();
      }
      if (filters.target_section && filters.target_section.trim()) {
        apiParams.target_section = filters.target_section.trim();
      }

      const data = await apiService.getLawMappingsWithOffset(offset, 20, apiParams);

      if (offset === 0) {
        setMappings(data.data);
      } else {
        setMappings(prev => [...prev, ...data.data]);
      }

      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || "Failed to fetch IEA-BSA mappings");
      setMappings([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
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
      if (Object.values(filters).some(value => value.trim())) {
        handleSearch(0);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters]);

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

  const viewMappingDetails = (mapping) => {
    setSelectedMapping(mapping);
    setShowMappingDetails(true);
  };

  const closeMappingDetails = () => {
    setShowMappingDetails(false);
    setSelectedMapping(null);
  };

  const downloadMapping = (mapping) => {
    console.log("Downloading mapping:", mapping.subject);
    alert(`Downloading: ${mapping.subject}\n\nThis would download the complete mapping document in a real application.`);
  };

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

  // Load initial mappings
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              IEA ↔ BSA Mapping
            </h1>
            <p className="text-lg mb-2" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Comprehensive mapping between Indian Evidence Act (IEA) and Bharatiya Sakshya Adhiniyam (BSA)
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                 style={{ 
                   backgroundColor: '#FEF3C7',
                   color: '#92400E'
                 }}>
              <span className="mr-2">📋</span>
              Currently viewing: IEA ↔ BSA (Evidence Law)
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Search IEA-BSA Mappings
            </h2>
            
            {/* Main Search Bar */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by section number, subject, or keywords..."
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

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                  IEA Section (Source)
                </label>
                <input
                  type="text"
                  value={filters.source_section}
                  onChange={(e) => setFilters(prev => ({ ...prev, source_section: e.target.value }))}
                  placeholder="e.g., 3, 27"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ fontFamily: 'Roboto, sans-serif', '--tw-ring-color': '#1E65AD' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
                  BSA Section (Target)
                </label>
                <input
                  type="text"
                  value={filters.target_section}
                  onChange={(e) => setFilters(prev => ({ ...prev, target_section: e.target.value }))}
                  placeholder="e.g., 3, 27"
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
                IEA ↔ BSA Mappings
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
                    onClick={() => viewMappingDetails(mapping)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      {/* IEA Section */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">IEA Section</div>
                          <div className="text-2xl font-bold text-purple-600 mb-2">{mapping.iea_section}</div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 transform rotate-90 md:rotate-0">
                          ⇄
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Maps to</div>
                      </div>

                      {/* BSA Section */}
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-1">BSA Section</div>
                          <div className="text-2xl font-bold text-orange-600 mb-2">{mapping.bsa_section}</div>
                        </div>
                      </div>
                    </div>

                    {/* Subject and Summary */}
                    <div className="mt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                            {mapping.subject}
                          </h3>
                          <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {mapping.summary}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <BookmarkButton
                            item={mapping}
                            type="bsa_iea_mapping"
                            size="default"
                            showText={true}
                          />
                        </div>
                      </div>
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

      {/* Mapping Details Modal */}
      {showMappingDetails && selectedMapping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  IEA-BSA Mapping Details
                </h2>
                <button
                  onClick={closeMappingDetails}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg" style={{ color: '#1E65AD' }}>IEA Section</h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{selectedMapping.iea_section}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Act:</strong> Indian Evidence Act, 1872
                  </div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg" style={{ color: '#1E65AD' }}>BSA Section</h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{selectedMapping.bsa_section}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Act:</strong> Bharatiya Sakshya Adhiniyam, 2023
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg" style={{ color: '#1E65AD' }}>Subject</h3>
                <p className="text-gray-800 p-4 bg-gray-50 rounded-lg text-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {selectedMapping.subject}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg" style={{ color: '#1E65AD' }}>Summary</h3>
                <p className="text-gray-600 p-4 bg-blue-50 rounded-lg" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {selectedMapping.summary}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => downloadMapping(selectedMapping)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Download PDF
                </button>
                <button
                  onClick={closeMappingDetails}
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
