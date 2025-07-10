import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eraseCookie, getCookie } from "../utils/cookie";
import { GiAtom, GiChemicalDrop, GiFrog } from "react-icons/gi";
import { FaCalculator, FaBars } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import SidePanel from "../components/sidepanel";
import NoInternetWarning from "../components/noInternetWarning";
import AppIcon from "../assets/app-icon.png"; // <-- use local asset

// Capacitor StatusBar imports
import { StatusBar, Style } from '@capacitor/status-bar';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Set the native status bar background color & style
    StatusBar.setBackgroundColor({ color: '#111827' });
    StatusBar.setStyle({ style: Style.Dark });

    async function checkSession() {
      const email = await getCookie("session");

      // no session → demo mode
      if (!email) {
        setIsLoggedIn(false);
        setIsDemo(true);
        setUsername("");
        return;
      }

      // read last validation timestamp and cached user-info
      const cachedName = await getCookie("user info");
      const lastVal = localStorage.getItem("lastValidated");
      const now = Date.now();
      const VALID_INTERVAL = 1000 * 60 * 60; // 1 hours

      // if we’ve validated recently, use cached value
      if (cachedName && lastVal && now - parseInt(lastVal, 10) < VALID_INTERVAL) {
        setUsername(cachedName);
        setIsLoggedIn(true);
        setIsDemo(false);
        return;
      }

      // otherwise fetch once and validate
      try {
        const res = await axios.get(`${backendUrl}/user/${email}`);
        if (res.data && res.data.username) {
          const formatted =
            res.data.username.charAt(0).toUpperCase() +
            res.data.username.slice(1);
          if (cachedName === formatted) {
            // still matches → update timestamp only
            localStorage.setItem("lastValidated", now.toString());
            setUsername(formatted);
            setIsLoggedIn(true);
            setIsDemo(false);
          } else {
            // mismatch → clear all session data → fallback to demo
            await eraseCookie("session");
            await eraseCookie("user info");
            localStorage.removeItem("lastValidated");
            setUsername("");
            setIsLoggedIn(false);
            setIsDemo(true);
          }
        } else {
          // no username in response → invalidate
          await eraseCookie("session");
          await eraseCookie("user info");
          localStorage.removeItem("lastValidated");
          setUsername("");
          setIsLoggedIn(false);
          setIsDemo(true);
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          // user not found → clear
          await eraseCookie("session");
          await eraseCookie("user info");
          localStorage.removeItem("lastValidated");
          setUsername("");
          setIsLoggedIn(false);
          setIsDemo(true);
        } else {
          // network/server error → keep demo state (or previous)
        }
      }
    }

    checkSession();
    // eslint-disable-next-line
  }, []);

  const subjectList = [
    {
      route: "/physics",
      name: "Physics",
      icon: <GiAtom className="text-2xl" style={{ color: "#1D4ED8" }} />,
    },
    {
      route: "/chemistry",
      name: "Chemistry",
      icon: <GiChemicalDrop className="text-2xl" style={{ color: "#EA580C" }} />,
    },
    {
      route: "/highermath",
      name: "Higher Math",
      icon: <FaCalculator className="text-2xl" style={{ color: "#8B5CF6" }} />,
    },
    {
      route: "/biology",
      name: "Biology",
      icon: <GiFrog className="text-2xl" style={{ color: "#10B981" }} />,
    },
  ];

  const handleSubjectClick = (route: string) => {
    navigate(route);
  };

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

      {/* NO INTERNET POPOUT */}
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

        <div className="flex flex-col items-center text-left w-full">
          <p className="text-sm text-gray-400 mb-5">Pick a subject :</p>
          <div className="flex flex-col gap-3 w-full max-w-[350px] mx-auto">
            {subjectList.map((subject, index) => (
              <motion.div
                key={index}
                className="subject-button cursor-pointer w-full"
                onClick={() => handleSubjectClick(subject.route)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
                <div className="flex items-center gap-4 py-4 px-6">
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
