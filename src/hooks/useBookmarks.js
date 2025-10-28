import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

/**
 * Custom hook for managing bookmarks using the documented API structure
 * Follows the Bookmark API Documentation endpoints
 */
const useBookmarks = (userToken) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    hasMore: false
  });

  // Load bookmarks from API
  const loadBookmarks = useCallback(async (offset = 0, limit = 50) => {
    if (!userToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserBookmarks({
        limit,
        offset
      });
      
      if (offset === 0) {
        setBookmarks(response.bookmarks || []);
      } else {
        setBookmarks(prev => [...prev, ...(response.bookmarks || [])]);
      }
      
      setPagination({
        limit: response.pagination?.limit || limit,
        offset: response.pagination?.offset || offset,
        hasMore: response.pagination?.has_more || false
      });
    } catch (err) {
      setError(err.message || 'Failed to load bookmarks');
      console.error('Error loading bookmarks:', err);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Bookmark a judgement
  const bookmarkJudgement = useCallback(async (judgementId) => {
    try {
      await apiService.bookmarkJudgement(judgementId);
      // Reload bookmarks to show the new one
      await loadBookmarks();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to bookmark judgement');
      console.error('Error bookmarking judgement:', err);
      return false;
    }
  }, [loadBookmarks]);

  // Remove judgement bookmark
  const removeJudgementBookmark = useCallback(async (judgementId) => {
    try {
      await apiService.removeJudgementBookmark(judgementId);
      // Remove from local state
      setBookmarks(prev => prev.filter(b => !(b.type === 'judgement' && b.item.id === judgementId)));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to remove judgement bookmark');
      console.error('Error removing judgement bookmark:', err);
      return false;
    }
  }, []);

  // Bookmark an act (central or state)
  const bookmarkAct = useCallback(async (actType, actId) => {
    try {
      await apiService.bookmarkAct(actType, actId);
      // Reload bookmarks to show the new one
      await loadBookmarks();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to bookmark act');
      console.error('Error bookmarking act:', err);
      return false;
    }
  }, [loadBookmarks]);

  // Remove act bookmark
  const removeActBookmark = useCallback(async (actType, actId) => {
    try {
      await apiService.removeActBookmark(actType, actId);
      // Remove from local state
      setBookmarks(prev => prev.filter(b => !(b.type === `${actType}_act` && b.item.id === actId)));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to remove act bookmark');
      console.error('Error removing act bookmark:', err);
      return false;
    }
  }, []);

  // Bookmark a mapping (BSA-IEA or BNS-IPC)
  const bookmarkMapping = useCallback(async (mappingType, mappingId) => {
    try {
      await apiService.bookmarkMapping(mappingType, mappingId);
      // Reload bookmarks to show the new one
      await loadBookmarks();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to bookmark mapping');
      console.error('Error bookmarking mapping:', err);
      return false;
    }
  }, [loadBookmarks]);

  // Remove mapping bookmark
  const removeMappingBookmark = useCallback(async (mappingType, mappingId) => {
    try {
      await apiService.removeMappingBookmark(mappingType, mappingId);
      // Remove from local state
      setBookmarks(prev => prev.filter(b => !(b.type === `${mappingType}_mapping` && b.item.id === mappingId)));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to remove mapping bookmark');
      console.error('Error removing mapping bookmark:', err);
      return false;
    }
  }, []);

  // Generic toggle bookmark function
  const toggleBookmark = useCallback(async (type, id, actType = null, mappingType = null) => {
    // Check if already bookmarked
    const existingBookmark = bookmarks.find(b =>
      b.type === type && b.item.id === id
    );

    if (existingBookmark) {
      // Remove bookmark
      switch (type) {
        case 'judgement':
          return await removeJudgementBookmark(id);
        case 'central_act':
          return await removeActBookmark('central', id);
        case 'state_act':
          return await removeActBookmark('state', id);
        case 'bsa_iea_mapping':
          return await removeMappingBookmark('bsa_iea', id);
        case 'bns_ipc_mapping':
          return await removeMappingBookmark('bns_ipc', id);
        default:
          setError(`Unsupported bookmark type: ${type}`);
          return false;
      }
    } else {
      // Add bookmark
      switch (type) {
        case 'judgement':
          return await bookmarkJudgement(id);
        case 'central_act':
          return await bookmarkAct('central', id);
        case 'state_act':
          return await bookmarkAct('state', id);
        case 'bsa_iea_mapping':
          return await bookmarkMapping('bsa_iea', id);
        case 'bns_ipc_mapping':
          return await bookmarkMapping('bns_ipc', id);
        default:
          setError(`Unsupported bookmark type: ${type}`);
          return false;
      }
    }
  }, [bookmarks, bookmarkJudgement, removeJudgementBookmark, bookmarkAct, removeActBookmark, bookmarkMapping, removeMappingBookmark]);

  // Check if an item is bookmarked
  const isBookmarked = useCallback((type, id) => {
    return bookmarks.some(b => b.type === type && b.item.id === id);
  }, [bookmarks]);

  // Get bookmarks by type
  const getBookmarksByType = useCallback((type) => {
    return bookmarks.filter(b => b.type === type);
  }, [bookmarks]);

  // Search bookmarks
  const searchBookmarks = useCallback((query) => {
    if (!query.trim()) return bookmarks;
    
    const lowercaseQuery = query.toLowerCase();
    return bookmarks.filter(bookmark => {
      const item = bookmark.item || bookmark;
      return (
        (item.title || '').toLowerCase().includes(lowercaseQuery) ||
        (item.description || '').toLowerCase().includes(lowercaseQuery) ||
        (bookmark.tags || []).some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    });
  }, [bookmarks]);

  // Load more bookmarks (pagination)
  const loadMoreBookmarks = useCallback(() => {
    if (pagination.hasMore && !loading) {
      loadBookmarks(pagination.offset + pagination.limit);
    }
  }, [pagination, loading, loadBookmarks]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load bookmarks on mount and when userToken changes
  useEffect(() => {
    if (userToken) {
      loadBookmarks();
    } else {
      setBookmarks([]);
      setPagination({
        limit: 50,
        offset: 0,
        hasMore: false
      });
    }
  }, [userToken, loadBookmarks]);

  return {
    // State
    bookmarks,
    loading,
    error,
    pagination,
    
    // Actions
    loadBookmarks,
    loadMoreBookmarks,
    toggleBookmark,
    bookmarkJudgement,
    removeJudgementBookmark,
    bookmarkAct,
    removeActBookmark,
    bookmarkMapping,
    removeMappingBookmark,
    
    // Utilities
    isBookmarked,
    getBookmarksByType,
    searchBookmarks,
    clearError
  };
};

export default useBookmarks;
