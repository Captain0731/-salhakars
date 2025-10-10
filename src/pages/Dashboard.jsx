import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import DashboardCards from "../components/DashboardCards";
import RecentJudgments from "../components/RecentJudgment";

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <Header />
      <SearchBar />
      <DashboardCards />

      <RecentJudgments />
    </div>
  );
}
