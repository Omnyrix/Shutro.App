import { getCookie, eraseCookie } from "../utils/cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaCog, FaSignOutAlt, FaHome, FaUser } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user data on mount
  useEffect(() => {
    const session = getCookie("session");
    if (!session) {
      navigate("/welcome");
      return;
    }

    setUserEmail(session);

    // Fetch username from backend
    async function fetchUser() {
      try {
        const userRes = await fetch(`${backendUrl}/user/${session}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsername(userData.username.toLowerCase());
        } else {
          setUsername(session.toLowerCase());
        }
      } catch (err) {
        console.warn("Failed to load user data:", err);
      }
    }

    fetchUser();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    eraseCookie("session");
    navigate("/welcome");
  }

  const UserIcon = ({ username }: { username: string | null }) => {
    return username ? (
      <img
        src={`${backendUrl}/user-icon/${username}.png`}
        alt="User Avatar"
        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-gray-200 border-2 border-sky-400"
        style={{ minWidth: 40, minHeight: 40 }}
      />
    ) : null;
  };

  const ProfilePanel = (
    <div className="absolute top-6 right-8 z-20">
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center focus:outline-none"
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="Profile"
        >
          {username && <UserIcon username={username} />}
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-900 rounded-lg shadow-lg py-2">
            <button
              className="w-full text-left px-4 py-2 text-gray-200 hover:bg-sky-700 transition"
              onClick={() => setDropdownOpen(false)}
            >
              <FaCog className="inline mr-2" /> Settings
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-200 hover:bg-sky-700 transition"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUser className="inline mr-2" /> Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const MobileNav = (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-gray-900 flex justify-around items-center py-2 border-t border-gray-800 md:hidden">
      <button className="flex flex-col items-center text-sky-400 focus:outline-none">
        <FaHome className="text-2xl" />
        <span className="text-xs">Home</span>
      </button>
      <button className="flex flex-col items-center text-sky-400 focus:outline-none">
        <FaCog className="text-2xl" />
        <span className="text-xs">Settings</span>
      </button>
      <button className="flex flex-col items-center text-sky-400 focus:outline-none">
        {username && <UserIcon username={username} />}
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-blue-950 flex flex-col">
      <div className="hidden md:block">{ProfilePanel}</div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-80">
          <div className="mb-6 text-center">
            {username && <UserIcon username={username} />}
            <h1 className="text-xl font-bold text-blue-900 mt-2">Home</h1>
            <p className="text-gray-600 mt-2">Welcome to Shutro.app!</p>
          </div>
        </div>
      </div>

      {MobileNav}
    </div>
  );
}
