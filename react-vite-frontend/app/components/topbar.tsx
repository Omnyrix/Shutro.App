// components/TopBarLayout.tsx
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import AppIcon from "../assets/app-icon.png";  // <-- use local asset

export default function TopBarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Spacer for the status bar / notch */}
      <div
        className="w-full bg-gray-900"
        style={{ height: "env(safe-area-inset-top, 0px)" }}
      />

      {/* Top Bar stays exactly the same */}
      <header
        className="fixed left-0 right-0 bg-gray-900 shadow-md flex items-center px-4 py-2 z-50"
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <button
          className="p-2 rounded-md hover:bg-gray-700"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="text-2xl text-white" />
        </button>
        <Link to="/home" className="flex items-center gap-2 ml-4">
          <img src={AppIcon} alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-400">Shutro.App</span>
        </Link>
      </header>

      {/* Main content padded below both the safe-area inset and the bar height (56px) */}
      <main
        className="w-full"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)" }}
      >
        {children}
      </main>
    </div>
  );
}
