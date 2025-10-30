import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/landing/Navbar";
import apiService from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import BookmarkButton from "../../../components/BookmarkButton";

/**
 * MINIMALIST/BRUTALIST DESIGN VARIANT - SUPREME COURT
 * 
 * Same design philosophy as High Court variant
 */

const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  
  /* Styles are inherited from HighCourtJudgments - same design system */
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  if (!document.getElementById('minimalist-sc-styles')) {
    styleSheet.id = 'minimalist-sc-styles';
    document.head.appendChild(styleSheet);
  }
}

export default function SupremeCourtJudgmentsMinimalist() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    title: '',
    cnr: '',
    judge: '',
    petitioner: '',
    respondent: '',
    decisionDateFrom: ''
  });

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
      judge: '',
      petitioner: '',
      respondent: '',
      decisionDateFrom: ''
    });
    setTimeout(() => handleSearch(), 100);
  };

  const applyFilters = () => {
    setNextCursor(null);
    setHasMore(false);
    setJudgments([]);
    handleSearch();
  };

  // Search handler
  const handleSearch = useCallback(async (loadMore = false) => {
    if (isSearching && !loadMore) {
      return;
    }
    
    if (loadMore) {
      setIsSearching(true);
    } else {
      setLoading(true);
      setError("");
    }
    
    try {
      const params = {
        limit: 10
      };

      // Add filters
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.title.trim()) params.title = filters.title.trim();
      if (filters.cnr.trim()) params.cnr = filters.cnr.trim();
      if (filters.judge.trim()) params.judge = filters.judge.trim();
      if (filters.petitioner.trim()) params.petitioner = filters.petitioner.trim();
      if (filters.respondent.trim()) params.respondent = filters.respondent.trim();
      if (filters.decisionDateFrom) params.decision_date_from = filters.decisionDateFrom;

      // Add cursor
      if (loadMore && nextCursor) {
        params.cursor_id = nextCursor.id;
      }

      const data = await apiService.getSupremeCourtJudgements(params);
      
      if (loadMore) {
        setJudgments(prev => [...prev, ...(data.data || [])]);
      } else {
        setJudgments(data.data || []);
      }
      
      setNextCursor(data.next_cursor || null);
      setHasMore(data.pagination_info?.has_more || false);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || "Failed to fetch judgments");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [filters, nextCursor, isSearching]);

  // Auto-apply filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search || filters.title || filters.cnr || filters.judge || filters.petitioner || filters.respondent || filters.decisionDateFrom) {
        applyFilters();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Load initial data
  useEffect(() => {
    handleSearch();
  }, []);

  const viewJudgment = (judgment) => {
    navigate('/view-pdf', { state: { judgment } });
  };

  const loadMore = () => {
    if (hasMore && !isSearching) {
      handleSearch(true);
    }
  };

  const hasActiveFilters = filters.search || filters.title || filters.cnr || filters.judge || filters.petitioner || filters.respondent || filters.decisionDateFrom;

  return (
    <div className="minimalist-container">
      <Navbar />
      
      {/* Hero Section */}
      <div className="minimalist-hero">
        <h1 className="minimalist-hero-title">
          SUPREME COURT<br />JUDGMENTS
        </h1>
        <p className="minimalist-hero-subtitle">
          SEARCH AND ACCESS LEGAL JUDGMENTS FROM THE SUPREME COURT OF INDIA
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
                placeholder="E.G., JUSTICE CHANDRACHUD"
                className="minimalist-input"
              />
            </div>

            <div>
              <label className="minimalist-label">PETITIONER</label>
              <input
                type="text"
                value={filters.petitioner}
                onChange={(e) => handleFilterChange('petitioner', e.target.value)}
                placeholder="E.G., STATE OF MAHARASHTRA"
                className="minimalist-input"
              />
            </div>

            <div>
              <label className="minimalist-label">RESPONDENT</label>
              <input
                type="text"
                value={filters.respondent}
                onChange={(e) => handleFilterChange('respondent', e.target.value)}
                placeholder="E.G., UNION OF INDIA"
                className="minimalist-input"
              />
            </div>

            <div>
              <label className="minimalist-label">CNR NUMBER</label>
              <input
                type="text"
                value={filters.cnr}
                onChange={(e) => handleFilterChange('cnr', e.target.value)}
                placeholder="E.G., SC-123456-2023"
                className="minimalist-input"
              />
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
                {filters.petitioner && (
                  <span className="minimalist-filter-tag">PETITIONER: {filters.petitioner}</span>
                )}
                {filters.respondent && (
                  <span className="minimalist-filter-tag">RESPONDENT: {filters.respondent}</span>
                )}
                {filters.cnr && (
                  <span className="minimalist-filter-tag">CNR: {filters.cnr}</span>
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
                onClick={() => handleSearch(false)}
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
                    {judgment.case_number || `${judgment.petitioner} VS ${judgment.respondent}` || 'UNTITLED CASE'}
                  </h3>
                  {judgment.petitioner && (
                    <div className="minimalist-card-meta">
                      PETITIONER: {judgment.petitioner}
                    </div>
                  )}
                  {judgment.respondent && (
                    <div className="minimalist-card-meta">
                      RESPONDENT: {judgment.respondent}
                    </div>
                  )}
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

