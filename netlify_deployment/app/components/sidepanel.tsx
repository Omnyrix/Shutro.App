// components/SidePanel.tsx
import { useState, useEffect } from "react"; // Import useState and useEffect
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { eraseCookie } from "../utils/cookie"; // Import eraseCookie
import { FaArrowLeft } from "react-icons/fa"; // Import FaArrowLeft
import axios from "axios"; // Import axios
import { motion } from "framer-motion"; // Import motion

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface SidePanelProps {
  isPanelOpen: boolean;
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  isDemo: boolean;
}


// Animation duration in milliseconds for About section
const aboutAnimMs = 200; // <<<<<<<<<<<  Set animation duration here (ms)

const SidePanel = ({
  isPanelOpen,
  setPanelOpen,
  username,
  isDemo, // <-- receives isDemo from Home
}: SidePanelProps) => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  // Add useEffect to override back button when panel is open
  useEffect(() => {
    if (!isPanelOpen) return;

    // Only add listener if running in Capacitor environment
    const isCapacitor = !!(window as any).Capacitor;
    if (!isCapacitor) return;

    const { App: CapacitorApp } = (window as any).Capacitor.Plugins;

    const backHandler = CapacitorApp.addListener("backButton", (event: any) => {
      setPanelOpen(false);
      // Prevent default navigation/back behavior
      event && event.preventDefault && event.preventDefault();
    });

    return () => {
      backHandler && backHandler.remove && backHandler.remove();
    };
  }, [isPanelOpen, setPanelOpen]);

  async function handleLogout() {
    setLogoutLoading(true);
    eraseCookie("session");
    setLogoutLoading(false);
    navigate("/auth/login");   // Go to home
  }

  const isLoggedIn = !isDemo; // Use isDemo prop to determine login state

  return (
    <motion.div
      className={`absolute top-0 h-full z-50 bg-gray-800 shadow-2xl transition-all duration-150  md:w-1/3 w-full ${isPanelOpen ? 'panel-open' : 'panel-closed'}`}
      style={{
        right: isPanelOpen ? "0" : "-100%",
      }}
    >
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          <button onClick={() => setPanelOpen(false)} className="rounded-md p-1 mb-4">
            <FaArrowLeft className="text-2xl cursor-pointer" />
          </button>
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-900 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {isLoggedIn ? username.charAt(0) : <span className="text-2xl">👤</span>}
            </div>
            <span className="text-xl font-semibold text-white">
              {isLoggedIn ? username : "Guest"}
            </span>
          </div>

          {/* Buttons Section */}
          {isLoggedIn ? (
            <button
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 mb-4 transition-all"
              onClick={() => {
                setPanelOpen(false);
                navigate("/profile");
              }}
            >
              Change Password
            </button>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              <button
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition-all"
                onClick={() => {
                  setPanelOpen(false);
                  navigate("/auth/login");
                }}
              >
                Login
              </button>
              <button
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-md hover:from-purple-600 hover:to-purple-800 transition-all"
                onClick={() => {
                  setPanelOpen(false);
                  navigate("/auth/register");
                }}
              >
                Register
              </button>
            </div>
          )}

          {/* ABOUT */}
          <div>
            <hr className="border-t border-gray-600 opacity-40 mb-2" />
            <button
              onClick={() => setAboutExpanded(!aboutExpanded)}
              className="w-full flex items-center justify-between py-2 px-3 bg-gray-800 text-gray-300"
            >
              <span>About</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', transition: `transform ${aboutAnimMs}ms cubic-bezier(0.4,0,0.2,1)` }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: aboutExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: `transform ${aboutAnimMs}ms cubic-bezier(0.4,0,0.2,1)`
                  }}
                >
                  <path d="M6 8l4 4 4-4" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <hr className="border-t border-gray-600 opacity-40 mt-2" />
            <div
              style={{
                maxHeight: aboutExpanded ? 300 : 0,
                opacity: aboutExpanded ? 1 : 0,
                marginTop: aboutExpanded ? 8 : 0,
                transition: `max-height ${aboutAnimMs}ms cubic-bezier(0.4,0,0.2,1), opacity ${aboutAnimMs}ms cubic-bezier(0.4,0,0.2,1), margin-top ${aboutAnimMs}ms cubic-bezier(0.4,0,0.2,1)`,
                overflow: 'hidden',
                willChange: 'max-height, opacity, margin-top'
              }}
            >
              <p className="text-sm text-gray-400">
                Shutro.App is an app that will contain all your mathematical formulas for all the subjects; Physics , Chemistry, Higher Math and Biology.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Developed by MRKAS05.
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-800 transition-all"
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SidePanel;