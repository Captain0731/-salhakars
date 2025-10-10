import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm  rounded-xl mb-6 flex justify-between flex-wrap">
      <div>
        <h1 className="text-3xl font-bold">
          Legal Judgment <span className="text-orange-500">Research</span>
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Search, analyze and translate court judgments across multiple jurisdictions
        </p>
      </div>

      <div>
        {/* Top buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="border px-5 py-2 rounded-md hover:bg-slate-50"
            onClick={() => navigate("/judgments")}
          >
            📖 Browse Judgments
          </button>

          <button className="border px-4 py-2 rounded-md hover:bg-slate-50">
            📂 Browse Categories
          </button>
        </div>
      </div>
    </header>
  );
}
