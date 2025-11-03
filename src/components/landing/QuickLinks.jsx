import { useNavigate } from "react-router-dom";

const QuickLinks = () => {
  const navigate = useNavigate();
  
  const links = [
    { label: "Legal Judgment", path: "/judgment-access" },
    { label: "Law Library", path: "/law-library" },
    { label: "Law Mapping", path: "/law-mapping" },
    { label: "Legal Templates", path: "/legal-template" },
    // { label: "YouTube Summarizer", path: "/youtube-summary" }
  ];

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap sm:justify-center gap-2.5 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4 lg:px-8 max-w-4xl mx-auto">
      {links.map((link, i) => (
        <button
          key={i}
          onClick={() => navigate(link.path)}
          className="w-full sm:w-auto px-3 sm:px-4 md:px-5 lg:px-6 py-3 sm:py-2.5 md:py-3 rounded-lg sm:rounded-full border-2 border-sky-200 
                     text-slate-700 font-medium text-xs sm:text-sm md:text-base
                     bg-white/70 backdrop-blur-sm
                     hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-600 
                     hover:text-white hover:border-sky-500 active:bg-gradient-to-r active:from-sky-500 active:to-indigo-600 
                     active:text-white active:border-sky-500
                     shadow-sm hover:shadow-lg active:shadow-md
                     transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300
                     touch-manipulation"
          style={{ minHeight: '50px' }}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
};

export default QuickLinks;

