// Home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eraseCookie, getCookie } from "../utils/cookie";
import { GiAtom, GiChemicalDrop, GiFrog } from "react-icons/gi";
import { FaCalculator, FaBars } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import SidePanel from "../components/sidepanel";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNoInternet, setShowNoInternet] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const email = await getCookie("session");
      if (!email) {
        // No session cookie: demo mode
        setIsLoggedIn(false);
        setIsDemo(true);
        setUsername("");
        return;
      }
      try {
        const res = await axios.get(`${backendUrl}/user/${email}`);
        if (res.data && res.data.username) {
          // Valid user: logged in mode
          setUsername(res.data.username.charAt(0).toUpperCase() + res.data.username.slice(1));
          setIsLoggedIn(true);
          setIsDemo(false);
          setShowNoInternet(false);
        } else {
          // User not found: erase cookie, demo mode
          await eraseCookie("session");
          setIsLoggedIn(false);
          setIsDemo(true);
          setUsername("");
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // User not found: erase cookie, demo mode
          await eraseCookie("session");
          setIsLoggedIn(false);
          setIsDemo(true);
          setUsername("");
        } else {
          // Network/server error: show no internet, keep previous state
          setShowNoInternet(true);
        }
      }
    }

    // Ping Google to check for internet connectivity (non-blocking)
    async function checkInternet() {
      try {
        // Use a lightweight request, avoid CORS error by using a public endpoint that allows it
        // Google's favicon is a small file and allows CORS
        await fetch("https://www.google.com/favicon.ico", { method: "HEAD", mode: "no-cors" });
        // If fetch does not throw, assume internet is available
      } catch {
        setShowNoInternet(true);
      }
    }
    checkSession();
    checkInternet();
    // eslint-disable-next-line
  }, []);

  const subjectList = [
    { route: "#/physics", name: "Physics", icon: <GiAtom className="text-2xl" style={{ color: "#1D4ED8" }} /> },
    { route: "#/chemistry", name: "Chemistry", icon: <GiChemicalDrop className="text-2xl" style={{ color: "#EA580C" }} /> },
    { route: "#/highermath", name: "Higher Math", icon: <FaCalculator className="text-2xl" style={{ color: "#8B5CF6" }} /> },
    { route: "#/biology", name: "Biology", icon: <GiFrog className="text-2xl" style={{ color: "#10B981" }} /> },
  ];

  const handleSubjectClick = (route: string) => {
    setTimeout(() => {
      window.location.href = route;
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 text-white overflow-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-md flex items-center justify-between px-4 py-2 z-50">
        <div className="flex items-center gap-2">
          <img src="https://shutro.netlify.app/favicon.ico" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-400">Shutro.App</span>
        </div>
        <button onClick={() => setPanelOpen(true)} className="rounded-md p-1">
          <FaBars className="text-2xl cursor-pointer" />
        </button>
      </header>

      {/* NO INTERNET POPOUT */}
      {isDemo && showNoInternet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-90">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg px-4 sm:px-8 py-4 sm:py-6 flex flex-col items-center w-[90vw] max-w-xs sm:max-w-sm md:max-w-md border border-blue-400 scale-[0.95] sm:scale-100 transition-transform duration-200">
            <span className="text-3xl mb-2">⚠️</span>
            <h2 className="font-bold text-lg mb-2 text-blue-400">No Internet Connection</h2>
            <p className="text-center text-sm mb-2">
              We couldn't reach the server. Please check your connection.
            </p>
            <p className="text-center text-xs text-gray-400 mb-2">
              <span className="font-semibold text-blue-300">Tip:</span> Log in to enable offline access to the app.
            </p>
            <p className="text-xs text-gray-400 mb-4">This message will disappear once connection is restored.</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="pt-16 p-6 h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-white">Welcome</span>{" "}
          <span style={{ color: "#1D4ED8" }}>{isLoggedIn ? username : " "}</span>{" "}
          <span className="text-white">to</span>{" "}
          <span className="text-blue-400">Shutro.App</span>
        </h1>

        <div className="flex flex-col items-center text-center w-full">
          <p className="text-lg mb-4">Choose a subject:</p>
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            {subjectList.map((subject, index) => (
              <motion.div
                key={index}
                className="subject-button cursor-pointer"
                onClick={() => handleSubjectClick(subject.route)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
                <div className="flex items-center gap-4 py-4 px-5">
                  {subject.icon}
                  <p className="text-lg font-semibold text-left text-gray-400">
                    {subject.name}
                  </p>
                </div>
                <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Side Panel */}
      <SidePanel
        isPanelOpen={isPanelOpen}
        setPanelOpen={setPanelOpen}
        username={username}
        isDemo={isDemo}
      />

      <footer className="absolute bottom-0 w-full py-4 bg-gray-800 text-gray-400 flex items-center justify-center text-sm sm:text-base">
        <p>&copy; 2025 Shutro.App - All Rights Reserved</p>
      </footer>
    </div>
  );
}