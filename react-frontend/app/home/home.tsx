import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaHome, FaUser, FaArrowRight } from "react-icons/fa";
import { getCookie, eraseCookie } from "../utils/cookie";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  // Desktop dropdown state
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getCookie("session");
    if (!session) {
      navigate("/welcome");
      return;
    }
    setUsername(session);
  }, [navigate]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    }
    if (desktopDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [desktopDropdownOpen]);

  // Close mobile drawer when clicking outside
  useEffect(() => {
    function handleClickOutsideDrawer(event: MouseEvent) {
      if (mobileDrawerRef.current && !mobileDrawerRef.current.contains(event.target as Node)) {
        setMobileDrawerOpen(false);
      }
    }
    if (mobileDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutsideDrawer);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDrawer);
    };
  }, [mobileDrawerOpen]);

  const handleLogout = () => {
    eraseCookie("session");
    window.location.href = "/welcome";
  };

  const navigateToSubject = (subject: string) => {
    navigate(`/${subject.toLowerCase()}`);
  };

  // For mobile drawer, display name with first letter capitalized
  const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : "";

  return (
    <div className="relative min-h-screen bg-gray-800 text-white p-6 flex flex-col items-center">
      {/* Desktop Top Bar */}
      <div className="w-full hidden md:flex justify-end items-center mb-4">
        <div className="relative" ref={desktopDropdownRef}>
          <button
            className="flex items-center focus:outline-none"
            onClick={() => setDesktopDropdownOpen((prev) => !prev)}
            aria-label="Profile Menu"
          >
            <FaUser className="text-2xl" />
          </button>
          {desktopDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 z-10">
              <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700 text-center">
                {username}
              </div>
              <button className="w-full text-left px-4 py-2 hover:bg-sky-700 transition">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-sky-700 transition">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-700 transition" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Centered Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Welcome {username} to Shutro.App</h1>

      {/* Subject Section */}
      <div className="flex flex-col items-center text-center">
        <p className="text-lg mb-4">Choose a subject:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("physics")}>
            Physics
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("chemistry")}>
            Chemistry
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("highermath")}>
            Higher Math
          </button>
          <button className="bg-green-600 hover:bg-green-700  text-white py-3 px-6 rounded-lg transition" onClick={() => navigateToSubject("biology")}>
            Biology
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav (3 Options Side by Side) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 flex justify-around items-center py-3 border-t border-gray-800 md:hidden">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center text-sky-400">
          <FaHome className="text-2xl" />
        </button>
        <button className="flex flex-col items-center text-sky-400">
          <FaCog className="text-2xl" />
        </button>
        <button onClick={() => setMobileDrawerOpen(true)} className="flex flex-col items-center text-sky-400">
          <FaUser className="text-2xl" />
        </button>
      </div>

      {/* Mobile Profile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end">
          <div
            ref={mobileDrawerRef}
            className="w-64 bg-gray-900 h-full p-4 relative transform transition-transform duration-300"
          >
            {/* Close Drawer */}
            <button className="absolute top-4 right-4 text-white" onClick={() => setMobileDrawerOpen(false)}>
              <FaArrowRight />
            </button>
            <div className="mt-8 flex flex-col items-center">
              {/* Default Logo */}
              <FaUser className="text-6xl mb-2" />
              {/* Display Name */}
              <div className="mb-4 text-lg font-semibold">{displayName}</div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-sky-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
