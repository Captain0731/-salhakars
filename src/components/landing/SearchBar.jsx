import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const sentences = [
  "  Judgments",
  " Old to new law mapping",
  " Legal Templates",
  " Youtube Summary"
];

const TYPING_SPEED = 80; // milliseconds per character
const PAUSE_DELAY = 1500; // delay before next sentence

const SearchBar = () => {
  const navigate = useNavigate();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    let charIndex = 0;
    let typingTimeout;

    const typeSentence = () => {
      const sentence = sentences[currentSentenceIndex];
      if (charIndex < sentence.length) {
        setDisplayedText(prev => prev + sentence.charAt(charIndex));
        charIndex++;
        typingTimeout = setTimeout(typeSentence, TYPING_SPEED);
      } else {
        // Wait before deleting and moving to next sentence
        typingTimeout = setTimeout(() => {
          setDisplayedText("");
          setCurrentSentenceIndex((currentSentenceIndex + 1) % sentences.length);
        }, PAUSE_DELAY);
      }
    };

    typeSentence();

    return () => clearTimeout(typingTimeout);
  }, [currentSentenceIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Navigate to dashboard; filters live there now
      navigate(`/dashboard?search=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-5 flex justify-center">
      <form onSubmit={handleSearch} className="flex bg-white rounded-full p-1 sm:p-2 shadow-lg items-center gap-1 sm:gap-2 w-full max-w-5xl">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={displayedText || "Search..."}
          className="flex-1 rounded-full outline-none px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-gray-700 text-sm sm:text-base md:text-lg"
        />
        <button 
          type="submit"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-950 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform flex-shrink-0"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

