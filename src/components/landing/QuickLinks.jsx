import { useNavigate } from "react-router-dom";

const QuickLinks = () => {
  const navigate = useNavigate();
  
  const links = [
    { label: "Legal Judgment", path: "/judgment-access" },
    { label: "Law Library", path: "/law-library" },
    { label: "Law Mapping", path: "/law-mapping" },
    { label: "Legal Templates", path: "/legal-template" },
    { label: "YouTube Summarizer", path: "/youtube-summary" }
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
      {links.map((link, i) => (
        <button
          key={i}
          onClick={() => navigate(link.path)}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 rounded-full border-2 border-sky-200 
                     text-slate-700 font-medium text-sm sm:text-base
                     bg-white/70 backdrop-blur-sm
                     hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-600 
                     hover:text-white hover:border-sky-500 
                     shadow-sm hover:shadow-lg 
                     transform hover:-translate-y-1 transition-all duration-300
                     touch-manipulation"
          style={{ minHeight: '44px' }}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
};

export default QuickLinks;

