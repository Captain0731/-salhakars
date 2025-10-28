import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  BookmarkPlus, 
  Folder, 
  FolderPlus, 
  FileText, 
  MoreVertical, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Trash2, 
  Edit3,
  Share2,
  Download,
  Tag,
  Calendar,
  Clock,
  Star,
  StarOff,
  Loader2,
  AlertCircle,
  X,
  BarChart3,
  Upload,
  Download as DownloadIcon
} from 'lucide-react';
import apiService from '../../services/api';
import BookmarkAnalytics from './BookmarkAnalytics';
import BookmarkImportExport from './BookmarkImportExport';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'date', 'type'
  const [filterType, setFilterType] = useState('all'); // 'all', 'judgement', 'central_act', 'state_act', 'bsa_iea_mapping', 'bns_ipc_mapping'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    description: '',
    url: '',
    type: 'judgment',
    tags: [],
    folderId: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    hasMore: false
  });
  
  // Advanced filtering states
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: {
      from: '',
      to: ''
    },
    court: '',
    ministry: '',
    year: '',
    tags: [],
    isFavorite: null // null, true, false
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks', 'analytics', 'import-export'

  // Load bookmarks and folders from API
  useEffect(() => {
    loadBookmarks();
    loadFolders();
  }, []);

  // Reload bookmarks when filters change
  useEffect(() => {
    loadBookmarks();
  }, [filterType, searchQuery, advancedFilters, currentFolder]);

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilterType(value);
    setSelectedItems([]); // Clear selections when filter changes
  };

  const handleAdvancedFilterChange = (filterKey, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setSelectedItems([]); // Clear selections when filter changes
  };

  const handleDateRangeChange = (rangeKey, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [rangeKey]: value
      }
    }));
    setSelectedItems([]);
  };

  const handleTagFilterChange = (tag) => {
    setAdvancedFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
    setSelectedItems([]);
  };

  const clearAllFilters = () => {
    setFilterType('all');
    setSearchQuery('');
    setAdvancedFilters({
      dateRange: { from: '', to: '' },
      court: '',
      ministry: '',
      year: '',
      tags: [],
      isFavorite: null
    });
    setSelectedItems([]);
  };

  const applyFilters = () => {
    loadBookmarks();
  };

  // Load bookmarks from API with filtering
  const loadBookmarks = async (offset = 0, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      // Build filter parameters based on current filters
      const filterParams = {
        limit,
        offset,
        ...(currentFolder && { folder_id: currentFolder.id }),
        ...(filterType !== 'all' && { type: filterType }),
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        ...(advancedFilters.dateRange.from && { date_from: advancedFilters.dateRange.from }),
        ...(advancedFilters.dateRange.to && { date_to: advancedFilters.dateRange.to }),
        ...(advancedFilters.court && { court: advancedFilters.court }),
        ...(advancedFilters.ministry && { ministry: advancedFilters.ministry }),
        ...(advancedFilters.year && { year: advancedFilters.year }),
        ...(advancedFilters.tags.length > 0 && { tags: advancedFilters.tags.join(',') }),
        ...(advancedFilters.isFavorite !== null && { is_favorite: advancedFilters.isFavorite })
      };

      const response = await apiService.getUserBookmarks(filterParams);
      
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
  };

  // Load folders from API
  const loadFolders = async () => {
    try {
      const response = await apiService.getUserFolders();
      setFolders(response.folders || []);
    } catch (err) {
      console.error('Error loading folders:', err);
      // Don't set error for folders as it's not critical
    }
  };

  // Since filtering is now done on the API side, we use the bookmarks directly
  const filteredBookmarks = bookmarks;

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    const itemA = a.item || a;
    const itemB = b.item || b;
    
    switch (sortBy) {
      case 'name':
        return (itemA.title || '').localeCompare(itemB.title || '');
      case 'date':
        return new Date(b.created_at || b.dateAdded) - new Date(a.created_at || a.dateAdded);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'recent':
      default:
        return new Date(b.created_at || b.dateAdded) - new Date(a.created_at || a.dateAdded);
    }
  });

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const response = await apiService.createFolder({
          name: newFolderName.trim(),
          description: `Folder for ${newFolderName.trim()}`
        });
        
        setFolders(prev => [...prev, response.folder]);
        setNewFolderName('');
        setShowCreateFolder(false);
      } catch (err) {
        setError(err.message || 'Failed to create folder');
        console.error('Error creating folder:', err);
      }
    }
  };

  const handleAddBookmark = async () => {
    if (newBookmark.title && newBookmark.url) {
      try {
        const bookmarkData = {
          title: newBookmark.title,
          description: newBookmark.description,
          url: newBookmark.url,
          type: newBookmark.type,
          tags: newBookmark.tags,
          folder_id: newBookmark.folderId
        };
        
        await apiService.addBookmark(bookmarkData);
        
        // Reload bookmarks to show the new one
        await loadBookmarks();
        
        setNewBookmark({
          title: '',
          description: '',
          url: '',
          type: 'judgment',
          tags: [],
          folderId: null
        });
        setShowAddBookmark(false);
      } catch (err) {
        setError(err.message || 'Failed to add bookmark');
        console.error('Error adding bookmark:', err);
      }
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      await apiService.deleteBookmark(bookmarkId);
      
      // Remove from local state
      setBookmarks(prev => prev.filter(item => item.id !== bookmarkId));
      setSelectedItems(prev => prev.filter(id => id !== bookmarkId));
    } catch (err) {
      setError(err.message || 'Failed to delete bookmark');
      console.error('Error deleting bookmark:', err);
    }
  };

  const handleToggleFavorite = async (bookmarkId) => {
    try {
      const bookmark = bookmarks.find(b => b.id === bookmarkId);
      if (bookmark) {
        await apiService.updateBookmark(bookmarkId, {
          is_favorite: !bookmark.is_favorite
        });
        
        // Update local state
        setBookmarks(prev => 
          prev.map(item => 
            item.id === bookmarkId ? { ...item, is_favorite: !item.is_favorite } : item
          )
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to update favorite status');
      console.error('Error updating favorite:', err);
    }
  };

  const handleMoveToFolder = async (bookmarkId, folderId) => {
    try {
      await apiService.updateBookmark(bookmarkId, {
        folder_id: folderId
      });
      
      // Update local state
      setBookmarks(prev => 
        prev.map(item => 
          item.id === bookmarkId ? { ...item, folder_id: folderId } : item
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to move bookmark');
      console.error('Error moving bookmark:', err);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sortedBookmarks.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedBookmarks.map(item => item.id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'judgment':
        return <FileText className="h-8 w-8 text-blue-600" />;
      case 'act':
        return <FileText className="h-8 w-8 text-green-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'judgment':
        return 'bg-blue-100 text-blue-800';
      case 'act':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>My Bookmarks</h1>
          <p className="mt-1" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
            {sortedBookmarks.length} bookmarks • {folders.length} folders
            {(filterType !== 'all' || searchQuery || Object.values(advancedFilters).some(v => 
              v !== null && v !== '' && (typeof v !== 'object' || Object.values(v).some(subV => subV !== ''))
            )) && (
              <span className="ml-2 text-blue-600 font-medium">• Filtered</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddBookmark(true)}
            className="flex items-center px-4 py-2 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Add Bookmark
          </button>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center px-4 py-2 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: '#CF9B63', fontFamily: 'Roboto, sans-serif' }}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookmarks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bookmark className="h-4 w-4 inline mr-2" />
            Bookmarks
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('import-export')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'import-export'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Import/Export
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookmarks' && (
        <>
          {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="date">Date Added</option>
            <option value="type">Type</option>
          </select>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="judgement">Judgements</option>
            <option value="central_act">Central Acts</option>
            <option value="state_act">State Acts</option>
            <option value="bsa_iea_mapping">BSA-IEA Mappings</option>
            <option value="bns_ipc_mapping">BNS-IPC Mappings</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={advancedFilters.dateRange.from}
                  onChange={(e) => handleDateRangeChange('from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="From date"
                />
                <input
                  type="date"
                  value={advancedFilters.dateRange.to}
                  onChange={(e) => handleDateRangeChange('to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="To date"
                />
              </div>
            </div>

            {/* Court Filter (for judgments) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
              <input
                type="text"
                value={advancedFilters.court}
                onChange={(e) => handleAdvancedFilterChange('court', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Supreme Court"
              />
            </div>

            {/* Ministry Filter (for acts) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ministry</label>
              <input
                type="text"
                value={advancedFilters.ministry}
                onChange={(e) => handleAdvancedFilterChange('ministry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Ministry of Law"
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                value={advancedFilters.year}
                onChange={(e) => handleAdvancedFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2024"
                min="1900"
                max="2030"
              />
            </div>

            {/* Favorite Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favorites</label>
              <select
                value={advancedFilters.isFavorite === null ? '' : advancedFilters.isFavorite.toString()}
                onChange={(e) => handleAdvancedFilterChange('isFavorite', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Favorites Only</option>
                <option value="false">Non-Favorites Only</option>
              </select>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Add tag filter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const tag = e.target.value.trim();
                      if (tag && !advancedFilters.tags.includes(tag)) {
                        handleTagFilterChange(tag);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {advancedFilters.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagFilterChange(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filterType !== 'all' || searchQuery || advancedFilters.dateRange.from || advancedFilters.dateRange.to || 
        advancedFilters.court || advancedFilters.ministry || advancedFilters.year || 
        advancedFilters.tags.length > 0 || advancedFilters.isFavorite !== null) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-800">Active Filters:</h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterType !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Type: {filterType.replace('_', ' ')}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
              </span>
            )}
            {advancedFilters.dateRange.from && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                From: {new Date(advancedFilters.dateRange.from).toLocaleDateString()}
              </span>
            )}
            {advancedFilters.dateRange.to && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                To: {new Date(advancedFilters.dateRange.to).toLocaleDateString()}
              </span>
            )}
            {advancedFilters.court && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Court: {advancedFilters.court}
              </span>
            )}
            {advancedFilters.ministry && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Ministry: {advancedFilters.ministry}
              </span>
            )}
            {advancedFilters.year && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Year: {advancedFilters.year}
              </span>
            )}
            {advancedFilters.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Tag: {tag}
              </span>
            ))}
            {advancedFilters.isFavorite !== null && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {advancedFilters.isFavorite ? 'Favorites Only' : 'Non-Favorites Only'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Folders */}
      {!currentFolder && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder)}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <div 
                  className="p-3 rounded-lg mb-2"
                  style={{ backgroundColor: (folder.color || '#1E65AD') + '20' }}
                >
                  <Folder 
                    className="h-8 w-8" 
                    style={{ color: folder.color || '#1E65AD' }}
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm text-center group-hover:text-blue-700">
                  {folder.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {folder.item_count || 0} items
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Folder Header */}
      {currentFolder && (
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentFolder(null)}
              className="mr-3 p-1 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <div 
              className="p-2 rounded-lg mr-3"
              style={{ backgroundColor: (currentFolder.color || '#1E65AD') + '20' }}
            >
              <Folder 
                className="h-6 w-6" 
                style={{ color: currentFolder.color || '#1E65AD' }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentFolder.name}</h2>
              <p className="text-sm text-gray-500">
                {sortedBookmarks.length} bookmarks
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Grid/List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading && bookmarks.length === 0 ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading bookmarks...</h3>
            <p className="text-gray-500">Please wait while we fetch your bookmarks</p>
          </div>
        ) : sortedBookmarks.length === 0 ? (
          <div className="p-12 text-center">
            <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding some bookmarks'}
            </p>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="p-4 bg-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Move to Folder
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedBookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className={`relative border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        selectedItems.includes(bookmark.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleSelectItem(bookmark.id)}
                    >
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(bookmark.id)}
                        onChange={() => handleSelectItem(bookmark.id)}
                        className="absolute top-2 left-2"
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Favorite Star */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(bookmark.id);
                        }}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
                      >
                        {bookmark.is_favorite ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </button>

                      {/* File Icon */}
                      <div className="flex justify-center mb-3">
                        {getFileIcon(bookmark.type)}
                      </div>

                      {/* Bookmark Info */}
                      <div className="text-center">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {(bookmark.item || bookmark).title || 'Untitled'}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {(bookmark.item || bookmark).description || ''}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap justify-center gap-1 mb-2">
                          {(bookmark.tags || []).slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {(bookmark.tags || []).length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{(bookmark.tags || []).length - 2}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{(bookmark.item || bookmark).source || 'Unknown'}</span>
                          <span>{formatDate(bookmark.created_at || bookmark.dateAdded)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute bottom-2 right-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const url = (bookmark.item || bookmark).url || bookmark.url;
                              if (url) {
                                window.open(url, '_blank');
                              }
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="View"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBookmark(bookmark.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === sortedBookmarks.length && sortedBookmarks.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookmark
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedBookmarks.map((bookmark) => (
                      <tr
                        key={bookmark.id}
                        className={`hover:bg-gray-50 ${selectedItems.includes(bookmark.id) ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(bookmark.id)}
                            onChange={() => handleSelectItem(bookmark.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getFileIcon(bookmark.type)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {(bookmark.item || bookmark).title || 'Untitled'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(bookmark.item || bookmark).description || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(bookmark.type)}`}>
                            {bookmark.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {(bookmark.tags || []).slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {(bookmark.tags || []).length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{(bookmark.tags || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(bookmark.created_at || bookmark.dateAdded)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleFavorite(bookmark.id)}
                              className={bookmark.is_favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
                              title={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                const url = (bookmark.item || bookmark).url || bookmark.url;
                                if (url) {
                                  window.open(url, '_blank');
                                }
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBookmark(bookmark.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {/* Load More Button */}
        {pagination.hasMore && !loading && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => loadBookmarks(pagination.offset + pagination.limit)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More Bookmarks
            </button>
          </div>
        )}
        
        {/* Loading More Indicator */}
        {loading && bookmarks.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <Loader2 className="h-5 w-5 text-blue-600 mx-auto animate-spin" />
            <p className="text-sm text-gray-500 mt-2">Loading more bookmarks...</p>
          </div>
        )}
      </div>
        </>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bookmark Modal */}
      {showAddBookmark && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Bookmark</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bookmark title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newBookmark.description}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter bookmark description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newBookmark.type}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="judgment">Judgment</option>
                  <option value="act">Act</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newBookmark.tags.join(', ')}
                  onChange={(e) => setNewBookmark(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Folder
                </label>
                <select
                  value={newBookmark.folderId || ''}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, folderId: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddBookmark(false);
                  setNewBookmark({
                    title: '',
                    description: '',
                    url: '',
                    type: 'judgment',
                    tags: [],
                    folderId: null
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBookmark}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Bookmark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'analytics' && (
        <BookmarkAnalytics />
      )}

      {activeTab === 'import-export' && (
        <BookmarkImportExport onImportComplete={loadBookmarks} />
      )}
    </div>
  );
};

export default Bookmarks;
