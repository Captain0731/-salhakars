// App.js
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import JudgmentsAccess from "./pages/JudgmentsAccess";
import LegalReferenceLibrary from "./pages/LegalReferenceLibrary";
import OldToNewLawMapping from "./pages/OldToNewLawMapping";
import LegalDocumentTemplates from "./pages/LegalDocumentTemplates";
import YoutubeVideoSummary from "./pages/YoutubeVideoSummary";
import LegalChatbot from "./pages/LegalChatbot";
import JudgmentDetails from "./components/JudgmentDetails";

function AppLayout() {
  const [expanded, setExpanded] = useState(true);
  const toggleSidebar = () => setExpanded((prev) => !prev);
  const location = useLocation();

  // Pages that should not show the sidebar
  const noSidebarPaths = ["/", "/login"];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div className="flex">
      {showSidebar && <Sidebar expanded={expanded} toggleSidebar={toggleSidebar} />}
      <div className={`flex-1 transition-all duration-300 ${showSidebar ? (expanded ? "ml-64" : "ml-16") : ""}`}
       style={{ minHeight: "100vh", overflowY: "auto" }}>
        <div className={showSidebar ? "p-6" : ""}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/judgments" element={<JudgmentsAccess />} />
            <Route path="/library" element={<LegalReferenceLibrary />} />
            <Route path="/mapping" element={<OldToNewLawMapping />} />
            <Route path="/templates" element={<LegalDocumentTemplates />} />
            <Route path="/videos" element={<YoutubeVideoSummary />} />
            <Route path="/chatbot" element={<LegalChatbot />} />
            <Route path="/judgment/:cnr" element={<JudgmentDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}
