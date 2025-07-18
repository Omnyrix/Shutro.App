import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import { GiAtom, GiChemicalDrop, GiFrog } from "react-icons/gi";
import { FaCalculator, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import SidePanel from "../components/sidepanel";
import NoInternetWarning from "../components/noInternetWarning";
import AppIcon from "../assets/app-icon.webp";

// Capacitor StatusBar imports
import { StatusBar, Style } from '@capacitor/status-bar';

export default function Home() {
  const navigate = useNavigate();
  const [username] = useState("");          // always blank here
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    StatusBar.setBackgroundColor({ color: '#111827' });
    StatusBar.setStyle({ style: Style.Dark });

    getCookie("session").then(session => {
      if (session) {
        setIsLoggedIn(true);
        setIsDemo(false);
      } else {
        setIsLoggedIn(false);
        setIsDemo(true);
      }
    });
  }, []);

  const subjectList = [
    { route: "/physics",    name: "Physics",     icon: <GiAtom className="text-2xl" style={{ color: "#1D4ED8" }} /> },
    { route: "/chemistry",  name: "Chemistry",   icon: <GiChemicalDrop className="text-2xl" style={{ color: "#EA580C" }} /> },
    { route: "/highermath", name: "Higher Math", icon: <FaCalculator className="text-2xl" style={{ color: "#8B5CF6" }} /> },
    { route: "/biology",    name: "Biology",     icon: <GiFrog className="text-2xl" style={{ color: "#10B981" }} /> },
  ];

  return (
    <div className="fixed inset-0 bg-gray-800 text-white overflow-hidden">
      {/* Spacer for status bar/notch */}
      <div
        className="w-full"
        style={{ height: "env(safe-area-inset-top, 0px)", background: "#111827" }}
      />

      {/* HEADER */}
      <header
        className="fixed left-0 right-0 bg-gray-900 shadow-md flex items-center justify-between px-4 py-2 z-50"
        style={{
          top: "env(safe-area-inset-top, 0px)",
          height: 56,
        }}
      >
        <div className="flex items-center gap-2">
          <img src={AppIcon} alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-blue-400">Shutro.App</span>
        </div>
        <button onClick={() => setPanelOpen(true)} className="rounded-md p-1">
          <FaBars className="text-2xl cursor-pointer" />
        </button>
      </header>

      {/* DEMO MODE WARNING */}
      {isDemo && <NoInternetWarning />}

      {/* MAIN */}
      <main
        className="pt-24 p-6 h-full overflow-hidden"
        style={{ paddingTop: "calc(80px + env(safe-area-inset-top, 0px))" }}
      >
        <h1
          className="font-bold text-center mb-2 leading-tight"
          style={{ fontSize: "31px" }}
        >
          <span className="text-white">ELEV∆TE </span><span>YOUR </span>
          <span className="text-blue-400">EQUATIΩNS</span>
        </h1>

        <div className="flex flex-col items-center w-full">
          <p className="text-sm text-gray-400 mb-5">Pick a subject :</p>
          <div className="flex flex-col gap-3 w-full max-w-[350px] mx-auto">
            {subjectList.map((s, i) => (
              <motion.div
                key={i}
                className="subject-button cursor-pointer w-full"
                onClick={() => navigate(s.route)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22,1,0.36,1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
                <div className="flex items-center gap-4 py-4 px-6">
                  {s.icon}
                  <p className="text-lg font-semibold text-gray-400">{s.name}</p>
                </div>
                <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* SIDE PANEL */}
      <SidePanel
        isPanelOpen={isPanelOpen}
        setPanelOpen={setPanelOpen}
        username={username}
        isDemo={isDemo}
      />

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full py-4 bg-gray-800 text-gray-400 flex items-center justify-center text-sm sm:text-base">
        <p>&copy; 2025 Shutro.App - All Rights Reserved</p>
      </footer>
    </div>
  );
}
