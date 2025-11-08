import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Folder, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  FolderPlus,
  Calendar,
  Clock,
  Tag
} from 'lucide-react';

const Notes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load folders and notes from API
  useEffect(() => {
    // TODO: Load folders and notes from API
    // For now, initialize with empty arrays
    setFolders([]);
    setNotes([]);
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? note.folderId === selectedFolder.id : true;
    return matchesSearch && matchesFolder;
  });

  const handleNoteClick = (note) => {
    navigate(`/notes/${note.id}`, { state: { note, folders } });
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(selectedFolder?.id === folder.id ? null : folder);
  };

  const getFolderNotes = (folderId) => {
    return notes.filter(note => note.folderId === folderId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Notes
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Organize and manage your legal research notes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-3 sm:gap-0">
            <button 
              className="px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm w-full sm:w-auto"
              style={{ 
                backgroundColor: '#1E65AD', 
                color: 'white',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              <FolderPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>New Folder</span>
            </button>
            <button 
              className="px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm w-full sm:w-auto"
              style={{ 
                backgroundColor: '#CF9B63', 
                color: 'white',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          />
        </div>
      </div>

      {/* Folders Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
          Folders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedFolder?.id === folder.id ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                borderColor: selectedFolder?.id === folder.id ? folder.color : '#E5E7EB',
                ringColor: folder.color,
                backgroundColor: selectedFolder?.id === folder.id ? `${folder.color}10` : 'white'
              }}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div 
                    className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${folder.color}20` }}
                  >
                    <Folder className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: folder.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {folder.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {getFolderNotes(folder.id).length} notes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-base sm:text-lg font-semibold truncate flex-1 min-w-0" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
            <span className="hidden sm:inline">{selectedFolder ? `${selectedFolder.name} Notes` : 'All Notes'}</span>
            <span className="sm:hidden">{selectedFolder ? selectedFolder.name : 'All Notes'}</span>
            <span className="ml-1 sm:ml-2">({filteredNotes.length})</span>
          </h2>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              style={{ color: viewMode === 'grid' ? '#1E65AD' : '#6B7280' }}
              title="Grid View"
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              style={{ color: viewMode === 'list' ? '#1E65AD' : '#6B7280' }}
              title="List View"
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-xs sm:text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
              No notes found. Create your first note!
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredNotes.map((note) => {
              const folder = folders.find(f => f.id === note.folderId);
              return (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note)}
                  className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white"
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-2 sm:mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.content}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle menu click
                      }}
                      className="p-1 sm:p-1 rounded hover:bg-gray-100 flex-shrink-0"
                    >
                      <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                      {folder && (
                        <span
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium truncate"
                          style={{ 
                            backgroundColor: `${folder.color}20`,
                            color: folder.color,
                            fontFamily: 'Roboto, sans-serif'
                          }}
                        >
                          {folder.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-500 flex-shrink-0" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="whitespace-nowrap">{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {filteredNotes.map((note) => {
              const folder = folders.find(f => f.id === note.folderId);
              return (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note)}
                  className="p-3 sm:p-4 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div 
                      className="p-2 sm:p-2.5 md:p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: folder ? `${folder.color}20` : '#F3F4F6' }}
                    >
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: folder?.color || '#6B7280' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base truncate" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mb-1.5 sm:mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.content}
                      </p>
                      <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {folder && (
                          <span className="flex items-center space-x-1">
                            <Folder className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{folder.name}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu click
                    }}
                    className="p-1.5 sm:p-2 rounded hover:bg-gray-100 flex-shrink-0"
                  >
                    <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;

