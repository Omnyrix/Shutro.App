import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/topbar";
import NoInternetWarning from "../../../components/noInternetWarning";
import { motion } from "framer-motion";
import { getCookie } from "../../../utils/cookie";

export default function ChapterSelectionPhysics1st() {
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowTopFade(scrollTop > 0);
      setShowBottomFade(scrollTop + clientHeight < scrollHeight);
      localStorage.setItem("phychapter1ScrollPos", scrollTop.toString());
    };

    const saved = localStorage.getItem("phychapter1ScrollPos");
    if (saved) el.scrollTop = parseInt(saved, 10);

    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const chapters = [
    { route: "/physics/1st-paper/chapter-1", name: "Chapter 1", subtitle: "Kinematics" },
    { route: "/physics/1st-paper/chapter-2", name: "Chapter 2", subtitle: "Dynamics" },
    { route: "/physics/1st-paper/chapter-3", name: "Chapter 3", subtitle: "Work & Energy" },
    { route: "/physics/1st-paper/chapter-4", name: "Chapter 4", subtitle: "Momentum" },
    { route: "/physics/1st-paper/chapter-5", name: "Chapter 5", subtitle: "Rotational Motion" },
    { route: "/physics/1st-paper/chapter-6", name: "Chapter 6", subtitle: "Gravitation" },
    { route: "/physics/1st-paper/chapter-7", name: "Chapter 7", subtitle: "Properties of Matter" },
    { route: "/physics/1st-paper/chapter-8", name: "Chapter 8", subtitle: "Thermodynamics" },
    { route: "/physics/1st-paper/chapter-9", name: "Chapter 9", subtitle: "Oscillations" },
    { route: "/physics/1st-paper/chapter-10", name: "Chapter 10", subtitle: "Waves" },
  ];

  const handleChapterClick = (route: string) => {
    setTimeout(() => navigate(route), 100);
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      {isDemo && <NoInternetWarning />}
      <div className="absolute inset-0 bg-gray-800 text-white p-6 flex flex-col items-center">
        <TopBar />

        <h1 className="text-2xl font-bold text-center mb-6">
          <span style={{ color: "#1D4ED8" }}>Physics</span>{" "}
          <span className="text-white">Chapters</span>
        </h1>

        <p className="text-sm mb-4 text-gray-400 text-center">
          Pick a chapter:
        </p>

        <div className="relative w-full mx-4 sm:mx-auto mt-1 max-w-md">
          <div
            ref={containerRef}
            className="overflow-y-auto hide-scrollbar px-2 pt-4"
            style={{ maxHeight: "27rem", minHeight: "27rem" }}
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
                  delay: 0.1 + idx * 0.03,
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
                <div className="py-4 px-5">
                  <p className="text-lg font-semibold text-left text-gray-400">
                    {chapter.name}
                  </p>
                  <p className="text-sm text-left text-gray-500 mt-1">
                    {chapter.subtitle}
                  </p>
                </div>
                <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
              </motion.div>
            ))}
          </div>

          {showTopFade && (
            <div className="pointer-events-none absolute top-0 left-2 right-2 h-8 bg-gradient-to-b from-gray-800 to-transparent" />
          )}
          {showBottomFade && (
            <div className="pointer-events-none absolute bottom-0 left-2 right-2 h-8 bg-gradient-to-t from-gray-800 to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}
