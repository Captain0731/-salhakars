import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Download, 
  Calendar as CalendarIcon, 
  Bookmark, 
  FileText as Note,
  Menu, 
  X, 
  Search,
  ChevronRight,
  FileText,
  Clock,
  Star,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Plus,
  Filter,
  Grid,
  List,
  Eye,
  Share2,
  MoreVertical
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Calendar from '../components/dashboard/Calendar';
import Bookmarks from '../components/dashboard/Bookmarks';
import Notes from '../components/dashboard/Notes';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  // Clear bookmarks when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setBookmarks([]);
      setBookmarksLoading(false);
      return;
    }
  }, [isAuthenticated, user]);

  // Load bookmarks for dashboard
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!isAuthenticated || !user) {
        setBookmarks([]);
        return;
      }
      
      setBookmarksLoading(true);
      try {
        const response = await apiService.getUserBookmarks({ limit: 10 });
        if (response.bookmarks) {
          setBookmarks(response.bookmarks);
        } else {
          setBookmarks([]);
        }
      } catch (err) {
        console.error('Error loading bookmarks for dashboard:', err);
        setBookmarks([]);
      } finally {
        setBookmarksLoading(false);
      }
    };

    if (activeTab === 'home' && isAuthenticated && user) {
      loadBookmarks();
    } else {
      setBookmarks([]);
    }
  }, [isAuthenticated, activeTab, user?.id]); // Add user.id dependency to reload when user changes

  // Helper to get bookmark title
  const getBookmarkTitle = (bookmark) => {
    const item = bookmark.item || bookmark;
    if (bookmark.type === 'judgement') {
      return item.title || item.case_title || 'Untitled Judgment';
    } else if (bookmark.type === 'central_act' || bookmark.type === 'state_act') {
      return item.short_title || item.long_title || 'Untitled Act';
    } else if (bookmark.type === 'bns_ipc_mapping' || bookmark.type === 'bsa_iea_mapping') {
      return item.subject || item.title || 'Untitled Mapping';
    }
    return 'Untitled';
  };

  // Helper to get bookmark description
  const getBookmarkDescription = (bookmark) => {
    const item = bookmark.item || bookmark;
    if (bookmark.type === 'judgement') {
      return item.court_name || item.judge || 'Judgment';
    } else if (bookmark.type === 'central_act' || bookmark.type === 'state_act') {
      return item.ministry || item.year || 'Act';
    } else if (bookmark.type === 'bns_ipc_mapping') {
      return `IPC ${item.ipc_section || ''} → BNS ${item.bns_section || ''}`.trim() || 'Mapping';
    } else if (bookmark.type === 'bsa_iea_mapping') {
      return `IEA ${item.iea_section || ''} → BSA ${item.bsa_section || ''}`.trim() || 'Mapping';
    }
    return '';
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Perfect Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    Dashboard
                  </h1>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Legal research overview
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-64 bg-white text-sm"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <Filter className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <Grid className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Perfect Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Downloads</p>
                    <p className="text-3xl font-bold mb-1" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>0</p>
                    <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>No downloads yet</p>
                  </div>
                  <div className="p-3 rounded-xl shadow-sm" style={{ backgroundColor: '#1E65AD' }}>
                    <Download className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Bookmarks</p>
                    <p className="text-3xl font-bold mb-1" style={{ color: '#CF9B63', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      {bookmarksLoading ? '...' : bookmarks.length}
                    </p>
                    <p className="text-sm text-green-600 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {bookmarks.length > 0 ? 'Active bookmarks' : 'No bookmarks yet'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl shadow-sm" style={{ backgroundColor: '#CF9B63' }}>
                    <Bookmark className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Upcoming Events</p>
                    <p className="text-3xl font-bold mb-1" style={{ color: '#8C969F', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>0</p>
                    <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>No events scheduled</p>
                  </div>
                  <div className="p-3 rounded-xl shadow-sm" style={{ backgroundColor: '#8C969F' }}>
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Notes</p>
                    <p className="text-3xl font-bold mb-1" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>0</p>
                    <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>No notes yet</p>
                  </div>
                  <div className="p-3 rounded-xl shadow-sm" style={{ backgroundColor: '#1E65AD' }}>
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Recent Activity</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  {bookmarksLoading ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Roboto, sans-serif' }}>Loading bookmarks...</p>
                    </div>
                  ) : bookmarks.length === 0 ? (
                    <div className="text-center py-4">
                      <Bookmark className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>No recent bookmarks</p>
                    </div>
                  ) : (
                    bookmarks.slice(0, 3).map((bookmark) => (
                      <div key={bookmark.id} className="flex items-start space-x-4">
                        <div className="p-2.5 rounded-lg flex-shrink-0" style={{ backgroundColor: '#CF9B63' }}>
                          <Bookmark className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {getBookmarkTitle(bookmark)}
                          </p>
                          <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {getBookmarkDescription(bookmark)}
                          </p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {formatRelativeTime(bookmark.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Quick Actions</h2>
                </div>
                <div className="p-5 space-y-3">
                  <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-lg flex-shrink-0" style={{ backgroundColor: '#1E65AD' }}>
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 mb-0.5" style={{ fontFamily: 'Roboto, sans-serif' }}>Add New Document</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Upload or bookmark a legal document</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-lg flex-shrink-0" style={{ backgroundColor: '#CF9B63' }}>
                        <CalendarIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 mb-0.5" style={{ fontFamily: 'Roboto, sans-serif' }}>Schedule Event</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Add important dates and reminders</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-lg flex-shrink-0" style={{ backgroundColor: '#8C969F' }}>
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 mb-0.5" style={{ fontFamily: 'Roboto, sans-serif' }}>View Analytics</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Track your research progress</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return <Calendar />;
      case 'bookmarks':
        return <Bookmarks />;
      case 'notes':
        return <Notes />;
      default:
        return null;
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'notes', label: 'Notes', icon: Note },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      <div className="flex h-screen" style={{ paddingTop: '80px' }}>
        {/* Perfect Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
          <div className="h-full flex flex-col border-r border-gray-200">
            {/* Logo and Dashboard Button */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ 
                    background: 'linear-gradient(135deg, #1E65AD, #CF9B63)' 
                  }}>
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Salhakar</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              {/* Dashboard Button */}
              <button
                onClick={() => {
                  setActiveTab('home');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'home'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <Home className={`h-5 w-5 mr-3 ${activeTab === 'home' ? 'text-white' : 'text-gray-600'}`} />
                <span className="font-semibold">Dashboard</span>
                {activeTab === 'home' && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                )}
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {sidebarItems.filter(item => item.id !== 'home').map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Premium Card */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r rounded-xl p-4 shadow-md" style={{ 
                background: 'linear-gradient(135deg, #1E65AD, #CF9B63)' 
              }}>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-3">
                    <Bookmark className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Premium</h3>
                    <p className="text-xs text-white/90" style={{ fontFamily: 'Roboto, sans-serif' }}>Unlock all features</p>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" style={{ 
                  color: '#1E65AD', 
                  fontFamily: 'Roboto, sans-serif' 
                }}>
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Area */}
          <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#F9FAFC' }}>
            <div className="max-w-7xl mx-auto px-6 py-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-4 right-4 lg:hidden z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Dashboard;