import { useNavigate } from "react-router-dom";

const QuickLinks = () => {
  const navigate = useNavigate();
  
  const links = [
    { label: "Judgment Access", path: "/judgments" },
    { label: "Old to new law mapping", path: "/mapping" },
    { label: "Legal Templates", path: "/templates" },
    { label: "Youtube Summary", path: "/videos" }
  ];

  return (
  <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
  {links.map((link, i) => (
    <button
      key={i}
      onClick={() => navigate(link.path)}
      className="px-6 py-2 rounded-full border-2 border-sky-200 
                 text-slate-700 font-medium 
                 bg-white/70 backdrop-blur-sm
                 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-600 
                 hover:text-white hover:border-sky-500 
                 shadow-sm hover:shadow-lg 
                 transform hover:-translate-y-1 transition-all duration-300"
    >
      {link.label}
    </button>
  ))}
</div>
  );
};

export default QuickLinks;

