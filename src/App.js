// App.js
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import GoogleTranslate from "./components/GoogleTranslate";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SupremeCourtJudgments from "./pages/SupremeCourtJudgments";
import HighCourtJudgments from "./pages/HighCourtJudgments";
import ViewPDF from "./pages/ViewPDF";
import BrowseActs from "./pages/BrowseActs";
import CentralActs from "./pages/CentralActs";
import StateActs from "./pages/StateActs";
import ActDetails from "./pages/ActDetails";
import OldToNewLawMapping from "./pages/OldToNewLawMapping";
import IPCBNSMapping from "./pages/IPCBNSMapping";
import IEABSAMapping from "./pages/IEABSAMapping";
import LegalTemplate from "./pages/LegalTemplate";
import YoutubeVideoSummary from "./pages/YoutubeVideoSummary";
import LegalChatbot from "./pages/LegalChatbot";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Referral from "./pages/Referral";
import InviteFriends from "./pages/InviteFriends";
import EarnRewards from "./pages/EarnRewards";
import TrackReferrals from "./pages/TrackReferrals";
import OurTeam from "./pages/OurTeam";
import Dashboard from "./pages/Dashboard";
import LanguageSelectorDemo from "./pages/LanguageSelectorDemo";
import ProtectedRoute from "./components/ProtectedRoute";

// Design Variants - Minimalist
import MinimalistShowcase from "./pages/designs/minimalist/index";
import MinimalistHighCourt from "./pages/designs/minimalist/HighCourtJudgments";
import MinimalistSupremeCourt from "./pages/designs/minimalist/SupremeCourtJudgments";

// Design Variants - Glassmorphism
import GlassmorphismShowcase from "./pages/designs/glassmorphism/index";

function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", overflowY: "auto" }}>
      {/* Google Translate Component - Global mount point */}
      <GoogleTranslate />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/language-demo" element={<LanguageSelectorDemo />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        
        {/* Public Routes - No Authentication Required */}
        <Route path="/supreme-court-judgments" element={<SupremeCourtJudgments />} />
        <Route path="/high-court-judgments" element={<HighCourtJudgments />} />
        <Route path="/view-pdf" element={<ViewPDF />} />
        <Route path="/browse-acts" element={<BrowseActs />} />
        <Route path="/central-acts" element={<CentralActs />} />
        <Route path="/state-acts" element={<StateActs />} />
        <Route path="/act-details" element={<ActDetails />} />
        <Route path="/old-to-new-mapping" element={<OldToNewLawMapping />} />
        <Route path="/ipc-bns-mapping" element={<IPCBNSMapping />} />
        <Route path="/iea-bsa-mapping" element={<IEABSAMapping />} />
        <Route path="/legal-template" element={<LegalTemplate />} />
        <Route path="/youtube-summary" element={<YoutubeVideoSummary />} />
        <Route path="/legal-chatbot" element={<LegalChatbot />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Additional Routes for Navigation */}
        <Route path="/judgment-access" element={<SupremeCourtJudgments />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/invite-friends" element={<InviteFriends />} />
        <Route path="/earn-rewards" element={<EarnRewards />} />
        <Route path="/track-referrals" element={<TrackReferrals />} />
        
        {/* Protected Routes - Authentication Required */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Referral Program Routes */}
        <Route path="/referral" element={<Referral />} />
        <Route path="/referral/invite" element={<InviteFriends />} />
        <Route path="/referral/rewards" element={<EarnRewards />} />
        <Route path="/referral/track" element={<TrackReferrals />} />
        
        {/* Design Variant Routes - Minimalist */}
        <Route path="/designs/minimalist" element={<MinimalistShowcase />} />
        <Route path="/designs/minimalist/high-court" element={<MinimalistHighCourt />} />
        <Route path="/designs/minimalist/supreme-court" element={<MinimalistSupremeCourt />} />
        
        {/* Design Variant Routes - Glassmorphism */}
        <Route path="/designs/glassmorphism" element={<GlassmorphismShowcase />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
