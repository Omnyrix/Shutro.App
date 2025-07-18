// app/routes/subjects/physics_1st/chapter-selection-page.tsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/topbar";
import NoInternetWarning from "../../../components/noInternetWarning";
import { motion } from "framer-motion";
import { getCookie, readScrollMap, writeScrollMap } from "../../../utils/cookie";

// actual Chapter-1 component
import Phy1stCh1 from "./ch-1";
// placeholders for future chapters—replace with real imports when ready
//import Phy1stCh2 from "./ch-2";
//import Phy1stCh3 from "./ch-3";
//import Phy1stCh4 from "./ch-4";
//import Phy1stCh5 from "./ch-5";
//import Phy1stCh6 from "./ch-6";
//import Phy1stCh7 from "./ch-7";
//import Phy1stCh8 from "./ch-8";
//import Phy1stCh9 from "./ch-9";
//import Phy1stCh10 from "./ch-10";

export default function ChapterSelectionPhysics1st() {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(false);
  const [showCh1, setShowCh1] = useState(false);           // ← new state
  const containerRef = useRef<HTMLDivElement>(null);

  // unique identifier for this page’s scroll position
  const mapKey = "physicsp1scrollpos";

  // gap (px) between bottom of scroll section and bottom of screen
  const scrollSectionBottomOffset = 1;

  useEffect(() => {
    async function checkSession() {
      const email = await getCookie("session");
      setIsDemo(!email);
    }
    checkSession();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // restore saved scroll position
    readScrollMap().then(map => {
      const savedPos = map[mapKey];
      if (typeof savedPos === "number") {
        el.scrollTop = savedPos;
      }
    });

    const onScroll = async () => {
      const { scrollTop } = el;
      const map = await readScrollMap();
      map[mapKey] = scrollTop;
      await writeScrollMap(map);
    };

    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mapKey]);

  const chapters = [
    { id: 1, route: "/physics/1st-paper/ch-1", title: "Chapter 1", subtitle: "Kinematics" },
    { id: 2, route: "/physics/1st-paper/ch-2", title: "Chapter 2", subtitle: "Dynamics" },
    { id: 3, route: "/physics/1st-paper/ch-3", title: "Chapter 3", subtitle: "Work & Energy" },
    { id: 4, route: "/physics/1st-paper/ch-4", title: "Chapter 4", subtitle: "Momentum" },
    { id: 5, route: "/physics/1st-paper/ch-5", title: "Chapter 5", subtitle: "Rotational Motion" },
    { id: 6, route: "/physics/1st-paper/ch-6", title: "Chapter 6", subtitle: "Gravitation" },
    { id: 7, route: "/physics/1st-paper/ch-7", title: "Chapter 7", subtitle: "Properties of Matter" },
    { id: 8, route: "/physics/1st-paper/ch-8", title: "Chapter 8", subtitle: "Thermodynamics" },
    { id: 9, route: "/physics/1st-paper/ch-9", title: "Chapter 9", subtitle: "Oscillations" },
    { id: 10, route: "/physics/1st-paper/ch-10", title: "Chapter 10", subtitle: "Waves" },
  ];

  // early return: render Chapter-1 component inline
  if (showCh1) {
    return <Phy1stCh1 onBack={() => setShowCh1(false)} />;
  }

  return (
    <div className="relative min-h-screen font-bengali">
      {isDemo && <NoInternetWarning />}

      {/* Fixed TopBar at top, no background behind it */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-transparent">
        <TopBar />
      </div>

      {/* Content background covers full screen */}
      <div
        className="absolute inset-0 bg-gray-800 text-white p-6 pt-20 flex flex-col items-center overflow-hidden"
        style={{ fontFamily: '"Noto Sans Bengali", sans-serif' }}
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          <span style={{ color: "#1D4ED8" }}>Physics</span>{" "}
          <span className="text-white">Chapters</span>
        </h1>

        <p className="text-sm mb-2 text-gray-400 text-center">
          Pick a chapter:
        </p>

        <div className="flex-1 relative w-full mx-4 sm:mx-auto mt-1 max-w-md">
          {/* scrollable region */}
          <div
            ref={containerRef}
            className="absolute inset-x-0 overflow-y-auto hide-scrollbar px-2 pt-4 pb-4"
            style={{
              top: 0,
              bottom: `calc(${scrollSectionBottomOffset}px + env(safe-area-inset-bottom, 0px))`
            }}
          >
            {chapters.map((chapter, idx) => (
              <motion.div
                key={chapter.id}
                className="subject-button cursor-pointer mb-2"
                onClick={() =>
                  idx === 0
                    ? setShowCh1(true)          // load Ch1 inline
                    : navigate("/404")          // lead other buttons to 404
                }
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.02,
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <hr className="mb-1 border-t border-gray-400 opacity-60" />
                <div className="py-3 px-4">
                  <p className="text-lg font-semibold text-left text-gray-400">
                    {chapter.title}
                  </p>
                  <p className="text-sm text-left text-gray-500 mt-1">
                    {chapter.subtitle}
                  </p>
                </div>
                <hr className="mt-1 border-t border-gray-400 opacity-60" />
              </motion.div>
            ))}
          </div>

          {/* Static fades */}
          <div className="pointer-events-none absolute top-0 left-2 right-2 h-0 bg-gradient-to-b from-gray-800 via-gray-800/50 to-transparent" />
          <div
            className="pointer-events-none absolute bottom-0 left-2 right-2 h-0 bg-gradient-to-t from-gray-800 via-gray-800/70 to-transparent"
            style={{ bottom: `calc(${scrollSectionBottomOffset}px + env(safe-area-inset-bottom, 0px))` }}
          />
        </div>
      </div>
    </div>
  );
}
