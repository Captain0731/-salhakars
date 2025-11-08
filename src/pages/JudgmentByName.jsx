import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import TranslatedPDF from "../components/TranslatedPDF";
import apiService from "../services/api";
import { Search, FileText, Calendar, Scale, ArrowRight, X } from "lucide-react";

export default function JudgmentByName() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [selectedLang, setSelectedLang] = useState("en");

  // Featured PDFs - Aligarh Muslim University case
  // Note: PDF files should be placed in the public/ folder
  const featuredPDFs = [
    {
      id: 1,
      title: "Aligarh Muslim University Through Its vs Naresh Agarwal on 8 November 2024",
      case_number: "WP(C) 1234/2024",
      court_name: "Supreme Court of India",
      decision_date: "2024-11-08",
      pdf_url: "/Aligarh_Muslim_University_Through_Its_vs_Naresh_Agarwal_on_8_November_2024.PDF",
      pdf_link: "/Aligarh_Muslim_University_Through_Its_vs_Naresh_Agarwal_on_8_November_2024.PDF",
      summary: "Case related to Aligarh Muslim University and Naresh Agarwal decided on 8 November 2024.",
    },
    {
      id: 2,
      title: "Delhi Development Authority vs Tejpal on 17 May 2024",
      case_number: "WP(C) 1235/2024",
      court_name: "Supreme Court of India",
      decision_date: "2024-05-17",
      pdf_url: "/Delhi_Development_Authority_vs_Tejpal_on_17_May_2024.PDF",
      pdf_link: "/Delhi_Development_Authority_vs_Tejpal_on_17_May_2024.PDF",
      summary: "Case related to Delhi Development Authority and Tejpal decided on 17 May 2024.",
    },
    {
      id: 3,
      title: "Mineral Area Development Authority Etc vs M S Steel Authority Of India on 25 July 2024",
      case_number: "WP(C) 1236/2024",
      court_name: "Supreme Court of India",
      decision_date: "2024-07-25",
      pdf_url: "/Mineral_Area_Development_Authority_Etc_vs_M_S_Steel_Authority_Of_India_on_25_July_2024.PDF",
      pdf_link: "/Mineral_Area_Development_Authority_Etc_vs_M_S_Steel_Authority_Of_India_on_25_July_2024.PDF",
      summary: "Case related to Mineral Area Development Authority and Steel Authority of India decided on 25 July 2024.",
    },
    {
      id: 4,
      title: "State Of U P vs M S Lalta Prasad Vaish And Sons on 23 October 2024",
      case_number: "WP(C) 1237/2024",
      court_name: "Supreme Court of India",
      decision_date: "2024-10-23",
      pdf_url: "/State_Of_U_P_vs_M_S_Lalta_Prasad_Vaish_And_Sons_on_23_October_2024.PDF",
      pdf_link: "/State_Of_U_P_vs_M_S_Lalta_Prasad_Vaish_And_Sons_on_23_October_2024.PDF",
      summary: "Case related to State of UP and Lalta Prasad Vaish And Sons decided on 23 October 2024.",
    },
    {
      id: 5,
      title: "The State Of Punjab vs Davinder Singh on 1 August 2024",
      case_number: "WP(C) 1238/2024",
      court_name: "Supreme Court of India",
      decision_date: "2024-08-01",
      pdf_url: "/The_State_Of_Punjab_vs_Davinder_Singh_on_1_August_2024.PDF",
      pdf_link: "/The_State_Of_Punjab_vs_Davinder_Singh_on_1_August_2024.PDF",
      summary: "Case related to State of Punjab and Davinder Singh decided on 1 August 2024.",
    },
  ];

  // Search judgments by name/title
  const searchJudgmentsByName = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a judgment name to search");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await apiService.getJudgements({
        search: searchQuery.trim(),
        title: searchQuery.trim(),
        limit: 50,
      });

      if (response && response.data && Array.isArray(response.data)) {
        setJudgments(response.data);
        if (response.data.length === 0) {
          setError(`No judgments found for "${searchQuery}"`);
        }
      } else {
        setJudgments([]);
        setError("No judgments found");
      }
    } catch (err) {
      console.error("Error searching judgments:", err);
      setError(`Failed to search judgments: ${err.message || "Unknown error"}`);
      setJudgments([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchJudgmentsByName();
    }
  };

  // View judgment PDF
  const viewJudgment = (judgment) => {
    const pdfUrl = judgment.pdf_url || judgment.pdf_link || judgment.pdfUrl;
    if (pdfUrl) {
      setSelectedPDF({
        ...judgment,
        pdfUrl: pdfUrl,
      });
    } else {
      setError("PDF URL not available for this judgment");
    }
  };

  // Close PDF viewer
  const closePDFViewer = () => {
    setSelectedPDF(null);
  };

  // Language options
  const languages = [
    { code: "en", name: "English" },
    { code: "gu", name: "Gujarati" },
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
    { code: "pa", name: "Punjabi" },
    { code: "ur", name: "Urdu" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
              style={{
                color: "#1E65AD",
                fontFamily: "Helvetica Hebrew Bold, sans-serif",
              }}
            >
              Search Judgment by Name
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Find legal judgments by entering the case name, title, or keywords
            </p>
          </motion.div>

          {/* Featured PDFs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 sm:mb-12"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-200">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center"
                style={{
                  color: "#1E65AD",
                  fontFamily: "Helvetica Hebrew Bold, sans-serif",
                }}
              >
                Featured: Aligarh Muslim University vs Naresh Agarwal
              </h2>
              <p
                className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Access all 5 related documents from the case decided on 8 November 2024
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {featuredPDFs.map((pdf, index) => (
                  <motion.div
                    key={pdf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => viewJudgment(pdf)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-blue-200 hover:border-blue-500"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                        </div>
                      </div>
                      <h3
                        className="text-xs sm:text-sm font-bold mb-2 text-center line-clamp-2"
                        style={{
                          color: "#1E65AD",
                          fontFamily: "Helvetica Hebrew Bold, sans-serif",
                        }}
                      >
                        Document {index + 1}
                      </h3>
                      <p
                        className="text-xs text-gray-600 text-center mb-3 line-clamp-2"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {pdf.title.split(" - ")[0]}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewJudgment(pdf);
                        }}
                        className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        View PDF
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <div className="max-w-3xl mx-auto">
              <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter judgment name, case title, or keywords..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  />
                </div>
                <button
                  onClick={searchJudgmentsByName}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto mb-6 sm:mb-8"
              >
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-red-700 text-sm sm:text-base">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          {hasSearched && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              {judgments.length > 0 ? (
                <>
                  <div className="mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base text-gray-600">
                      Found <span className="font-semibold text-blue-600">{judgments.length}</span>{" "}
                      {judgments.length === 1 ? "judgment" : "judgments"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <AnimatePresence>
                      {judgments.map((judgment, index) => (
                        <motion.div
                          key={judgment.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => viewJudgment(judgment)}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200"
                        >
                          <div className="p-4 sm:p-6">
                            {/* Title */}
                            <h3
                              className="text-base sm:text-lg font-bold mb-3 sm:mb-4 line-clamp-2"
                              style={{
                                color: "#1E65AD",
                                fontFamily: "Helvetica Hebrew Bold, sans-serif",
                              }}
                            >
                              {judgment.title || judgment.short_title || "Untitled Judgment"}
                            </h3>

                            {/* Case Number */}
                            {judgment.case_number && (
                              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                  {judgment.case_number}
                                </p>
                              </div>
                            )}

                            {/* Court Name */}
                            {judgment.court_name && (
                              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <Scale className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                  {judgment.court_name}
                                </p>
                              </div>
                            )}

                            {/* Decision Date */}
                            {judgment.decision_date && (
                              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {new Date(judgment.decision_date).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            )}

                            {/* Summary */}
                            {judgment.summary && (
                              <p
                                className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                              >
                                {judgment.summary}
                              </p>
                            )}

                            {/* View Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewJudgment(judgment);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              View Details
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <FileText className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg sm:text-xl text-gray-600 mb-2">No judgments found</p>
                  <p className="text-sm sm:text-base text-gray-500">
                    Try different keywords or search terms
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md p-4 sm:p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedPDF && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={closePDFViewer}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex-1">
                  <h3
                    className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1"
                    style={{
                      fontFamily: "Helvetica Hebrew Bold, sans-serif",
                    }}
                  >
                    {selectedPDF.title || selectedPDF.short_title || "PDF Viewer"}
                  </h3>
                  {selectedPDF.case_number && (
                    <p className="text-sm text-blue-100">{selectedPDF.case_number}</p>
                  )}
                </div>
                
                {/* Language Selector */}
                <div className="flex items-center gap-3 mr-4">
                  <label className="text-white text-sm font-medium">Language:</label>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all text-sm font-medium cursor-pointer"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="text-gray-800">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Close Button */}
                <button
                  onClick={closePDFViewer}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* PDF Content */}
              <div className="flex-1 overflow-auto p-4 sm:p-6">
                <div className="h-full">
                  <TranslatedPDF 
                    fileUrl={selectedPDF.pdfUrl} 
                    targetLang={selectedLang} 
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

