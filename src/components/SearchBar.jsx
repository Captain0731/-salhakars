export default function SearchBar() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-3 items-center mb-6">
      <input
        type="text"
        placeholder="Quick search by judge name, case number, or keywords..."
        className="flex-1 border rounded-md p-2 outline-none focus:ring focus:ring-blue-200"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        🎤 Voice Search
      </button>
      <button className="bg-blue-600 text-white px-[40px] py-2 rounded-md hover:bg-blue-700">
        🔎 Search
      </button>
    </div>
  );
}
