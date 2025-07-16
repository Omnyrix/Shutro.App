// app/routes/subjects/chemistry_1st/chapter-selection-page.tsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/topbar";
import NoInternetWarning from "../../../components/noInternetWarning";
import { motion } from "framer-motion";
import { getCookie, readScrollMap, writeScrollMap } from "../../../utils/cookie";

export default function ChapterSelectionChemistry1st() {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // unique identifier for this page’s scroll position
  const mapKey = "chemistryp1scrollpos";

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
    { route: "/chemistry/1st-paper/ch-1", title: "Chapter 1", subtitle: "Kinematics" },
    { route: "/chemistry/1st-paper/ch-2", title: "Chapter 2", subtitle: "Dynamics" },
    { route: "/chemistry/1st-paper/ch-3", title: "Chapter 3", subtitle: "Work & Energy" },
    { route: "/chemistry/1st-paper/ch-4", title: "Chapter 4", subtitle: "Momentum" },
    { route: "/chemistry/1st-paper/ch-5", title: "Chapter 5", subtitle: "Rotational Motion" },
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
          <span style={{ color: "#EA580C" }}>Chemistry</span>{" "}
          <span className="text-white">Chapters</span>
        </h1>

        <p className="text-sm mb-2 text-gray-400 text-center">
          Pick a chapter:
        </p>

        <div className="flex-1 relative w-full mx-4 sm:mx-auto mt-1 max-w-md">
          {/* scrollable region with bottom gap + safe-area inset */}
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

          {/* Static fades at top and bottom */}
          <div className="pointer-events-none absolute top-0 left-2 right-2 h-0 bg-gradient-to-b from-gray-800 via-gray-800/50 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-2 right-2 h-0 bg-gradient-to-t from-gray-800 via-gray-800/70 to-transparent"
          style={{ bottom: `calc(${scrollSectionBottomOffset}px + env(safe-area-inset-bottom, 0px))` }}
          />
        </div>
      </div>
    </div>
  );
}
