import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/landing/Navbar";
import apiService from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import BookmarkButton from "../../../components/BookmarkButton";

/**
 * MINIMALIST/BRUTALIST DESIGN VARIANT
 * 
 * Design Philosophy:
 * - Swiss Design meets Brutalism
 * - Stark black & white with red accents
 * - Monospaced typography for technical precision
 * - Maximum whitespace, zero decorations
 * - Bold hierarchy through size and weight only
 */

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .minimalist-container * {
    box-sizing: border-box;
  }

  .minimalist-container {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #FFFFFF;
    color: #000000;
    min-height: 100vh;
  }

  .minimalist-mono {
    font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
  }

  .minimalist-hero {
    background: #000000;
    color: #FFFFFF;
    padding: 96px 24px;
    text-align: center;
    border-bottom: 4px solid #000000;
  }

  .minimalist-hero-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 64px;
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1.1;
    margin: 0 0 24px 0;
    text-transform: uppercase;
  }

  .minimalist-hero-subtitle {
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.5px;
    opacity: 0.8;
    max-width: 600px;
    margin: 0 auto;
  }

  .minimalist-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 24px;
  }

  .minimalist-section-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 48px 0;
    text-transform: uppercase;
    letter-spacing: -1px;
    border-bottom: 4px solid #000000;
    padding-bottom: 16px;
  }

  .minimalist-search-box {
    background: #FFFFFF;
    border: 3px solid #000000;
    padding: 24px;
    margin-bottom: 48px;
  }

  .minimalist-input {
    width: 100%;
    font-size: 18px;
    font-family: 'Inter', sans-serif;
    padding: 16px 24px;
    border: 2px solid #000000;
    background: #FFFFFF;
    color: #000000;
    outline: none;
    transition: none;
  }

  .minimalist-input:focus {
    border-color: #FF0000;
    box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
  }

  .minimalist-input::placeholder {
    color: #666666;
  }

  .minimalist-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
  }

  .minimalist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .minimalist-button {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 16px 32px;
    border: 3px solid #000000;
    background: #000000;
    color: #FFFFFF;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .minimalist-button:hover:not(:disabled) {
    background: #FF0000;
    border-color: #FF0000;
    transform: translate(2px, 2px);
  }

  .minimalist-button:active:not(:disabled) {
    transform: translate(0, 0);
  }

  .minimalist-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .minimalist-button-secondary {
    background: #FFFFFF;
    color: #000000;
  }

  .minimalist-button-secondary:hover:not(:disabled) {
    background: #000000;
    color: #FFFFFF;
    border-color: #000000;
  }

  .minimalist-filter-tag {
    display: inline-block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    padding: 8px 16px;
    background: #000000;
    color: #FFFFFF;
    margin-right: 8px;
    margin-bottom: 8px;
    border: 2px solid #000000;
  }

  .minimalist-card {
    background: #FFFFFF;
    border: 3px solid #000000;
    padding: 32px;
    margin-bottom: 24px;
    transition: transform 0.1s ease;
  }

  .minimalist-card:hover {
    transform: translate(4px, 4px);
    box-shadow: -4px -4px 0 #000000;
  }

  .minimalist-card-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 16px 0;
    line-height: 1.3;
  }

  .minimalist-card-meta {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #666666;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .minimalist-card-text {
    font-size: 16px;
    line-height: 1.6;
    color: #000000;
    margin: 16px 0;
  }

  .minimalist-card-actions {
    display: flex;
    gap: 16px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 2px solid #E0E0E0;
  }

  .minimalist-loading {
    text-align: center;
    padding: 96px 24px;
  }

  .minimalist-loading-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .minimalist-spinner {
    width: 64px;
    height: 64px;
    border: 4px solid #E0E0E0;
    border-top-color: #000000;
    border-radius: 0;
    margin: 0 auto 24px;
    animation: minimalist-spin 0.8s linear infinite;
  }

  @keyframes minimalist-spin {
    to { transform: rotate(360deg); }
  }

  .minimalist-error {
    background: #FF0000;
    color: #FFFFFF;
    padding: 24px;
    margin-bottom: 32px;
    border: 3px solid #000000;
  }

  .minimalist-error-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .minimalist-empty {
    text-align: center;
    padding: 96px 24px;
    border: 3px solid #000000;
  }

  .minimalist-empty-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .minimalist-load-more {
    text-align: center;
    margin: 48px 0;
  }

  .minimalist-stat {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
    color: #666666;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    .minimalist-hero-title {
      font-size: 36px;
    }
    
    .minimalist-section {
      padding: 32px 16px;
    }
    
    .minimalist-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  if (!document.getElementById('minimalist-styles')) {
    styleSheet.id = 'minimalist-styles';
    document.head.appendChild(styleSheet);
  }
}

export default function HighCourtJudgmentsMinimalist() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isMountedRef = useRef(true);

  // State
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const nextCursorRef = useRef(null);
  const fetchJudgmentsRef = useRef(null);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    title: '',
    cnr: '',
    highCourt: '',
    judge: '',
    decisionDateFrom: ''
  });

  const pageSize = 10;

  // Fetch judgments
  const fetchJudgments = useCallback(async (isLoadMore = false) => {
    if (!isMountedRef.current) return;
    
    try {
      if (isLoadMore) {
        setIsSearching(true);
      } else {
        setLoading(true);
        setError(null);
      }
      
      const currentNextCursor = nextCursorRef.current;
      
      const params = {
        limit: pageSize,
        ...filters
      };

      if (isLoadMore && currentNextCursor) {
        params.cursor_decision_date = currentNextCursor.decision_date;
        params.cursor_id = currentNextCursor.id;
      }

      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const data = await apiService.getJudgements(params);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response');
      }
      
      if (!Array.isArray(data.data)) {
        data.data = [];
      }
      
      if (!isMountedRef.current) return;
      
      const newJudgments = Array.isArray(data.data) ? data.data : [];
      const paginationInfo = data.pagination_info || {};
      
      if (isLoadMore) {
        setJudgments(prev => [...prev, ...newJudgments]);
      } else {
        setJudgments(newJudgments);
      }
      
      setNextCursor(data.next_cursor || null);
      setHasMore(paginationInfo.has_more || false);
      
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error('Error fetching judgments:', error);
      setError(error.message || 'Failed to fetch judgments');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setIsSearching(false);
      }
    }
  }, [filters, pageSize]);

  // Filter handlers
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
      highCourt: '',
      judge: '',
      decisionDateFrom: ''
    });
    
    setJudgments([]);
    setHasMore(true);
    setNextCursor(null);
    
    fetchJudgments(false);
  };

  const applyFilters = () => {
    setJudgments([]);
    setHasMore(true);
    setNextCursor(null);
    fetchJudgments(false);
  };

  // Sync refs
  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  useEffect(() => {
    fetchJudgmentsRef.current = fetchJudgments;
  }, [fetchJudgments]);

  // Auto-apply filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const hasActiveFilters = filters.search || filters.title || filters.cnr || filters.highCourt || filters.judge || filters.decisionDateFrom;
      
      if (hasActiveFilters) {
        setJudgments([]);
        setHasMore(true);
        setNextCursor(null);
        fetchJudgments(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.title, filters.cnr, filters.highCourt, filters.judge, filters.decisionDateFrom, fetchJudgments]);

  // Load initial data
  useEffect(() => {
    fetchJudgments(false);
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const viewJudgment = (judgment) => {
    navigate('/view-pdf', { state: { judgment } });
  };

  const loadMore = () => {
    if (hasMore && !isSearching) {
      fetchJudgments(true);
    }
  };

  const hasActiveFilters = filters.search || filters.title || filters.cnr || filters.highCourt || filters.judge || filters.decisionDateFrom;

  return (
    <div className="minimalist-container">
      <Navbar />
      
      {/* Hero Section */}
      <div className="minimalist-hero">
        <h1 className="minimalist-hero-title">
          HIGH COURT<br />JUDGMENTS
        </h1>
        <p className="minimalist-hero-subtitle">
          SEARCH AND ACCESS LEGAL JUDGMENTS FROM HIGH COURTS ACROSS INDIA
        </p>
      </div>

      {/* Main Content */}
      <div className="minimalist-section">
        
        {/* Search Section */}
        <div className="minimalist-search-box">
          <h2 className="minimalist-section-title">SEARCH PARAMETERS</h2>
          
          {/* Primary Search */}
          <div style={{ marginBottom: '32px' }}>
            <label className="minimalist-label">PRIMARY SEARCH</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="ENTER KEYWORDS, CASE TITLE, OR SEARCH TERMS..."
              className="minimalist-input"
            />
          </div>

          {/* Filters Grid */}
          <div className="minimalist-grid">
            <div>
              <label className="minimalist-label">CASE TITLE</label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                placeholder="E.G., STATE VS JOHN DOE"
                className="minimalist-input"
              />
            </div>

            <div>
              <label className="minimalist-label">JUDGE NAME</label>
              <input
                type="text"
                value={filters.judge}
                onChange={(e) => handleFilterChange('judge', e.target.value)}
                placeholder="E.G., JUSTICE SINGH"
                className="minimalist-input"
              />
            </div>

            <div>
              <label className="minimalist-label">CNR NUMBER</label>
              <input
                type="text"
                value={filters.cnr}
                onChange={(e) => handleFilterChange('cnr', e.target.value)}
                placeholder="E.G., HPHC010019512005"
                className="minimalist-input"
              />
            </div>

            <div>
              <label className="minimalist-label">HIGH COURT</label>
              <select
                value={filters.highCourt}
                onChange={(e) => handleFilterChange('highCourt', e.target.value)}
                className="minimalist-input"
              >
                <option value="">ALL COURTS</option>
                <option value="Delhi High Court">DELHI HIGH COURT</option>
                <option value="Bombay High Court">BOMBAY HIGH COURT</option>
                <option value="Calcutta High Court">CALCUTTA HIGH COURT</option>
                <option value="Madras High Court">MADRAS HIGH COURT</option>
              </select>
            </div>

            <div>
              <label className="minimalist-label">DECISION DATE FROM</label>
              <input
                type="date"
                value={filters.decisionDateFrom}
                onChange={(e) => handleFilterChange('decisionDateFrom', e.target.value)}
                className="minimalist-input"
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button
              onClick={applyFilters}
              disabled={loading}
              className="minimalist-button"
            >
              APPLY FILTERS
            </button>
            
            <button
              onClick={clearFilters}
              disabled={loading}
              className="minimalist-button minimalist-button-secondary"
            >
              CLEAR ALL
            </button>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div style={{ marginTop: '32px' }}>
              <label className="minimalist-label">ACTIVE FILTERS</label>
              <div>
                {filters.search && (
                  <span className="minimalist-filter-tag">SEARCH: {filters.search}</span>
                )}
                {filters.title && (
                  <span className="minimalist-filter-tag">TITLE: {filters.title}</span>
                )}
                {filters.judge && (
                  <span className="minimalist-filter-tag">JUDGE: {filters.judge}</span>
                )}
                {filters.cnr && (
                  <span className="minimalist-filter-tag">CNR: {filters.cnr}</span>
                )}
                {filters.highCourt && (
                  <span className="minimalist-filter-tag">COURT: {filters.highCourt}</span>
                )}
                {filters.decisionDateFrom && (
                  <span className="minimalist-filter-tag">FROM: {filters.decisionDateFrom}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          <h2 className="minimalist-section-title">
            {hasActiveFilters ? 'SEARCH RESULTS' : 'LATEST JUDGMENTS'}
          </h2>

          {/* Stats */}
          <div className="minimalist-stat">
            SHOWING {judgments.length} RESULTS {hasMore && '(MORE AVAILABLE)'}
          </div>

          {/* Error */}
          {error && (
            <div className="minimalist-error">
              <div className="minimalist-error-title">ERROR</div>
              <div>{error}</div>
              <button
                onClick={() => fetchJudgments(false)}
                className="minimalist-button"
                style={{ marginTop: '16px' }}
              >
                RETRY
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="minimalist-loading">
              <div className="minimalist-spinner"></div>
              <div className="minimalist-loading-text">LOADING...</div>
            </div>
          ) : judgments.length === 0 && !error ? (
            <div className="minimalist-empty">
              <div className="minimalist-empty-title">NO RESULTS</div>
              <p>No judgments found matching your criteria. Try different filters.</p>
            </div>
          ) : (
            <div>
              {judgments.map((judgment, index) => (
                <div key={`${judgment.id}-${index}`} className="minimalist-card">
                  <div className="minimalist-card-meta">
                    CASE #{judgment.id} | {judgment.decision_date || 'NO DATE'}
                  </div>
                  <h3 className="minimalist-card-title">
                    {judgment.case_number || judgment.petitioner || 'UNTITLED CASE'}
                  </h3>
                  <div className="minimalist-card-meta">
                    {judgment.court_name || 'COURT NOT SPECIFIED'}
                  </div>
                  {judgment.judge && (
                    <div className="minimalist-card-meta">
                      JUDGE: {judgment.judge}
                    </div>
                  )}
                  {judgment.cnr && (
                    <div className="minimalist-card-meta">
                      CNR: {judgment.cnr}
                    </div>
                  )}
                  {judgment.summary && (
                    <div className="minimalist-card-text">
                      {judgment.summary}
                    </div>
                  )}
                  <div className="minimalist-card-actions">
                    <button
                      onClick={() => viewJudgment(judgment)}
                      className="minimalist-button"
                    >
                      VIEW JUDGMENT
                    </button>
                    {isAuthenticated && (
                      <BookmarkButton
                        itemId={judgment.id}
                        itemType="judgement"
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="minimalist-load-more">
                  <button
                    onClick={loadMore}
                    disabled={isSearching}
                    className="minimalist-button"
                  >
                    {isSearching ? 'LOADING...' : 'LOAD MORE'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

