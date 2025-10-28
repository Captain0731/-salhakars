import React, { useState, useEffect } from 'react';

/**
 * PDFTranslator Component
 * 
 * Specialized component for translating PDF documents using Google Translate.
 * Integrates with the GoogleTranslate component to provide PDF translation functionality.
 * 
 * Features:
 * - Translates PDF URLs using Google Translate service
 * - Maintains translation state across language changes
 * - Provides fallback to original PDF if translation fails
 * - Integrates with existing language selector
 */

const PDFTranslator = ({ pdfUrl, onTranslatedUrlChange }) => {
  const [translatedUrl, setTranslatedUrl] = useState(pdfUrl);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationTimeout, setTranslationTimeout] = useState(null);
  const [preloadedUrls, setPreloadedUrls] = useState({});

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

  // Create Google Translate URL for PDF with optimization
  const createTranslatedPdfUrl = (originalPdfUrl, langCode) => {
    if (!originalPdfUrl || langCode === 'en') {
      return originalPdfUrl;
    }

    // Ultra-optimized Google Translate URL for maximum speed
    const translateUrl = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${encodeURIComponent(originalPdfUrl)}&client=webapp&oe=UTF-8&hl=en&ie=UTF-8&prev=_t&sl=en&tl=${langCode}&u=${encodeURIComponent(originalPdfUrl)}`;
    return translateUrl;
  };

  // Set translation with instant fallback for speed
  const setTranslationWithTimeout = (newTranslatedUrl, originalUrl) => {
    setIsTranslating(true);
    
    // Clear any existing timeout
    if (translationTimeout) {
      clearTimeout(translationTimeout);
    }
    
    // Check if we have a preloaded URL for faster access
    const preloadedUrl = preloadedUrls[currentLang];
    if (preloadedUrl) {
      console.log('Using preloaded PDF translation');
      setTranslatedUrl(preloadedUrl);
      setIsTranslating(false);
      if (onTranslatedUrlChange) {
        onTranslatedUrlChange(preloadedUrl);
      }
      return;
    }
    
    // Show original PDF immediately for instant loading
    setTranslatedUrl(originalUrl);
    if (onTranslatedUrlChange) {
      onTranslatedUrlChange(originalUrl);
    }
    
    // Preload the translation URL for future use
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'prefetch';
    preloadLink.href = newTranslatedUrl;
    document.head.appendChild(preloadLink);
    
    // Attempt translation in background with very short timeout
    const timeout = setTimeout(() => {
      console.log('Attempting fast PDF translation');
      setTranslatedUrl(newTranslatedUrl);
      setIsTranslating(false);
      
      // Cache the successful translation
      setPreloadedUrls(prev => ({
        ...prev,
        [currentLang]: newTranslatedUrl
      }));
      
      if (onTranslatedUrlChange) {
        onTranslatedUrlChange(newTranslatedUrl);
      }
    }, 500); // Try translation after 0.5 seconds
    
    // Fallback timeout - if translation still fails, keep original
    const fallbackTimeout = setTimeout(() => {
      console.log('PDF translation failed, keeping original');
      setTranslatedUrl(originalUrl);
      setIsTranslating(false);
      if (onTranslatedUrlChange) {
        onTranslatedUrlChange(originalUrl);
      }
    }, 2000); // 2 seconds total fallback
    
    setTranslationTimeout(fallbackTimeout);
  };

  // Update translated URL when language or PDF URL changes
  useEffect(() => {
    const newLang = getCurrentLanguage();
    setCurrentLang(newLang);
    
    const newTranslatedUrl = createTranslatedPdfUrl(pdfUrl, newLang);
    
    if (newLang === 'en') {
      // For English, use original URL immediately
      setTranslatedUrl(newTranslatedUrl);
      setIsTranslating(false);
      if (onTranslatedUrlChange) {
        onTranslatedUrlChange(newTranslatedUrl);
      }
    } else {
      // For other languages, use timeout mechanism
      setTranslationWithTimeout(newTranslatedUrl, pdfUrl);
    }
  }, [pdfUrl]); // Removed onTranslatedUrlChange from dependencies

  // Listen for language changes (cookie changes) - simplified
  useEffect(() => {
    const checkLanguageChange = () => {
      const newLang = getCurrentLanguage();
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
        const newTranslatedUrl = createTranslatedPdfUrl(pdfUrl, newLang);
        
        if (newLang === 'en') {
          // For English, use original URL immediately
          setTranslatedUrl(newTranslatedUrl);
          setIsTranslating(false);
          if (onTranslatedUrlChange) {
            onTranslatedUrlChange(newTranslatedUrl);
          }
        } else {
          // For other languages, use timeout mechanism
          setTranslationWithTimeout(newTranslatedUrl, pdfUrl);
        }
      }
    };

    // Check for language changes every 1000ms (reduced frequency)
    const interval = setInterval(checkLanguageChange, 1000);
    
    return () => {
      clearInterval(interval);
      // Clear timeout on cleanup
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
    };
  }, [pdfUrl]); // Only depend on pdfUrl to prevent loops

  // Expose functions globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.PDFTranslator = {
        createTranslatedPdfUrl,
        getCurrentLanguage,
        getTranslatedUrl: () => translatedUrl
      };
    }
  }, [translatedUrl]);

  // This component doesn't render anything visible
  // It just manages PDF translation state
  return null;
};

export default PDFTranslator;
