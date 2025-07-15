// app/routes/higher-math.tsx
import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar";
import { motion } from "framer-motion";
import NoInternetWarning from "../components/noInternetWarning";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookie";

export default function HigherMath() {
  const navigate = useNavigate();

  // Session/profile logic placeholder for future use
  const isLoggedIn = false; // Set to true if user is logged in, false otherwise

  const papers = [
    { route: "/HigherMath/1st-paper", name: "1st Paper" },
    { route: "/HigherMath/2nd-paper", name: "2nd Paper" },
  ];

  const handlePaperClick = (route: string) => {
    setTimeout(() => {
      navigate(route);
    }, 100);
  };

  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const email = await getCookie("session");
      setIsDemo(!email);
    }
    checkSession();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900">
      {isDemo && <NoInternetWarning />}

      {/* Fixed TopBar at the top */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-transparent">
        <TopBar />
      </div>

      <div className="absolute inset-0 bg-gray-800 text-white p-6 pt-20 flex flex-col items-center overflow-hidden">
        <h1 className="text-2xl font-bold text-center mb-6">
          <span style={{ color: "#8B5CF6" }}>Higher Math</span>{" "}
          <span className="text-white">Formulas</span>
        </h1>

        <p className="text-sm mb-5 text-gray-400 text-center">
          Pick a paper:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          {papers.map((paper, index) => (
            <motion.div
              key={paper.route}
              className="subject-button cursor-pointer"
              onClick={() => handlePaperClick(paper.route)}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.03, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <hr className="mb-1 border-t-2 border-gray-400 opacity-60" />
              <div className="py-4 px-5">
                <p className="text-lg font-semibold text-left text-gray-400">
                  {paper.name}
                </p>
              </div>
              <hr className="mt-1 border-t-2 border-gray-400 opacity-60" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
