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
    { code: 'en', name: 'English', flag: '🇺🇸', short: 'EN' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', short: 'HI' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', short: 'GU' }
  ];

  // Get current language from cookie
  const getCurrentLanguage = () => {
    if (typeof window === 'undefined') return 'en';
    
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('googtrans='));
    
    if (cookie) {
      const value = cookie.split('=')[1];
      if (value === '/en/hi') return 'hi';
      if (value === '/en/gu') return 'gu';
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

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-20"
          style={{ 
            color: '#8C969F',
            fontFamily: 'Roboto, sans-serif',
            backgroundColor: '#F9FAFC',
            borderColor: '#8C969F',
            minHeight: '40px',
            focusRingColor: '#1E65AD'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#1E65AD';
            e.currentTarget.style.color = '#1E65AD';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#8C969F';
            e.currentTarget.style.color = '#8C969F';
            e.currentTarget.style.backgroundColor = '#F9FAFC';
          }}
          aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
        <span className="text-lg" aria-hidden="true">
          {currentLanguage.flag}
        </span>
        <span className="text-sm font-medium">{currentLanguage.short}</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: '#CF9B63' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
          style={{ 
            borderColor: '#1E65AD',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(30, 101, 173, 0.15)'
          }}
          role="listbox"
          aria-label="Language selection"
        >
          {languages.map((language) => (
            <button
              key={language.code}
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
              className={`w-full text-left px-4 py-3 transition-all duration-200 text-sm flex items-center gap-3 focus:outline-none ${
                currentLang === language.code 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={{ 
                fontFamily: 'Roboto, sans-serif',
                backgroundColor: currentLang === language.code ? '#F9FAFC' : 'transparent',
                color: currentLang === language.code ? '#1E65AD' : '#8C969F'
              }}
              onMouseEnter={(e) => {
                if (currentLang !== language.code) {
                  e.currentTarget.style.backgroundColor = '#F9FAFC';
                  e.currentTarget.style.color = '#1E65AD';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLang !== language.code) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#8C969F';
                }
              }}
              role="option"
              aria-selected={currentLang === language.code}
            >
              <span className="text-lg" aria-hidden="true">{language.flag}</span>
              <div className="flex-1">
                <div 
                  className="font-semibold"
                  style={{ 
                    color: currentLang === language.code ? '#1E65AD' : '#8C969F',
                    fontFamily: currentLang === language.code 
                      ? 'Helvetica Hebrew Bold, sans-serif' 
                      : 'Roboto, sans-serif'
                  }}
                >
                  {language.name}
                </div>
                <div 
                  className="text-xs"
                  style={{ color: '#CF9B63' }}
                >
                  {language.short}
                </div>
              </div>
              {currentLang === language.code && (
                <svg className="w-4 h-4 ml-2" style={{ color: '#CF9B63' }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default LanguageSelector;
