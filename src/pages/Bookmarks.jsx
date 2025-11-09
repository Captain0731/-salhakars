import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { JudgmentSkeleton } from '../components/LoadingComponents';

export default function Bookmarks() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, judgements, acts, mappings

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching user bookmarks...');
      const response = await apiService.getUserBookmarks({
        limit: 1000 // Get all bookmarks
      });
      
      console.log('Bookmarks API response:', response);
      
      if (response.bookmarks) {
        setBookmarks(response.bookmarks);
      } else if (Array.isArray(response)) {
        setBookmarks(response);
      } else {
        setBookmarks([]);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Filter bookmarks by type
  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (filter === 'all') return true;
    if (filter === 'judgements') return bookmark.type === 'judgement';
    if (filter === 'acts') return bookmark.type === 'central_act' || bookmark.type === 'state_act';
    if (filter === 'mappings') return bookmark.type === 'bsa_iea_mapping' || bookmark.type === 'bns_ipc_mapping' || bookmark.type === 'bnss_crpc_mapping';
    return true;
  });

  // Handle bookmark removal
  const handleRemoveBookmark = async (bookmarkId, type, itemId) => {
    try {
      if (type === 'judgement') {
        await apiService.removeJudgementBookmark(itemId);
      } else if (type === 'central_act') {
        await apiService.removeActBookmark('central', itemId);
      } else if (type === 'state_act') {
        await apiService.removeActBookmark('state', itemId);
      } else if (type === 'bsa_iea_mapping') {
        await apiService.removeMappingBookmark('bsa_iea', itemId);
      } else if (type === 'bns_ipc_mapping') {
        await apiService.removeMappingBookmark('bns_ipc', itemId);
      } else if (type === 'bnss_crpc_mapping') {
        await apiService.removeMappingBookmark('bnss_crpc', itemId);
      }
      
      // Remove from local state
      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setError('Failed to remove bookmark. Please try again.');
    }
  };

  // Handle view item - fetch full details for judgments
  const handleViewItem = async (bookmark) => {
    const item = bookmark.item || bookmark;
    
    if (bookmark.type === 'judgement') {
      // For judgments, fetch full details including PDF link
      try {
        setLoading(true);
        const fullJudgment = await apiService.getJudgementById(item.id);
        
        // Navigate with full judgment data including PDF link
        const judgmentId = fullJudgment?.id || fullJudgment?.cnr || item?.id || item?.cnr;
        const url = judgmentId ? `/judgment/${judgmentId}` : '/judgment';
        navigate(url, { state: { judgment: fullJudgment } });
      } catch (err) {
        console.error('Error fetching judgment details:', err);
        setError('Failed to load judgment details. Please try again.');
        // Fallback to navigate with basic data if full fetch fails
        const judgmentId = item?.id || item?.cnr;
        const url = judgmentId ? `/judgment/${judgmentId}` : '/judgment';
        navigate(url, { state: { judgment: item } });
      } finally {
        setLoading(false);
      }
    } else if (bookmark.type === 'central_act') {
      navigate('/central-acts', { state: { highlightId: item.id } });
    } else if (bookmark.type === 'state_act') {
      navigate('/state-acts', { state: { highlightId: item.id } });
    } else if (bookmark.type === 'bsa_iea_mapping' || bookmark.type === 'bnss_crpc_mapping') {
      // For mappings, navigate to law-mapping page with the mapping type
      const mappingType = bookmark.type === 'bsa_iea_mapping' ? 'bsa_iea' : 'bnss_crpc';
      navigate(`/law-mapping?type=${mappingType}`, { state: { highlightId: item.id } });
    } else if (bookmark.type === 'bns_ipc_mapping') {
      navigate(`/law-mapping?type=bns_ipc`, { state: { highlightId: item.id } });
    }
  };

  // Get item title
  const getItemTitle = (bookmark) => {
    const item = bookmark.item || bookmark;
    
    if (bookmark.type === 'judgement') {
      return item.title || item.case_title || item.case_info || 'Untitled Judgment';
    } else if (bookmark.type === 'central_act' || bookmark.type === 'state_act') {
      return item.short_title || item.title || item.act_name || 'Untitled Act';
    } else if (bookmark.type === 'bsa_iea_mapping' || bookmark.type === 'bns_ipc_mapping' || bookmark.type === 'bnss_crpc_mapping') {
      return item.title || item.subject || item.mapping_title || 'Untitled Mapping';
    }
    
    return 'Untitled Item';
  };

  // Get item description
  const getItemDescription = (bookmark) => {
    const item = bookmark.item || bookmark;
    
    if (bookmark.type === 'judgement') {
      // Handle different field names that might exist in the API response
      return item.court_name || item.court || item.judge || item.title || 'Supreme Court Judgment';
    } else if (bookmark.type === 'central_act' || bookmark.type === 'state_act') {
      return item.ministry || item.department || 'Government Act';
    } else if (bookmark.type === 'bsa_iea_mapping' || bookmark.type === 'bns_ipc_mapping' || bookmark.type === 'bnss_crpc_mapping') {
      return item.description || item.summary || 'Legal Mapping';
    }
    
    return 'Bookmarked Item';
  };

  // Get type display name
  const getTypeDisplayName = (type) => {
    switch (type) {
      case 'judgement': return 'Judgment';
      case 'central_act': return 'Central Act';
      case 'state_act': return 'State Act';
      case 'bsa_iea_mapping': return 'BSA-IEA Mapping';
      case 'bns_ipc_mapping': return 'BNS-IPC Mapping';
      case 'bnss_crpc_mapping': return 'BNSS-CrPC Mapping';
      default: return 'Bookmark';
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              My Bookmarks
            </h1>
            <div className="w-20 h-1 mx-auto mb-6" style={{ backgroundColor: '#CF9B63' }}></div>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Access your saved judgments, acts, and legal resources
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Error Display - Moved to top */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {error}
                  </p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Filter Bookmarks
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Bookmarks' },
                { key: 'judgements', label: 'Judgments' },
                { key: 'acts', label: 'Acts' },
                { key: 'mappings', label: 'Mappings' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookmarks List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <JudgmentSkeleton key={index} />
              ))}
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                {filter === 'all' ? 'No Bookmarks Found' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Found`}
              </h3>
              <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {filter === 'all' 
                  ? 'You haven\'t bookmarked any items yet. Start exploring and bookmark items you find useful.'
                  : `You haven\'t bookmarked any ${filter} yet. Try changing the filter or explore more content.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookmarks.map((bookmark) => {
                const item = bookmark.item || bookmark;
                return (
                  <div key={bookmark.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {getTypeDisplayName(bookmark.type)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Bookmarked {new Date(bookmark.created_at || bookmark.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                          {getItemTitle(bookmark)}
                        </h3>
                        
                        <p className="text-gray-600 mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {getItemDescription(bookmark)}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewItem(bookmark)}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            {loading && bookmark.type === 'judgement' ? 'Loading...' : 'View Details'}
                          </button>
                          <button
                            onClick={() => handleRemoveBookmark(bookmark.id, bookmark.type, item.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                            style={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            Remove Bookmark
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary */}
          {!loading && filteredBookmarks.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
