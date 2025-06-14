import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import Loading from "../components/loading"; // Import loading screen
import Menu from "../components/topbar"; // Import Menu component
import { motion } from "framer-motion";

export default function Chemistry() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [progress, setProgress] = useState(0); // Dynamic progress bar

  const LOADING_TIME = 0; // Set loading duration (0 means minimal delay)

  useEffect(() => {
    const session = getCookie("session");

    if (!session) {
      navigate("/auth/login"); // Redirect if no session
      return;
    }

    setUsername(session);

    // Simulated loading animation
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / (LOADING_TIME / 50)), 100));
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false); // Hide loading screen after full render
    }, LOADING_TIME || 1); // Use fallback timeout if LOADING_TIME is 0

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gray-800 text-white">
      {loading && <Loading progress={progress} />} {/* Show loading screen */}

      {!loading && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}  // Smoother sliding effect
          // Inline style backgroundColor matching Tailwind bg-gray-800 (#1F2937)
          style={{ backgroundColor: "#1F2937" }}
          className="p-6 flex flex-col items-center"
        >
          {/* Menu Component */}
          <Menu username={username} />

          {/* Main Centered Title and Content */}
          <h1 className="text-3xl font-bold text-center mb-6">Chemistry Formulas</h1>
          <p className="text-lg mb-6 text-center">Choose a paper:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            {/* 1st Paper */}
            <div
              className="cursor-pointer"
              onClick={() => navigate("/chemistry/1st-paper")}
            >
              {/* Top thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p
                  className="text-lg font-semibold text-left"
                  style={{ color: "#9CA3AF" }}
                >
                  1st Paper
                </p>
              </div>
              {/* Bottom thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mt-1"
              />
            </div>

            {/* 2nd Paper */}
            <div
              className="cursor-pointer"
              onClick={() => navigate("/chemistry/2nd-paper")}
            >
              {/* Top thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mb-1"
              />
              <div className="py-2 px-4">
                <p
                  className="text-lg font-semibold text-left"
                  style={{ color: "#9CA3AF" }}
                >
                  2nd Paper
                </p>
              </div>
              {/* Bottom thin line */}
              <hr
                style={{ borderTop: "2px solid #9CA3AF", opacity: 0.6 }}
                className="mt-1"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
