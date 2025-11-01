import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Star, StarOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import apiService from '../services/api';

/**
 * Perfect Bookmark Button Component
 * Handles bookmarking for different content types with real-time status checking
 */
const BookmarkButton = ({ 
  item, 
  type, 
  actType = null, 
  mappingType = null, 
  size = 'default',
  showText = true,
  onBookmarkChange = null,
  autoCheckStatus = true,
  showNotifications = true,
  className = ''
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [bookmarkId, setBookmarkId] = useState(null);

  // Check bookmark status on mount
  useEffect(() => {
    if (autoCheckStatus && item?.id) {
      checkBookmarkStatus();
    }
  }, [item?.id, type]);

  const checkBookmarkStatus = async () => {
    if (!item?.id) return;
    
    setIsCheckingStatus(true);
    try {
      // Get user's bookmarks and check if this item is bookmarked
      const response = await apiService.getUserBookmarks({
        limit: 1000, // Get all bookmarks to check status
        type: type
      });
      
      const existingBookmark = response.bookmarks?.find(bookmark => {
        const bookmarkItem = bookmark.item || bookmark;
        return bookmarkItem.id === item.id && bookmark.type === type;
      });
      
      if (existingBookmark) {
        setIsBookmarked(true);
        setBookmarkId(existingBookmark.id);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }
    } catch (err) {
      console.error('Error checking bookmark status:', err);
      // Don't show error for status check, just assume not bookmarked
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const showNotificationMessage = (message, type = 'success') => {
    if (!showNotifications) return;
    
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBookmarkToggle = async () => {
    if (isLoading || !item?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let success = false;
      let message = '';
      
      if (isBookmarked) {
        // Remove bookmark
        switch (type) {
          case 'judgement':
            await apiService.removeJudgementBookmark(item.id);
            message = 'Judgment removed from bookmarks';
            break;
          case 'central_act':
            await apiService.removeActBookmark('central', item.id);
            message = 'Central act removed from bookmarks';
            break;
          case 'state_act':
            await apiService.removeActBookmark('state', item.id);
            message = 'State act removed from bookmarks';
            break;
          case 'bsa_iea_mapping':
            await apiService.removeMappingBookmark('bsa_iea', item.id);
            message = 'BSA-IEA mapping removed from bookmarks';
            break;
          case 'bns_ipc_mapping':
            await apiService.removeMappingBookmark('bns_ipc', item.id);
            message = 'BNS-IPC mapping removed from bookmarks';
            break;
          case 'bnss_crpc_mapping':
            await apiService.removeMappingBookmark('bnss_crpc', item.id);
            message = 'BNSS-CrPC mapping removed from bookmarks';
            break;
          default:
            throw new Error(`Unsupported bookmark type: ${type}`);
        }
        
        setIsBookmarked(false);
        setBookmarkId(null);
        success = true;
        
      } else {
        // Add bookmark
        let response;
        switch (type) {
          case 'judgement':
            response = await apiService.bookmarkJudgement(item.id);
            message = 'Judgment added to bookmarks';
            break;
          case 'central_act':
            response = await apiService.bookmarkAct('central', item.id);
            message = 'Central act added to bookmarks';
            break;
          case 'state_act':
            response = await apiService.bookmarkAct('state', item.id);
            message = 'State act added to bookmarks';
            break;
          case 'bsa_iea_mapping':
            response = await apiService.bookmarkMapping('bsa_iea', item.id);
            message = 'BSA-IEA mapping added to bookmarks';
            break;
          case 'bns_ipc_mapping':
            response = await apiService.bookmarkMapping('bns_ipc', item.id);
            message = 'BNS-IPC mapping added to bookmarks';
            break;
          case 'bnss_crpc_mapping':
            response = await apiService.bookmarkMapping('bnss_crpc', item.id);
            message = 'BNSS-CrPC mapping added to bookmarks';
            break;
          default:
            throw new Error(`Unsupported bookmark type: ${type}`);
        }
        
        setIsBookmarked(true);
        if (response?.bookmark?.id) {
          setBookmarkId(response.bookmark.id);
        }
        success = true;
      }
      
      if (success) {
        showNotificationMessage(message, 'success');
        if (onBookmarkChange) {
          onBookmarkChange(isBookmarked, item.id, bookmarkId);
        }
      }
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to update bookmark';
      setError(errorMessage);
      showNotificationMessage(errorMessage, 'error');
      console.error('Bookmark error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "flex items-center justify-center transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    
    if (size === 'small') {
      return `${baseStyles} px-3 py-1.5 text-sm`;
    } else if (size === 'large') {
      return `${baseStyles} px-6 py-3 text-lg`;
    } else {
      return `${baseStyles} px-4 py-2 text-sm`;
    }
  };

  const getIconSize = () => {
    if (size === 'small') return 'h-4 w-4';
    if (size === 'large') return 'h-6 w-6';
    return 'h-5 w-5';
  };

  const getButtonContent = () => {
    if (isCheckingStatus) {
      return (
        <>
          <Loader2 className={`${getIconSize()} animate-spin mr-2`} />
          {showText && 'Checking...'}
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          <Loader2 className={`${getIconSize()} animate-spin mr-2`} />
          {showText && 'Processing...'}
        </>
      );
    }

    if (isBookmarked) {
      return (
        <>
          <BookmarkCheck className={`${getIconSize()} mr-2`} />
          {showText && 'Bookmarked'}
        </>
      );
    }

    return (
      <>
        <Bookmark className={`${getIconSize()} mr-2`} />
        {showText && 'Bookmark'}
      </>
    );
  };

  const getButtonColors = () => {
    if (isBookmarked) {
      return 'bg-green-600 text-white hover:bg-green-700 border-green-600';
    }
    return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleBookmarkToggle}
        disabled={isLoading || isCheckingStatus}
        className={`${getButtonStyles()} ${getButtonColors()} w-full`}
        title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {getButtonContent()}
      </button>
      
      {/* Error Tooltip */}
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700 whitespace-nowrap z-10 shadow-lg">
          <div className="flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        </div>
      )}
      
      {/* Success Notification */}
      {notification && notification.type === 'success' && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-green-100 border border-green-300 rounded text-xs text-green-700 whitespace-nowrap z-10 shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            {notification.message}
          </div>
        </div>
      )}
      
      {/* Error Notification */}
      {notification && notification.type === 'error' && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700 whitespace-nowrap z-10 shadow-lg">
          <div className="flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Compact Bookmark Icon Component
 * Just shows the bookmark icon without text - uses the same logic as BookmarkButton
 */
export const BookmarkIcon = ({ 
  item, 
  type, 
  actType = null, 
  mappingType = null, 
  onBookmarkChange = null,
  autoCheckStatus = true,
  showNotifications = false
}) => {
  return (
    <BookmarkButton
      item={item}
      type={type}
      actType={actType}
      mappingType={mappingType}
      size="small"
      showText={false}
      onBookmarkChange={onBookmarkChange}
      autoCheckStatus={autoCheckStatus}
      showNotifications={showNotifications}
    />
  );
};

export default BookmarkButton;
