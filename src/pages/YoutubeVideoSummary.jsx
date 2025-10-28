import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";

export default function YoutubeVideoSummary() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);


  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSummarize = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube video URL");
      return;
    }

    if (!validateYouTubeUrl(videoUrl)) {
      setError("Please enter a valid YouTube video URL");
      return;
    }

    setLoading(true);
    setError("");
    setSummary(null);
    setVideoInfo(null);

    // TODO: Implement real API call for video summarization
    setError("Video summarization feature is not yet implemented. Please check back later.");
    setLoading(false);
  };

  const clearForm = () => {
    setVideoUrl("");
    setSummary(null);
    setVideoInfo(null);
    setError("");
  };

  const copySummary = () => {
    if (summary) {
      const textToCopy = `Summary: ${summary.summary}\n\nKey Points:\n${summary.keyPoints.map(point => `• ${point}`).join('\n')}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Summary copied to clipboard!");
      });
    }
  };

  const downloadSummary = () => {
    if (summary && videoInfo) {
      const content = `YouTube Video Summary\n\nTitle: ${videoInfo.title}\nChannel: ${videoInfo.channel}\nDuration: ${videoInfo.duration}\n\nSummary:\n${summary.summary}\n\nKey Points:\n${summary.keyPoints.map(point => `• ${point}`).join('\n')}\n\nTags: ${summary.tags.join(', ')}\n\nGenerated on: ${new Date().toLocaleString()}`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${videoInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              YouTube Video Summary
            </h1>
            <p className="text-lg" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
              Get AI-powered summaries of YouTube videos to quickly understand key content and insights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Input Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Enter YouTube Video URL
                </h2>
                
                <div className="mb-4">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    style={{ fontFamily: 'Roboto, sans-serif', '--tw-ring-color': '#1E65AD' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSummarize()}
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSummarize}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ backgroundColor: '#1E65AD', fontFamily: 'Roboto, sans-serif', minHeight: '44px' }}
                  >
                    {loading ? "Generating Summary..." : "Generate Summary"}
                  </button>
                  <button
                    onClick={clearForm}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 border-2"
                    style={{ 
                      color: '#8C969F', 
                      borderColor: '#8C969F', 
                      fontFamily: 'Roboto, sans-serif' 
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD' }}>
                      Analyzing Video Content
                    </h3>
                    <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Our AI is processing the video to extract key information and generate a comprehensive summary...
                    </p>
                  </div>
                </div>
              )}

              {/* Video Info */}
              {videoInfo && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    Video Information
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img
                        src={videoInfo.thumbnail}
                        alt={videoInfo.title}
                        className="w-full rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/320x180/1E65AD/FFFFFF?text=Video+Thumbnail';
                        }}
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                        {videoInfo.title}
                      </h3>
                      <div className="space-y-2 text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
                        <div><strong>Channel:</strong> {videoInfo.channel}</div>
                        <div><strong>Duration:</strong> {videoInfo.duration}</div>
                        <div><strong>Views:</strong> {videoInfo.views}</div>
                        <div><strong>Published:</strong> {new Date(videoInfo.publishedAt).toLocaleDateString()}</div>
                      </div>
                      <p className="mt-3 text-gray-600 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {videoInfo.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Results */}
              {summary && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      AI-Generated Summary
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copySummary}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Copy
                      </button>
                      <button
                        onClick={downloadSummary}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3" style={{ color: '#1E65AD' }}>Summary</h3>
                    <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {summary.summary}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3" style={{ color: '#1E65AD' }}>Key Points</h3>
                    <ul className="space-y-2">
                      {summary.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3" style={{ color: '#1E65AD' }}>Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          style={{ fontFamily: 'Roboto, sans-serif' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
                    <div>
                      <strong>Confidence:</strong> {Math.round(summary.confidence * 100)}%
                    </div>
                    <div>
                      <strong>Processing Time:</strong> {summary.processingTime}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">

              {/* Tips */}
              <div className="bg-blue-50 rounded-xl p-6 mt-6">
                <h3 className="font-semibold mb-3" style={{ color: '#1E65AD' }}>Tips for Better Summaries</h3>
                <ul className="space-y-2 text-sm" style={{ color: '#8C969F', fontFamily: 'Roboto, sans-serif' }}>
                  <li>• Use videos with clear audio and speech</li>
                  <li>• Educational and informational videos work best</li>
                  <li>• Longer videos (10+ minutes) provide more detailed summaries</li>
                  <li>• Videos with subtitles are processed more accurately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
