import React, { useState, useEffect, useRef } from 'react';

/**
 * LanguageSelector Component
 * 
 * Compact language selector for Google Translate integration.
 * Features:
 * - Tailwind-styled dropdown
 * - Keyboard accessible (tab, enter, escape)
 * - Screen reader friendly
 * - Responsive design
 * - Cookie persistence
 */

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', langCode: 'EN', country: 'US', name: 'English', flag: '🇺🇸', display: 'English' },
    { code: 'gu', langCode: 'GU', country: 'IN', name: 'ગુજરાતી', flag: '🇮🇳', display: 'IN' },
    { code: 'hi', langCode: 'HI', country: 'IN', name: 'हिन्दी', flag: '🇮🇳', display: 'IN' },
    { code: 'as', langCode: 'AS', country: 'IN', name: 'অসমীয়া', flag: '🇮🇳', display: 'IN' },
    { code: 'bn', langCode: 'BN', country: 'BD', name: 'বাংলা', flag: '🇧🇩', display: 'BD' },  
    { code: 'kn', langCode: 'KN', country: 'IN', name: 'ಕನ್ನಡ', flag: '🇮🇳', display: 'IN' },
    { code: 'ml', langCode: 'ML', country: 'IN', name: 'മലയാളം', flag: '🇮🇳', display: 'IN' },
    { code: 'mr', langCode: 'MR', country: 'IN', name: 'मराठी', flag: '🇮🇳', display: 'IN' },
    { code: 'or', langCode: 'OR', country: 'IN', name: 'ଓଡ଼ିଆ', flag: '🇮🇳', display: 'IN' },
    { code: 'pa', langCode: 'PA', country: 'IN', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', display: 'IN' },
    { code: 'ta', langCode: 'TA', country: 'IN', name: 'தமிழ்', flag: '🇮🇳', display: 'IN' },
    { code: 'te', langCode: 'TE', country: 'IN', name: 'తెలుగు', flag: '🇮🇳', display: 'IN' },
  ];

  // Get current language from cookie
  const getCurrentLanguage = () => {
    if (typeof window === 'undefined') return 'en';
    
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('googtrans='));
    
    if (cookie) {
      const value = cookie.split('=')[1];
      // Extract language code from /en/xx format
      if (value && value.startsWith('/en/')) {
        return value.replace('/en/', '').toLowerCase();
      }
    }
    return 'en';
  };

  // Set language and reload page
  const handleLanguageSelect = (langCode) => {
    if (typeof window === 'undefined') return;

    if (langCode === 'en') {
      // Clear translation
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } else {
      // Set translation cookie
      const cookieValue = `/en/${langCode}`;
      document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`;
    }

    // Reload page to apply translation
    window.location.reload();
  };

  // Update current language on mount
  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang.toLowerCase()) || languages[0];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ 
            color: isOpen ? '#1E65AD' : '#8C969F',
            fontFamily: 'Roboto, sans-serif',
            backgroundColor: isOpen ? '#F0F7FF' : '#FFFFFF',
            borderColor: isOpen ? '#1E65AD' : '#E5E7EB',
            minHeight: '44px',
            minWidth: '80px'
          }}
          aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {currentLanguage.flag}
            </span>
            <span className="text-sm font-semibold">{currentLanguage.display}</span>
          </div>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: isOpen ? '#1E65AD' : '#8C969F' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 overflow-hidden z-50 transition-all duration-200 ease-out opacity-100 transform scale-100"
          style={{ 
            borderColor: '#1E65AD',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 20px 40px rgba(30, 101, 173, 0.2)',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
          role="listbox"
          aria-label="Language selection"
        >
          {/* Dropdown Header */}
          <div className="px-4 py-3 border-b-2 bg-gradient-to-r from-blue-50 to-blue-100" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#1E65AD', fontFamily: 'Roboto, sans-serif' }}>
              Select Language
            </h3>
          </div>

          {/* Language List */}
          <div className="py-2">
            {languages.map((language, index) => {
              const isSelected = currentLang.toLowerCase() === language.code.toLowerCase();
              return (
                <button
                  key={`${language.code}-${language.country}-${index}`}
                  onClick={() => {
                    handleLanguageSelect(language.code);
                    setIsOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLanguageSelect(language.code);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 transition-all duration-150 flex items-center gap-3 focus:outline-none focus:bg-blue-50 ${
                    isSelected 
                      ? 'bg-blue-50 border-l-4' 
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                  style={{ 
                    fontFamily: 'Roboto, sans-serif',
                    backgroundColor: isSelected ? '#F0F7FF' : 'transparent',
                    borderLeftColor: isSelected ? '#1E65AD' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.borderLeftColor = '#E5E7EB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderLeftColor = 'transparent';
                    }
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">{language.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="font-semibold truncate"
                      style={{ 
                        color: isSelected ? '#1E65AD' : '#374151',
                        fontFamily: isSelected 
                          ? 'Helvetica Hebrew Bold, sans-serif' 
                          : 'Roboto, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      {language.name}
                    </div>
                    <div 
                      className="text-xs mt-0.5"
                      style={{ color: '#6B7280' }}
                    >
                      {language.langCode} • {language.country}
                    </div>
                  </div>
                  {isSelected && (
                    <svg 
                      className="w-5 h-5 flex-shrink-0" 
                      style={{ color: '#1E65AD' }} 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      aria-hidden="true"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default LanguageSelector;
