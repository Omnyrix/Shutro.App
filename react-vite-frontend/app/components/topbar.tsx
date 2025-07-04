import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function TopBarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Spacer for status bar/notch */}
      <div
        className="w-full"
        style={{ height: "env(safe-area-inset-top, 0px)", background: "#111827" /* bg-gray-900 */ }}
      />
      {/* Top Bar */}
      <header
        className="fixed left-0 right-0 bg-gray-900 shadow-md flex items-center px-4 py-2 z-50"
        style={{
          top: "env(safe-area-inset-top, 0px)"
        }}
      >
        <button
          className="p-2 rounded-md hover:bg-gray-700"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="text-2xl text-white" />
        </button>
        <Link to="/home" className="flex items-center gap-2 ml-4">
          <img src="https://shutro.netlify.app/favicon.ico" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-400">Shutro.App</span>
        </Link>
      </header>
      {/* Main Content (offset by the header height + safe area inset) */}
      <main
        className="pt-20"
        style={{ paddingTop: "calc(56px + env(safe-area-inset-top, 0px))" }}
      >
        {children}
      </main>
    </div>
  );
}
