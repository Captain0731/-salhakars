import React, { useState } from 'react';
import { 
  Home, 
  Download, 
  Calendar as CalendarIcon, 
  Bookmark, 
  // Note,
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
import MyDownloads from '../components/dashboard/MyDownloads';
import Calendar from '../components/dashboard/Calendar';
import Bookmarks from '../components/dashboard/Bookmarks';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Perfect Header */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    Dashboard
                  </h1>
                  <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Legal research overview
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-64 bg-white"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Filter className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
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
                    <p className="text-3xl font-bold mb-1" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>24</p>
                    <p className="text-sm text-green-600 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>+3</p>
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
                    <p className="text-3xl font-bold mb-1" style={{ color: '#CF9B63', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>12</p>
                    <p className="text-sm text-green-600 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>+2 this week</p>
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
                    <p className="text-3xl font-bold mb-1" style={{ color: '#8C969F', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>8</p>
                    <p className="text-sm text-green-600 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>+1 this week</p>
                  </div>
                  <div className="p-3 rounded-xl shadow-sm" style={{ backgroundColor: '#8C969F' }}>
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>High Court Judgments</p>
                    <p className="text-3xl font-bold mb-1" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>10</p>
                    <p className="text-sm text-green-600 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>Available now</p>
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
              <div className="bg-white rounded-lg border" style={{ borderColor: '#E5E7EB' }}>
                <div className="p-4 border-b" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Recent Activity</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-md" style={{ backgroundColor: '#1E65AD' }}>
                      <Download className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Downloaded Supreme Court Judgment</p>
                      <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>Contract Law Case 2023 - Civil Appeal No. 1234</p>
                      <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-md" style={{ backgroundColor: '#CF9B63' }}>
                      <Bookmark className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Bookmarked IPC Act 2023</p>
                      <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>Indian Penal Code - Bharatiya Nyaya Sanhita</p>
                      <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-md" style={{ backgroundColor: '#8C969F' }}>
                      <CalendarIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Added Court Hearing Event</p>
                      <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>Supreme Court - Contract Dispute Hearing</p>
                      <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border" style={{ borderColor: '#E5E7EB' }}>
                <div className="p-4 border-b" style={{ borderColor: '#E5E7EB' }}>
                  <h2 className="text-lg font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Quick Actions</h2>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md" style={{ backgroundColor: '#1E65AD' }}>
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Add New Document</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Upload or bookmark a legal document</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md" style={{ backgroundColor: '#CF9B63' }}>
                        <CalendarIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Schedule Event</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Add important dates and reminders</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md" style={{ backgroundColor: '#8C969F' }}>
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>View Analytics</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Track your research progress</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'downloads':
        return <MyDownloads />;
      case 'calendar':
        return <Calendar />;
      case 'bookmarks':
        return <Bookmarks />;
      default:
        return null;
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'downloads', label: 'My Downloads', icon: Download },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    // { id: 'notes', label: 'Notes', icon: Note },
  ];

  return (
    <div className="h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      <div className="flex h-full">
        {/* Modern Attractive Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-white to-gray-50 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`} style={{ top: '80px', height: 'calc(100vh - 100px)' }}>
          <div className="h-full flex flex-col">
            {/* Elegant Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg" style={{ 
                    background: 'linear-gradient(135deg, #1E65AD, #CF9B63)' 
                  }}>
                    <span className="text-lg">⚖️</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Dashboard</h2>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Legal Research Hub</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden" style={{ color: '#8C969F' }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Beautiful Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      activeTab === item.id
                        ? 'shadow-lg transform scale-105'
                        : 'hover:shadow-md hover:scale-102'
                    }`}
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      backgroundColor: activeTab === item.id ? '#1E65AD' : 'transparent',
                      color: activeTab === item.id ? 'white' : '#374151',
                      borderLeft: activeTab === item.id ? '4px solid #CF9B63' : 'none'
                    }}
                  >
                    <item.icon className={`h-5 w-5 mr-3 transition-colors ${
                      activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    <span className="font-semibold">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Premium Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r rounded-2xl p-4 shadow-lg" style={{ 
                background: 'linear-gradient(135deg, #1E65AD, #CF9B63)' 
              }}>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-3">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Premium</h3>
                    <p className="text-xs text-white/80" style={{ fontFamily: 'Roboto, sans-serif' }}>Unlock all features</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" style={{ 
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
        <div className="flex-1 flex flex-col">
          {/* Content Area */}
          <main className="flex-1 px-4 py-6 overflow-y-auto pt-24" style={{ backgroundColor: '#F9FAFC' }}>
            {renderContent()}
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
    </div>
  );
};

export default Dashboard;