import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"

const navItems = [
  {
    label: "Judgment Access",
    path: "/judgments",
    links: [
      { label: "High Court", path: "/judgments" },
      { label: "Supreme Court", path: "/judgments" },
    ],
  },
  {
    label: "Browse Acts",
    links: [
      { label: "Central Acts", path: "#" },
      { label: "State Acts", path: "#" },
    ],
  },
  {
    label: "Old To New Law Mapping",
    path: "/mapping",
    links: [
      {label: "BNS To IEA",path: "#"},
      {label: "BNSS To CrPC" ,path: "#"},
      {label: "BNS To IPC" ,path: "#"},

    ]
  },
  {
    label: "Legal Template",
    path: "/template",
  },
  {
    label: "Others",
    links: [{ label: "YouTube Summary", path: "/videos" }],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleNavClick = (path) => {
    if (path && path !== "#") {
      navigate(path);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
             src={logo}
            alt="सलाहकार Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-2xl font-bold text-slate-800 tracking-tight">
            सलाहकार
          </span>
        </div>

        {/* Hamburger Button */}
        <div
          className="md:hidden flex flex-col gap-1 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`h-1 w-6 bg-sky-500 rounded transition-transform ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`h-1 w-6 bg-sky-500 rounded transition-opacity ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`h-1 w-6 bg-sky-500 rounded transition-transform ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>

        {/* Nav Links */}
        <ul
          className={`flex-col md:flex-row md:flex gap-4 items-center absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 transition-all duration-300 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          {navItems.map((item, idx) => (
            <li key={idx} className="relative group">
              <button
                onClick={() => {
                  if (item.links && item.links.length > 0) {
                    setDropdownOpen(dropdownOpen === idx ? null : idx);
                  } else if (item.path) {
                    handleNavClick(item.path);
                  }
                }}
                className="flex items-center justify-between w-full md:w-auto py-2 px-4 rounded-lg text-slate-700 hover:text-sky-600 hover:bg-indigo-50 md:hover:bg-transparent transition font-medium"
              >
                {item.label}{" "}
                {item.links && item.links.length > 0 && (
                  <span className="ml-1 text-slate-500">▾</span>
                )}
              </button>

              {/* Dropdown */}
              {item.links && item.links.length > 0 && (
                <ul
                  className={`absolute left-0 top-full bg-white shadow-lg rounded-xl py-2 mt-2 min-w-[200px] border border-gray-100 md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible transition-all ${
                    dropdownOpen === idx ? "block md:block" : "hidden md:absolute"
                  }`}
                >
                  {item.links.map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleNavClick(link.path)}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 hover:text-white transition"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Login Button */}
          <li>
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-md hover:scale-[1.03] transition-transform duration-200"
            >
              Login
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
