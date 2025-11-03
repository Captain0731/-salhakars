import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LanguageSelector from "../LanguageSelector";

const navItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Services",
    links: [
      { 
        label: "Legal Judgment", 
        path: "/judgment-access",
      },
      { 
        label: "Supreme Court Judgments", 
        path: "/supreme-court-judgments",
      },
      { 
        label: "High Court Judgments", 
        path: "/high-court-judgments",
      },
      { 
        label: "Law Library", 
        path: "/law-library"
      },
      { 
        label: "Law Mapping", 
        path: "/law-mapping"
      },
      { 
        label: "Legal Template", 
        path: "/legal-template" 
      },
      { 
        label: "YouTube Summarizer", 
        path: "/youtube-summary",
      },
      { 
        label: "🎨 Design Variants", 
        path: "#",
        subLinks: [
          { label: "⬛ Minimalist", path: "/designs/minimalist" },
          { label: "🔮 Glassmorphism", path: "/designs/glassmorphism" },
          { label: "🎨 Material Design", path: "/designs/material" },
          { label: "🍎 Neumorphism", path: "/designs/neumorphism" },
          { label: "👔 Premium", path: "/designs/premium" },
          { label: "♿ Accessible", path: "/designs/accessible" },
          { label: "💬 Conversational", path: "/designs/conversational" },
        ]
      },
    ],
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Support",
    path: "/legal-chatbot",
  },
  {
    label: "Pricing",
    path: "/pricing",
  },
  {
    label: "More",
    links: [
      { 
        label: "Our Team", 
        path: "/our-team"
      },
      { 
        label: "Referral Program", 
        path: "/referral",
        subLinks: [
          { label: "Invite Friends", path: "/invite-friends" },
          { label: "Earn Rewards", path: "/earn-rewards" },
          { label: "Track Referrals", path: "/track-referrals" },
        ]
      },
    ],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // index of main dropdown
  // Changed: track both main index and sub index to avoid collisions
  const [subDropdownOpen, setSubDropdownOpen] = useState({ main: null, sub: null });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const subHoverTimeoutRef = useRef(null);

  const handleNavClick = (path, filter = null) => {
    console.log('Navigating to:', path);
    if (path && path !== "#") {
      if (path.startsWith("/#")) {
        const anchorId = path.substring(2);
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // All routes are now public - no authentication required
        
        if (filter) {
          navigate(path, { state: { filter } });
        } else {
          navigate(path);
        }
      }
      setMenuOpen(false);
      setDropdownOpen(null);
      setSubDropdownOpen({ main: null, sub: null });
    }
  };

  // Handle scroll effect and progress bar
  useEffect(() => {
    let rafId = null;
    
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setIsScrolled(scrollTop > 50);
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateScrollProgress);
    };

    const handleResize = () => {
      updateScrollProgress();
    };

    // Initial calculation
    updateScrollProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDropdownOpen(null);
        setSubDropdownOpen({ main: null, sub: null });
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear timeouts on cleanup
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (subHoverTimeoutRef.current) clearTimeout(subHoverTimeoutRef.current);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  // Helper classes for smooth animation
  const animatedDropdownClass = (isOpen) =>
    `transition-all duration-300 ease-out transform ${
      isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
    }`;

  const animatedSubDropdownClass = (isOpen) =>
    `transition-all duration-300 ease-out transform ${
      isOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-2 pointer-events-none"
    }`;

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-[9999] border-b transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'bg-white/20 backdrop-blur-lg shadow-xl py-2' 
        : 'bg-white/90 backdrop-blur-md shadow-lg py-3 sm:py-4 md:py-4'
    }`} style={{ borderColor: '#E5E7EB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ">
        
        {/* Brand Logo - Left Corner */}
        <div
          className="cursor-pointer group flex items-center"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo4.png"
            alt="सलहाकार Logo"
            className={`max-h-12 sm:max-h-16 md:max-h-18 w-auto object-contain group-hover:scale-110 transition-all duration-500 ease-out ${
              isScrolled ? 'max-h-14 sm:max-h-45 md:max-h-54' : 'max-h-12 sm:max-h-14 md:max-h-16'
            }`}
            style={{ height: 'auto' }}
            onError={(e) => {
              if (e.target.src.includes('logo4.png')) {
                e.target.src = '/logo.png';
              } else if (e.target.src.includes('logo.png')) {
                e.target.src = '/logo 3.PNG';
              } else if (e.target.src.includes('logo 3.PNG')) {
                e.target.src = '/laogo2.jpeg';
              } else {
                e.target.src = '/logo4.png';
              }
            }}
          />
        </div>

        {/* Hamburger Button */}
        <div
          className="md:hidden flex flex-col gap-1.2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-all duration-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`h-0.5 w-6 rounded-full transition-all ease-out ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}
            style={{ backgroundColor: '#1E65AD' }}
          ></span>
          <span
            className={`h-0.5 w-6 rounded-full transition-all duration-900 ease-out ${menuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
            style={{ backgroundColor: '#1E65AD' }}
          ></span>
          <span
            className={`h-0.5 w-6 rounded-full transition-all duration-900 ease-out ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
            style={{ backgroundColor: '#1E65AD' }}
          ></span>
        </div>

        {/* Nav Links */}
        <ul
          className={`flex-col md:flex-row md:flex gap-1 sm:gap-2 items-center absolute md:static left-0 w-full md:w-auto backdrop-blur-lg md:bg-transparent p-6 sm:p-8 md:p-0 transition-all duration-500 ease-out shadow-2xl md:shadow-none rounded-2xl md:rounded-none border-t md:border-t-0  ${
            isScrolled ? 'bg-white/70 backdrop-blur-lg top-16 sm:top-18' : 'bg-white/90 backdrop-blur-md top-20 sm:top-24'
          } ${menuOpen ? "flex opacity-100 translate-y-0" : "hidden md:flex opacity-0 md:opacity-100 -translate-y-2 md:translate-y-0"}`}
          style={{ borderTopColor: '#E5E7EB', zIndex: 9999 }}
        >
          {navItems.map((item, idx) => (
            <li 
              key={idx} 
              className="relative group w-full md:w-auto"
              style={{ position: 'relative' }}
              onMouseEnter={() => {
                if (window.innerWidth >= 768 && item.links && item.links.length > 0) {
                  // Clear any existing timeout
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                  }
                  console.log('Opening dropdown for:', item.label, 'index:', idx);
                  setDropdownOpen(idx);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 768) {
                  // Clear any existing timeout
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                  }
                  hoverTimeoutRef.current = setTimeout(() => {
                    setDropdownOpen(null);
                    setSubDropdownOpen({ main: null, sub: null });
                  }, 150);
                }
              }}
            >
              <button
                onClick={() => {
                  if (item.links && item.links.length > 0) {
                    setDropdownOpen(dropdownOpen === idx ? null : idx);
                    setSubDropdownOpen({ main: null, sub: null });
                  } else if (item.path) {
                    handleNavClick(item.path);
                  }
                }}
                className={`flex items-center justify-between w-full md:w-auto py-3 sm:py-3 px-4 sm:px-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 text-sm sm:text-base touch-manipulation relative overflow-hidden group ${(item.path && location.pathname === item.path) ? 'bg-blue-50 text-blue-600' : ''}`}
                style={{ 
                  color: (item.path && location.pathname === item.path) ? '#1E65AD' : '#8C969F', 
                  fontFamily: 'Roboto, sans-serif',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    const isSelected = item.path && location.pathname === item.path;
                    e.currentTarget.style.color = isSelected ? '#1E65AD' : '#1E65AD';
                    e.currentTarget.style.backgroundColor = isSelected ? '#E3F2FD' : '#F8FAFC';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 101, 173, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    const isSelected = item.path && location.pathname === item.path;
                    e.currentTarget.style.color = isSelected ? '#1E65AD' : '#8C969F';
                    e.currentTarget.style.backgroundColor = isSelected ? '#E3F2FD' : 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <span className="text-left">{item.label}</span>
                {item.links && item.links.length > 0 && (
                  <span 
                    className={`ml-2 ${dropdownOpen === idx ? 'rotate-180 scale-110' : 'scale-100'}`}
                    style={{ 
                      color: '#CF9B63',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transformOrigin: 'center',
                      display: 'inline-block'
                    }}
                  >
                    ▼
                  </span>
                )}
              </button>

                {/* Main Dropdown - uses smooth animation class */}
                {item.links && item.links.length > 0 && (
                  <ul
                    className={`w-full md:absolute md:left-0 md:top-full backdrop-blur-md shadow-2xl rounded-2xl py-3 mt-3 md:min-w-[300px] border ${
                      isScrolled ? 'bg-white/80' : 'bg-white/95'
                    } ${
                      dropdownOpen === idx ? "block opacity-100" : "hidden opacity-0"
                    } ${animatedDropdownClass(dropdownOpen === idx)}`}
                  style={{ 
                    borderColor: '#E5E7EB',
                    zIndex: 9999,
                    backgroundColor: 'white',
                    color: '#1f2937',
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    minWidth: '300px'
                  }}
                  onMouseEnter={() => {
                    if (window.innerWidth >= 768) {
                      // Clear any existing timeout
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      setDropdownOpen(idx);
                    }
                  }}
                  onMouseLeave={() => {
                    if (window.innerWidth >= 768) {
                      // Clear any existing timeout
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      hoverTimeoutRef.current = setTimeout(() => {
                        setDropdownOpen(null);
                        setSubDropdownOpen({ main: null, sub: null });
                      }, 150);
                    }
                  }}
                >
                  {item.links.map((link, i) => (
                    <li 
                      key={i} 
                      className="relative"
                      style={{
                        position: 'relative',
                        transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                      onMouseEnter={() => {
                        if (window.innerWidth >= 768 && link.subLinks && link.subLinks.length > 0) {
                          // Clear any existing timeout
                          if (subHoverTimeoutRef.current) {
                            clearTimeout(subHoverTimeoutRef.current);
                          }
                          // set both main and sub for correct matching
                          setSubDropdownOpen({ main: idx, sub: i });
                        }
                      }}
                      onMouseLeave={() => {
                        if (window.innerWidth >= 768) {
                          // Clear any existing timeout
                          if (subHoverTimeoutRef.current) {
                            clearTimeout(subHoverTimeoutRef.current);
                          }
                          subHoverTimeoutRef.current = setTimeout(() => {
                            setSubDropdownOpen({ main: null, sub: null });
                          }, 150);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            if (link.subLinks && link.subLinks.length > 0) {
                              // toggle using composite main/sub keys
                              setSubDropdownOpen(prev => (
                                prev.main === idx && prev.sub === i ? { main: null, sub: null } : { main: idx, sub: i }
                              ));
                            } else {
                              handleNavClick(link.path, link.filter);
                            }
                          }}
                          className="flex items-center justify-between w-full text-left px-4 py-3 text-sm sm:text-base touch-manipulation rounded-lg mx-2 group"
                          style={{ 
                            color: '#1f2937', 
                            fontFamily: 'Roboto, sans-serif',
                            minHeight: '44px',
                            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                          }}
                          onMouseEnter={(e) => {
                            if (window.innerWidth >= 768) {
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.backgroundColor = '#1E65AD';
                              e.currentTarget.style.transform = 'translateX(4px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 101, 173, 0.2)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (window.innerWidth >= 768) {
                              e.currentTarget.style.color = '#8C969F';
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.transform = 'translateX(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        >
                          <span style={{ color: '#1f2937' }}>{link.label}</span>
                          {link.subLinks && link.subLinks.length > 0 && (
                            <span 
                              className={`ml-2 ${(subDropdownOpen.main === idx && subDropdownOpen.sub === i) ? 'rotate-90 scale-110' : 'scale-100'}`}
                              style={{ 
                                color: '#CF9B63',
                                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                display: 'inline-block'
                              }}
                            >
                              ▶
                            </span>
                          )}
                        </button>
                      </div>

                        {/* Sub-dropdown for services with sub-links - uses composite check */}
                        {link.subLinks && link.subLinks.length > 0 && (
                          <ul
                            // On md+: absolute flyout; on mobile: static block below parent
                            className={`w-full backdrop-blur-md shadow-2xl rounded-2xl py-3 ml-0 md:ml-2 md:min-w-[220px] border ${
                              isScrolled ? 'bg-white/80' : 'bg-white/95'
                            } 
                              ${window.innerWidth >= 768 ? "md:absolute md:left-full md:top-0" : "static"} 
                              ${(subDropdownOpen.main === idx && subDropdownOpen.sub === i) ? "block opacity-100" : "hidden opacity-0"}
                              ${animatedSubDropdownClass(subDropdownOpen.main === idx && subDropdownOpen.sub === i)}`}
                          style={{ 
                            borderColor: '#E5E7EB',
                            zIndex: 10000,
                            backgroundColor: 'white',
                            color: '#1f2937',
                            position: 'absolute',
                            top: '0',
                            left: '100%',
                            minWidth: '220px'
                          }}
                          onMouseEnter={() => {
                            if (window.innerWidth >= 768) {
                              // Clear any existing timeout
                              if (subHoverTimeoutRef.current) {
                                clearTimeout(subHoverTimeoutRef.current);
                              }
                              setSubDropdownOpen({ main: idx, sub: i });
                            }
                          }}
                          onMouseLeave={() => {
                            if (window.innerWidth >= 768) {
                              // Clear any existing timeout
                              if (subHoverTimeoutRef.current) {
                                clearTimeout(subHoverTimeoutRef.current);
                              }
                              subHoverTimeoutRef.current = setTimeout(() => {
                                setSubDropdownOpen({ main: null, sub: null });
                              }, 150);
                            }
                          }}
                        >
                          {link.subLinks.map((subLink, j) => (
                            <li 
                              key={j}
                              className=""
                              style={{
                                transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                              }}
                            >
                              <button
                                onClick={() => handleNavClick(subLink.path, subLink.filter)}
                                className="block w-full text-left px-4 py-3 text-sm sm:text-base touch-manipulation rounded-lg mx-2 group"
                                style={{ 
                                  color: '#1f2937', 
                                  fontFamily: 'Roboto, sans-serif',
                                  minHeight: '44px',
                                  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                }}
                                onMouseEnter={(e) => {
                                  if (window.innerWidth >= 768) {
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.backgroundColor = '#CF9B63';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(207, 155, 99, 0.2)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (window.innerWidth >= 768) {
                                    e.currentTarget.style.color = '#8C969F';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium" style={{ color: '#1f2937' }}>{subLink.label}</span>
                                  {subLink.arrow && (
                                    <span className="text-blue-600 font-bold text-lg group-hover:scale-110 group-hover:rotate-12"
                                      style={{
                                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                        display: 'inline-block'
                                      }}>
                                      {subLink.arrow}
                                    </span>
                                  )}
                                  {subLink.targetLabel && (
                                    <span className="font-medium" style={{ color: '#1f2937' }}>{subLink.targetLabel}</span>
                                  )}
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Language Selector - Mobile */}
          <li className="w-full md:hidden mt-4">
            <div className="mb-3">
              <LanguageSelector />
            </div>
          </li>

          {/* User Profile or Login Button - Mobile */}
          <li className="w-full md:hidden mt-2">
            {isAuthenticated ? (
              <div className="w-full">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <div>
                    <div className="font-semibold text-gray-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {user?.name || 'name'}
                    </div>
                    <div className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {user?.email || user?.phone || 'No email'}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="text-white px-6 sm:px-8 py-3 sm:py-3 rounded-full font-semibold hover:shadow-xl hover:scale-110 transition-all duration-500 ease-out transform w-full text-sm sm:text-base touch-manipulation relative overflow-hidden group mb-2"
                  style={{ 
                    backgroundColor: '#1E65AD', 
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: '0 4px 15px rgba(30, 101, 173, 0.3)',
                    minHeight: '44px'
                  }}
                >
                  View Profile
                </button>
                
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                  className="text-white px-6 sm:px-8 py-3 sm:py-3 rounded-full font-semibold hover:shadow-xl hover:scale-110 transition-all duration-500 ease-out transform w-full text-sm sm:text-base touch-manipulation relative overflow-hidden group mb-2"
                  style={{ 
                    backgroundColor: '#1E65AD', 
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: '0 4px 15px rgba(30, 101, 173, 0.3)',
                    minHeight: '44px'
                  }}
                >
                  Dashboard
                </button>
                
                <button
                  onClick={handleLogout}
                  className="text-white px-6 sm:px-8 py-3 sm:py-3 rounded-full font-semibold hover:shadow-xl hover:scale-110 transition-all duration-500 ease-out transform w-full text-sm sm:text-base touch-manipulation relative overflow-hidden group"
                  style={{ 
                    backgroundColor: '#CF9B63', 
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: '0 4px 15px rgba(207, 155, 99, 0.3)',
                    minHeight: '44px'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full text-sm touch-manipulation"
                style={{ 
                  color: '#FFFFFF',
                  fontFamily: 'Roboto, sans-serif',
                  background: 'linear-gradient(135deg, #1E65AD 0%, #CF9B63 100%)',
                  borderColor: '#1E65AD',
                  minHeight: '50px',
                  minWidth: '100px',
                  boxShadow: '0 2px 8px rgba(30, 101, 173, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #CF9B63 0%, #1E65AD 100%)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(207, 155, 99, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1E65AD 0%, #CF9B63 100%)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 101, 173, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Login
              </button>
            )}
          </li>
        </ul>

        {/* User Profile or Login Button - Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Selector */}
          <LanguageSelector />
          
          {isAuthenticated ? (
            <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {user?.name || 'name'}
                    </div>
                    <div className="text-xs text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {user?.email || user?.phone || 'No email'}
                    </div>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User Dropdown */}
                <div className={`absolute right-0 top-full mt-2 w-64 backdrop-blur-md rounded-xl shadow-xl border py-2 z-50 transition-all duration-300 ease-out ${
                  isScrolled ? 'bg-white/80' : 'bg-white/95'
                } ${userDropdownOpen ? 'block opacity-100' : 'hidden opacity-0'}`} style={{ borderColor: '#E5E7EB' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
                    <div className="font-semibold text-gray-800" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {user?.name || 'name'}
                    </div>
                    <div className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {user?.email || user?.phone || 'No email'}
                    </div>
                    {user?.profession && (
                      <div className="text-xs text-blue-600 mt-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {user.profession}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    Logout
                  </button>
                </div>
              </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm touch-manipulation"
              style={{ 
                color: '#FFFFFF',
                fontFamily: 'Roboto, sans-serif',
                background: 'linear-gradient(135deg, #1E65AD 0%, #CF9B63 100%)',
                borderColor: '#1E65AD',
                minHeight: '50px',
                minWidth: '100px',
                boxShadow: '0 2px 8px rgba(30, 101, 173, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #CF9B63 0%, #1E65AD 100%)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(207, 155, 99, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1E65AD 0%, #CF9B63 100%)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 101, 173, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Login
            </button>
          )}

        </div>
      </div>
      
      {/* Smooth Scroll Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-[10001] h-1 bg-transparent pointer-events-none"
        style={{ 
          transform: 'translateY(100%)'
        }}
      >
        <div
          className="h-full relative overflow-hidden"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 50%, #1E65AD 100%)',
            backgroundSize: '200% 100%',
            boxShadow: '0 -2px 10px rgba(30, 101, 173, 0.3)',
            willChange: 'width',
            transition: 'width 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 shimmer opacity-60"
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
