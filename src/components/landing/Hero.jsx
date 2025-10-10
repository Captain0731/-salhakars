import SearchBar from "./SearchBar";
import QuickLinks from "./QuickLinks";
import logo from "../../assets/logo1.png"

const Hero = () => {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center 
                 bg-gradient-to-b from-sky-50 via-white to-indigo-50 overflow-hidden"
    >
      {/* Decorative glowing orbs */}
      <div className="absolute w-80 h-80 bg-sky-200/30 rounded-full top-10 left-10 blur-3xl animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-indigo-200/30 rounded-full bottom-16 right-16 blur-3xl animate-pulse"></div>

      {/* Heading */}
      <div className="flex flex-col items-center justify-center mb-6 z-10">
        {/* <img src={logo} alt="सलाहकार Logo" className="h-16 w-auto object-contain mb-4" /> */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-4 tracking-tight">
          सलाहकार
        </h1>

        <p className="text-slate-600 text-lg md:text-2xl max-w-3xl px-4 leading-relaxed">
          India’s first{" "}
          <span className="font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered
          </span>{" "}
          multilingual legal tech platform
        </p>
      </div>

      {/* Search + Quick Links */}
      <div className="z-10 mt-8 w-full max-w-3xl">
        <SearchBar />
        <QuickLinks />
      </div>

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-100"></div>
    </section>
  );
};

export default Hero;
