import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Bell, 
  Pin, 
  ChevronLeft, 
  ChevronRight,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'agenda'
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'general',
    reminder: false,
    reminderTime: '15'
  });

  // Load events from API
  useEffect(() => {
    // TODO: Load events from API
    // For now, initialize with empty array
    setEvents([]);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'hearing':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'deadline':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'notification':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'training':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'hearing':
        return <AlertCircle className="h-4 w-4" />;
      case 'deadline':
        return <Clock className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      case 'training':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event = {
        id: Date.now(),
        ...newEvent,
        date: new Date(newEvent.date),
        pinned: false,
        completed: false
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        type: 'general',
        reminder: false,
        reminderTime: '15'
      });
      setShowAddEvent(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleTogglePin = (eventId) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, pinned: !event.pinned } : event
      )
    );
  };

  const handleToggleComplete = (eventId) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, completed: !event.completed } : event
      )
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>Calendar</h1>
          <p className="mt-1" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
            Manage your legal events, deadlines, and reminders
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 text-sm ${viewMode === 'agenda' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Agenda
            </button>
          </div>
          
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center px-4 py-2 text-white rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {/* Pinned Events */}
      {events.filter(event => event.pinned).length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Pin className="h-5 w-5 mr-2 text-red-500" />
            Pinned Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.filter(event => event.pinned).map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-2 ${getEventTypeColor(event.type)} ${
                  event.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getEventIcon(event.type)}
                      <span className="ml-2 text-sm font-medium">{event.title}</span>
                    </div>
                    <p className="text-sm opacity-80 mb-2">{event.description}</p>
                    <div className="flex items-center text-xs opacity-70">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(event.date)}
                      {event.time && (
                        <>
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {event.time}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleToggleComplete(event.id)}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                      title={event.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckCircle className={`h-4 w-4 ${event.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={() => handleTogglePin(event.id)}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                      title="Unpin"
                    >
                      <Pin className="h-4 w-4 text-red-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
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
      )}

      {/* Calendar View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                const isToday = day && day.toDateString() === today.toDateString();
                const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-gray-200 ${
                      day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                    } ${isToday ? 'bg-blue-50 border-blue-300' : ''} ${
                      isSelected ? 'bg-blue-100 border-blue-400' : ''
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded ${getEventTypeColor(event.type)} truncate`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Events for {formatDate(selectedDate)}
            </h2>
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500">No events scheduled for this date.</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${getEventTypeColor(event.type)} ${
                      event.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {getEventIcon(event.type)}
                          <span className="ml-2 font-medium">{event.title}</span>
                          {event.pinned && <Pin className="h-4 w-4 ml-2 text-red-500" />}
                        </div>
                        <p className="text-sm opacity-80 mb-2">{event.description}</p>
                        {event.time && (
                          <div className="flex items-center text-sm opacity-70">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => handleToggleComplete(event.id)}
                          className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                          title={event.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <CheckCircle className={`h-4 w-4 ${event.completed ? 'text-green-600' : 'text-gray-400'}`} />
                        </button>
                        <button
                          onClick={() => handleTogglePin(event.id)}
                          className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                          title={event.pinned ? 'Unpin' : 'Pin'}
                        >
                          <Pin className={`h-4 w-4 ${event.pinned ? 'text-red-500' : 'text-gray-400'}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="hearing">Court Hearing</option>
                  <option value="deadline">Deadline</option>
                  <option value="notification">Notification</option>
                  <option value="training">Training</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={newEvent.reminder}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, reminder: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="reminder" className="ml-2 text-sm text-gray-700">
                  Set reminder
                </label>
              </div>

              {newEvent.reminder && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Time (minutes before)
                  </label>
                  <select
                    value={newEvent.reminderTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, reminderTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="1440">1 day</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddEvent(false);
                  setNewEvent({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    type: 'general',
                    reminder: false,
                    reminderTime: '15'
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
