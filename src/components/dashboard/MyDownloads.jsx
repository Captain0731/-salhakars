import React, { useState, useEffect } from 'react';
import { 
  Download, 
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
  Archive,
  Calendar,
  Clock,
  HardDrive
} from 'lucide-react';

const MyDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [folders, setFolders] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'size', 'type'
  const [filterType, setFilterType] = useState('all'); // 'all', 'judgments', 'acts', 'other'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolder, setCurrentFolder] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockFolders = [
      { id: 1, name: 'Supreme Court', color: '#1E65AD', itemCount: 8 },
      { id: 2, name: 'High Court', color: '#CF9B63', itemCount: 12 },
      { id: 3, name: 'Central Acts', color: '#8C969F', itemCount: 15 },
      { id: 4, name: 'State Acts', color: '#10B981', itemCount: 6 },
      { id: 5, name: 'Research', color: '#F59E0B', itemCount: 3 },
    ];

    const mockDownloads = [
      {
        id: 1,
        name: 'Supreme Court Judgment - Contract Law 2023',
        type: 'judgment',
        size: '2.4 MB',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        source: 'Supreme Court of India',
        url: '/api/judgments/supreme-court/123.pdf',
        folderId: 1,
        thumbnail: '/api/thumbnails/judgment-123.jpg'
      },
      {
        id: 2,
        name: 'IPC Act 2023 - Complete Text',
        type: 'act',
        size: '1.8 MB',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        source: 'Ministry of Law',
        url: '/api/acts/central/ipc-2023.pdf',
        folderId: 3,
        thumbnail: '/api/thumbnails/act-ipc.jpg'
      },
      {
        id: 3,
        name: 'High Court Judgment - Criminal Appeal',
        type: 'judgment',
        size: '3.2 MB',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        source: 'Delhi High Court',
        url: '/api/judgments/high-court/456.pdf',
        folderId: 2,
        thumbnail: '/api/thumbnails/judgment-456.jpg'
      },
      {
        id: 4,
        name: 'BNS Act 2023 - Bharatiya Nyaya Sanhita',
        type: 'act',
        size: '2.1 MB',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        source: 'Ministry of Law',
        url: '/api/acts/central/bns-2023.pdf',
        folderId: 3,
        thumbnail: '/api/thumbnails/act-bns.jpg'
      },
      {
        id: 5,
        name: 'Research Notes - Contract Law',
        type: 'other',
        size: '0.8 MB',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        source: 'Personal Notes',
        url: '/api/documents/research/contract-notes.pdf',
        folderId: 5,
        thumbnail: '/api/thumbnails/notes-contract.jpg'
      }
    ];

    setFolders(mockFolders);
    setDownloads(mockDownloads);
  }, []);

  const filteredDownloads = downloads.filter(download => {
    const matchesSearch = download.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || download.type === filterType;
    const matchesFolder = !currentFolder || download.folderId === currentFolder.id;
    
    return matchesSearch && matchesType && matchesFolder;
  });

  const sortedDownloads = [...filteredDownloads].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'date':
        return b.date - a.date;
      case 'recent':
      default:
        return b.date - a.date;
    }
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        color: '#1E65AD',
        itemCount: 0
      };
      setFolders(prev => [...prev, newFolder]);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleDeleteItem = (itemId) => {
    setDownloads(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const handleMoveToFolder = (itemId, folderId) => {
    setDownloads(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, folderId } : item
      )
    );
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sortedDownloads.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedDownloads.map(item => item.id));
    }
  };

  const formatFileSize = (size) => {
    return size;
  };

  const formatDate = (date) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>My Downloads</h1>
          <p className="text-lg" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
            {sortedDownloads.length} files • {formatFileSize('10.3 MB')} total
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-6 sm:mt-0">
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center px-6 py-3 text-white rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{ backgroundColor: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
          >
            <FolderPlus className="h-5 w-5 mr-2" />
            New Folder
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border mb-8" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#8C969F' }} />
            <input
              type="text"
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border rounded-2xl focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
              style={{ 
                borderColor: '#E5E7EB', 
                backgroundColor: '#F9FAFC',
                fontFamily: 'Roboto, sans-serif',
                focusRingColor: '#1E65AD'
              }}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
            style={{ 
              borderColor: '#E5E7EB', 
              backgroundColor: '#F9FAFC',
              fontFamily: 'Roboto, sans-serif',
              focusRingColor: '#1E65AD'
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="size">Size</option>
            <option value="date">Date</option>
          </select>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-4 border rounded-2xl focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
            style={{ 
              borderColor: '#E5E7EB', 
              backgroundColor: '#F9FAFC',
              fontFamily: 'Roboto, sans-serif',
              focusRingColor: '#1E65AD'
            }}
          >
            <option value="all">All Types</option>
            <option value="judgment">Judgments</option>
            <option value="act">Acts</option>
            <option value="other">Other</option>
          </select>

          {/* View Mode */}
          <div className="flex border rounded-2xl overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all duration-200 ${viewMode === 'grid' ? 'shadow-md' : 'hover:bg-gray-50'}`}
              style={{ 
                backgroundColor: viewMode === 'grid' ? '#1E65AD' : 'transparent',
                color: viewMode === 'grid' ? 'white' : '#8C969F'
              }}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-all duration-200 ${viewMode === 'list' ? 'shadow-md' : 'hover:bg-gray-50'}`}
              style={{ 
                backgroundColor: viewMode === 'list' ? '#1E65AD' : 'transparent',
                color: viewMode === 'list' ? 'white' : '#8C969F'
              }}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Folders */}
      {!currentFolder && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Folders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder)}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
              >
                <div 
                  className="p-3 rounded-lg mb-2"
                  style={{ backgroundColor: folder.color + '20' }}
                >
                  <Folder 
                    className="h-8 w-8" 
                    style={{ color: folder.color }}
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm text-center group-hover:text-blue-700">
                  {folder.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {folder.itemCount} files
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
              style={{ backgroundColor: currentFolder.color + '20' }}
            >
              <Folder 
                className="h-6 w-6" 
                style={{ color: currentFolder.color }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentFolder.name}</h2>
              <p className="text-sm text-gray-500">
                {sortedDownloads.length} files
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Downloads Grid/List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {sortedDownloads.length === 0 ? (
          <div className="p-12 text-center">
            <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No downloads found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Start by downloading some documents'}
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
                  {sortedDownloads.map((download) => (
                    <div
                      key={download.id}
                      className={`relative border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        selectedItems.includes(download.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleSelectItem(download.id)}
                    >
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(download.id)}
                        onChange={() => handleSelectItem(download.id)}
                        className="absolute top-2 left-2"
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* File Icon */}
                      <div className="flex justify-center mb-3">
                        {getFileIcon(download.type)}
                      </div>

                      {/* File Info */}
                      <div className="text-center">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                          {download.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{download.source}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{download.size}</span>
                          <span>{formatDate(download.date)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2">
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(download.url, '_blank');
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="View"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(download.id);
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
                          checked={selectedItems.length === sortedDownloads.length && sortedDownloads.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedDownloads.map((download) => (
                      <tr
                        key={download.id}
                        className={`hover:bg-gray-50 ${selectedItems.includes(download.id) ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(download.id)}
                            onChange={() => handleSelectItem(download.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getFileIcon(download.type)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {download.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {download.source}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {download.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {download.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(download.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(download.url, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(download.id)}
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
      </div>

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
    </div>
  );
};

export default MyDownloads;
