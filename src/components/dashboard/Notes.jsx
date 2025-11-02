import React, { useState } from 'react';
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

  // Mock data - in production, this would come from API
  const [folders] = useState([
    { id: 1, name: 'Legal Cases', color: '#1E65AD', noteCount: 8 },
    { id: 2, name: 'Research Notes', color: '#CF9B63', noteCount: 12 },
    { id: 3, name: 'Court Proceedings', color: '#8C969F', noteCount: 5 },
    { id: 4, name: 'Judgment Analysis', color: '#1E65AD', noteCount: 15 },
  ]);

  const [notes] = useState([
    {
      id: 1,
      title: 'Contract Law Case Analysis',
      content: 'Detailed analysis of contract dispute case...',
      folderId: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      tags: ['Contract Law', 'Supreme Court']
    },
    {
      id: 2,
      title: 'Evidence Act Section 65B',
      content: 'Notes on digital evidence admissibility...',
      folderId: 2,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22',
      tags: ['Evidence Act', 'Digital Evidence']
    },
    {
      id: 3,
      title: 'Hearing Notes - Case No. 1234',
      content: 'Key points from today\'s hearing...',
      folderId: 3,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      tags: ['Hearing', 'Criminal']
    },
    {
      id: 4,
      title: 'BNS vs IPC Comparison',
      content: 'Comparative analysis of Bharatiya Nyaya Sanhita...',
      folderId: 4,
      createdAt: '2024-01-22',
      updatedAt: '2024-01-23',
      tags: ['BNS', 'IPC', 'Legal Reform']
    },
  ]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Notes
            </h1>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Organize and manage your legal research notes
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
              style={{ 
                backgroundColor: '#1E65AD', 
                color: 'white',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </button>
            <button 
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
              style={{ 
                backgroundColor: '#CF9B63', 
                color: 'white',
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              <Plus className="h-4 w-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          />
        </div>
      </div>

      {/* Folders Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
          Folders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedFolder?.id === folder.id ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                borderColor: selectedFolder?.id === folder.id ? folder.color : '#E5E7EB',
                ringColor: folder.color,
                backgroundColor: selectedFolder?.id === folder.id ? `${folder.color}10` : 'white'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${folder.color}20` }}
                  >
                    <Folder className="h-5 w-5" style={{ color: folder.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {folder.name}
                    </h3>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
            {selectedFolder ? `${selectedFolder.name} Notes` : 'All Notes'} ({filteredNotes.length})
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              style={{ color: viewMode === 'grid' ? '#1E65AD' : '#6B7280' }}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              style={{ color: viewMode === 'list' ? '#1E65AD' : '#6B7280' }}
            >
              <FileText className="h-5 w-5" />
            </button>
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
              No notes found. Create your first note!
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const folder = folders.find(f => f.id === note.folderId);
              return (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note)}
                  className="p-5 rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.content}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle menu click
                      }}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {folder && (
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
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
                    <div className="flex items-center space-x-1 text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      <Clock className="h-3 w-3" />
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => {
              const folder = folders.find(f => f.id === note.folderId);
              return (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note)}
                  className="p-4 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: folder ? `${folder.color}20` : '#F3F4F6' }}
                    >
                      <FileText className="h-5 w-5" style={{ color: folder?.color || '#6B7280' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {note.content}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {folder && (
                          <span className="flex items-center space-x-1">
                            <Folder className="h-3 w-3" />
                            <span>{folder.name}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
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
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
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

