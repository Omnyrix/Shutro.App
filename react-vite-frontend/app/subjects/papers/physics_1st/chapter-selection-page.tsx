// app/routes/subjects/physics_1st/chapter-selection-page.tsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/topbar";
import NoInternetWarning from "../../../components/noInternetWarning";
import { motion } from "framer-motion";
import { getCookie, readScrollMap, writeScrollMap } from "../../../utils/cookie";

export default function ChapterSelectionPhysics1st() {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // unique identifier for this page’s scroll position
  const mapKey = "physicschap1scrollpos";

  // gap (px) between bottom of scroll section and bottom of screen
  const scrollSectionBottomOffset = 0;

  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

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
        setShowTopFade(savedPos > 0);
        setShowBottomFade(savedPos + el.clientHeight < el.scrollHeight);
      }
    });

    const onScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowTopFade(scrollTop > 0);
      setShowBottomFade(scrollTop + clientHeight < scrollHeight);

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
    { route: "/physics/1st-paper/chapter-1", title: "১। গতিবিদ্যা", subtitle: "Kinematics" },
    { route: "/physics/1st-paper/chapter-2", title: "Chapter 2", subtitle: "Dynamics" },
    { route: "/physics/1st-paper/chapter-3", title: "Chapter 3", subtitle: "Work & Energy" },
    { route: "/physics/1st-paper/chapter-4", title: "Chapter 4", subtitle: "Momentum" },
    { route: "/physics/1st-paper/chapter-5", title: "Chapter 5", subtitle: "Rotational Motion" },
    { route: "/physics/1st-paper/chapter-6", title: "Chapter 6", subtitle: "Gravitation" },
    { route: "/physics/1st-paper/chapter-7", title: "Chapter 7", subtitle: "Properties of Matter" },
    { route: "/physics/1st-paper/chapter-8", title: "Chapter 8", subtitle: "Thermodynamics" },
    { route: "/physics/1st-paper/chapter-9", title: "Chapter 9", subtitle: "Oscillations" },
    { route: "/physics/1st-paper/chapter-10", title: "Chapter 10", subtitle: "Waves" },
  ];

  const handleChapterClick = (route: string) => {
    setTimeout(() => navigate(route), 100);
  };

  return (
    <div className="relative min-h-screen font-bengali">
      {isDemo && <NoInternetWarning />}

      {/* Fixed TopBar at top, no background behind it */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-transparent">
        <TopBar />
      </div>

      {/* Content background covers full screen (including behind TopBar) */}
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
          {/* scrollable region with bottom gap */}
          <div
            ref={containerRef}
            className="absolute inset-x-0 overflow-y-auto hide-scrollbar px-2 pt-4 pb-4"
            style={{ top: 0, bottom: `${scrollSectionBottomOffset}px` }}
          >
            {chapters.map((chapter, idx) => (
              <motion.div
                key={chapter.route}
                className="subject-button cursor-pointer mb-2"
                onClick={() => handleChapterClick(chapter.route)}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.02,
                  duration: 0.2,
                  ease: "easeOut",
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

          {showTopFade && (
            <div
              className="pointer-events-none absolute top-0 left-2 right-2 h-0 bg-gradient-to-b from-gray-800 via-gray-800/50 to-transparent"
            />
          )}
          {showBottomFade && (
            <div
              className="pointer-events-none absolute left-2 right-2 h-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent"
              style={{ bottom: `${scrollSectionBottomOffset}px` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
