import { useState, useRef, useEffect } from "react";
import { FaUser, FaHome, FaCog } from "react-icons/fa";
import { eraseCookie, getCookie } from "../utils/cookie";
import axios from "axios"; // Import axios for API calls

const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use environment variable for backend URL

export default function ProfileMenu() {
  const [username, setUsername] = useState<string | null>(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getCookie("session");
    if (!session) {
      setUsername("User"); // Fallback if session is missing
      return;
    }

    // Fetch user data from backend using email stored in session cookie
    axios.get(`${backendUrl}/user/${session}`)
      .then(res => {
        setUsername(res.data.username);
      })
      .catch(() => {
        setUsername("User"); // Fallback in case of error
      });

    function handleClickOutside(event: MouseEvent) {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    }
    if (desktopDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [desktopDropdownOpen]);

  const handleLogout = () => {
    eraseCookie("session");
    window.location.href = "/welcome";
  };

  return (
    <>
      {/* Desktop Profile Dropdown */}
      <div className="w-full hidden md:flex justify-end items-center mb-4">
        <div className="relative" ref={desktopDropdownRef}>
          <button className="flex items-center focus:outline-none" onClick={() => setDesktopDropdownOpen((prev) => !prev)} aria-label="Profile Menu">
            <FaUser className="text-2xl" />
          </button>
          {desktopDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 z-10">
              <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700 text-center">{username}</div>
              <button onClick={() => window.location.href = "/profile"} className="w-full text-left px-4 py-2 hover:bg-sky-700 transition">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-sky-700 transition">Settings</button>
              <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-700 transition" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 flex justify-around items-center py-3 border-t border-gray-800 md:hidden">
        <button onClick={() => window.location.href = "/home"} className="flex flex-col items-center text-sky-400">
          <FaHome className="text-2xl" />
        </button>
        <button className="flex flex-col items-center text-sky-400">
          <FaCog className="text-2xl" />
        </button>
        <button onClick={() => window.location.href = "/profile"} className="flex flex-col items-center text-sky-400">
          <FaUser className="text-2xl" />
        </button>
      </div>
    </>
  );
}
