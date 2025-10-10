// Sidebar.js
import { useNavigate } from "react-router-dom";

import {
  Home,
  FileText,
  BookOpen,
  GitBranch,
  FileCheck,
  Youtube,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Judgments Access", icon: FileText, path: "/judgments" },
  { name: "Legal Reference Library", icon: BookOpen, path: "/library" },
  { name: "Old To New Law Mapping", icon: GitBranch, path: "/mapping" },
  { name: "Legal Document Templates", icon: FileCheck, path: "/templates" },
  { name: "Youtube Video Summary", icon: Youtube, path: "/videos" },
  { name: "Legal Chatbot", icon: MessageCircle, path: "/chatbot" },
];

export default function Sidebar({ expanded, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300",
        expanded ? "w-64" : "w-16",
        "h-screen" // always 100% viewport height
      )}
      style={{ overflow: "fixed" }} // disable scrolling
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {expanded && <img src="/logo.png" alt="सलाहकार Logo" className="h-8 w-auto object-contain" />}
        {expanded && <span className="text-lg font-semibold">सलाहकार</span>}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          {expanded ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 cursor-pointer"
            >
              <Icon size={20} />
              {expanded && <span className="text-sm font-medium">{item.name}</span>}
            </div>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-slate-700">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 cursor-pointer"
        >
          <LogOut size={20} />
          {expanded && <span className="text-sm font-medium">Logout</span>}
        </div>
      </div>

      {/* Footer Stats */}
      {expanded && (
        <div className="p-4 border-t border-slate-700 text-sm space-y-2">
          <p className="flex justify-between text-slate-300">
            <span>Total Judgments</span> <span>10+</span>
          </p>
          <p className="flex justify-between text-slate-300">
            <span>Categories</span> <span>8</span>
          </p>
        </div>
      )}
    </div>
  );
}
