
import { FileText, Calendar, BookOpen, TrendingUp } from "lucide-react";

const cards = [
  {
    title: "Total Judgments",
    value: "16M+",
    desc: "Comprehensive database",
    icon: <FileText className="text-blue-500" size={22} />,
  },
  {
    title: "This Month",
    value: "12K+",
    desc: "Latest additions",
    icon: <Calendar className="text-green-500" size={22} />,
  },
  {
    title: "Legal Resources",
    value: "500+",
    desc: "Acts & References",
    icon: <BookOpen className="text-purple-500" size={22} />,
  },
  {
    title: "Active Users",
    value: "10K+",
    desc: "Growing daily",
    icon: <TrendingUp className="text-indigo-500" size={22} />,
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-slate-500 font-medium">
              {card.title}
            </h3>
            {card.icon}
          </div>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
          <p className="text-xs text-green-600 mt-1">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
