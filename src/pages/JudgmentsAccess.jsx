import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return dateStr;
  }
}

function JudgmentsAccess() {
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();
  const observerRef = useRef();
  const loadMoreRef = useRef();
  
  // Filter states
  const [filters, setFilters] = useState({
    court_name: '',
    year: '',
    judge: '',
    cnr: '',
    from_date: '',
    to_date: '',
    limit: 20
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchJudgments = useCallback((cursor = null, append = false) => {
    if (!append) setLoading(true);
    setError(null);
    
    // Build query params
    const params = new URLSearchParams();
    Object.keys(appliedFilters).forEach(key => {
      if (appliedFilters[key]) {
        params.append(key, appliedFilters[key]);
      }
    });
    
    // Add cursor for pagination
    if (cursor) {
      params.append('cursor_decision_date', cursor.decision_date);
      params.append('cursor_id', cursor.id);
    }
    
    const url = `https://9001a55425e2.ngrok-free.app/judgements?${params.toString()}`;
    
    fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch judgments");
        return res.json();
      })
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          if (append) {
            setJudgments(prev => [...prev, ...response.data]);
          } else {
            setJudgments(response.data);
          }
          setNextCursor(response.next_cursor);
          setHasMore(response.pagination_info?.has_more || false);
        } else {
          setJudgments([]);
          setNextCursor(null);
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading judgments:", err);
        setError("Failed to load judgments. Please try again later.");
        setLoading(false);
      });
  }, [appliedFilters]);

  useEffect(() => {
    fetchJudgments();
  }, [appliedFilters, fetchJudgments]);

  // Infinite scroll observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading && nextCursor) {
        fetchJudgments(nextCursor, true);
      }
    }, options);

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef && observerRef.current) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasMore, loading, nextCursor, fetchJudgments]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setJudgments([]);
  };

  const clearFilters = () => {
    setFilters({
      court_name: '',
      year: '',
      judge: '',
      cnr: '',
      from_date: '',
      to_date: '',
      limit: 20
    });
    setAppliedFilters({});
    setJudgments([]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Judgment Access</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Database</p>
          <p className="text-2xl font-bold text-blue-600">16M+</p>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Search & Filter Judgments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Court Name</label>
            <input
              type="text"
              value={filters.court_name}
              onChange={(e) => handleFilterChange('court_name', e.target.value)}
              placeholder="e.g., High Court of Punjab"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              placeholder="e.g., 2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judge Name</label>
            <input
              type="text"
              value={filters.judge}
              onChange={(e) => handleFilterChange('judge', e.target.value)}
              placeholder="e.g., Justice"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => handleFilterChange('from_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => handleFilterChange('to_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CNR Number</label>
            <input
              type="text"
              value={filters.cnr}
              onChange={(e) => handleFilterChange('cnr', e.target.value)}
              placeholder="e.g., PHHC010393012024"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search Judgments
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{judgments.length}</span> results
          {hasMore && <span className="text-blue-600 ml-2">(scroll for more)</span>}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Judgments List */}
      <div className="space-y-4">
        {loading && judgments.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading judgments...</p>
          </div>
        ) : judgments.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">No judgments found. Try adjusting your filters.</p>
          </div>
        ) : (
          judgments.map((judgment, idx) => (
            <div
              key={judgment.cnr || idx}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {judgment.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                {judgment.judge && (
                  <div>
                    <span className="font-medium text-gray-800">Judge:</span>{" "}
                    {judgment.judge}
                  </div>
                )}
                {judgment.court_name && (
                  <div>
                    <span className="font-medium text-gray-800">Court:</span>{" "}
                    {judgment.court_name}
                  </div>
                )}
                {judgment.decision_date && (
                  <div>
                    <span className="font-medium text-gray-800">Decision Date:</span>{" "}
                    {formatDate(judgment.decision_date)}
                  </div>
                )}
                {judgment.date_of_registration && (
                  <div>
                    <span className="font-medium text-gray-800">Registration Date:</span>{" "}
                    {judgment.date_of_registration}
                  </div>
                )}
                {judgment.disposal_nature && (
                  <div>
                    <span className="font-medium text-gray-800">Status:</span>{" "}
                    {judgment.disposal_nature}
                  </div>
                )}
                {judgment.cnr && (
                  <div>
                    <span className="font-medium text-gray-800">CNR:</span>{" "}
                    {judgment.cnr}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/judgment/${judgment.cnr || idx}`, { state: judgment })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>
                {judgment.pdf_link && (
                  <a
                    href={judgment.pdf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      // Ensure HTTP request is sent
                      console.log('Downloading PDF from:', judgment.pdf_link);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    View PDF
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2 text-sm">Loading more judgments...</p>
          </div>
        </div>
      )}
      
      {!hasMore && judgments.length > 0 && (
        <div className="text-center mt-8 py-8 text-gray-500">
          <p className="text-lg font-medium">✓ All available results loaded</p>
          <p className="text-sm mt-1">Showing {judgments.length} judgments from 16M+ database</p>
        </div>
      )}
    </div>
  );
}

export default JudgmentsAccess;
