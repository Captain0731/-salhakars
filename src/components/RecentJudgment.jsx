import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default function RecentJudgments({ noInnerScroll = false, maxHeight = "500px" }) {
  const [judgments, setJudgments] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    fetch("https://efe7dedccc17.ngrok-free.app/judgements", {
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((response) => {
        if (!mounted) return;
        // API returns {data: [...], next_cursor: {...}, pagination_info: {...}}
        if (response && Array.isArray(response.data)) {
          setJudgments(response.data);
        } else {
          setJudgments([]);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("Error loading judgments:", err);
        setError("Failed to load judgments.");
        setJudgments([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (judgments === null) {
    return (
      <div className="max-w-6xl mx-auto p-2">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Recent Judgments</h2>
        <p>Loading…</p>
      </div>
    );
  }

  // Pagination calculations
  const totalResults = judgments.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIdx = (currentPage - 1) * resultsPerPage;
  const currentJudgments = judgments.slice(startIdx, startIdx + resultsPerPage);

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  return (
    <div className="max-w-10xl mx-auto py-2">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
        Recent Judgments
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-4">
        Total results: <span className="font-semibold">{totalResults}</span>
      </p>

      {error && <div className="mb-4 text-sm sm:text-base text-red-600">{error} (see console)</div>}

      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div
          className={`divide-y divide-gray-200 ${noInnerScroll ? "" : "overflow-y-auto"}`}
          style={noInnerScroll ? {} : { maxHeight }}
        >
          {currentJudgments.length === 0 ? (
            <div className="p-6 text-gray-600 text-sm sm:text-base">No judgments found.</div>
          ) : (
            currentJudgments.map((judgment, idx) => (
              <div
                key={judgment.cnr || judgment.id || idx}
                className="p-5 hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900">
                    {judgment.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-gray-600 text-xs sm:text-sm md:text-base mt-3">
                    {judgment.judge && (
                      <span>
                        <span className="font-medium text-gray-800">Judge:</span>{" "}
                        {judgment.judge}
                      </span>
                    )}
                    {judgment.court_name && (
                      <span>
                        <span className="font-medium text-gray-800">Court:</span>{" "}
                        {judgment.court_name}
                      </span>
                    )}
                    {judgment.decision_date && (
                      <span>
                        <span className="font-medium text-gray-800">Decision Date:</span>{" "}
                        {formatDate(judgment.decision_date)}
                      </span>
                    )}
                    {judgment.disposal_nature && (
                      <span>
                        <span className="font-medium text-gray-800">Status:</span>{" "}
                        {judgment.disposal_nature}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/judgment/${judgment.cnr || idx}`, { state: judgment })
                    }
                    className="px-4 py-2 text-sm sm:text-base md:text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                  {judgment.pdf_link && (
                    <a
                      href={judgment.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        console.log('Opening PDF:', judgment.pdf_link);
                      }}
                      className="px-4 py-2 text-sm sm:text-base md:text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      PDF
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => goToPage(1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}
