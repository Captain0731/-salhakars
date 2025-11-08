import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import { Search, FileText, ArrowRight } from 'lucide-react';

export default function JudgmentSearch() {
  const [judgmentId, setJudgmentId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (judgmentId.trim()) {
      navigate(`/judgment-details/${judgmentId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Search Judgment by ID
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Enter a judgment ID to view detailed information and PDF
            </p>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={judgmentId}
                    onChange={(e) => setJudgmentId(e.target.value)}
                    placeholder="Enter Judgment ID (e.g., 12345)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!judgmentId.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <span>Search</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    How to find Judgment ID
                  </h3>
                  <ul className="text-xs sm:text-sm text-blue-800 space-y-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <li>• The Judgment ID is a unique number assigned to each judgment</li>
                    <li>• You can find it in the judgment list or from bookmarked judgments</li>
                    <li>• Enter the numeric ID to view complete judgment details</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

